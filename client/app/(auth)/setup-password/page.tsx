'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Key, CheckCircle2 } from 'lucide-react';
import { authService } from '@/api/auth.service';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

export default function SetupPasswordPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu mới và xác nhận mật khẩu không khớp');
      return;
    }

    setLoading(true);

    try {
      await authService.setupPassword({
        phoneNumber,
        newPassword,
        confirmPassword,
      });
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Kích hoạt mật khẩu thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-14 h-14 rounded-full bg-[#F5EBE6] flex items-center justify-center mb-3 text-[#6F4E37]">
          <Key className="w-7 h-7" strokeWidth={2} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Kích hoạt mật khẩu</h1>
        <p className="text-sm text-gray-500 mt-1">Dành cho khách hàng đã từng tích điểm tại quầy</p>
      </div>

      {isSuccess ? (
        <div className="text-center py-4 space-y-4 animate-in fade-in">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Kích hoạt thành công!</h3>
          <p className="text-xs text-gray-500 max-w-xs mx-auto">
            Mật khẩu cho tài khoản của bạn đã được thiết lập thành công. Bây giờ bạn có thể đăng nhập.
          </p>
          <div className="pt-2">
            <Link href="/login">
              <Button>Đăng nhập ngay</Button>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-medium text-center animate-in fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Số điện thoại đã tích điểm"
              type="tel"
              placeholder="Nhập số điện thoại..."
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />

            <Input
              label="Mật khẩu mới"
              placeholder="Nhập mật khẩu mới..."
              isPassword
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <Input
              label="Xác nhận mật khẩu mới"
              placeholder="Nhập lại mật khẩu..."
              isPassword
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <div className="pt-2">
              <Button type="submit" isLoading={loading}>
                Xác nhận kích hoạt
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-gray-100 flex justify-center text-center text-xs">
            <Link href="/login" className="text-[#6F4E37] font-medium hover:underline">
              Quay lại đăng nhập
            </Link>
          </div>
        </>
      )}
    </>
  );
}
