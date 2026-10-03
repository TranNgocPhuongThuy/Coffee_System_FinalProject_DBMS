'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bell, ChevronDown, KeyRound, LogOut, User as UserIcon } from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';

interface HeaderProps {
  title?: string;
}

export default function Header({ title = 'Tổng quan' }: HeaderProps) {
  const { user, logout } = useAuthContext();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const initial = user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U';

  return (
    <header className="h-16 fixed top-0 right-0 left-64 bg-white border-b border-gray-100 flex items-center justify-between px-6 z-30">
      {/* Left: Page Title */}
      <div>
        <h1 className="text-xl font-semibold text-gray-800 tracking-tight">{title}</h1>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button
          type="button"
          aria-label="Thông báo"
          className="relative w-10 h-10 rounded-full flex items-center justify-center text-gray-600 hover:text-[#6F4E37] hover:bg-[#F5EBE6] transition-colors cursor-pointer"
        >
          <Bell className="w-5 h-5" strokeWidth={1.9} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
        </button>

        <div className="h-6 w-px bg-gray-200" />

        {/* User Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-[#F5EBE6] flex items-center justify-center text-[#6F4E37] font-semibold text-sm shrink-0">
              {initial}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm font-medium text-gray-700 leading-tight">
                {user?.fullName || 'Người dùng'}
              </span>
              <span className="text-[11px] text-gray-400 font-medium">
                {user?.role || user?.userType || 'GUEST'}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 shrink-0 ml-1" />
          </button>

          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-20 animate-in fade-in">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-xs font-semibold text-gray-800">{user?.fullName}</p>
                  <p className="text-[11px] text-gray-400">{user?.phoneNumber || user?.username}</p>
                </div>

                <Link
                  href="/change-password"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <KeyRound className="w-4 h-4 text-gray-500" />
                  <span>Đổi mật khẩu</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
