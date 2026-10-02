"use client";

import { useState } from "react";
import Link from "next/link";
import { Coffee, Eye, EyeOff } from "lucide-react";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // UI tĩnh - logic xử lý đăng nhập sẽ được tích hợp sau
  };

  return (
    <main className="min-h-screen w-full bg-[#FAF6F0] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Sign-in Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-[#F0E6DD] p-6 sm:p-8">
        {/* Header: Icon & Title */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-[#F5EBE6] flex items-center justify-center mb-4 text-[#6F4E37]">
            <Coffee className="w-7 h-7" strokeWidth={2} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Đăng nhập hệ thống
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Chào mừng bạn quay trở lại quán cà phê
          </p>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Input 1: Tài khoản / Số điện thoại */}
          <div className="space-y-1.5">
            <label
              htmlFor="identifier"
              className="block text-sm font-medium text-gray-700"
            >
              Tài khoản hoặc Số điện thoại
            </label>
            <input
              id="identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Nhập username hoặc số điện thoại..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 text-sm transition-colors focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
              required
            />
          </div>

          {/* Input 2: Mật khẩu */}
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Mật khẩu
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu..."
                className="w-full px-4 py-2.5 pr-11 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 text-sm transition-colors focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#6F4E37] transition-colors p-1"
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-[#6F4E37] hover:bg-[#5A3F2C] text-white font-semibold text-sm shadow-sm transition-all duration-200 cursor-pointer active:scale-[0.99]"
          >
            Đăng nhập
          </button>
        </form>

        {/* Footer Navigation Links */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col items-center space-y-2.5 text-center text-sm">
          <Link
            href="/sign-up"
            className="text-[#6F4E37] font-medium hover:underline transition-colors"
          >
            Khách hàng mới? Đăng ký tại đây
          </Link>
          <Link
            href="/setup-password"
            className="text-[#6F4E37] font-medium hover:underline transition-colors"
          >
            Khách đã tích điểm tại quầy? Kích hoạt mật khẩu
          </Link>
        </div>
      </div>
    </main>
  );
}
