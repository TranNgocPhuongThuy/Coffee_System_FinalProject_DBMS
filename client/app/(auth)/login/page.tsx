'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Coffee, ShieldCheck, User } from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';
import { UserType } from '@/types/auth';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

export default function LoginPage() {
  const { login } = useAuthContext();
  const [userType, setUserType] = useState<UserType>('EMPLOYEE');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login({ identifier, password, userType });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-14 h-14 rounded-full bg-[#F5EBE6] flex items-center justify-center mb-3 text-[#6F4E37]">
          <Coffee className="w-7 h-7" strokeWidth={2} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Đăng nhập hệ thống</h1>
        <p className="text-sm text-gray-500 mt-1">Coffee Shop Management System</p>
      </div>

      {/* UserType Switcher */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-[#FAF6F0] rounded-xl mb-6">
        <button
          type="button"
          onClick={() => { setUserType('EMPLOYEE'); setError(null); }}
          className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            userType === 'EMPLOYEE' ? 'bg-white text-[#6F4E37] shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Nhân viên</span>
        </button>
        <button
          type="button"
          onClick={() => { setUserType('CUSTOMER'); setError(null); }}
          className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            userType === 'CUSTOMER' ? 'bg-white text-[#6F4E37] shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Khách hàng</span>
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-medium text-center animate-in fade-in">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label={userType === 'EMPLOYEE' ? 'Tên đăng nhập (Username)' : 'Số điện thoại'}
          placeholder={userType === 'EMPLOYEE' ? 'Nhập tên đăng nhập...' : 'Nhập số điện thoại...'}
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
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

        <div className="pt-2">
          <Button type="submit" isLoading={loading}>
            Đăng nhập
          </Button>
        </div>
      </form>

      <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col items-center space-y-2 text-center text-xs">
        <Link href="/register" className="text-[#6F4E37] font-medium hover:underline">
          Khách hàng mới? Đăng ký tài khoản
        </Link>
        <Link href="/setup-password" className="text-[#6F4E37] font-medium hover:underline">
          Đã tích điểm tại quầy? Kích hoạt mật khẩu
        </Link>
      </div>
    </>
  );
}
