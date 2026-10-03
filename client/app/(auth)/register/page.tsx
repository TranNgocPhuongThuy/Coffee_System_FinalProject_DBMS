'use client';

import { useState } from 'react';
import Link from 'next/link';
import { UserPlus } from 'lucide-react';
import { authService } from '@/api/auth.service';
import { useAuthContext } from '@/context/AuthContext';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

export default function RegisterPage() {
  const { login } = useAuthContext();
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);

    try {
      await authService.register({
        fullName,
        phoneNumber,
        password,
        confirmPassword,
        address,
      });

      // Đăng nhập tự động sau khi đăng ký thành công
      await login({
        identifier: phoneNumber,
        password,
        userType: 'CUSTOMER',
      });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-14 h-14 rounded-full bg-[#F5EBE6] flex items-center justify-center mb-3 text-[#6F4E37]">
          <UserPlus className="w-7 h-7" strokeWidth={2} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Đăng ký thành viên</h1>
        <p className="text-sm text-gray-500 mt-1">Trở thành hội viên để tích điểm & nhận ưu đãi</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-medium text-center animate-in fade-in">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          label="Họ và tên"
          placeholder="Nhập họ tên của bạn..."
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        <Input
          label="Số điện thoại"
          type="tel"
          placeholder="Nhập số điện thoại..."
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />

        <Input
          label="Mật khẩu"
          placeholder="Nhập mật khẩu..."
          isPassword
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Input
          label="Xác nhận mật khẩu"
          placeholder="Nhập lại mật khẩu..."
          isPassword
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <Input
          label="Địa chỉ (Không bắt buộc)"
          placeholder="Nhập địa chỉ của bạn..."
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <div className="pt-2">
          <Button type="submit" isLoading={loading}>
            Đăng ký tài khoản
          </Button>
        </div>
      </form>

      <div className="mt-6 pt-5 border-t border-gray-100 flex justify-center text-center text-xs">
        <Link href="/login" className="text-[#6F4E37] font-medium hover:underline">
          Đã có tài khoản? Đăng nhập ngay
        </Link>
      </div>
    </>
  );
}
