'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, KeyRound, LogOut } from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';

export function PosUserDropdown() {
  const { user, logout } = useAuthContext();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const initial = user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U';

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setDropdownOpen((prev) => !prev)}
        className="flex items-center gap-2.5 p-1.5 pr-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
      >
        <div className="w-8 h-8 rounded-full bg-[#F5EBE6] dark:bg-amber-950/50 flex items-center justify-center text-[#6F4E37] dark:text-amber-300 font-bold text-xs shrink-0">
          {initial}
        </div>
        <div className="hidden sm:flex flex-col text-left">
          <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 leading-tight">
            {user?.fullName || 'Người dùng'}
          </span>
          <span className="text-[10px] text-zinc-400 font-semibold">
            {user?.role || user?.userType || 'CASHIER'}
          </span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0 ml-0.5" />
      </button>

      {dropdownOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setDropdownOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-100 dark:border-zinc-800 py-1.5 z-50 animate-in fade-in">
            <div className="px-4 py-2.5 border-b border-zinc-100 dark:border-zinc-800">
              <p className="text-xs font-bold text-zinc-800 dark:text-zinc-100 truncate">{user?.fullName || 'Người dùng'}</p>
              <p className="text-[11px] text-zinc-400 truncate">{user?.phoneNumber || user?.username || '—'}</p>
            </div>

            <Link
              href="/change-password"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <KeyRound className="w-3.5 h-3.5 text-zinc-500" />
              <span>Đổi mật khẩu</span>
            </Link>

            <button
              type="button"
              onClick={() => {
                setDropdownOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-left cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-500" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
