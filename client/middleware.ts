import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ROLE_DEFAULT_ROUTES, ROLE_ROUTE_PERMISSIONS } from '@/constants/roles';
import { STORAGE_KEYS } from '@/constants/storage';
import { UserRole } from '@/types/auth';

const PUBLIC_ROUTES = ['/login', '/register', '/setup-password'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(STORAGE_KEYS.ACCESS_TOKEN)?.value;
  const role = request.cookies.get(STORAGE_KEYS.ROLE)?.value as UserRole | undefined;


  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

  // 1. Chưa đăng nhập
  if (!token) {
    if (!isPublicRoute) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 2. Đã login mà vào route công khai
  if (isPublicRoute) {
    const defaultRoute = (role && ROLE_DEFAULT_ROUTES[role]) || '/login';
    return NextResponse.redirect(new URL(defaultRoute, request.url));
  }

  // 3. Phân quyền theo Role
  if (role) {
    const allowed = ROLE_ROUTE_PERMISSIONS[role] || [];
    const hasPermission = allowed.some((prefix) => pathname.startsWith(prefix));

    if (!hasPermission) {
      const fallback = ROLE_DEFAULT_ROUTES[role] || '/login';
      return NextResponse.redirect(new URL(fallback, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|icons|.*\\..*).*)'],
};