"use client";

import { useState } from "react";
import Link from "next/link";
import { UserPlus, Eye, EyeOff } from "lucide-react";

export default function SignUpPage() {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // UI tĩnh - logic đăng ký sẽ được tích hợp sau
  };

  return (
    <main className="min-h-screen w-full bg-[#FAF6F0] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Sign-up Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-[#F0E6DD] p-6 sm:p-8">
        {/* Header: Icon & Title */}
        <div className="flex flex-col items-center text-center mb-7">
          <div className="w-14 h-14 rounded-full bg-[#F5EBE6] flex items-center justify-center mb-4 text-[#6F4E37]">
            <UserPlus className="w-7 h-7" strokeWidth={2} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Đăng ký thành viên
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Trở thành thành viên để nhận ưu đãi và tích điểm
          </p>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input 1: Họ và tên */}
          <div className="space-y-1.5">
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700"
            >
              Họ và tên
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nhập họ tên của bạn..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 text-sm transition-colors focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
              required
            />
          </div>

          {/* Input 2: Số điện thoại */}
          <div className="space-y-1.5">
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Số điện thoại
            </label>
            <input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Nhập số điện thoại..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 text-sm transition-colors focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
              required
            />
          </div>

          {/* Input 3: Mật khẩu */}
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#6F4E37] transition-colors p-1 cursor-pointer"
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

          {/* Input 4: Xác nhận mật khẩu */}
          <div className="space-y-1.5">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Xác nhận mật khẩu
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu..."
                className="w-full px-4 py-2.5 pr-11 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 text-sm transition-colors focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#6F4E37] transition-colors p-1 cursor-pointer"
                aria-label={
                  showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-[#6F4E37] hover:bg-[#5A3F2C] text-white font-semibold text-sm shadow-sm transition-all duration-200 cursor-pointer active:scale-[0.99]"
            >
              Tạo tài khoản
            </button>
          </div>
        </form>

        {/* Footer Navigation Link */}
        <div className="mt-7 pt-6 border-t border-gray-100 flex justify-center text-center text-sm">
          <Link
            href="/sign-in"
            className="text-[#6F4E37] font-medium hover:underline transition-colors"
          >
            Đã có tài khoản? Đăng nhập ngay
          </Link>
        </div>
      </div>
    </main>
  );
}
