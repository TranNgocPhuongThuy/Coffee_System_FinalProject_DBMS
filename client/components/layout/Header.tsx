"use client";

import { Bell, ChevronDown } from "lucide-react";

interface HeaderProps {
  title?: string;
}

export default function Header({ title = "Tổng quan" }: HeaderProps) {
  return (
    <header className="h-16 fixed top-0 right-0 left-64 bg-white border-b border-gray-100 flex items-center justify-between px-6 z-30">
      {/* Left: Page Title */}
      <div>
        <h1 className="text-xl font-semibold text-gray-800 tracking-tight">
          {title}
        </h1>
      </div>

      {/* Right: Actions (Notification & User Profile) */}
      <div className="flex items-center gap-4">
        {/* Notification Bell Button */}
        <button
          type="button"
          aria-label="Thông báo"
          className="relative w-10 h-10 rounded-full flex items-center justify-center text-gray-600 hover:text-[#6F4E37] hover:bg-[#F5EBE6] transition-colors cursor-pointer"
        >
          <Bell className="w-5 h-5" strokeWidth={1.9} />
          {/* Notification Badge Dot */}
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-200" />

        {/* User Block */}
        <button
          type="button"
          className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
        >
          {/* Avatar Circle */}
          <div className="w-9 h-9 rounded-full bg-[#F5EBE6] flex items-center justify-center text-[#6F4E37] font-semibold text-sm shrink-0">
            QL
          </div>

          {/* User Name */}
          <span className="text-sm font-medium text-gray-700">Quản lý</span>

          {/* Dropdown Icon */}
          <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
        </button>
      </div>
    </header>
  );
}
