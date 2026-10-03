// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ROLE_DEFAULT_ROUTES, isRouteAllowed } from '@/constants/roles';
import { STORAGE_KEYS } from '@/constants/storage';
import { UserRole } from '@/types/auth';

const PUBLIC_ROUTES = ['/login', '/register', '/setup-password'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(STORAGE_KEYS.ACCESS_TOKEN)?.value;
  const role = request.cookies.get(STORAGE_KEYS.ROLE)?.value as UserRole | undefined;

  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

  // 1. Chưa đăng nhập: Cố truy cập trang nội bộ -> Chuyển về /login
  if (!token) {
    if (!isPublicRoute) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 2. Đã đăng nhập: Vào trang public hoặc trang chủ '/' -> Chuyển thẳng về trang nghiệp vụ theo Role
  if (isPublicRoute || pathname === '/') {
    const defaultRoute = (role && ROLE_DEFAULT_ROUTES[role]) || '/dashboard';
    return NextResponse.redirect(new URL(defaultRoute, request.url));
  }

  // 3. Đã đăng nhập: Kiểm tra ma trận phân quyền RBAC
  if (role) {
    const allowed = isRouteAllowed(pathname, role);
    if (!allowed) {
      const fallbackRoute = ROLE_DEFAULT_ROUTES[role] || '/dashboard';
      return NextResponse.redirect(new URL(fallbackRoute, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|icons|.*\\..*).*)'],
};