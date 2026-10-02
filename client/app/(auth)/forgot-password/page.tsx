"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function ForgotPasswordPage() {
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // UI tĩnh - logic gửi yêu cầu khôi phục sẽ được tích hợp sau
  };

  return (
    <main className="min-h-screen w-full bg-[#FAF6F0] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Forgot Password Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-[#F0E6DD] p-6 sm:p-8">
        {/* Header: Icon & Title */}
        <div className="flex flex-col items-center text-center mb-7">
          <div className="w-14 h-14 rounded-full bg-[#F5EBE6] flex items-center justify-center mb-4 text-[#6F4E37]">
            <ShieldAlert className="w-7 h-7" strokeWidth={2} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Quên mật khẩu
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Nhập số điện thoại để nhận mã khôi phục
          </p>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Input: Số điện thoại đã đăng ký */}
          <div className="space-y-1.5">
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Số điện thoại đã đăng ký
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

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-[#6F4E37] hover:bg-[#5A3F2C] text-white font-semibold text-sm shadow-sm transition-all duration-200 cursor-pointer active:scale-[0.99]"
          >
            Gửi yêu cầu khôi phục
          </button>
        </form>

        {/* Footer Navigation Link */}
        <div className="mt-7 pt-6 border-t border-gray-100 flex justify-center text-center text-sm">
          <Link
            href="/sign-in"
            className="text-[#6F4E37] font-medium hover:underline transition-colors"
          >
            Quay lại trang đăng nhập
          </Link>
        </div>
      </div>
    </main>
  );
}
