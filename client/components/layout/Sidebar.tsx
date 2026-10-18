'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Coffee,
  LayoutDashboard,
  MonitorSmartphone,
  CupSoda,
  Package,
  Users,
  PieChart,
  LogOut,
  CookingPot,
  Radio,
} from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';
import { isRouteAllowed } from '@/constants/roles';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthContext();

  const allMenuItems = [
  {
    name: 'Tổng quan',
    path: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Bán hàng POS',
    path: '/pos/terminal',
    icon: MonitorSmartphone,
  },
  {
    name: 'Bếp / Pha chế',
    path: '/kds/queue',
    icon: CookingPot,
  },
  {
    name: 'Thực đơn',
    path: '/dashboard/menu', // Trỏ trực tiếp đến trang Menu Hub tổng quan
    icon: CupSoda,
  },
  {
    name: 'Kho nguyên liệu',
    path: '/dashboard/inventory/ingredients',
    icon: Package,
  },
  {
    name: 'Thẻ rung',
    path: '/pos/pagers', // Cho phép Manager quản lý thẻ rung trực tiếp
    icon: Radio,
  },
  {
    name: 'Khách hàng',
    path: '/dashboard/customers',
    icon: Users,
  },
  {
    name: 'Báo cáo',
    path: '/dashboard/reports',
    icon: PieChart,
  },
];

  // Lọc menu theo quyền của Role hiện tại
  const allowedMenuItems = user?.role
    ? allMenuItems.filter((item) => isRouteAllowed(item.path, user.role))
    : allMenuItems;

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-white border-r border-gray-100 flex flex-col z-40">
      {/* Header / Brand Logo */}
      <div className="h-20 flex items-center gap-3 px-6 border-b border-gray-100">
        <div className="w-10 h-10 rounded-full bg-[#F5EBE6] flex items-center justify-center text-[#6F4E37] shrink-0">
          <Coffee className="w-5 h-5" strokeWidth={2.2} />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold text-gray-900 tracking-tight leading-none">
            MePhaPhin
          </span>
          <span className="text-[11px] text-gray-400 font-medium mt-1">
            Coffee & Operations Management
          </span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-5 px-3 space-y-1.5 overflow-y-auto">
        {allowedMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.path === '/dashboard'
              ? pathname === '/dashboard'
              : item.path.startsWith('/dashboard/inventory')
              ? pathname.startsWith('/dashboard/inventory')
              : item.path.startsWith('/dashboard/menu')
              ? pathname.startsWith('/dashboard/menu')
              : pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-[#6F4E37] text-white shadow-sm'
                  : 'text-gray-600 hover:bg-[#F5EBE6] hover:text-[#6F4E37]'
              }`}
            >
              <Icon
                className={`w-5 h-5 shrink-0 ${
                  isActive ? 'text-white' : 'text-gray-500 group-hover:text-[#6F4E37]'
                }`}
                strokeWidth={isActive ? 2.2 : 1.8}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions: Logout */}
      <div className="p-3 border-t border-gray-100 mt-auto">
        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
        >
          <LogOut className="w-5 h-5 shrink-0" strokeWidth={1.8} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}