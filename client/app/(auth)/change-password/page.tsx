'use client';

import { useState } from 'react';
import Link from 'next/link';
import { KeyRound, CheckCircle2 } from 'lucide-react';
import { authService } from '@/api/auth.service';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

export default function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState('');
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
      await authService.changePassword({
        oldPassword,
        newPassword,
        confirmPassword,
      });
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Đổi mật khẩu thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-14 h-14 rounded-full bg-[#F5EBE6] flex items-center justify-center mb-3 text-[#6F4E37]">
          <KeyRound className="w-7 h-7" strokeWidth={2} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Đổi mật khẩu</h1>
        <p className="text-sm text-gray-500 mt-1">Cập nhật mật khẩu để bảo mật tài khoản</p>
      </div>

      {isSuccess ? (
        <div className="text-center py-4 space-y-4 animate-in fade-in">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Đổi mật khẩu thành công!</h3>
          <p className="text-xs text-gray-500 max-w-xs mx-auto">
            Mật khẩu mới của bạn đã được cập nhật thành công trên hệ thống.
          </p>
          <div className="pt-2">
            <Link href="/login">
              <Button>Đăng nhập lại</Button>
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
              label="Mật khẩu hiện tại"
              placeholder="Nhập mật khẩu hiện tại..."
              isPassword
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
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
              placeholder="Nhập lại mật khẩu mới..."
              isPassword
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <div className="pt-2">
              <Button type="submit" isLoading={loading}>
                Cập nhật mật khẩu
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
