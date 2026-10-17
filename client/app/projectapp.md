# Project Dump

**Root:** `C:\Programing\hqtcsdl\Coffee_System_FinalProject_DBMS\client\app`

**Generated:** 2026-10-17 21:38:34.704589

**Files:** 39 | **Total size:** 415,229 bytes

---

# (auth)\change-password\page.tsx

| Property | Value |
|----------|-------|
| Path | `(auth)\change-password\page.tsx` |
| Size | 4,313 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:54.887453 |

```tsx
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

```

# (auth)\layout.tsx

| Property | Value |
|----------|-------|
| Path | `(auth)\layout.tsx` |
| Size | 368 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:54.889448 |

```tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen w-full bg-[#FAF6F0] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-[#F0E6DD] p-6 sm:p-8">
        {children}
      </div>
    </main>
  );
}


```

# (auth)\login\page.tsx

| Property | Value |
|----------|-------|
| Path | `(auth)\login\page.tsx` |
| Size | 4,191 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:54.891450 |

```tsx
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
      await login({ identifier, password });
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
        <p className="text-sm text-gray-500 mt-1">Hệ thống quản lý quán cà phê MePhaPhin</p>
      </div>

      {/* UserType Switcher */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-[#FAF6F0] rounded-xl mb-6">
        <button
          type="button"
          onClick={() => { setUserType('EMPLOYEE'); setError(null); }}
          className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${userType === 'EMPLOYEE' ? 'bg-white text-[#6F4E37] shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Nhân viên</span>
        </button>
        <button
          type="button"
          onClick={() => { setUserType('CUSTOMER'); setError(null); }}
          className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${userType === 'CUSTOMER' ? 'bg-white text-[#6F4E37] shadow-sm' : 'text-gray-500 hover:text-gray-700'
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

```

# (auth)\register\page.tsx

| Property | Value |
|----------|-------|
| Path | `(auth)\register\page.tsx` |
| Size | 4,027 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:54.893451 |

```tsx
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

```

# (auth)\setup-password\page.tsx

| Property | Value |
|----------|-------|
| Path | `(auth)\setup-password\page.tsx` |
| Size | 4,347 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:54.895451 |

```tsx
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

```

# dashboard\customers\[id]\page.tsx

| Property | Value |
|----------|-------|
| Path | `dashboard\customers\[id]\page.tsx` |
| Size | 17,941 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:54.900457 |

```tsx
'use client';

import { useState, useEffect, useCallback, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Edit,
  PlusCircle,
  Clock,
  Sparkles,
  Crown,
  Shield,
  Medal,
  ArrowDownLeft,
  ArrowUpRight,
  UserCheck,
  Calendar,
  Phone,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';
import { loyaltyService, CustomerItem } from '@/api/loyalty.service';
import { LoyaltyTransaction } from '@/types/customer';
import { CustomerFormModal } from '@/components/loyalty/CustomerFormModal';
import { AdjustPointsModal } from '@/components/loyalty/AdjustPointsModal';

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const customerId = resolvedParams.id;
  const router = useRouter();
  const { user } = useAuthContext();
  const isManager = user?.role === 'MANAGER' || user?.role === 'ADMIN';

  const [customer, setCustomer] = useState<CustomerItem | null>(null);
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAdjustPointsOpen, setIsAdjustPointsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchCustomerDetail = useCallback(async () => {
    if (!customerId) return;
    setLoading(true);
    try {
      const data = await loyaltyService.getCustomerById(customerId);
      setCustomer(data);
    } catch {
      setCustomer(null);
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  const fetchCustomerHistory = useCallback(async () => {
    if (!customerId) return;
    setLoadingHistory(true);
    try {
      const res = await loyaltyService.getLoyaltyHistory({
        customerId: Number(customerId),
        limit: 50,
      });
      setTransactions(res.items || res.data || []);
    } catch {
      setTransactions([]);
    } finally {
      setLoadingHistory(false);
    }
  }, [customerId]);

  useEffect(() => {
    fetchCustomerDetail();
    fetchCustomerHistory();
  }, [fetchCustomerDetail, fetchCustomerHistory]);

  const handleUpdateCustomer = async (data: { fullName: string; phoneNumber: string; password?: string }) => {
    if (!customer) return;
    await loyaltyService.updateCustomer(customer.id, data);
    showToast('Cập nhật thông tin khách hàng thành công!');
    fetchCustomerDetail();
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'DIAMOND':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
            <Sparkles className="w-4 h-4 text-purple-600" />
            Hạng Kim Cương
          </span>
        );
      case 'GOLD':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <Crown className="w-4 h-4 text-amber-600" />
            Hạng Vàng
          </span>
        );
      case 'SILVER':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-200 text-slate-800 border border-slate-300">
            <Shield className="w-4 h-4 text-slate-600" />
            Hạng Bạc
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 border border-orange-200">
            <Medal className="w-4 h-4 text-orange-600" />
            Hạng Chuẩn (Standard)
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500 font-medium animate-pulse">
        Đang tải thông tin chi tiết khách hàng...
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center space-y-4">
        <div className="p-6 bg-red-50 text-red-600 rounded-2xl border border-red-200 text-sm font-medium">
          Khách hàng không tồn tại hoặc đã bị xóa khỏi hệ thống.
        </div>
        <button
          type="button"
          onClick={() => router.push('/dashboard/customers')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#6F4E37] text-white rounded-xl font-semibold text-sm cursor-pointer hover:bg-[#5A3F2C]"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại danh sách
        </button>
      </div>
    );
  }

  const initial = customer.fullName ? customer.fullName.charAt(0).toUpperCase() : 'K';

  // Tier progress calculation
  let nextTierName = 'SILVER';
  let targetPoints = 200;
  if (customer.membershipTier === 'SILVER') {
    nextTierName = 'GOLD';
    targetPoints = 500;
  } else if (customer.membershipTier === 'GOLD') {
    nextTierName = 'DIAMOND';
    targetPoints = 1000;
  }
  const currentEarned = customer.totalPointsEarned || customer.rewardPoints || 0;
  const isMaxTier = customer.membershipTier === 'DIAMOND';
  const progressPercent = isMaxTier
    ? 100
    : Math.min(100, Math.round((currentEarned / targetPoints) * 100));

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-semibold z-50 animate-in fade-in">
          {toastMessage}
        </div>
      )}

      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/customers"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh sách Khách hàng</span>
        </Link>
      </div>

      {/* Main Profile Header Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#8B5E3C] to-[#6F4E37] text-white font-bold text-3xl flex items-center justify-center shrink-0 shadow-md">
            {initial}
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{customer.fullName}</h1>
              {getTierBadge(customer.membershipTier)}
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500 font-medium flex-wrap">
              <span className="flex items-center gap-1.5 font-mono">
                <Phone className="w-3.5 h-3.5 text-gray-400" />
                {customer.phoneNumber}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                Ngày tham gia: {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 flex-wrap w-full md:w-auto">
          {isManager && (
            <button
              type="button"
              onClick={() => setIsAdjustPointsOpen(true)}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Thêm / Trừ điểm</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsEditModalOpen(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-4 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition-all cursor-pointer"
          >
            <Edit className="w-4 h-4 text-gray-500" />
            <span>Sửa thông tin</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Points Balance */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium">Điểm khả dụng hiện tại</p>
            <p className="text-2xl font-bold text-[#6F4E37] mt-1">
              {(customer.rewardPoints || 0).toLocaleString('vi-VN')} <span className="text-sm">pts</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#F5EBE6] text-[#6F4E37] flex items-center justify-center font-bold">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Lifetime Earned */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium">Tổng điểm đã tích lũy (Lifetime)</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">
              {(customer.totalPointsEarned || customer.rewardPoints || 0).toLocaleString('vi-VN')}{' '}
              <span className="text-sm">pts</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <ArrowDownLeft className="w-6 h-6" />
          </div>
        </div>

        {/* Total Redeemed */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium">Tổng điểm đã đổi thưởng</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">
              {(customer.totalPointsRedeemed || 0).toLocaleString('vi-VN')} <span className="text-sm">pts</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <ArrowUpRight className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tier Progress Bar Card */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-sm font-semibold">
          <span className="text-gray-700">Tiến trình thăng hạng hội viên</span>
          <span className="text-gray-900">
            {isMaxTier
              ? 'Đã đạt hạng Kim Cương tối đa!'
              : `${currentEarned} / ${targetPoints} pts (Tiếp theo: ${nextTierName})`}
          </span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#8B5E3C] to-[#6F4E37] rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-xs text-gray-400">
          Chính sách thăng hạng: Bạc (200 pts) • Vàng (500 pts) • Kim Cương (1000 pts tích lũy)
        </p>
      </div>

      {/* Transaction History Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden space-y-4 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#6F4E37]" />
            <span>Lịch sử tích / tiêu điểm của khách hàng</span>
          </h2>
          <div className="flex items-center gap-3">
            <Link
              href={`/dashboard/customers/transactions?customerId=${customer.id}`}
              className="text-xs font-semibold text-[#6F4E37] hover:underline inline-flex items-center gap-1"
            >
              <span>Xem trên sổ cái</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <span className="text-xs font-medium text-gray-500">
              ({transactions.length} giao dịch)
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF6F0] border-b border-gray-100 text-xs font-bold text-gray-600 uppercase tracking-wider">
                <th className="py-3 px-4">Mã GD / ID</th>
                <th className="py-3 px-4">Đơn hàng</th>
                <th className="py-3 px-4">Loại giao dịch</th>
                <th className="py-3 px-4">Số điểm</th>
                <th className="py-3 px-4">Số dư sau GD</th>
                <th className="py-3 px-4">Ghi chú</th>
                <th className="py-3 px-4">Thời gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loadingHistory ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-400 text-xs">
                    Đang tải nhật ký điểm...
                  </td>
                </tr>
              ) : transactions.length > 0 ? (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs font-bold text-gray-700">#{tx.id}</td>
                    <td className="py-3 px-4 text-xs">
                      {tx.orderId ? (
                        <span className="font-semibold text-blue-600">Đơn hàng #{tx.orderId}</span>
                      ) : (
                        <span className="text-gray-400 italic">Thủ công / Khác</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {tx.transactionType === 'EARN' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <ArrowDownLeft className="w-3.5 h-3.5" />
                          Cộng điểm
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                          Trừ điểm
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold text-xs">
                      <span className={tx.transactionType === 'EARN' ? 'text-emerald-600' : 'text-red-600'}>
                        {tx.transactionType === 'EARN' ? `+${tx.points}` : `-${tx.points}`} pts
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-800 text-xs font-mono">
                      {(tx.balanceAfter || 0).toLocaleString('vi-VN')} pts
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-500 max-w-xs truncate">
                      {tx.description || '-'}
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-400 font-mono">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {tx.createdAt ? new Date(tx.createdAt).toLocaleString('vi-VN') : 'N/A'}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-400 text-xs">
                    Chưa phát sinh giao dịch điểm thưởng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Customer Form Modal */}
      <CustomerFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateCustomer}
        customer={customer}
      />

      {/* Adjust Points Modal */}
      <AdjustPointsModal
        isOpen={isAdjustPointsOpen}
        onClose={() => setIsAdjustPointsOpen(false)}
        onSuccess={() => {
          showToast('Điều chỉnh điểm thành công!');
          fetchCustomerDetail();
          fetchCustomerHistory();
        }}
        customer={customer}
      />
    </div>
  );
}
```

# dashboard\customers\page.tsx

| Property | Value |
|----------|-------|
| Path | `dashboard\customers\page.tsx` |
| Size | 24,638 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:54.902450 |

```tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  UserCheck,
  Crown,
  Shield,
  Medal,
  Clock,
  Sparkles,
  History,
  Eye,
  PlusCircle,
  Users,
  Award,
} from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';
import { loyaltyService, CustomerItem } from '@/api/loyalty.service';
import { CustomerFormModal } from '@/components/loyalty/CustomerFormModal';
import { AssignRoleModal } from '@/components/loyalty/AssignRoleModal';
import { AdjustPointsModal } from '@/components/loyalty/AdjustPointsModal';
import { CustomerProfileDrawer } from '@/components/loyalty/CustomerProfileDrawer';
import { ConfirmModal } from '@/components/common/ConfirmModal';

export default function CustomersPage() {
  const router = useRouter();
  const { user } = useAuthContext();
  const isManager = user?.role === 'MANAGER' || user?.role === 'ADMIN';

  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState('all');

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Modal & Drawer states
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerItem | null>(null);

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignCustomer, setAssignCustomer] = useState<CustomerItem | null>(null);

  const [isAdjustPointsOpen, setIsAdjustPointsOpen] = useState(false);
  const [adjustTargetCustomer, setAdjustTargetCustomer] = useState<CustomerItem | null>(null);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerCustomer, setDrawerCustomer] = useState<CustomerItem | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteCustomerTarget, setDeleteCustomerTarget] = useState<CustomerItem | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await loyaltyService.getCustomers({
        search: searchQuery || undefined,
        membershipTier: selectedTier !== 'all' ? selectedTier : undefined,
        page,
        limit: 15,
      });
      setCustomers(res.items || res.data || []);
      if (res.meta) {
        setTotalPages(res.meta.totalPages || 1);
        setTotalItems(res.meta.totalItems || 0);
      } else {
        setTotalItems(res.items?.length || 0);
      }
    } catch {
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedTier, page]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleCreateCustomer = async (data: { fullName: string; phoneNumber: string; password?: string }) => {
    await loyaltyService.createCustomer(data);
    showToast('Tạo khách hàng mới thành công!');
    fetchCustomers();
  };

  const handleUpdateCustomer = async (data: { fullName: string; phoneNumber: string; password?: string }) => {
    if (!selectedCustomer) return;
    await loyaltyService.updateCustomer(selectedCustomer.id, data);
    showToast('Cập nhật thông tin khách hàng thành công!');
    fetchCustomers();
  };

  const handleDeleteCustomer = async () => {
    if (!deleteCustomerTarget) return;
    try {
      await loyaltyService.deleteCustomer(deleteCustomerTarget.id);
      showToast('Xóa khách hàng thành công!');
      fetchCustomers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Xóa thất bại');
    } finally {
      setIsDeleteModalOpen(false);
      setDeleteCustomerTarget(null);
    }
  };

  const handleAssignRole = async (data: {
    fullName: string;
    username: string;
    password: string;
    role: 'CASHIER' | 'BARISTA' | 'STOREKEEPER';
    phoneNumber?: string;
  }) => {
    await loyaltyService.assignEmployeeRole(data);
    showToast(`Đã cấp quyền nhân viên ${data.role} cho ${data.fullName}!`);
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'DIAMOND':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            Kim Cương
          </span>
        );
      case 'GOLD':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <Crown className="w-3.5 h-3.5 text-amber-600" />
            Hạng Vàng
          </span>
        );
      case 'SILVER':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <Shield className="w-3.5 h-3.5 text-slate-500" />
            Hạng Bạc
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-800 border border-orange-200">
            <Medal className="w-3.5 h-3.5 text-orange-600" />
            Standard
          </span>
        );
    }
  };

  // Calculate summary stats
  const totalPoints = customers.reduce((acc, c) => acc + (c.rewardPoints || 0), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
      {/* Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-semibold z-50 animate-in fade-in">
          {toastMessage}
        </div>
      )}

      {/* Header Title & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Quản lý Khách hàng & Tích điểm</h1>
          <p className="text-sm text-gray-500 mt-1">
            Danh sách hội viên, lịch sử điểm thưởng và phân quyền hệ thống
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/dashboard/customers/transactions"
            className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-4 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition-all"
          >
            <History className="w-4 h-4 text-gray-500" />
            <span>Sổ cái biến động điểm</span>
          </Link>

          {isManager && (
            <>
              <button
                type="button"
                onClick={() => {
                  setAdjustTargetCustomer(null);
                  setIsAdjustPointsOpen(true);
                }}
                className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition-all cursor-pointer active:scale-[0.99]"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Điều chỉnh điểm</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedCustomer(null);
                  setIsAddEditModalOpen(true);
                }}
                className="flex items-center gap-2 bg-[#6F4E37] hover:bg-[#5A3F2C] text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition-all cursor-pointer active:scale-[0.99]"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm khách hàng</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Quick Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#F5EBE6] text-[#6F4E37] flex items-center justify-center shrink-0 font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Tổng số khách hàng</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">{totalItems.toLocaleString('vi-VN')}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 font-bold">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Tổng điểm lưu hành</p>
            <p className="text-xl font-bold text-amber-800 mt-0.5">{totalPoints.toLocaleString('vi-VN')} pts</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 font-bold">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Thành viên Kim Cương</p>
            <p className="text-xl font-bold text-purple-900 mt-0.5">
              {customers.filter((c) => c.membershipTier === 'DIAMOND').length}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 font-bold">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Thành viên Hạng Vàng</p>
            <p className="text-xl font-bold text-amber-900 mt-0.5">
              {customers.filter((c) => c.membershipTier === 'GOLD').length}
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Tìm theo tên, số điện thoại..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20 transition-all"
          />
        </div>

        <div className="relative">
          <Filter className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={selectedTier}
            onChange={(e) => {
              setSelectedTier(e.target.value);
              setPage(1);
            }}
            className="pl-10 pr-8 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20 cursor-pointer appearance-none"
          >
            <option value="all">Tất cả hạng thẻ</option>
            <option value="STANDARD">Standard</option>
            <option value="SILVER">Silver</option>
            <option value="GOLD">Gold</option>
            <option value="DIAMOND">Diamond</option>
          </select>
        </div>
      </div>

      {/* Customers Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF6F0] border-b border-gray-100 text-xs font-bold text-gray-600 uppercase tracking-wider">
                <th className="py-3.5 px-5">Khách hàng</th>
                <th className="py-3.5 px-5">Số điện thoại</th>
                <th className="py-3.5 px-5">Điểm hiện tại</th>
                <th className="py-3.5 px-5">Hạng thẻ</th>
                <th className="py-3.5 px-5">Ngày tham gia</th>
                <th className="py-3.5 px-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400 text-sm">
                    Đang tải danh sách khách hàng...
                  </td>
                </tr>
              ) : customers.length > 0 ? (
                customers.map((cust) => {
                  const initial = cust.fullName ? cust.fullName.charAt(0).toUpperCase() : 'K';
                  return (
                    <tr key={cust.id} className="hover:bg-gray-50/60 transition-colors group">
                      {/* Name & Avatar */}
                      <td className="py-3.5 px-5">
                        <div
                          onClick={() => {
                            setDrawerCustomer(cust);
                            setIsDrawerOpen(true);
                          }}
                          className="flex items-center gap-3 cursor-pointer"
                        >
                          <div className="w-9 h-9 rounded-full bg-[#F5EBE6] text-[#6F4E37] font-bold text-xs flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                            {initial}
                          </div>
                          <span className="font-bold text-gray-900 group-hover:text-[#6F4E37] transition-colors">
                            {cust.fullName}
                          </span>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-5 font-mono text-gray-700 font-medium text-xs">
                        {cust.phoneNumber}
                      </td>

                      {/* Points */}
                      <td className="py-3.5 px-5">
                        <span className="font-bold text-[#6F4E37]">
                          {(cust.rewardPoints || 0).toLocaleString('vi-VN')}
                        </span>
                        <span className="text-xs text-gray-400 ml-1">pts</span>
                      </td>

                      {/* Tier */}
                      <td className="py-3.5 px-5">{getTierBadge(cust.membershipTier)}</td>

                      {/* Created At */}
                      <td className="py-3.5 px-5 text-gray-500 text-xs">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          <span>
                            {cust.createdAt
                              ? new Date(cust.createdAt).toLocaleDateString('vi-VN')
                              : 'N/A'}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* View Detail Page */}
                          <button
                            type="button"
                            onClick={() => router.push(`/dashboard/customers/${cust.id}`)}
                            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                            title="Xem trang chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Quick Drawer */}
                          <button
                            type="button"
                            onClick={() => {
                              setDrawerCustomer(cust);
                              setIsDrawerOpen(true);
                            }}
                            className="p-2 rounded-lg text-[#6F4E37] hover:bg-[#F5EBE6] transition-colors cursor-pointer"
                            title="Xem nhanh hồ sơ"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>

                          {isManager && (
                            <>
                              {/* Adjust Points Modal */}
                              <button
                                type="button"
                                onClick={() => {
                                  setAdjustTargetCustomer(cust);
                                  setIsAdjustPointsOpen(true);
                                }}
                                className="p-2 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                                title="Cộng / Trừ điểm"
                              >
                                <PlusCircle className="w-4 h-4" />
                              </button>

                              {/* Edit Button */}
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedCustomer(cust);
                                  setIsAddEditModalOpen(true);
                                }}
                                className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                                title="Sửa thông tin"
                              >
                                <Edit className="w-4 h-4" />
                              </button>

                              {/* Assign Employee Role */}
                              <button
                                type="button"
                                onClick={() => {
                                  setAssignCustomer(cust);
                                  setIsAssignModalOpen(true);
                                }}
                                className="p-2 rounded-lg text-[#6F4E37] hover:bg-orange-50 transition-colors cursor-pointer"
                                title="Chuyển thành nhân viên"
                              >
                                <UserCheck className="w-4 h-4 text-orange-600" />
                              </button>

                              {/* Delete Button */}
                              <button
                                type="button"
                                onClick={() => {
                                  setDeleteCustomerTarget(cust);
                                  setIsDeleteModalOpen(true);
                                }}
                                className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                title="Xóa khách hàng"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400 text-sm">
                    Không tìm thấy khách hàng phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info & Pagination */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 bg-white">
          <p>
            Hiển thị <span className="font-semibold text-gray-700">{customers.length}</span> / {totalItems} khách hàng
          </p>

          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 font-semibold cursor-pointer"
              >
                Trước
              </button>
              <span className="font-semibold text-gray-700">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 font-semibold cursor-pointer"
              >
                Sau
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Customer Quick Profile Drawer */}
      <CustomerProfileDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setDrawerCustomer(null);
        }}
        customer={drawerCustomer}
        isManager={isManager}
        onEdit={(cust) => {
          setIsDrawerOpen(false);
          setSelectedCustomer(cust);
          setIsAddEditModalOpen(true);
        }}
        onAdjustPoints={(cust) => {
          setIsDrawerOpen(false);
          setAdjustTargetCustomer(cust);
          setIsAdjustPointsOpen(true);
        }}
      />

      {/* Adjust Points Modal */}
      <AdjustPointsModal
        isOpen={isAdjustPointsOpen}
        onClose={() => {
          setIsAdjustPointsOpen(false);
          setAdjustTargetCustomer(null);
        }}
        onSuccess={() => {
          showToast('Điều chỉnh điểm thưởng thành công!');
          fetchCustomers();
        }}
        customer={adjustTargetCustomer}
        customersList={customers}
      />

      {/* Add / Edit Customer Modal */}
      <CustomerFormModal
        isOpen={isAddEditModalOpen}
        onClose={() => {
          setIsAddEditModalOpen(false);
          setSelectedCustomer(null);
        }}
        onSubmit={selectedCustomer ? handleUpdateCustomer : handleCreateCustomer}
        customer={selectedCustomer}
      />

      {/* Assign Employee Role Modal */}
      <AssignRoleModal
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false);
          setAssignCustomer(null);
        }}
        onSubmit={handleAssignRole}
        customer={assignCustomer}
      />

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteCustomerTarget(null);
        }}
        onConfirm={handleDeleteCustomer}
        title="Xóa thông tin khách hàng"
        message={`Bạn có chắc chắn muốn xóa khách hàng "${deleteCustomerTarget?.fullName || ''}" khỏi hệ thống không?`}
      />
    </div>
  );
}

```

# dashboard\customers\transactions\page.tsx

| Property | Value |
|----------|-------|
| Path | `dashboard\customers\transactions\page.tsx` |
| Size | 17,989 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:54.904448 |

```tsx
'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Search,
  Filter,
  Clock,
  ArrowDownLeft,
  ArrowUpRight,
  PlusCircle,
  Calendar,
  FileText,
  X,
  ExternalLink,
} from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';
import { loyaltyService } from '@/api/loyalty.service';
import { LoyaltyTransaction } from '@/types/customer';
import { AdjustPointsModal } from '@/components/loyalty/AdjustPointsModal';

function TransactionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCustomerId = searchParams.get('customerId');

  const { user } = useAuthContext();
  const isManager = user?.role === 'MANAGER' || user?.role === 'ADMIN';

  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [customerIdFilter, setCustomerIdFilter] = useState<string>(initialCustomerId || '');
  const [orderIdFilter, setOrderIdFilter] = useState<string>('');
  const [transactionType, setTransactionType] = useState<string>('all');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');

  // Sync customerIdFilter state with URL searchParams when URL changes
  useEffect(() => {
    const queryCustId = searchParams.get('customerId');
    setCustomerIdFilter(queryCustId || '');
  }, [searchParams]);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Modals
  const [isAdjustPointsOpen, setIsAdjustPointsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await loyaltyService.getLoyaltyHistory({
        customerId: customerIdFilter ? Number(customerIdFilter) : undefined,
        orderId: orderIdFilter ? Number(orderIdFilter) : undefined,
        transactionType: transactionType !== 'all' ? (transactionType as 'EARN' | 'REDEEM') : undefined,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
        page,
        limit: 20,
      });

      setTransactions(res.items || res.data || []);
      if (res.meta) {
        setTotalPages(res.meta.totalPages || 1);
        setTotalItems(res.meta.totalItems || 0);
      } else {
        setTotalItems(res.items?.length || 0);
      }
    } catch {
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [customerIdFilter, orderIdFilter, transactionType, fromDate, toDate, page]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleFilterByCustomer = (id: number | string) => {
    const idStr = String(id);
    setCustomerIdFilter(idStr);
    setPage(1);
    router.push(`/dashboard/customers/transactions?customerId=${idStr}`);
  };

  const handleClearCustomerFilter = () => {
    setCustomerIdFilter('');
    setPage(1);
    router.push('/dashboard/customers/transactions');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-semibold z-50 animate-in fade-in">
          {toastMessage}
        </div>
      )}

      {/* Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/dashboard/customers"
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Danh sách Khách hàng</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Sổ cái biến động điểm thưởng</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Nhật ký toàn bộ giao dịch tích điểm (EARN) và trừ / đổi điểm (REDEEM)
          </p>
        </div>

        {isManager && (
          <button
            type="button"
            onClick={() => setIsAdjustPointsOpen(true)}
            className="flex items-center gap-2 bg-[#6F4E37] hover:bg-[#5A3F2C] text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition-all cursor-pointer active:scale-[0.99]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Điều chỉnh điểm thủ công</span>
          </button>
        )}
      </div>

      {/* Customer Filter Active Indicator Badge */}
      {customerIdFilter && (
        <div className="p-3 bg-[#FAF6F0] rounded-xl border border-[#EBE3D5] flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#6F4E37]" />
            <p className="text-xs text-gray-700 font-medium">
              Đang lọc giao dịch theo Khách hàng: <span className="font-bold text-[#6F4E37]">#{customerIdFilter}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={handleClearCustomerFilter}
            className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:underline cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Xóa lọc khách hàng</span>
          </button>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Filter Customer ID */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Mã Khách hàng (ID)</label>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="number"
                value={customerIdFilter}
                onChange={(e) => {
                  const val = e.target.value;
                  setCustomerIdFilter(val);
                  setPage(1);
                  if (val) {
                    router.push(`/dashboard/customers/transactions?customerId=${val}`);
                  } else {
                    router.push('/dashboard/customers/transactions');
                  }
                }}
                placeholder="Nhập ID khách..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
              />
            </div>
          </div>

          {/* Filter Order ID */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Mã đơn hàng (Order ID)</label>
            <div className="relative">
              <FileText className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="number"
                value={orderIdFilter}
                onChange={(e) => {
                  setOrderIdFilter(e.target.value);
                  setPage(1);
                }}
                placeholder="Nhập mã đơn..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
              />
            </div>
          </div>

          {/* Filter Transaction Type */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Loại giao dịch</label>
            <div className="relative">
              <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={transactionType}
                onChange={(e) => {
                  setTransactionType(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-9 pr-8 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20 cursor-pointer appearance-none bg-white"
              >
                <option value="all">Tất cả loại giao dịch</option>
                <option value="EARN">Cộng điểm (+)</option>
                <option value="REDEEM">Trừ / Đổi điểm (-)</option>
              </select>
            </div>
          </div>

          {/* Filter Date Range */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Từ ngày</label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="date"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF6F0] border-b border-gray-100 text-xs font-bold text-gray-600 uppercase tracking-wider">
                <th className="py-3.5 px-5">Mã GD</th>
                <th className="py-3.5 px-5">Khách hàng</th>
                <th className="py-3.5 px-5">Đơn hàng</th>
                <th className="py-3.5 px-5">Loại giao dịch</th>
                <th className="py-3.5 px-5">Số điểm</th>
                <th className="py-3.5 px-5">Số dư sau GD</th>
                <th className="py-3.5 px-5">Ghi chú</th>
                <th className="py-3.5 px-5">Thời gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400 text-sm">
                    Đang tải danh sách biến động điểm...
                  </td>
                </tr>
              ) : transactions.length > 0 ? (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50/60 transition-colors">
                    {/* ID */}
                    <td className="py-3.5 px-5 font-mono text-xs font-bold text-gray-700">#{tx.id}</td>

                    {/* Customer */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleFilterByCustomer(tx.customerId)}
                          className="group text-left cursor-pointer"
                          title="Click để lọc tất cả giao dịch của khách này"
                        >
                          <span className="font-bold text-gray-900 group-hover:text-[#6F4E37] transition-colors block">
                            {tx.customerName || `Khách hàng`}
                          </span>
                          {tx.customerPhone && (
                            <span className="block text-xs text-gray-400 font-mono">
                              {tx.customerPhone}
                            </span>
                          )}
                        </button>

                        <Link
                          href={`/dashboard/customers/${tx.customerId}`}
                          className="p-1 text-gray-400 hover:text-[#6F4E37] transition-colors"
                          title="Xem hồ sơ chi tiết khách hàng"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>

                    {/* Order ID */}
                    <td className="py-3.5 px-5 text-xs font-mono">
                      {tx.orderId ? (
                        <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100">
                          Order #{tx.orderId}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">Hệ thống</span>
                      )}
                    </td>

                    {/* Transaction Type */}
                    <td className="py-3.5 px-5">
                      {tx.transactionType === 'EARN' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <ArrowDownLeft className="w-3.5 h-3.5" />
                          Cộng điểm
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                          Trừ điểm
                        </span>
                      )}
                    </td>

                    {/* Points */}
                    <td className="py-3.5 px-5 font-bold text-sm">
                      <span className={tx.transactionType === 'EARN' ? 'text-emerald-600' : 'text-red-600'}>
                        {tx.transactionType === 'EARN' ? `+${tx.points}` : `-${tx.points}`} pts
                      </span>
                    </td>

                    {/* Balance After */}
                    <td className="py-3.5 px-5 font-bold text-gray-900 font-mono text-xs">
                      {(tx.balanceAfter || 0).toLocaleString('vi-VN')} pts
                    </td>

                    {/* Description */}
                    <td className="py-3.5 px-5 text-xs text-gray-500 max-w-xs truncate">
                      {tx.description || '-'}
                    </td>

                    {/* Time */}
                    <td className="py-3.5 px-5 text-xs text-gray-400 font-mono">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span>{tx.createdAt ? new Date(tx.createdAt).toLocaleString('vi-VN') : 'N/A'}</span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400 text-sm">
                    Không có nhật ký giao dịch phù hợp với bộ lọc.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info & Pagination */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 bg-white">
          <p>
            Hiển thị <span className="font-semibold text-gray-700">{transactions.length}</span> / {totalItems} bản ghi
          </p>

          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 font-semibold cursor-pointer"
              >
                Trước
              </button>
              <span className="font-semibold text-gray-700">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 font-semibold cursor-pointer"
              >
                Sau
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Adjust Points Modal */}
      <AdjustPointsModal
        isOpen={isAdjustPointsOpen}
        onClose={() => setIsAdjustPointsOpen(false)}
        onSuccess={() => {
          showToast('Điều chỉnh điểm thưởng thành công!');
          fetchTransactions();
        }}
      />
    </div>
  );
}

export default function TransactionsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-gray-400 text-sm">Đang tải...</div>}>
      <TransactionsContent />
    </Suspense>
  );
}

```

# dashboard\inventory\adjustments\page.tsx

| Property | Value |
|----------|-------|
| Path | `dashboard\inventory\adjustments\page.tsx` |
| Size | 22,925 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:54.907481 |

```tsx
"use client";

import { useState, useEffect } from "react";
import {
  Scale,
  Plus,
  Search,
  X,
  CheckCircle2,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  History,
  ChevronDown,
  Loader2,
  RefreshCw,
} from "lucide-react";
import inventoryService from "@/api/inventory.service";

interface Ingredient {
  id: number;
  name: string;
  unit: string;
  stockQuantity: number;
}

interface AdjustmentRecord {
  id: number;
  ticketCode?: string;
  ingredientId: number;
  ingredientName?: string;
  unit?: string;
  staffName?: string;
  oldQuantity?: number;
  newQuantity?: number;
  difference?: number;
  reason?: string;
  adjustedAt?: string;
  createdAt?: string;
}

export default function InventoryAdjustmentsPage() {
  const [adjustments, setAdjustments] = useState<AdjustmentRecord[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "LOSS" | "SURPLUS">("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIngId, setSelectedIngId] = useState<number | "">("");
  const [inputNewQty, setInputNewQty] = useState<number>(0);
  const [inputReason, setInputReason] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [adjRes, ingsRes] = await Promise.all([
        inventoryService.getAdjustments().catch(() => []),
        inventoryService.getIngredients().catch(() => []),
      ]);
      setAdjustments(Array.isArray(adjRes) ? adjRes : []);
      setIngredients(Array.isArray(ingsRes) ? ingsRes : []);
    } catch (err) {
      console.error("Failed to load adjustments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const currentIngredient = ingredients.find((i) => i.id === selectedIngId) || ingredients[0];
  const calculatedDiff = currentIngredient
    ? Number((inputNewQty - Number(currentIngredient.stockQuantity)).toFixed(3))
    : 0;

  const filteredAdjustments = adjustments.filter((adj) => {
    const query = searchQuery.toLowerCase();
    const matchSearch =
      !searchQuery ||
      (adj.ingredientName || "").toLowerCase().includes(query) ||
      (adj.reason || "").toLowerCase().includes(query) ||
      adj.id.toString().includes(query);

    const diff = Number(adj.difference || 0);
    const matchType =
      filterType === "ALL" ||
      (filterType === "LOSS" && diff < 0) ||
      (filterType === "SURPLUS" && diff > 0);

    return matchSearch && matchType;
  });

  const totalAdjustments = adjustments.length;
  const lossCount = adjustments.filter((a) => Number(a.difference || 0) < 0).length;
  const surplusCount = adjustments.filter((a) => Number(a.difference || 0) > 0).length;

  const handleOpenModal = () => {
    if (ingredients.length > 0) {
      setSelectedIngId(ingredients[0].id);
      setInputNewQty(Number(ingredients[0].stockQuantity));
    } else {
      setSelectedIngId("");
      setInputNewQty(0);
    }
    setInputReason("");
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleIngredientChange = (id: number) => {
    setSelectedIngId(id);
    const ing = ingredients.find((i) => i.id === id);
    if (ing) {
      setInputNewQty(Number(ing.stockQuantity));
    }
  };

  const handleCreateAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIngId) {
      setErrorMsg("Vui lòng chọn nguyên liệu");
      return;
    }
    if (!inputReason.trim()) {
      setErrorMsg("Vui lòng nhập lý do điều chỉnh hao hụt / thừa kho");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      await inventoryService.createAdjustment({
        ingredientId: Number(selectedIngId),
        newQuantity: Number(inputNewQty),
        reason: inputReason.trim(),
      });

      setIsModalOpen(false);
      showToast("Đã ghi nhận phiếu cân kho hao hụt!");
      await loadData();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Có lỗi xảy ra khi lập phiếu cân kho");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#6F4E37] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <span className="font-medium text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-[#F5EBE6] rounded-xl text-[#6F4E37]">
              <Scale className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Kiểm kê & Cân kho Hao hụt
            </h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Ghi nhận chênh lệch thực tế, đối soát tồn kho định kỳ và hạch toán hao hụt nguyên vật liệu
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadData}
            className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer"
            title="Làm mới"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            type="button"
            onClick={handleOpenModal}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#6F4E37] hover:bg-[#5A3F2C] text-white rounded-xl font-semibold text-sm transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Lập phiếu cân kho hao hụt</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#F5EBE6] text-[#6F4E37] flex items-center justify-center font-bold">
            <History className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Tổng số lần cân kho</p>
            <p className="text-lg font-bold text-gray-900">
              {totalAdjustments} <span className="text-xs text-gray-500 font-normal">phiếu</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Lần hao hụt (Âm)</p>
            <p className="text-lg font-bold text-rose-600">
              {lossCount} <span className="text-xs text-gray-500 font-normal">lần</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Lần dư kho (Dương)</p>
            <p className="text-lg font-bold text-emerald-700">
              {surplusCount} <span className="text-xs text-gray-500 font-normal">lần</span>
            </p>
          </div>
        </div>
      </div>

      {/* Toolbar: Search & Type Filter */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Tìm theo tên nguyên liệu hoặc lý do..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6F4E37] focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilterType("ALL")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
              filterType === "ALL"
                ? "bg-[#6F4E37] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Tất cả ({adjustments.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType("LOSS")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
              filterType === "LOSS"
                ? "bg-rose-600 text-white"
                : "bg-rose-50 text-rose-600 hover:bg-rose-100"
            }`}
          >
            Hao hụt âm ({lossCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterType("SURPLUS")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
              filterType === "SURPLUS"
                ? "bg-emerald-600 text-white"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            }`}
          >
            Thừa kho dương ({surplusCount})
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF6F0] text-gray-600 text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
                <th className="py-3.5 px-5">Mã phiếu</th>
                <th className="py-3.5 px-5">Tên nguyên liệu</th>
                <th className="py-3.5 px-4 text-center">Tồn cũ</th>
                <th className="py-3.5 px-4 text-center">Tồn thực tế</th>
                <th className="py-3.5 px-4 text-center">Chênh lệch</th>
                <th className="py-3.5 px-5">Lý do điều chỉnh</th>
                <th className="py-3.5 px-5 text-right">Thời gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#6F4E37]" />
                    Đang tải danh sách cân kho...
                  </td>
                </tr>
              ) : filteredAdjustments.length > 0 ? (
                filteredAdjustments.map((adj) => {
                  const diff = Number(adj.difference || 0);
                  const isNegative = diff < 0;
                  const isPositive = diff > 0;

                  return (
                    <tr key={adj.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3.5 px-5">
                        <span className="font-mono font-bold text-[#6F4E37] bg-[#F5EBE6] px-2.5 py-1 rounded-lg text-xs">
                          #ADJ-{String(adj.id).padStart(3, "0")}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 font-bold text-gray-900">
                        {adj.ingredientName || `Nguyên liệu #${adj.ingredientId}`}
                      </td>
                      <td className="py-3.5 px-4 text-center font-medium text-gray-600">
                        {adj.oldQuantity ?? "—"}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-gray-900">
                        {adj.newQuantity ?? "—"}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {isNegative && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg font-mono font-bold text-xs">
                            <TrendingDown className="w-3 h-3" />
                            {diff} {adj.unit || ""}
                          </span>
                        )}
                        {isPositive && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg font-mono font-bold text-xs">
                            <TrendingUp className="w-3 h-3" />
                            +{diff} {adj.unit || ""}
                          </span>
                        )}
                        {!isNegative && !isPositive && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs font-mono font-medium">
                            0
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-5 text-xs text-gray-700 max-w-xs">
                        <p className="line-clamp-2">{adj.reason || "—"}</p>
                      </td>
                      <td className="py-3.5 px-5 text-right text-xs text-gray-500 font-medium">
                        {adj.adjustedAt || adj.createdAt
                          ? new Date(adj.adjustedAt || adj.createdAt!).toLocaleString("vi-VN")
                          : "—"}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    Chưa có lịch sử cân kho hao hụt.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Cân kho Hao hụt */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="p-5 bg-[#FAF6F0] border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white rounded-xl text-[#6F4E37] shadow-xs">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Lập phiếu cân kho & hao hụt</h3>
                  <p className="text-xs text-gray-500">
                    Cập nhật lại số tồn thực tế và hạch toán chênh lệch
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateAdjustment} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                  1. Chọn nguyên liệu kiểm kê <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedIngId}
                    onChange={(e) => handleIngredientChange(Number(e.target.value))}
                    className="w-full pl-3.5 pr-10 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6F4E37] appearance-none cursor-pointer"
                  >
                    {ingredients.map((ing) => (
                      <option key={ing.id} value={ing.id}>
                        {ing.name} (Tồn hệ thống: {Number(ing.stockQuantity)} {ing.unit})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div>
                  <span className="text-xs font-medium text-gray-500">Tồn cũ hệ thống:</span>
                  <div className="text-lg font-bold text-gray-800 mt-1">
                    {currentIngredient ? Number(currentIngredient.stockQuantity) : 0}{" "}
                    <span className="text-xs font-normal text-gray-500">
                      {currentIngredient?.unit}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Tồn thực tế kiểm kê <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      min="0"
                      required
                      value={inputNewQty}
                      onChange={(e) => setInputNewQty(parseFloat(e.target.value) || 0)}
                      className="w-full pl-3 pr-10 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-medium">
                      {currentIngredient?.unit}
                    </span>
                  </div>
                </div>
              </div>

              <div
                className={`p-4 rounded-xl border flex items-center justify-between transition-colors ${
                  calculatedDiff < 0
                    ? "bg-rose-50 border-rose-200 text-rose-800"
                    : calculatedDiff > 0
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : "bg-gray-100 border-gray-200 text-gray-700"
                }`}
              >
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    {calculatedDiff < 0
                      ? "Phát hiện hao hụt (Thiếu kho):"
                      : calculatedDiff > 0
                      ? "Phát hiện dôi dư (Thừa kho):"
                      : "Không có chênh lệch:"}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-mono font-bold">
                    {calculatedDiff > 0 ? `+${calculatedDiff}` : calculatedDiff}{" "}
                    {currentIngredient?.unit}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                  Lý do hao hụt / căn cứ điều chỉnh <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={inputReason}
                  onChange={(e) => setInputReason(e.target.value)}
                  placeholder="VD: Rơi vỡ trong ca, hao hụt bọt sữa, hỏng nguyên liệu khi pha chế..."
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-[#6F4E37] hover:bg-[#5A3F2C] text-white rounded-xl text-sm font-semibold transition-colors shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Xác nhận điều chỉnh</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

```

# dashboard\inventory\boms\page.tsx

| Property | Value |
|----------|-------|
| Path | `dashboard\inventory\boms\page.tsx` |
| Size | 27,136 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:54.910165 |

```tsx
"use client";

import { useState, useEffect } from "react";
import {
  FlaskConical,
  Plus,
  Trash2,
  Layers,
  Sparkles,
  Coffee,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Loader2,
  RefreshCw,
} from "lucide-react";
import inventoryService from "@/api/inventory.service";
import menuService from "@/api/menu.service";

type BomTab = "RECIPE_BOM" | "TOPPING_BOM";

interface Ingredient {
  id: number;
  name: string;
  unit: string;
  stockQuantity: number;
}

interface ProductVariant {
  id: number;
  size: string;
  price: number;
}

interface Product {
  id: number;
  name: string;
  categoryName?: string;
  variants: ProductVariant[];
}

interface Topping {
  id: number;
  name: string;
  price: number;
}

interface RecipeBOMDetail {
  variantId?: number;
  productName: string;
  productSize: string;
  ingredientId?: number;
  ingredientName: string;
  consumedQuantity: number;
  ingredientUnit: string;
}

interface ToppingBOMDetail {
  toppingId?: number;
  toppingName: string;
  ingredientId?: number;
  ingredientName: string;
  consumedQuantity: number;
  unit: string;
}

export default function BOMManagementPage() {
  const [activeTab, setActiveTab] = useState<BomTab>("RECIPE_BOM");
  const [loading, setLoading] = useState(true);

  // Data lists from API
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [toppings, setToppings] = useState<Topping[]>([]);
  const [recipeBoms, setRecipeBoms] = useState<RecipeBOMDetail[]>([]);
  const [toppingBoms, setToppingBoms] = useState<ToppingBOMDetail[]>([]);

  // Selected State
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const [selectedToppingId, setSelectedToppingId] = useState<number | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formIngredientId, setFormIngredientId] = useState<number | "">("");
  const [formQty, setFormQty] = useState<number>(0.01);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [ingsData, prodsData, topsData, recipeData, toppingData] = await Promise.all([
        inventoryService.getIngredients().catch(() => []),
        menuService.getProducts().catch(() => []),
        menuService.getToppings().catch(() => []),
        inventoryService.getRecipeBOMs().catch(() => []),
        inventoryService.getToppingBOMs().catch(() => []),
      ]);

      setIngredients(Array.isArray(ingsData) ? ingsData : []);
      const prodList = Array.isArray(prodsData) ? prodsData : [];
      setProducts(prodList);
      const topList = Array.isArray(topsData) ? topsData : [];
      setToppings(topList);
      setRecipeBoms(Array.isArray(recipeData) ? recipeData : []);
      setToppingBoms(Array.isArray(toppingData) ? toppingData : []);

      if (prodList.length > 0 && selectedProductId === null) {
        setSelectedProductId(prodList[0].id);
        if (prodList[0].variants?.length > 0) {
          setSelectedVariantId(prodList[0].variants[0].id);
        }
      }
      if (topList.length > 0 && selectedToppingId === null) {
        setSelectedToppingId(topList[0].id);
      }
    } catch (err) {
      console.error("Error loading BOM data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];
  const selectedVariant = selectedProduct?.variants?.find((v) => v.id === selectedVariantId) || selectedProduct?.variants?.[0];
  const selectedTopping = toppings.find((t) => t.id === selectedToppingId) || toppings[0];

  // Filter Recipe BOMs for current product & size
  const currentRecipeItems = recipeBoms.filter((rb) => {
    if (!selectedProduct) return false;
    const matchName = rb.productName === selectedProduct.name;
    const matchSize = selectedVariant ? rb.productSize === selectedVariant.size : true;
    return matchName && matchSize;
  });

  // Filter Topping BOMs for current topping
  const currentToppingItems = toppingBoms.filter((tb) => {
    if (!selectedTopping) return false;
    return tb.toppingName === selectedTopping.name;
  });

  const handleOpenAddModal = () => {
    if (ingredients.length > 0) {
      setFormIngredientId(ingredients[0].id);
    } else {
      setFormIngredientId("");
    }
    setFormQty(0.01);
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formIngredientId) {
      setErrorMsg("Vui lòng chọn nguyên liệu");
      return;
    }
    setSubmitting(true);
    setErrorMsg("");

    try {
      if (activeTab === "RECIPE_BOM") {
        if (!selectedVariantId) {
          setErrorMsg("Không tìm thấy thông tin biến thể size sản phẩm");
          setSubmitting(false);
          return;
        }
        await inventoryService.addRecipeBOMItem({
          variantId: Number(selectedVariantId),
          ingredientId: Number(formIngredientId),
          consumedQuantity: Number(formQty),
        });
        showToast("Đã lưu định lượng công thức!");
      } else {
        if (!selectedToppingId) {
          setErrorMsg("Không tìm thấy thông tin topping");
          setSubmitting(false);
          return;
        }
        await inventoryService.addToppingBOMItem({
          toppingId: Number(selectedToppingId),
          ingredientId: Number(formIngredientId),
          consumedQuantity: Number(formQty),
        });
        showToast("Đã lưu định lượng Topping!");
      }
      setIsModalOpen(false);
      await loadData();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Có lỗi xảy ra khi lưu định lượng");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRecipeItem = async (ingredientId?: number) => {
    if (!selectedVariantId || !ingredientId) return;
    if (!confirm("Bạn có chắc chắn muốn xóa nguyên liệu này khỏi công thức?")) return;

    try {
      await inventoryService.deleteRecipeBOMItem(selectedVariantId, ingredientId);
      showToast("Đã xóa nguyên liệu khỏi công thức!");
      await loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Không thể xóa nguyên liệu khỏi công thức");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#6F4E37] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <span className="font-medium text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-[#F5EBE6] rounded-xl text-[#6F4E37]">
              <FlaskConical className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Cấu hình Định lượng (BOM)
            </h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Thiết lập định lượng nguyên vật liệu tiêu hao (Bill of Materials) để tự động trừ kho khi bán hàng
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadData}
            className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer"
            title="Làm mới"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs font-medium">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Độ chính xác định mức: 0.001</span>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab("RECIPE_BOM")}
          className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm cursor-pointer ${
            activeTab === "RECIPE_BOM"
              ? "bg-[#6F4E37] text-white shadow-[#6F4E37]/20"
              : "bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200"
          }`}
        >
          <Coffee className="w-4 h-4" />
          <span>Định lượng Đồ uống (RecipeBOM)</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
              activeTab === "RECIPE_BOM" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            {products.length} sản phẩm
          </span>
        </button>

        <button
          onClick={() => setActiveTab("TOPPING_BOM")}
          className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm cursor-pointer ${
            activeTab === "TOPPING_BOM"
              ? "bg-[#6F4E37] text-white shadow-[#6F4E37]/20"
              : "bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Định lượng Topping (ToppingBOM)</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
              activeTab === "TOPPING_BOM" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            {toppings.length} topping
          </span>
        </button>
      </div>

      {/* TAB 1: RECIPE BOM */}
      {activeTab === "RECIPE_BOM" && (
        <div className="space-y-6">
          {/* Controls Bar: Select Product & Select Size Variant */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 flex-1">
              {/* Product Selector */}
              <div className="flex-1 min-w-[260px]">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  1. Chọn Sản phẩm đồ uống
                </label>
                <div className="relative">
                  <select
                    value={selectedProductId || ""}
                    onChange={(e) => {
                      const prodId = Number(e.target.value);
                      setSelectedProductId(prodId);
                      const prod = products.find((p) => p.id === prodId);
                      if (prod && prod.variants?.length > 0) {
                        setSelectedVariantId(prod.variants[0].id);
                      } else {
                        setSelectedVariantId(null);
                      }
                    }}
                    className="w-full pl-3.5 pr-10 py-2.5 bg-[#FAF6F0] border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#6F4E37] appearance-none cursor-pointer"
                  >
                    {products.map((prod) => (
                      <option key={prod.id} value={prod.id}>
                        {prod.name} {prod.categoryName ? `(${prod.categoryName})` : ""}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Size Variant Selector */}
              <div className="w-full sm:w-[260px]">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  2. Chọn Biến thể Size
                </label>
                <div className="relative">
                  <select
                    value={selectedVariantId || ""}
                    onChange={(e) => setSelectedVariantId(Number(e.target.value))}
                    className="w-full pl-3.5 pr-10 py-2.5 bg-[#FAF6F0] border border-gray-200 rounded-xl text-sm font-semibold text-[#6F4E37] focus:outline-none focus:ring-2 focus:ring-[#6F4E37] appearance-none cursor-pointer"
                  >
                    {selectedProduct?.variants?.map((variant) => (
                      <option key={variant.id} value={variant.id}>
                        Size {variant.size} ({Number(variant.price).toLocaleString("vi-VN")}đ)
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#6F4E37] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#6F4E37] hover:bg-[#5A3F2C] text-white rounded-xl text-sm font-semibold transition-all shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm nguyên liệu</span>
              </button>
            </div>
          </div>

          {/* Table: BOM Items */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-base">
                  Bảng định mức: {selectedProduct?.name} -{" "}
                  <span className="text-[#6F4E37]">Size {selectedVariant?.size || "M"}</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Số lượng tiêu hao nguyên liệu khi chế biến 1 đơn vị sản phẩm
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg font-medium">
                {currentRecipeItems.length} thành phần
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FAF6F0] text-gray-600 text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
                    <th className="py-3.5 px-5">Tên nguyên liệu</th>
                    <th className="py-3.5 px-5 text-center">Định mức tiêu hao</th>
                    <th className="py-3.5 px-5">Đơn vị tính</th>
                    <th className="py-3.5 px-5 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-gray-400">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#6F4E37]" />
                        Đang tải định lượng công thức...
                      </td>
                    </tr>
                  ) : currentRecipeItems.length > 0 ? (
                    currentRecipeItems.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3.5 px-5 font-bold text-gray-900">
                          {item.ingredientName}
                        </td>
                        <td className="py-3.5 px-5 text-center">
                          <span className="inline-block px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg font-mono font-bold text-sm">
                            {Number(item.consumedQuantity).toFixed(3)}
                          </span>
                        </td>
                        <td className="py-3.5 px-5">
                          <span className="px-2.5 py-0.5 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                            {item.ingredientUnit}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteRecipeItem(item.ingredientId)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Xóa khỏi công thức"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-10 text-center text-gray-400">
                        <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        Chưa có nguyên liệu nào được cấu hình cho kích cỡ này.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TOPPING BOM */}
      {activeTab === "TOPPING_BOM" && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="w-full sm:w-[320px]">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Chọn Topping
              </label>
              <div className="relative">
                <select
                  value={selectedToppingId || ""}
                  onChange={(e) => setSelectedToppingId(Number(e.target.value))}
                  className="w-full pl-3.5 pr-10 py-2.5 bg-[#FAF6F0] border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#6F4E37] appearance-none cursor-pointer"
                >
                  {toppings.map((top) => (
                    <option key={top.id} value={top.id}>
                      {top.name} (+{Number(top.price).toLocaleString("vi-VN")}đ)
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <button
              type="button"
              onClick={handleOpenAddModal}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#6F4E37] hover:bg-[#5A3F2C] text-white rounded-xl text-sm font-semibold transition-all shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm nguyên liệu Topping</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-base">
                  Bảng định mức Topping: {selectedTopping?.name}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Định lượng nguyên liệu tiêu hao cho 1 suất topping
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg font-medium">
                {currentToppingItems.length} thành phần
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FAF6F0] text-gray-600 text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
                    <th className="py-3.5 px-5">Tên nguyên liệu</th>
                    <th className="py-3.5 px-5 text-center">Định mức tiêu hao</th>
                    <th className="py-3.5 px-5">Đơn vị tính</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {loading ? (
                    <tr>
                      <td colSpan={3} className="py-12 text-center text-gray-400">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#6F4E37]" />
                        Đang tải định lượng Topping...
                      </td>
                    </tr>
                  ) : currentToppingItems.length > 0 ? (
                    currentToppingItems.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3.5 px-5 font-bold text-gray-900">
                          {item.ingredientName}
                        </td>
                        <td className="py-3.5 px-5 text-center">
                          <span className="inline-block px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg font-mono font-bold text-sm">
                            {Number(item.consumedQuantity).toFixed(3)}
                          </span>
                        </td>
                        <td className="py-3.5 px-5">
                          <span className="px-2.5 py-0.5 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                            {item.unit}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-10 text-center text-gray-400">
                        <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        Chưa có nguyên liệu nào được cấu hình cho topping này.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal Thêm nguyên liệu vào định lượng */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-gray-900">
              Thêm nguyên liệu vào định lượng
            </h2>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSaveItem} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Chọn nguyên liệu từ kho <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={formIngredientId}
                  onChange={(e) => setFormIngredientId(Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
                >
                  {ingredients.map((ing) => (
                    <option key={ing.id} value={ing.id}>
                      {ing.name} ({ing.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Định mức tiêu hao <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="0.0001"
                  step="any"
                  required
                  value={formQty}
                  onChange={(e) => setFormQty(Number(e.target.value))}
                  placeholder="Ví dụ: 0.02"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20 font-mono font-bold"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#6F4E37] hover:bg-[#5A3F2C] rounded-xl flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Lưu định lượng</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

```

# dashboard\inventory\imports\[id]\page.tsx

| Property | Value |
|----------|-------|
| Path | `dashboard\inventory\imports\[id]\page.tsx` |
| Size | 219 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:54.913163 |

```tsx
export default function Page() {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-800">Chi tiết phiếu nhập kho (Import Detail)</h1>
        </div>
    );
}

```

# dashboard\inventory\imports\new\page.tsx

| Property | Value |
|----------|-------|
| Path | `dashboard\inventory\imports\new\page.tsx` |
| Size | 217 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:54.915195 |

```tsx
export default function Page() {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-800">Lập phiếu nhập kho mới (New Import)</h1>
        </div>
    );
}

```

# dashboard\inventory\imports\page.tsx

| Property | Value |
|----------|-------|
| Path | `dashboard\inventory\imports\page.tsx` |
| Size | 30,410 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:54.917162 |

```tsx
"use client";

import { useState, useEffect } from "react";
import {
  FileDown,
  Plus,
  Search,
  Eye,
  X,
  Trash2,
  CheckCircle2,
  PackagePlus,
  Printer,
  DollarSign,
  TrendingUp,
  Building2,
  FileText,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import inventoryService from "@/api/inventory.service";

interface ImportDetail {
  id?: number;
  ingredientId: number;
  ingredientName?: string;
  unit?: string;
  quantity: number;
  unitPrice: number;
  totalLineAmount?: number;
}

interface ImportTicket {
  id: number;
  supplierName?: string;
  createdByName?: string;
  importDate?: string;
  totalAmount: number;
  note?: string;
  details?: ImportDetail[];
}

interface Ingredient {
  id: number;
  name: string;
  unit: string;
}

export default function InventoryImportsPage() {
  const { user } = useAuthContext();
  const [tickets, setTickets] = useState<ImportTicket[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchSupplier, setSearchSupplier] = useState("");

  // Drawer Detail State
  const [selectedTicket, setSelectedTicket] = useState<ImportTicket | null>(null);
  const [drawerDetails, setDrawerDetails] = useState<ImportDetail[]>([]);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Modal Create Ticket State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formSupplier, setFormSupplier] = useState("");
  const [formNote, setFormNote] = useState("");
  const [formLines, setFormLines] = useState<
    { id: string; ingredientId: number; quantity: number; unitPrice: number }[]
  >([]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [importsRes, ingsRes] = await Promise.all([
        inventoryService.getImports().catch(() => []),
        inventoryService.getIngredients().catch(() => []),
      ]);
      setTickets(Array.isArray(importsRes) ? importsRes : []);
      setIngredients(Array.isArray(ingsRes) ? ingsRes : []);
    } catch (err) {
      console.error("Failed to load imports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredTickets = tickets.filter((t) => {
    const query = searchSupplier.toLowerCase();
    const matchSupplier = (t.supplierName || "").toLowerCase().includes(query);
    const matchCode = (t.id ? `PNK-${t.id}` : "").toLowerCase().includes(query);
    return matchSupplier || matchCode;
  });

  const totalImportValue = tickets.reduce((sum, t) => sum + (Number(t.totalAmount) || 0), 0);
  const totalTicketsCount = tickets.length;

  const handleOpenDrawer = async (ticket: ImportTicket) => {
    setSelectedTicket(ticket);
    setIsDrawerOpen(true);
    setLoadingDetail(true);
    try {
      const res = await inventoryService.getImportDetail(ticket.id);
      setDrawerDetails(Array.isArray(res) ? res : res?.details || []);
    } catch (err) {
      console.error("Failed to load import detail:", err);
      setDrawerDetails(ticket.details || []);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleOpenCreateModal = () => {
    setFormSupplier("");
    setFormNote("");
    if (ingredients.length > 0) {
      setFormLines([
        {
          id: `line-${Date.now()}`,
          ingredientId: ingredients[0].id,
          quantity: 10,
          unitPrice: 50000,
        },
      ]);
    } else {
      setFormLines([]);
    }
    setErrorMsg("");
    setIsCreateModalOpen(true);
  };

  const handleAddLine = () => {
    if (ingredients.length === 0) return;
    setFormLines([
      ...formLines,
      {
        id: `line-${Date.now()}-${Math.random()}`,
        ingredientId: ingredients[0].id,
        quantity: 1,
        unitPrice: 10000,
      },
    ]);
  };

  const handleRemoveLine = (id: string) => {
    if (formLines.length === 1) {
      alert("Phiếu nhập cần ít nhất một mặt hàng!");
      return;
    }
    setFormLines(formLines.filter((l) => l.id !== id));
  };

  const handleUpdateLine = (id: string, field: string, value: number) => {
    setFormLines((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [field]: value } : l))
    );
  };

  const modalTotalAmount = formLines.reduce(
    (sum, l) => sum + (Number(l.quantity) || 0) * (Number(l.unitPrice) || 0),
    0
  );

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSupplier.trim()) {
      setErrorMsg("Vui lòng nhập tên nhà cung cấp");
      return;
    }
    if (formLines.length === 0) {
      setErrorMsg("Vui lòng thêm ít nhất 1 mặt hàng");
      return;
    }
    setSubmitting(true);
    setErrorMsg("");

    try {
      await inventoryService.createImportTicket({
        supplierName: formSupplier.trim(),
        employeeId: user?.id || 1,
        note: formNote.trim() || undefined,
        details: formLines.map((l) => ({
          ingredientId: Number(l.ingredientId),
          quantity: Number(l.quantity),
          unitPrice: Number(l.unitPrice),
        })),
      });
      setIsCreateModalOpen(false);
      showToast("Đã tạo phiếu nhập kho thành công!");
      await loadData();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Có lỗi xảy ra khi tạo phiếu nhập kho");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#6F4E37] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <span className="font-medium text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-[#F5EBE6] rounded-xl text-[#6F4E37]">
              <PackagePlus className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Lịch sử & Quản lý Nhập kho
            </h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Theo dõi danh sách các phiếu nhập hàng từ nhà cung cấp, cập nhật giá vốn và tồn kho
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadData}
            className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer"
            title="Làm mới"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#6F4E37] hover:bg-[#5A3F2C] text-white rounded-xl font-semibold text-sm transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Lập phiếu nhập kho mới</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#F5EBE6] text-[#6F4E37] flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Tổng giá trị nhập kho</p>
            <p className="text-xl font-bold text-gray-900">
              {totalImportValue.toLocaleString("vi-VN")} <span className="text-sm font-normal text-gray-500">đ</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Tổng số phiếu nhập</p>
            <p className="text-xl font-bold text-gray-900">
              {totalTicketsCount} <span className="text-sm font-normal text-gray-500">phiếu</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Số loại nguyên liệu</p>
            <p className="text-xl font-bold text-amber-700">
              {ingredients.length} <span className="text-sm font-normal text-gray-500">mặt hàng</span>
            </p>
          </div>
        </div>
      </div>

      {/* Toolbar: Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Tìm theo tên nhà cung cấp hoặc mã phiếu (#PNK-...)"
            value={searchSupplier}
            onChange={(e) => setSearchSupplier(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6F4E37] focus:bg-white"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF6F0] text-gray-600 text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
                <th className="py-3.5 px-5">Mã phiếu</th>
                <th className="py-3.5 px-5">Nhà cung cấp</th>
                <th className="py-3.5 px-5">Ngày giờ nhập</th>
                <th className="py-3.5 px-5">Tổng tiền</th>
                <th className="py-3.5 px-5">Ghi chú</th>
                <th className="py-3.5 px-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#6F4E37]" />
                    Đang tải phiếu nhập kho...
                  </td>
                </tr>
              ) : filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-5">
                      <span className="font-mono font-bold text-[#6F4E37] bg-[#F5EBE6] px-2.5 py-1 rounded-lg text-xs">
                        #PNK-{String(ticket.id).padStart(3, "0")}
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="font-bold text-gray-900 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-gray-400" />
                        <span>{ticket.supplierName || "Nhà cung cấp tự do"}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-gray-600 text-xs">
                      {ticket.importDate ? new Date(ticket.importDate).toLocaleString("vi-VN") : "—"}
                    </td>
                    <td className="py-3.5 px-5 font-bold text-gray-900">
                      {Number(ticket.totalAmount).toLocaleString("vi-VN")}{" "}
                      <span className="text-xs text-gray-400 font-normal">đ</span>
                    </td>
                    <td className="py-3.5 px-5 text-xs text-gray-500 max-w-xs truncate">
                      {ticket.note || "—"}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenDrawer(ticket)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF6F0] hover:bg-[#F5EBE6] text-[#6F4E37] font-semibold text-xs rounded-lg transition-colors border border-[#6F4E37]/15 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Xem chi tiết</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    Chưa có phiếu nhập kho nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Lập Phiếu Nhập Kho Mới */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 bg-[#FAF6F0] border-b border-gray-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white rounded-xl text-[#6F4E37] shadow-xs">
                  <PackagePlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Lập phiếu nhập kho nguyên liệu</h3>
                  <p className="text-xs text-gray-500">
                    Cập nhật số lượng tồn kho tự động
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateTicket} className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                    Tên Nhà Cung Cấp
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Công ty Cà phê Việt"
                    value={formSupplier}
                    onChange={(e) => setFormSupplier(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                    Ghi chú
                  </label>
                  <input
                    type="text"
                    placeholder="Ghi chú phiếu nhập..."
                    value={formNote}
                    onChange={(e) => setFormNote(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Danh sách mặt hàng nhập ({formLines.length})
                  </label>
                  <button
                    type="button"
                    onClick={handleAddLine}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF6F0] hover:bg-[#F5EBE6] text-[#6F4E37] text-xs font-semibold rounded-lg transition-colors border border-[#6F4E37]/20 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm mặt hàng</span>
                  </button>
                </div>

                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#FAF6F0] text-gray-600 font-semibold uppercase tracking-wider border-b border-gray-200">
                        <th className="py-2.5 px-3">Tên Nguyên liệu</th>
                        <th className="py-2.5 px-3 w-28 text-center">Số lượng</th>
                        <th className="py-2.5 px-3 w-36 text-right">Đơn giá nhập</th>
                        <th className="py-2.5 px-3 w-36 text-right">Thành tiền</th>
                        <th className="py-2.5 px-2 w-10 text-center"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {formLines.map((line) => {
                        const subtotal = (Number(line.quantity) || 0) * (Number(line.unitPrice) || 0);
                        return (
                          <tr key={line.id} className="hover:bg-gray-50">
                            <td className="py-2.5 px-3">
                              <select
                                value={line.ingredientId}
                                onChange={(e) =>
                                  handleUpdateLine(line.id, "ingredientId", Number(e.target.value))
                                }
                                className="w-full py-1.5 px-2 bg-white border border-gray-300 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#6F4E37]"
                              >
                                {ingredients.map((ing) => (
                                  <option key={ing.id} value={ing.id}>
                                    {ing.name} ({ing.unit})
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <input
                                type="number"
                                step="any"
                                min="0.01"
                                required
                                value={line.quantity}
                                onChange={(e) =>
                                  handleUpdateLine(line.id, "quantity", parseFloat(e.target.value) || 0)
                                }
                                className="w-full py-1.5 px-2 text-center font-bold bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6F4E37]"
                              />
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <input
                                type="number"
                                step="1000"
                                min="0"
                                required
                                value={line.unitPrice}
                                onChange={(e) =>
                                  handleUpdateLine(line.id, "unitPrice", parseFloat(e.target.value) || 0)
                                }
                                className="w-full py-1.5 px-2 text-right font-medium bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6F4E37]"
                              />
                            </td>
                            <td className="py-2.5 px-3 text-right font-bold text-gray-900">
                              {Math.round(subtotal).toLocaleString("vi-VN")} đ
                            </td>
                            <td className="py-2.5 px-2 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveLine(line.id)}
                                className="p-1 text-gray-400 hover:text-rose-600 rounded cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-4 bg-[#FAF6F0] rounded-xl border border-gray-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-gray-600 uppercase">Tổng tiền thanh toán:</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-[#6F4E37]">
                    {modalTotalAmount.toLocaleString("vi-VN")}{" "}
                    <span className="text-sm font-normal text-gray-600">VNĐ</span>
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-[#6F4E37] hover:bg-[#5A3F2C] text-white rounded-xl text-sm font-semibold transition-colors shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Hoàn tất & Nhập kho</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DRAWER: Xem Chi Tiết Phiếu Nhập */}
      {isDrawerOpen && selectedTicket && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xl bg-white shadow-2xl border-l border-gray-100 flex flex-col">
              <div className="p-6 bg-[#FAF6F0] border-b border-gray-200 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">
                      Phiếu nhập #PNK-{String(selectedTicket.id).padStart(3, "0")}
                    </span>
                  </div>
                  {selectedTicket.importDate && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      Ngày nhập: {new Date(selectedTicket.importDate).toLocaleString("vi-VN")}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-xl cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-xs">Nhà cung cấp:</span>
                    <span className="font-bold text-gray-900">{selectedTicket.supplierName || "—"}</span>
                  </div>
                  <div className="flex items-start justify-between">
                    <span className="text-gray-500 text-xs">Ghi chú:</span>
                    <span className="text-gray-700 text-xs text-right max-w-xs">{selectedTicket.note || "—"}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 text-sm mb-3">
                    Chi tiết danh sách hàng nhập
                  </h4>
                  {loadingDetail ? (
                    <div className="py-8 text-center text-gray-400">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#6F4E37]" />
                      Đang tải chi tiết phiếu nhập...
                    </div>
                  ) : drawerDetails.length > 0 ? (
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-[#FAF6F0] text-gray-600 font-semibold uppercase tracking-wider border-b border-gray-200">
                            <th className="py-2.5 px-3">Nguyên liệu</th>
                            <th className="py-2.5 px-3 text-center">Số lượng</th>
                            <th className="py-2.5 px-3 text-right">Đơn giá</th>
                            <th className="py-2.5 px-3 text-right">Thành tiền</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {drawerDetails.map((item, idx) => {
                            const qty = Number(item.quantity) || 0;
                            const price = Number(item.unitPrice) || 0;
                            const total = item.totalLineAmount || qty * price;
                            return (
                              <tr key={idx} className="hover:bg-gray-50">
                                <td className="py-3 px-3">
                                  <div className="font-semibold text-gray-900">
                                    {item.ingredientName || `Nguyên liệu #${item.ingredientId}`}
                                  </div>
                                </td>
                                <td className="py-3 px-3 text-center font-bold text-gray-900">
                                  {qty} {item.unit || ""}
                                </td>
                                <td className="py-3 px-3 text-right text-gray-600">
                                  {price.toLocaleString("vi-VN")} đ
                                </td>
                                <td className="py-3 px-3 text-right font-bold text-[#6F4E37]">
                                  {total.toLocaleString("vi-VN")} đ
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400">Không có chi tiết hàng nhập.</p>
                  )}
                </div>

                <div className="bg-[#FAF6F0] p-4 rounded-xl border border-gray-200 flex items-center justify-between">
                  <span className="font-semibold text-gray-800 text-sm">Tổng cộng thanh toán:</span>
                  <span className="text-xl font-bold text-[#6F4E37]">
                    {Number(selectedTicket.totalAmount).toLocaleString("vi-VN")} VNĐ
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

```

# dashboard\inventory\ingredients\page.tsx

| Property | Value |
|----------|-------|
| Path | `dashboard\inventory\ingredients\page.tsx` |
| Size | 19,481 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:54.921172 |

```tsx
"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Package,
  AlertTriangle,
  Coins,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import inventoryService from "@/api/inventory.service";

interface Ingredient {
  id: number;
  name: string;
  unit: string;
  stockQuantity: number;
  minimumThreshold: number;
  createdAt?: string;
  updatedAt?: string;
}

export default function IngredientsPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Ingredient | null>(null);
  const [formName, setFormName] = useState("");
  const [formUnit, setFormUnit] = useState("kg");
  const [formStock, setFormStock] = useState<number>(0);
  const [formMinThreshold, setFormMinThreshold] = useState<number>(10);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchIngredients = async () => {
    setLoading(true);
    try {
      const data = await inventoryService.getIngredients();
      setIngredients(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch ingredients:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setFormName("");
    setFormUnit("kg");
    setFormStock(0);
    setFormMinThreshold(10);
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: Ingredient) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormUnit(item.unit);
    setFormStock(item.stockQuantity);
    setFormMinThreshold(item.minimumThreshold);
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setErrorMsg("Tên nguyên liệu không được để trống");
      return;
    }
    setSubmitting(true);
    setErrorMsg("");

    try {
      if (editingItem) {
        await inventoryService.updateIngredient(editingItem.id, {
          name: formName.trim(),
          unit: formUnit.trim(),
          stockQuantity: Number(formStock),
          minimumThreshold: Number(formMinThreshold),
        });
      } else {
        await inventoryService.createIngredient({
          name: formName.trim(),
          unit: formUnit.trim(),
          stockQuantity: Number(formStock),
          minimumThreshold: Number(formMinThreshold),
        });
      }
      setIsModalOpen(false);
      await fetchIngredients();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Có lỗi xảy ra khi lưu nguyên liệu");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa nguyên liệu này?")) return;
    try {
      await inventoryService.deleteIngredient(id);
      await fetchIngredients();
    } catch (err: any) {
      alert(err.response?.data?.message || "Không thể xóa nguyên liệu");
    }
  };

  const getStatus = (stock: number, minStock: number) => {
    if (stock <= 0) return "out_of_stock";
    if (stock <= minStock) return "low_stock";
    return "in_stock";
  };

  const getStatusBadge = (status: "in_stock" | "low_stock" | "out_of_stock") => {
    switch (status) {
      case "in_stock":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Còn hàng
          </span>
        );
      case "low_stock":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/70">
            <AlertCircle className="w-3.5 h-3.5" />
            Sắp hết
          </span>
        );
      case "out_of_stock":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/70">
            <XCircle className="w-3.5 h-3.5" />
            Hết hàng
          </span>
        );
    }
  };

  const filteredIngredients = ingredients.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(query) ||
      item.id.toString().includes(query) ||
      item.unit.toLowerCase().includes(query)
    );
  });

  const warningCount = ingredients.filter(
    (item) => Number(item.stockQuantity) <= Number(item.minimumThreshold)
  ).length;
  const safeCount = ingredients.length - warningCount;
  const unitCount = Array.from(new Set(ingredients.map((i) => i.unit))).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-16">
      {/* 1. Page Header (Chuẩn như trang Khách hàng) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Kho nguyên liệu
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Theo dõi số lượng tồn kho và định mức an toàn nguyên liệu
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchIngredients}
            className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer"
            title="Làm mới"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 bg-[#6F4E37] hover:bg-[#5A3F2C] text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition-all cursor-pointer active:scale-[0.99]"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm nguyên liệu</span>
          </button>
        </div>
      </div>

      {/* 2. Thống kê tổng quan (4 Thẻ Metric Cards: Icon Trái - Thông Số Phải) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Tổng số mặt hàng */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#F5EBE6] text-[#6F4E37] flex items-center justify-center shrink-0 font-bold">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Tổng mặt hàng</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">{ingredients.length.toLocaleString('vi-VN')}</p>
          </div>
        </div>

        {/* Card 2: Cảnh báo sắp hết / hết hàng */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 font-bold">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Cảnh báo tồn kho</p>
            <p className="text-xl font-bold text-rose-600 mt-0.5">{warningCount.toLocaleString('vi-VN')}</p>
          </div>
        </div>

        {/* Card 3: Nguyên liệu an toàn */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Mức tồn an toàn</p>
            <p className="text-xl font-bold text-emerald-700 mt-0.5">{safeCount.toLocaleString('vi-VN')}</p>
          </div>
        </div>

        {/* Card 4: Số loại đơn vị tính */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 font-bold">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Đơn vị quản lý</p>
            <p className="text-xl font-bold text-amber-900 mt-0.5">{unitCount} <span className="text-xs font-normal text-gray-500">loại</span></p>
          </div>
        </div>
      </div>

      {/* 3. Toolbar (Đóng gói trong Card trắng chuẩn) */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên nguyên liệu..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20 transition-all"
          />
        </div>

        <div className="flex items-center justify-end shrink-0">
          <span className="text-xs text-gray-500 font-medium">
            Hiển thị: <b className="text-gray-900 font-bold">{filteredIngredients.length}</b>/{ingredients.length} nguyên liệu
          </span>
        </div>
      </div>

      {/* 3. Bảng dữ liệu */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                <th scope="col" className="py-3.5 px-5">Tên nguyên liệu</th>
                <th scope="col" className="py-3.5 px-5">Đơn vị tính</th>
                <th scope="col" className="py-3.5 px-5">Số lượng tồn</th>
                <th scope="col" className="py-3.5 px-5">Định mức an toàn</th>
                <th scope="col" className="py-3.5 px-5">Trạng thái</th>
                <th scope="col" className="py-3.5 px-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#6F4E37]" />
                    Đang tải dữ liệu nguyên liệu...
                  </td>
                </tr>
              ) : filteredIngredients.length > 0 ? (
                filteredIngredients.map((item) => {
                  const status = getStatus(Number(item.stockQuantity), Number(item.minimumThreshold));
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50/60 transition-colors group"
                    >
                      <td className="py-3.5 px-5">
                        <span className="font-bold text-gray-900 group-hover:text-[#6F4E37] transition-colors">
                          {item.name}
                        </span>
                      </td>

                      <td className="py-3.5 px-5">
                        <span className="px-2.5 py-1 rounded-md bg-gray-100 text-xs text-gray-600 font-semibold">
                          {item.unit}
                        </span>
                      </td>

                      <td className="py-3.5 px-5">
                        <span className="font-bold text-gray-900">
                          {Number(item.stockQuantity).toLocaleString("vi-VN")}
                        </span>
                        <span className="text-xs text-gray-400 ml-1">
                          {item.unit}
                        </span>
                      </td>

                      <td className="py-3.5 px-5 font-medium text-gray-600">
                        {Number(item.minimumThreshold).toLocaleString("vi-VN")} {item.unit}
                      </td>

                      <td className="py-3.5 px-5">
                        {getStatusBadge(status)}
                      </td>

                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(item)}
                            className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                            title="Chỉnh sửa nguyên liệu"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Xóa nguyên liệu"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400 text-sm">
                    Không có nguyên liệu nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Thêm/Sửa Nguyên Liệu */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-gray-900">
              {editingItem ? "Chỉnh sửa nguyên liệu" : "Thêm nguyên liệu mới"}
            </h2>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Tên nguyên liệu <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ví dụ: Hạt cà phê Robusta"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Đơn vị tính <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    placeholder="kg, lít, chai,..."
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Định mức an toàn
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={formMinThreshold}
                    onChange={(e) => setFormMinThreshold(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Số lượng tồn kho ban đầu
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={formStock}
                  onChange={(e) => setFormStock(Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#6F4E37] hover:bg-[#5A3F2C] rounded-xl flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingItem ? "Cập nhật" : "Tạo mới"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


```

# dashboard\layout.tsx

| Property | Value |
|----------|-------|
| Path | `dashboard\layout.tsx` |
| Size | 571 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:54.922163 |

```tsx
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FAF6F0]">
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 ml-64 pt-20 sm:pt-22 px-6 sm:px-8 pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}

```

# dashboard\menu\categories\page.tsx

| Property | Value |
|----------|-------|
| Path | `dashboard\menu\categories\page.tsx` |
| Size | 13,314 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:54.925185 |

```tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Coffee,
  CupSoda,
  CakeSlice,
  LayoutGrid,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { CategoryDisplayStatus } from '@/types/enums';
import { menuService } from '@/api/menu.service';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import MenuNavTabs from '@/components/menu/MenuNavTabs';

const getCategoryIcon = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes('cà phê') || lower.includes('cafe') || lower.includes('coffee') || lower.includes('espresso')) {
    return Coffee;
  }
  if (
    lower.includes('trà') ||
    lower.includes('tea') ||
    lower.includes('đá xay') ||
    lower.includes('frappuccino') ||
    lower.includes('sinh tố') ||
    lower.includes('smoothie') ||
    lower.includes('nước') ||
    lower.includes('juice')
  ) {
    return CupSoda;
  }
  if (
    lower.includes('bánh') ||
    lower.includes('cake') ||
    lower.includes('pastry') ||
    lower.includes('bakery') ||
    lower.includes('croissant')
  ) {
    return CakeSlice;
  }
  return LayoutGrid;
};

interface CategoryItem {
  id: number;
  name: string;
  displayStatus?: CategoryDisplayStatus;
  productCount?: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [name, setName] = useState('');
  const [displayStatus, setDisplayStatus] = useState<CategoryDisplayStatus>('SHOW');

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<CategoryItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await menuService.getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setName('');
    setDisplayStatus('SHOW');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setName(cat.name || '');
    setDisplayStatus(cat.displayStatus || 'SHOW');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Vui lòng nhập tên danh mục!');
      return;
    }
    setSubmitting(true);
    try {
      if (editingCategory) {
        await menuService.updateCategory(editingCategory.id, { name: name.trim(), displayStatus });
        showToast(`Đã cập nhật danh mục "${name.trim()}"!`);
      } else {
        await menuService.createCategory({ name: name.trim(), displayStatus });
        showToast(`Đã tạo danh mục "${name.trim()}" thành công!`);
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Thao tác thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingCategory) return;
    try {
      await menuService.deleteCategory(deletingCategory.id);
      setIsDeleteModalOpen(false);
      showToast(`Đã xóa danh mục "${deletingCategory.name}"!`);
      setDeletingCategory(null);
      fetchCategories();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Xóa thất bại');
    }
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto p-4 sm:p-6 pb-16">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#6F4E37] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <span className="font-semibold text-sm">{toastMsg}</span>
        </div>
      )}

      {/* TẦNG 1: Thanh Điều Hướng (Tabs) */}
      <MenuNavTabs />

      {/* TẦNG 2: Thanh Công Cụ (Toolbar) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 w-full">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm danh mục món..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 text-sm shadow-sm focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
          />
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
          <span className="text-xs text-gray-500 font-medium hidden sm:inline">
            Hiển thị: <b className="text-gray-900 font-bold">{filteredCategories.length}</b>/{categories.length} danh mục
          </span>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#6F4E37] hover:bg-[#5A3F2C] text-white font-bold text-sm shadow-sm hover:shadow-md active:scale-95 transition-all cursor-pointer w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            <span>Thêm danh mục</span>
          </button>
        </div>
      </div>

      {/* TẦNG 3: Bảng Dữ Liệu */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF6F0]/80 border-b border-gray-200/70 text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                <th className="py-4 px-6 text-left">Tên danh mục</th>
                <th className="py-4 px-6 text-center w-40">Số lượng món</th>
                <th className="py-4 px-6 text-center w-48">Trạng thái</th>
                <th className="py-4 px-6 text-right w-32">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center text-gray-400">
                    Đang tải danh mục...
                  </td>
                </tr>
              ) : filteredCategories.length > 0 ? (
                filteredCategories.map((cat) => {
                  const CategoryIcon = getCategoryIcon(cat.name);
                  return (
                    <tr key={cat.id} className="hover:bg-gray-50/70 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#F5EBE6] text-[#6F4E37] flex items-center justify-center shrink-0">
                            <CategoryIcon className="w-5 h-5" />
                          </div>
                          <span className="font-bold text-gray-900 group-hover:text-[#6F4E37] transition-colors">
                            {cat.name}
                          </span>
                        </div>
                      </td>

                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-lg bg-gray-100 font-semibold text-gray-800 text-xs">
                        {cat.productCount || 0} món
                      </span>
                    </td>

                    <td className="py-4 px-6 text-center">
                      {cat.displayStatus === 'HIDE' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                          <XCircle className="w-3.5 h-3.5" />
                          Đã ẩn
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Đang hiển thị
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(cat)}
                          className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                          title="Sửa danh mục"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeletingCategory(cat);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Xóa danh mục"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
              ) : (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-gray-400 text-sm">
                    Chưa có danh mục nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Category Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Tên danh mục"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ví dụ: Cà phê, Trà hoa quả..."
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Trạng thái hiển thị
            </label>
            <select
              value={displayStatus}
              onChange={(e) => setDisplayStatus(e.target.value as CategoryDisplayStatus)}
              className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
            >
              <option value="SHOW">Hiển thị (SHOW)</option>
              <option value="HIDE">Ẩn (HIDE)</option>
            </select>
          </div>
          <div className="pt-2 flex gap-3">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" isLoading={submitting}>
              {editingCategory ? 'Lưu thay đổi' : 'Tạo danh mục'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Xóa danh mục"
        message={`Bạn có chắc chắn muốn xóa danh mục "${deletingCategory?.name || ''}" không?`}
      />
    </div>
  );
}

```

# dashboard\menu\page.tsx

| Property | Value |
|----------|-------|
| Path | `dashboard\menu\page.tsx` |
| Size | 21,155 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:54.927163 |

```tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  CupSoda,
  Layers,
  Sparkles,
  Plus,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Eye,
  RefreshCw,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import { menuService } from '@/api/menu.service';
import { Product, Category, Topping } from '@/types/menu';
import MenuNavTabs from '@/components/menu/MenuNavTabs';

export default function MenuHubPage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [toppings, setToppings] = useState<Topping[]>([]);
  const [searchPreview, setSearchPreview] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [prodsData, catsData, topsData] = await Promise.all([
        menuService.getProducts().catch(() => []),
        menuService.getCategories().catch(() => []),
        menuService.getToppings().catch(() => []),
      ]);
      setProducts(Array.isArray(prodsData) ? prodsData : []);
      setCategories(Array.isArray(catsData) ? catsData : []);
      setToppings(Array.isArray(topsData) ? topsData : []);
    } catch (error) {
      console.error('Error fetching menu overview data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const activeProductsCount = products.filter((p) => p.status === 'ACTIVE').length;
  const activeCategoriesCount = categories.filter((c) => c.displayStatus === 'SHOW').length;
  const activeToppingsCount = toppings.filter((t) => (t.status as string) !== 'INACTIVE').length;

  const filteredPreviewProducts = products
    .filter((p) => p.name.toLowerCase().includes(searchPreview.toLowerCase()))
    .slice(0, 6);

  const formatCurrency = (amount?: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount || 0);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-6 pb-16">
      {/* Navigation Sub-tabs */}
      <MenuNavTabs />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#6F4E37] via-[#855e43] to-[#5A3F2C] p-6 sm:p-8 rounded-3xl text-white shadow-xl shadow-[#6F4E37]/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-amber-200 text-xs font-semibold backdrop-blur-md mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Quản trị Thực đơn & Danh mục (Menu-Catalog)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Trung tâm Quản lý Thực đơn
          </h1>
          <p className="text-sm text-amber-100/90 mt-1 max-w-xl">
            Điều chỉnh danh mục, cấu hình món ăn, quản lý biến thể kích cỡ (Size) và hệ thống topping đi kèm cho toàn bộ chi nhánh.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={loadData}
            disabled={loading}
            className="p-3 bg-white/10 hover:bg-white/20 active:scale-95 text-white rounded-2xl transition-all backdrop-blur-md cursor-pointer disabled:opacity-50"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            href="/dashboard/menu/products/new"
            className="flex items-center gap-2 px-5 py-3 bg-[#FAF6F0] hover:bg-white text-[#6F4E37] rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo món mới</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Card 1: Products */}
        <div className="bg-white p-6 rounded-3xl border border-amber-900/10 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-[#FAF6F0] text-[#6F4E37] rounded-2xl group-hover:scale-110 transition-transform">
              <CupSoda className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {activeProductsCount} Đang bán
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-gray-900">{products.length}</div>
            <div className="text-sm font-medium text-gray-500 mt-0.5">Tổng số món đồ uống / thực đơn</div>
          </div>
          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-semibold">
            <Link
              href="/dashboard/menu/products"
              className="text-[#6F4E37] hover:text-[#5A3F2C] flex items-center gap-1.5"
            >
              Xem danh sách món <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/dashboard/menu/products/new"
              className="text-gray-500 hover:text-gray-900 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Thêm mới
            </Link>
          </div>
        </div>

        {/* Card 2: Categories */}
        <div className="bg-white p-6 rounded-3xl border border-amber-900/10 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-amber-50 text-amber-800 rounded-2xl group-hover:scale-110 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {activeCategoriesCount} Đang hiển thị
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-gray-900">{categories.length}</div>
            <div className="text-sm font-medium text-gray-500 mt-0.5">Danh mục phân loại thực đơn</div>
          </div>
          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-semibold">
            <Link
              href="/dashboard/menu/categories"
              className="text-[#6F4E37] hover:text-[#5A3F2C] flex items-center gap-1.5"
            >
              Quản lý danh mục <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <span className="text-gray-400">Tự động đồng bộ POS</span>
          </div>
        </div>

        {/* Card 3: Toppings */}
        <div className="bg-white p-6 rounded-3xl border border-amber-900/10 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-[#F5EBE6] text-[#6F4E37] rounded-2xl group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {activeToppingsCount} Khả dụng
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-gray-900">{toppings.length}</div>
            <div className="text-sm font-medium text-gray-500 mt-0.5">Topping & thành phần thêm</div>
          </div>
          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-semibold">
            <Link
              href="/dashboard/menu/toppings"
              className="text-[#6F4E37] hover:text-[#5A3F2C] flex items-center gap-1.5"
            >
              Quản lý Topping <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/dashboard/inventory/boms"
              className="text-gray-500 hover:text-gray-900 flex items-center gap-1"
            >
              Định lượng BOM
            </Link>
          </div>
        </div>
      </div>

      {/* Module Navigation Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Section 1: Products Section */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between hover:border-[#6F4E37]/30 transition-all group">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF6F0] flex items-center justify-center text-[#6F4E37]">
              <CupSoda className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#6F4E37] transition-colors">
              Món & Biến thể Size
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Thiết lập danh sách đồ uống (Cà phê, Trà sữa, Sinh tố...), định giá từng kích thước (S, M, L, XL), hình ảnh minh họa và trạng thái hết hàng.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2">
            <Link
              href="/dashboard/menu/products"
              className="flex-1 text-center py-2.5 px-4 bg-[#6F4E37] hover:bg-[#5A3F2C] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Mở danh sách
            </Link>
            <Link
              href="/dashboard/menu/products/new"
              className="py-2.5 px-4 bg-[#FAF6F0] hover:bg-[#F5EBE6] text-[#6F4E37] text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              + Tạo mới
            </Link>
          </div>
        </div>

        {/* Section 2: Categories Section */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between hover:border-[#6F4E37]/30 transition-all group">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-800">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#6F4E37] transition-colors">
              Phân loại Danh mục
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Tổ chức menu theo nhóm khoa học (Cà phê truyền thống, Cold Brew, Trà trái cây, Bánh ngọt). Bật/ẩn danh mục để tối ưu màn hình POS & Order.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2">
            <Link
              href="/dashboard/menu/categories"
              className="w-full text-center py-2.5 px-4 bg-[#6F4E37] hover:bg-[#5A3F2C] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Quản lý danh mục
            </Link>
          </div>
        </div>

        {/* Section 3: Toppings Section */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between hover:border-[#6F4E37]/30 transition-all group">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#F5EBE6] flex items-center justify-center text-[#6F4E37]">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#6F4E37] transition-colors">
              Topping & Extra
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Quản lý các loại trân châu, thạch, kem phô mai, espresso shot kèm đơn giá bán cộng thêm. Liên kết định lượng nguyên vật liệu kho (BOM).
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2">
            <Link
              href="/dashboard/menu/toppings"
              className="w-full text-center py-2.5 px-4 bg-[#6F4E37] hover:bg-[#5A3F2C] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Quản lý Topping
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Preview Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Món thực đơn gần đây</h2>
            <p className="text-xs text-gray-500 mt-0.5">Xem nhanh danh sách sản phẩm và các biến thể kích thước</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchPreview}
                onChange={(e) => setSearchPreview(e.target.value)}
                placeholder="Tìm nhanh món..."
                className="w-full pl-9 pr-4 py-2 bg-[#FAF6F0] rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
              />
            </div>
            <Link
              href="/dashboard/menu/products"
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors whitespace-nowrap"
            >
              Xem tất cả ({products.length})
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF6F0]/60 text-gray-600 text-xs font-bold uppercase tracking-wider border-b border-gray-100">
                <th className="py-4 px-6">Tên món</th>
                <th className="py-4 px-6">Danh mục</th>
                <th className="py-4 px-6">Các kích cỡ & Đơn giá</th>
                <th className="py-4 px-6 text-center">Trạng thái</th>
                <th className="py-4 px-6 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#6F4E37]" />
                    Đang tải dữ liệu thực đơn...
                  </td>
                </tr>
              ) : filteredPreviewProducts.length > 0 ? (
                filteredPreviewProducts.map((p) => {
                  const minPrice = p.variants?.length
                    ? Math.min(...p.variants.map((v) => Number(v.price)))
                    : 0;

                  return (
                    <tr key={p.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#FAF6F0] border border-gray-200/60 overflow-hidden flex items-center justify-center shrink-0">
                            {p.image ? (
                              <img
                                src={p.image}
                                alt={p.name}
                                loading="lazy"
                                decoding="async"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.onerror = null;
                                  target.style.display = 'none';
                                  if (target.parentElement && !target.parentElement.querySelector('.fallback-icon')) {
                                    const fallback = document.createElement('span');
                                    fallback.className = 'fallback-icon text-[#6F4E37] text-sm select-none';
                                    fallback.textContent = '☕';
                                    target.parentElement.appendChild(fallback);
                                  }
                                }}
                              />
                            ) : (
                              <CupSoda className="w-5 h-5 text-[#6F4E37]" />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{p.name}</div>
                            <div className="text-xs text-gray-400 line-clamp-1">
                              {p.description || 'Chưa có mô tả'}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 bg-amber-50 text-[#6F4E37] rounded-lg text-xs font-semibold">
                          {p.categoryName || 'Mặc định'}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {p.variants && p.variants.length > 0 ? (
                            p.variants.map((v) => (
                              <span
                                key={v.id || v.size}
                                className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md text-xs font-medium"
                              >
                                Size {v.size}: <b className="font-semibold text-gray-900">{formatCurrency(v.price)}</b>
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-gray-400">Từ {formatCurrency(minPrice)}</span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-6 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${p.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700'
                            : p.status === 'OUT_OF_STOCK'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-rose-50 text-rose-700'
                            }`}
                        >
                          {p.status === 'ACTIVE' ? 'Đang bán' : p.status === 'OUT_OF_STOCK' ? 'Hết hàng' : 'Ngưng bán'}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <Link
                          href={`/dashboard/menu/products/${p.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#FAF6F0] hover:bg-[#F5EBE6] text-[#6F4E37] text-xs font-bold rounded-xl transition-colors cursor-pointer"
                        >
                          Chi tiết
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    Không tìm thấy món nào phù hợp với từ khóa.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

```

# dashboard\menu\products\[id]\page.tsx

| Property | Value |
|----------|-------|
| Path | `dashboard\menu\products\[id]\page.tsx` |
| Size | 20,954 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:54.930163 |

```tsx
'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  CupSoda,
  Plus,
  Trash2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  FlaskConical,
  Layers,
} from 'lucide-react';
import { menuService } from '@/api/menu.service';
import { Category, Product, ProductVariant } from '@/types/menu';
import { ProductStatus } from '@/types/enums';
import { ConfirmModal } from '@/components/common/ConfirmModal';

interface VariantFormItem {
  id?: number;
  size: 'S' | 'M' | 'L' | 'XL';
  price: number;
}

const AVAILABLE_SIZES: Array<'S' | 'M' | 'L' | 'XL'> = ['S', 'M', 'L', 'XL'];

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const productId = Number(resolvedParams.id);

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  // Form states
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [status, setStatus] = useState<ProductStatus>('ACTIVE');
  const [variants, setVariants] = useState<VariantFormItem[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Delete modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [prodData, catsData] = await Promise.all([
          menuService.getProductById(productId),
          menuService.getCategories(),
        ]);

        setCategories(Array.isArray(catsData) ? catsData : []);

        if (prodData) {
          setName(prodData.name || '');
          setCategoryId(prodData.categoryId || '');
          setDescription(prodData.description || '');
          setImage(prodData.image || '');
          setStatus(prodData.status || 'ACTIVE');

          if (prodData.variants && prodData.variants.length > 0) {
            setVariants(
              prodData.variants.map((v: ProductVariant) => ({
                id: v.id,
                size: v.size as 'S' | 'M' | 'L' | 'XL',
                price: Number(v.price),
              }))
            );
          } else {
            setVariants([{ size: 'M', price: 40000 }]);
          }
        }
      } catch (err: any) {
        setErrorMsg('Không tìm thấy thông tin món hoặc món đã bị xóa!');
      } finally {
        setLoading(false);
      }
    }

    if (productId) {
      loadData();
    }
  }, [productId]);

  const handleAddVariant = () => {
    const existingSizes = variants.map((v) => v.size);
    const nextSize = AVAILABLE_SIZES.find((s) => !existingSizes.includes(s)) || 'S';
    setVariants([...variants, { size: nextSize, price: 45000 }]);
  };

  const handleRemoveVariant = (index: number) => {
    if (variants.length <= 1) {
      setErrorMsg('Sản phẩm phải có ít nhất 1 biến thể kích thước (Size)!');
      return;
    }
    setVariants(variants.filter((_, idx) => idx !== index));
  };

  const handleVariantChange = (
    index: number,
    field: 'size' | 'price',
    value: string | number
  ) => {
    const updated = [...variants];
    if (field === 'size') {
      updated[index].size = value as 'S' | 'M' | 'L' | 'XL';
    } else {
      updated[index].price = typeof value === 'number' ? value : Number(value) || 0;
    }
    setVariants(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Vui lòng nhập tên món ăn/đồ uống!');
      return;
    }

    if (!categoryId) {
      setErrorMsg('Vui lòng chọn danh mục cho món!');
      return;
    }

    if (variants.length === 0) {
      setErrorMsg('Vui lòng cấu hình ít nhất 1 kích thước/giá bán!');
      return;
    }

    const sizeSet = new Set(variants.map((v) => v.size));
    if (sizeSet.size !== variants.length) {
      setErrorMsg('Các kích thước Size không được trùng lặp nhau!');
      return;
    }

    setSubmitting(true);
    try {
      await menuService.updateProduct(productId, {
        categoryId: Number(categoryId),
        name: name.trim(),
        description: description.trim() || undefined,
        image: image.trim() || undefined,
        status,
        variants: variants.map((v) => ({
          size: v.size,
          price: Number(v.price),
        })),
      });

      setToastMsg('Cập nhật món thành công!');
      setTimeout(() => {
        router.push('/dashboard/menu/products');
      }, 1000);
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.message || err.message || 'Có lỗi xảy ra khi cập nhật món'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async () => {
    setDeleting(true);
    try {
      await menuService.deleteProduct(productId);
      setIsDeleteModalOpen(false);
      setToastMsg('Đã xóa món thành công!');
      setTimeout(() => {
        router.push('/dashboard/menu/products');
      }, 800);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Xóa món thất bại');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-gray-400 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#6F4E37]" />
        <p className="text-sm font-medium">Đang tải thông tin món #{productId}...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 sm:p-6 pb-20">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#6F4E37] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <span className="font-semibold text-sm">{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/menu/products"
            className="p-2.5 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 transition-colors shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                Chỉnh Sửa Món: {name || `#${productId}`}
              </h1>
              <span className="px-2.5 py-0.5 bg-[#FAF6F0] text-[#6F4E37] font-mono text-xs font-bold rounded-lg border border-amber-200">
                ID: #{productId}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Cập nhật thông tin thực đơn, biến thể kích cỡ và thiết lập định mức nguyên liệu
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/dashboard/inventory/boms"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-[#6F4E37] border border-amber-200 rounded-xl font-bold text-xs transition-colors cursor-pointer"
          >
            <FlaskConical className="w-4 h-4 text-[#6F4E37]" />
            <span>Cấu hình Định lượng (BOM)</span>
          </Link>

          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            className="p-2.5 rounded-xl text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
            title="Xóa món này"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-sm flex items-center gap-3 animate-shake">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: General Info */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
            <CupSoda className="w-5 h-5 text-[#6F4E37]" />
            <span>1. Thông tin chung về món</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Danh mục món <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
                className="w-full px-4 py-3 bg-[#FAF6F0] border border-gray-200 rounded-2xl text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#6F4E37] cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Trạng thái kinh doanh <span className="text-rose-500">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProductStatus)}
                className="w-full px-4 py-3 bg-[#FAF6F0] border border-gray-200 rounded-2xl text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#6F4E37] cursor-pointer"
              >
                <option value="ACTIVE">Đang bán (ACTIVE)</option>
                <option value="OUT_OF_STOCK">Hết hàng (OUT_OF_STOCK)</option>
                <option value="INACTIVE">Ngưng bán (INACTIVE)</option>
              </select>
            </div>

            {/* Product Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Tên món đồ uống / thức ăn <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Cà phê Muối Hải Phòng, Trà Đào Cam Sả..."
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-gray-900 text-sm font-semibold focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20 placeholder:text-gray-400"
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Mô tả chi tiết / Thành phần
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả hương vị, nguyên liệu đặc trưng của món..."
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20 placeholder:text-gray-400"
              />
            </div>

            {/* Image URL with Preview */}
            <div className="sm:col-span-2 space-y-3">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Đường dẫn hình ảnh minh họa (Image URL)
              </label>
              <div className="flex gap-4 items-start">
                <div className="flex-1">
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://example.com/images/espresso.jpg"
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20 placeholder:text-gray-400"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Dán URL ảnh trực tiếp để hiển thị trên POS & Thực đơn.
                  </p>
                </div>

                <div className="w-20 h-20 rounded-2xl bg-[#FAF6F0] border border-gray-200 overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
                  {image ? (
                    <img
                      src={image}
                      alt="Preview"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.style.display = 'none';
                        if (target.parentElement && !target.parentElement.querySelector('.fallback-icon')) {
                          const fallback = document.createElement('span');
                          fallback.className = 'fallback-icon text-[#6F4E37] text-2xl select-none';
                          fallback.textContent = '☕';
                          target.parentElement.appendChild(fallback);
                        }
                      }}
                    />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-gray-400" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Size Variants & Smart Upsert */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-700" />
                <span>2. Kích cỡ (Size) & Đơn giá bán (Smart Upsert)</span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Chỉnh sửa giá tiền hoặc thêm/xóa kích thước. Hệ thống tự động đồng bộ mà không phá vỡ liên kết dữ liệu cũ.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddVariant}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#6F4E37] hover:bg-[#5A3F2C] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm Size</span>
            </button>
          </div>

          <div className="space-y-3">
            {variants.map((v, idx) => (
              <div
                key={idx}
                className="p-4 bg-[#FAF6F0]/60 border border-gray-200/80 rounded-2xl flex flex-col sm:flex-row items-center gap-4"
              >
                <div className="w-full sm:w-40">
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Kích cỡ (Size)
                  </label>
                  <select
                    value={v.size}
                    onChange={(e) => handleVariantChange(idx, 'size', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-[#6F4E37] focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
                  >
                    {AVAILABLE_SIZES.map((s) => (
                      <option key={s} value={s}>
                        Size {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex-1 w-full">
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Đơn giá bán (VNĐ) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="1"
                      placeholder="0"
                      value={v.price === 0 ? '' : v.price}
                      onKeyDown={(e) => {
                        if (['e', 'E', '+', '-', '.', ','].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) => {
                        const val = e.target.value === '' ? 0 : Number(e.target.value);
                        handleVariantChange(idx, 'price', val);
                      }}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">
                      đ
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center pt-2 sm:pt-4">
                  <button
                    type="button"
                    onClick={() => handleRemoveVariant(idx)}
                    disabled={variants.length <= 1}
                    className="p-2.5 rounded-xl text-rose-600 hover:bg-rose-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                    title="Xóa size này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Action Buttons */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
          <Link
            href="/dashboard/menu/products"
            className="px-6 py-3 rounded-2xl border border-gray-300 text-gray-700 font-bold text-sm hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Hủy bỏ
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 bg-[#6F4E37] hover:bg-[#5A3F2C] active:scale-95 text-white font-bold text-sm rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Lưu Thay Đổi</span>
          </button>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteProduct}
        title="Xóa món khỏi thực đơn"
        message={`Bạn có chắc chắn muốn xóa món "${name}" và toàn bộ các biến thể kích cỡ liên quan?`}
      />
    </div>
  );
}

```

# dashboard\menu\products\new\page.tsx

| Property | Value |
|----------|-------|
| Path | `dashboard\menu\products\new\page.tsx` |
| Size | 18,329 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:54.933164 |

```tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  CupSoda,
  Plus,
  Trash2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react';
import { menuService } from '@/api/menu.service';
import { Category, ProductSize } from '@/types/menu';
import { ProductStatus } from '@/types/enums';

interface VariantFormItem {
  size: 'S' | 'M' | 'L' | 'XL';
  price: number;
}

const AVAILABLE_SIZES: Array<'S' | 'M' | 'L' | 'XL'> = ['S', 'M', 'L', 'XL'];

export default function NewProductPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);

  // Form states
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [status, setStatus] = useState<ProductStatus>('ACTIVE');
  const [variants, setVariants] = useState<VariantFormItem[]>([
    { size: 'M', price: 40000 },
    { size: 'L', price: 50000 },
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadCategories() {
      setLoadingCats(true);
      try {
        const data = await menuService.getCategories();
        const cats = Array.isArray(data) ? data : [];
        setCategories(cats);
        if (cats.length > 0) {
          setCategoryId(cats[0].id);
        }
      } catch (err) {
        console.error('Lỗi khi tải danh mục:', err);
      } finally {
        setLoadingCats(false);
      }
    }
    loadCategories();
  }, []);

  const handleAddVariant = () => {
    const existingSizes = variants.map((v) => v.size);
    const nextSize = AVAILABLE_SIZES.find((s) => !existingSizes.includes(s)) || 'S';
    setVariants([...variants, { size: nextSize, price: 45000 }]);
  };

  const handleRemoveVariant = (index: number) => {
    if (variants.length <= 1) {
      setErrorMsg('Sản phẩm phải có ít nhất 1 biến thể kích thước (Size)!');
      return;
    }
    setVariants(variants.filter((_, idx) => idx !== index));
  };

  const handleVariantChange = (
    index: number,
    field: 'size' | 'price',
    value: string | number
  ) => {
    const updated = [...variants];
    if (field === 'size') {
      updated[index].size = value as 'S' | 'M' | 'L' | 'XL';
    } else {
      updated[index].price = typeof value === 'number' ? value : Number(value) || 0;
    }
    setVariants(updated);
  };

  const handleApplyPresetSizes = () => {
    setVariants([
      { size: 'S', price: 35000 },
      { size: 'M', price: 45000 },
      { size: 'L', price: 55000 },
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Vui lòng nhập tên món ăn/đồ uống!');
      return;
    }

    if (!categoryId) {
      setErrorMsg('Vui lòng chọn danh mục cho món!');
      return;
    }

    if (variants.length === 0) {
      setErrorMsg('Vui lòng cấu hình ít nhất 1 kích thước/giá bán!');
      return;
    }

    // Check unique sizes
    const sizeSet = new Set(variants.map((v) => v.size));
    if (sizeSet.size !== variants.length) {
      setErrorMsg('Các kích thước Size không được trùng lặp nhau!');
      return;
    }

    setSubmitting(true);
    try {
      await menuService.createProduct({
        categoryId: Number(categoryId),
        name: name.trim(),
        description: description.trim() || undefined,
        image: image.trim() || undefined,
        status,
        variants: variants.map((v) => ({
          size: v.size,
          price: Number(v.price),
        })),
      });

      setToastMsg('Tạo món mới thành công!');
      setTimeout(() => {
        router.push('/dashboard/menu/products');
      }, 1000);
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.message || err.message || 'Có lỗi xảy ra khi tạo món mới'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 sm:p-6 pb-20">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#6F4E37] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <span className="font-semibold text-sm">{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/menu/products"
          className="p-2.5 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 transition-colors shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Thêm Món Mới Vào Thực Đơn
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Điền thông tin đồ uống, tải ảnh minh họa và cấu hình các kích cỡ (Size)
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-sm flex items-center gap-3 animate-shake">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: General Info */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
            <CupSoda className="w-5 h-5 text-[#6F4E37]" />
            <span>1. Thông tin chung về món</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Danh mục món <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
                className="w-full px-4 py-3 bg-[#FAF6F0] border border-gray-200 rounded-2xl text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#6F4E37] cursor-pointer"
              >
                {loadingCats ? (
                  <option value="">Đang tải danh mục...</option>
                ) : categories.length > 0 ? (
                  categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))
                ) : (
                  <option value="">Chưa có danh mục nào</option>
                )}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Trạng thái kinh doanh <span className="text-rose-500">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProductStatus)}
                className="w-full px-4 py-3 bg-[#FAF6F0] border border-gray-200 rounded-2xl text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#6F4E37] cursor-pointer"
              >
                <option value="ACTIVE">Đang bán (ACTIVE)</option>
                <option value="OUT_OF_STOCK">Hết hàng (OUT_OF_STOCK)</option>
                <option value="INACTIVE">Ngưng bán (INACTIVE)</option>
              </select>
            </div>

            {/* Product Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Tên món đồ uống / thức ăn <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Cà phê Muối Hải Phòng, Trà Đào Cam Sả..."
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-gray-900 text-sm font-semibold focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20 placeholder:text-gray-400"
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Mô tả chi tiết / Thành phần
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ví dụ: Cà phê robusta thượng hạng kết hợp lớp kem béo mặn sánh mịn đặc trưng..."
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20 placeholder:text-gray-400"
              />
            </div>

            {/* Image URL with Preview */}
            <div className="sm:col-span-2 space-y-3">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Đường dẫn hình ảnh minh họa (Image URL)
              </label>
              <div className="flex gap-4 items-start">
                <div className="flex-1">
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://example.com/images/espresso.jpg"
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20 placeholder:text-gray-400"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Dán URL ảnh trực tiếp từ Unsplash, Imgur hoặc CDN.
                  </p>
                </div>

                <div className="w-20 h-20 rounded-2xl bg-[#FAF6F0] border border-gray-200 overflow-hidden flex items-center justify-center shrink-0">
                  {image ? (
                    <img
                      src={image}
                      alt="Preview"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.style.display = 'none';
                        if (target.parentElement && !target.parentElement.querySelector('.fallback-icon')) {
                          const fallback = document.createElement('span');
                          fallback.className = 'fallback-icon text-[#6F4E37] text-2xl select-none';
                          fallback.textContent = '☕';
                          target.parentElement.appendChild(fallback);
                        }
                      }}
                    />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-gray-400" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Size Variants & Pricing */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-700" />
                <span>2. Kích cỡ (Size) & Đơn giá bán</span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Mỗi món có thể có nhiều kích cỡ với các mức giá khác nhau
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleApplyPresetSizes}
                className="px-3 py-1.5 bg-[#FAF6F0] hover:bg-[#F5EBE6] text-[#6F4E37] text-xs font-bold rounded-xl transition-colors cursor-pointer"
                title="Tạo nhanh 3 size S, M, L"
              >
                Mẫu nhanh (S/M/L)
              </button>
              <button
                type="button"
                onClick={handleAddVariant}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#6F4E37] hover:bg-[#5A3F2C] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm Size</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {variants.map((v, idx) => (
              <div
                key={idx}
                className="p-4 bg-[#FAF6F0]/60 border border-gray-200/80 rounded-2xl flex flex-col sm:flex-row items-center gap-4"
              >
                <div className="w-full sm:w-40">
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Kích cỡ (Size)
                  </label>
                  <select
                    value={v.size}
                    onChange={(e) => handleVariantChange(idx, 'size', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-[#6F4E37] focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
                  >
                    {AVAILABLE_SIZES.map((s) => (
                      <option key={s} value={s}>
                        Size {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex-1 w-full">
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Đơn giá bán (VNĐ) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="1"
                      placeholder="0"
                      value={v.price === 0 ? '' : v.price}
                      onKeyDown={(e) => {
                        if (['e', 'E', '+', '-', '.', ','].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) => {
                        const val = e.target.value === '' ? 0 : Number(e.target.value);
                        handleVariantChange(idx, 'price', val);
                      }}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">
                      đ
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center pt-2 sm:pt-4">
                  <button
                    type="button"
                    onClick={() => handleRemoveVariant(idx)}
                    disabled={variants.length <= 1}
                    className="p-2.5 rounded-xl text-rose-600 hover:bg-rose-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                    title="Xóa size này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Action Buttons */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
          <Link
            href="/dashboard/menu/products"
            className="px-6 py-3 rounded-2xl border border-gray-300 text-gray-700 font-bold text-sm hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Hủy bỏ
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 bg-[#6F4E37] hover:bg-[#5A3F2C] active:scale-95 text-white font-bold text-sm rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Lưu & Tạo Món</span>
          </button>
        </div>
      </form>
    </div>
  );
}

```

# dashboard\menu\products\page.tsx

| Property | Value |
|----------|-------|
| Path | `dashboard\menu\products\page.tsx` |
| Size | 23,276 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:54.935163 |

```tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  CupSoda,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Filter,
  Layers,
  FlaskConical,
  RefreshCw,
  SlidersHorizontal,
  Coffee,
} from 'lucide-react';
import { menuService } from '@/api/menu.service';
import { Product, Category } from '@/types/menu';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import MenuNavTabs from '@/components/menu/MenuNavTabs';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Deletion Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    try {
      console.log('[DEBUG Frontend] Fetching products and categories from Backend...');
      const [prodsData, catsData] = await Promise.all([
        menuService.getProducts(),
        menuService.getCategories(),
      ]);

      console.log('[DEBUG Frontend] Raw Products received:', prodsData);
      console.log('[DEBUG Frontend] Raw Categories received:', catsData);

      // Robust mapping to protect against subtle field name differences
      const normalizedProducts: Product[] = (Array.isArray(prodsData) ? prodsData : []).map((p: any) => ({
        id: Number(p.id),
        categoryId: Number(p.categoryId ?? p.category_id ?? 0),
        categoryName: p.categoryName ?? p.category_name ?? 'Mặc định',
        name: p.name ?? p.productName ?? p.product_name ?? 'Món chưa đặt tên',
        description: p.description ?? p.desc ?? null,
        image: p.image ?? p.imageUrl ?? p.image_url ?? null,
        status: p.status ?? 'ACTIVE',
        createdAt: p.createdAt ?? new Date().toISOString(),
        variants: Array.isArray(p.variants)
          ? p.variants.map((v: any) => ({
              id: Number(v.id ?? 0),
              productId: Number(v.productId ?? p.id),
              size: v.size,
              price: Number(v.price) || 0,
              createdAt: v.createdAt ?? new Date().toISOString(),
            }))
          : p.price || p.basePrice
          ? [{ id: 0, productId: Number(p.id), size: 'M' as const, price: Number(p.price || p.basePrice) || 0, createdAt: new Date().toISOString() }]
          : [],
      }));

      const normalizedCategories: Category[] = (Array.isArray(catsData) ? catsData : []).map((c: any) => ({
        id: Number(c.id),
        name: c.name ?? c.categoryName ?? 'Danh mục',
        displayStatus: c.displayStatus ?? c.display_status ?? 'SHOW',
        productCount: Number(c.productCount ?? c.product_count ?? 0),
        createdAt: c.createdAt ?? new Date().toISOString(),
      }));

      console.log('[DEBUG Frontend] Normalized Products Count:', normalizedProducts.length);
      console.log('[DEBUG Frontend] Normalized Categories Count:', normalizedCategories.length);

      setProducts(normalizedProducts);
      setCategories(normalizedCategories);
    } catch (err) {
      console.error('[DEBUG Frontend] Lỗi tải dữ liệu thực đơn:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const filteredProducts = products.filter((p) => {
    const searchLower = searchQuery.toLowerCase().trim();
    const matchSearch =
      !searchLower ||
      (p.name || '').toLowerCase().includes(searchLower) ||
      (p.categoryName || '').toLowerCase().includes(searchLower);

    const matchCategory =
      selectedCategoryId === 'ALL' || Number(p.categoryId) === Number(selectedCategoryId);

    const matchStatus =
      selectedStatus === 'ALL' ||
      (selectedStatus === 'ACTIVE' && p.status === 'ACTIVE') ||
      (selectedStatus === 'OUT_OF_STOCK' && p.status === 'OUT_OF_STOCK') ||
      (selectedStatus === 'INACTIVE' && p.status === 'INACTIVE');

    return matchSearch && matchCategory && matchStatus;
  });

  const totalProducts = products.length;
  const activeCount = products.filter((p) => p.status === 'ACTIVE').length;
  const outOfStockCount = products.filter((p) => p.status === 'OUT_OF_STOCK').length;
  const inactiveCount = products.filter((p) => p.status === 'INACTIVE').length;

  const formatCurrency = (val?: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(val || 0);
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;
    setDeleting(true);
    try {
      await menuService.deleteProduct(deletingProduct.id);
      setIsDeleteModalOpen(false);
      setDeletingProduct(null);
      showToast(`Đã xóa món "${deletingProduct.name}" khỏi thực đơn!`);
      fetchInitialData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Xóa món thất bại');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-16">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#6F4E37] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <span className="font-semibold text-sm">{toastMsg}</span>
        </div>
      )}

      {/* 1. Header Title & Actions (Đồng bộ theo trang Khách hàng) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Quản lý Thực đơn & Món ăn</h1>
          <p className="text-sm text-gray-500 mt-1">
            Danh mục đồ uống, giá bán theo kích thước và trạng thái phục vụ
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/dashboard/menu/products/new"
            className="flex items-center gap-2 bg-[#6F4E37] hover:bg-[#5A3F2C] text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition-all cursor-pointer active:scale-[0.99]"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo món mới</span>
          </Link>
        </div>
      </div>

      {/* 2. Thanh Điều Hướng Menu Tabs */}
      <MenuNavTabs />

      {/* 3. Thẻ Metric Cards (Bố cục Icon bên trái - Thông số bên phải chuẩn) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#F5EBE6] text-[#6F4E37] flex items-center justify-center shrink-0 font-bold">
            <Coffee className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Tổng số món ăn/uống</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">{totalProducts.toLocaleString('vi-VN')}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Đang mở bán</p>
            <p className="text-xl font-bold text-emerald-700 mt-0.5">{activeCount.toLocaleString('vi-VN')}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 font-bold">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Hết hàng tạm thời</p>
            <p className="text-xl font-bold text-amber-800 mt-0.5">{outOfStockCount.toLocaleString('vi-VN')}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 font-bold">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Tạm ngưng phục vụ</p>
            <p className="text-xl font-bold text-rose-800 mt-0.5">{inactiveCount.toLocaleString('vi-VN')}</p>
          </div>
        </div>
      </div>

      {/* 4. Toolbar (Card trắng độc lập chuẩn theo trang Khách hàng) */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            type="button"
            onClick={fetchInitialData}
            className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
            title="Làm mới"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm theo tên món đồ uống..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20 transition-all"
            />
          </div>

          <div className="relative">
            <Filter className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="pl-10 pr-8 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20 cursor-pointer appearance-none"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="ACTIVE">Đang bán (ACTIVE)</option>
              <option value="OUT_OF_STOCK">Hết hàng (OUT_OF_STOCK)</option>
              <option value="INACTIVE">Ngưng bán (INACTIVE)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end shrink-0">
          <span className="text-xs text-gray-500 font-medium">
            Hiển thị: <b className="text-gray-900 font-bold">{filteredProducts.length}</b>/{products.length} món
          </span>
        </div>
      </div>

      {/* TẦNG 3: Bảng Dữ Liệu & Bộ lọc Danh mục */}
      <div className="space-y-3">
        {/* Category Pills Slider */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedCategoryId('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategoryId === 'ALL'
                ? 'bg-[#6F4E37] text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            Tất cả danh mục ({products.length})
          </button>
          {categories.map((cat) => {
            const count = products.filter((p) => Number(p.categoryId) === Number(cat.id)).length;
            const isSelected = selectedCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#6F4E37] text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected ? 'bg-white/25 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF6F0]/80 border-b border-gray-200/70 text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                <th className="py-4 px-5">Món ăn / Đồ uống</th>
                <th className="py-4 px-5">Danh mục</th>
                <th className="py-4 px-5">Kích thước (Size) & Giá</th>
                <th className="py-4 px-5 text-center">Trạng thái</th>
                <th className="py-4 px-6 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-gray-400">
                    <RefreshCw className="w-7 h-7 animate-spin mx-auto mb-2 text-[#6F4E37]" />
                    Đang tải danh sách thực đơn...
                  </td>
                </tr>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((item) => {
                  const sortedVariants = item.variants
                    ? [...item.variants].sort((a, b) => Number(a.price) - Number(b.price))
                    : [];

                  return (
                    <tr key={item.id} className="hover:bg-gray-50/70 transition-colors group">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-2xl bg-[#FAF6F0] border border-gray-200/60 overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                loading="lazy"
                                decoding="async"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.onerror = null;
                                  target.style.display = 'none';
                                  if (target.parentElement && !target.parentElement.querySelector('.fallback-icon')) {
                                    const fallback = document.createElement('span');
                                    fallback.className = 'fallback-icon text-[#6F4E37] text-base select-none';
                                    fallback.textContent = '☕';
                                    target.parentElement.appendChild(fallback);
                                  }
                                }}
                              />
                            ) : (
                              <CupSoda className="w-6 h-6 text-[#6F4E37]" />
                            )}
                          </div>
                          <div>
                            <Link
                              href={`/dashboard/menu/products/${item.id}`}
                              className="font-bold text-gray-900 group-hover:text-[#6F4E37] transition-colors block text-base leading-snug hover:underline"
                            >
                              {item.name}
                            </Link>
                            {item.description && (
                              <span className="text-xs text-gray-500 line-clamp-1 mt-0.5 max-w-sm">
                                {item.description}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        <span className="inline-flex items-center px-2.5 py-1 bg-amber-50 text-[#6F4E37] rounded-lg text-xs font-bold border border-amber-200/50">
                          {item.categoryName || 'Mặc định'}
                        </span>
                      </td>

                      <td className="py-4 px-5">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {sortedVariants.length > 0 ? (
                            sortedVariants.map((v) => (
                              <span
                                key={v.id || v.size}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 text-gray-800 text-xs font-medium border border-gray-200/60"
                              >
                                <span className="font-bold text-[#6F4E37]">Size {v.size}:</span>
                                <span>{formatCurrency(v.price)}</span>
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-gray-400 italic">Chưa có giá</span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-5 text-center">
                        {item.status === 'ACTIVE' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Đang bán
                          </span>
                        ) : item.status === 'OUT_OF_STOCK' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Hết hàng
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <XCircle className="w-3.5 h-3.5" />
                            Ngưng bán
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/dashboard/inventory/boms`}
                            className="p-2 rounded-xl text-amber-700 hover:bg-amber-50 transition-colors cursor-pointer"
                            title="Định lượng BOM nguyên liệu"
                          >
                            <FlaskConical className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/dashboard/menu/products/${item.id}`}
                            className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                            title="Chỉnh sửa món"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => {
                              setDeletingProduct(item);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Xóa món"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-gray-400">
                    <AlertCircle className="w-9 h-9 mx-auto mb-2 text-gray-300" />
                    Không tìm thấy món ăn nào phù hợp với bộ lọc ({products.length} món trong CSDL).
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      </div>

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Xóa món khỏi thực đơn"
        message={`Bạn có chắc chắn muốn xóa món "${deletingProduct?.name || ''}" và toàn bộ các biến thể kích cỡ liên quan?`}
      />
    </div>
  );
}

```

# dashboard\menu\toppings\page.tsx

| Property | Value |
|----------|-------|
| Path | `dashboard\menu\toppings\page.tsx` |
| Size | 17,374 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:54.937193 |

```tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Sparkles,
  Cloud,
  CircleDot,
  Droplet,
  CheckCircle2,
  XCircle,
  FlaskConical,
  RefreshCw,
  AlertCircle,
  Layers,
} from 'lucide-react';
import { menuService } from '@/api/menu.service';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { ToppingStatus } from '@/types/enums';
import MenuNavTabs from '@/components/menu/MenuNavTabs';

const getToppingIcon = (name: string) => {
  const lower = name.toLowerCase();
  if (
    lower.includes('kem') ||
    lower.includes('cheese') ||
    lower.includes('cream') ||
    lower.includes('foam') ||
    lower.includes('váng sữa')
  ) {
    return Cloud;
  }
  if (
    lower.includes('trân châu') ||
    lower.includes('thạch') ||
    lower.includes('pearl') ||
    lower.includes('boba') ||
    lower.includes('jelly') ||
    lower.includes('hạt') ||
    lower.includes('pudding')
  ) {
    return CircleDot;
  }
  if (
    lower.includes('shot') ||
    lower.includes('bổ sung') ||
    lower.includes('syrup') ||
    lower.includes('siro') ||
    lower.includes('sốt') ||
    lower.includes('sauce') ||
    lower.includes('espresso') ||
    lower.includes('thêm')
  ) {
    return Droplet;
  }
  return Sparkles;
};

interface ToppingItem {
  id: number;
  name: string;
  price: number;
  status?: ToppingStatus;
}

export default function ToppingsPage() {
  const [toppings, setToppings] = useState<ToppingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | ToppingStatus>('ALL');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTopping, setEditingTopping] = useState<ToppingItem | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(10000);
  const [status, setStatus] = useState<ToppingStatus>('AVAILABLE');

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingTopping, setDeletingTopping] = useState<ToppingItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const fetchToppings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await menuService.getToppings();
      setToppings(Array.isArray(data) ? data : []);
    } catch {
      setToppings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchToppings();
  }, [fetchToppings]);

  const filteredToppings = toppings.filter((t) => {
    const matchSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus =
      statusFilter === 'ALL' || (t.status || 'AVAILABLE') === statusFilter;
    return matchSearch && matchStatus;
  });

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(val || 0);
  };

  const handleOpenCreate = () => {
    setEditingTopping(null);
    setName('');
    setPrice(10000);
    setStatus('AVAILABLE');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: ToppingItem) => {
    setEditingTopping(t);
    setName(t.name || '');
    setPrice(Number(t.price) || 0);
    setStatus(t.status || 'AVAILABLE');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Vui lòng nhập tên topping!');
      return;
    }
    if (price < 0) {
      alert('Đơn giá không được âm!');
      return;
    }

    setSubmitting(true);
    try {
      if (editingTopping) {
        await menuService.updateTopping(editingTopping.id, {
          name: name.trim(),
          price: Number(price),
          status,
        });
        showToast(`Đã cập nhật topping "${name}"!`);
      } else {
        await menuService.createTopping({
          name: name.trim(),
          price: Number(price),
          status,
        });
        showToast(`Đã thêm topping "${name}" mới!`);
      }
      setIsModalOpen(false);
      fetchToppings();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Thao tác thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingTopping) return;
    try {
      await menuService.deleteTopping(deletingTopping.id);
      setIsDeleteModalOpen(false);
      showToast(`Đã xóa topping "${deletingTopping.name}"!`);
      setDeletingTopping(null);
      fetchToppings();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Xóa thất bại');
    }
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto p-4 sm:p-6 pb-16">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#6F4E37] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <span className="font-semibold text-sm">{toastMsg}</span>
        </div>
      )}

      {/* TẦNG 1: Thanh Điều Hướng (Tabs) */}
      <MenuNavTabs />

      {/* TẦNG 2: Thanh Công Cụ (Toolbar) */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 w-full">
        {/* Bên trái: Nút làm mới + Search + Dropdown trạng thái */}
        <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-2.5 max-w-2xl">
          <button
            type="button"
            onClick={fetchToppings}
            className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 shadow-sm transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
            title="Làm mới"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm topping (Trân châu, Kem cheese, Thạch...)"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 text-sm shadow-sm focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full sm:w-auto px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6F4E37] cursor-pointer"
            >
              <option value="ALL">Tất cả ({toppings.length})</option>
              <option value="AVAILABLE">Đang phục vụ (AVAILABLE)</option>
              <option value="UNAVAILABLE">Tạm ngưng (UNAVAILABLE)</option>
            </select>
          </div>
        </div>

        {/* Bên phải: BOM Link + Nút hành động chính */}
        <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0">
          <Link
            href="/dashboard/inventory/boms"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-amber-200 bg-white hover:bg-amber-50 text-[#6F4E37] font-semibold text-xs shadow-sm transition-colors cursor-pointer"
            title="Định lượng Topping (BOM)"
          >
            <FlaskConical className="w-4 h-4 text-amber-700" />
            <span className="hidden sm:inline">Định lượng BOM</span>
          </Link>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#6F4E37] hover:bg-[#5A3F2C] text-white font-bold text-sm shadow-sm hover:shadow-md active:scale-95 transition-all cursor-pointer w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            <span>Thêm Topping mới</span>
          </button>
        </div>
      </div>

      {/* TẦNG 3: Bảng Dữ Liệu */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF6F0]/80 border-b border-gray-200/70 text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                <th className="py-4 px-6 text-left">Tên Topping</th>
                <th className="py-4 px-6 text-center w-52">Giá cộng thêm (Phụ thu)</th>
                <th className="py-4 px-6 text-center w-48">Trạng thái</th>
                <th className="py-4 px-6 text-right w-36">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center text-gray-400">
                    <RefreshCw className="w-7 h-7 animate-spin mx-auto mb-2 text-[#6F4E37]" />
                    Đang tải danh sách topping...
                  </td>
                </tr>
              ) : filteredToppings.length > 0 ? (
                filteredToppings.map((item) => {
                  const ToppingIcon = getToppingIcon(item.name);
                  return (
                    <tr key={item.id} className="hover:bg-gray-50/70 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          <div className="w-11 h-11 rounded-2xl bg-[#FAF6F0] text-[#6F4E37] flex items-center justify-center shrink-0 border border-amber-200/50 shadow-inner">
                            <ToppingIcon className="w-5 h-5" />
                          </div>
                          <span className="font-bold text-gray-900 group-hover:text-[#6F4E37] transition-colors text-base">
                            {item.name}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-center font-bold text-[#6F4E37] text-base">
                        +{formatCurrency(item.price)}
                      </td>

                      <td className="py-4 px-6 text-center">
                        {item.status === 'UNAVAILABLE' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <XCircle className="w-3.5 h-3.5" />
                            Tạm ngưng
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Đang phục vụ
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href="/dashboard/inventory/boms"
                            className="p-2 rounded-xl text-amber-700 hover:bg-amber-50 transition-colors cursor-pointer"
                            title="Cấu hình định mức kho"
                          >
                            <FlaskConical className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                            title="Sửa topping"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDeletingTopping(item);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Xóa topping"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="py-16 text-center text-gray-400">
                    <AlertCircle className="w-9 h-9 mx-auto mb-2 text-gray-300" />
                    Chưa có topping nào hoặc không khớp với tìm kiếm.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTopping ? 'Chỉnh sửa topping' : 'Thêm topping mới'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Tên topping"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ví dụ: Trân châu hoàng kim, Kem Cheese..."
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Giá phụ thu (VNĐ) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              step="1"
              placeholder="0"
              value={price === 0 ? '' : price}
              onKeyDown={(e) => {
                if (['e', 'E', '+', '-', '.', ','].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              onChange={(e) => {
                const val = e.target.value === '' ? 0 : Number(e.target.value);
                setPrice(val);
              }}
              className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Trạng thái phục vụ
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ToppingStatus)}
              className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
            >
              <option value="AVAILABLE">Đang phục vụ (AVAILABLE)</option>
              <option value="UNAVAILABLE">Tạm ngưng (UNAVAILABLE)</option>
            </select>
          </div>
          <div className="pt-2 flex gap-3">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" isLoading={submitting}>
              {editingTopping ? 'Lưu thay đổi' : 'Tạo topping'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Xóa topping"
        message={`Bạn có chắc chắn muốn xóa topping "${deletingTopping?.name || ''}" khỏi thực đơn?`}
      />
    </div>
  );
}

```

# dashboard\page.tsx

| Property | Value |
|----------|-------|
| Path | `dashboard\page.tsx` |
| Size | 5,600 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:54.939165 |

```tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  ShoppingBag,
  Users,
  DollarSign,
  Coffee,
  ArrowUpRight,
  Loader2,
  RefreshCw,
} from "lucide-react";
import reportService from "@/api/report.service";

export default function DashboardOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [revenue, setRevenue] = useState(0);
  const [totalOrdersCount, setTotalOrdersCount] = useState(0);
  const [topProductName, setTopProductName] = useState("—");
  const [topProductQty, setTopProductQty] = useState(0);

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const [revRes, topRes] = await Promise.all([
        reportService.getDailyRevenue().catch(() => []),
        reportService.getTopProducts().catch(() => []),
      ]);

      const revList = Array.isArray(revRes) ? revRes : [];
      const totalRev = revList.reduce((sum: number, item: any) => sum + (Number(item.revenue) || 0), 0);
      const totalOrders = revList.reduce((sum: number, item: any) => sum + (Number(item.orders) || 0), 0);
      setRevenue(totalRev);
      setTotalOrdersCount(totalOrders);

      const topList = Array.isArray(topRes) ? topRes : [];
      if (topList.length > 0) {
        setTopProductName(topList[0].productName || topList[0].name || "—");
        setTopProductQty(topList[0].totalQuantity || 0);
      }
    } catch (err) {
      console.error("Error fetching overview:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const stats = [
    {
      title: "Tổng doanh thu",
      value: `${revenue.toLocaleString("vi-VN")} đ`,
      change: "Thời gian thực",
      icon: DollarSign,
      color: "bg-emerald-100 text-emerald-800",
    },
    {
      title: "Đơn hàng đã ghi nhận",
      value: `${totalOrdersCount}`,
      change: "Qua hệ thống POS",
      icon: ShoppingBag,
      color: "bg-amber-100 text-amber-800",
    },
    {
      title: "Món bán chạy nhất",
      value: topProductName,
      change: `${topProductQty} ly`,
      icon: Coffee,
      color: "bg-[#F5EBE6] text-[#6F4E37]",
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Tổng quan kinh doanh
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Theo dõi doanh số và hoạt động của cửa hàng theo thời gian thực
          </p>
        </div>

        <button
          type="button"
          onClick={fetchOverview}
          className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer"
          title="Làm mới"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start justify-between"
            >
              <div>
                <p className="text-xs font-medium text-gray-500">{stat.title}</p>
                <h3 className="text-xl font-bold text-gray-900 mt-1">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin text-[#6F4E37]" /> : stat.value}
                </h3>
                <div className="flex items-center gap-1 mt-2 text-xs font-medium text-emerald-600">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{stat.change}</span>
                </div>
              </div>
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${stat.color}`}
              >
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Access Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-base font-bold text-gray-900 mb-4">
          Lối tắt nhanh
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Link
            href="/dashboard/menu/products"
            className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-[#6F4E37]/30 hover:bg-[#FAF6F0] transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#F5EBE6] text-[#6F4E37] flex items-center justify-center">
                <Coffee className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 group-hover:text-[#6F4E37]">
                  Quản lý Thực đơn
                </h4>
                <p className="text-xs text-gray-400">Xem và chỉnh sửa danh mục món</p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-[#6F4E37]" />
          </Link>
        </div>
      </div>
    </div>
  );
}

```

# dashboard\pagers\page.tsx

| Property | Value |
|----------|-------|
| Path | `dashboard\pagers\page.tsx` |
| Size | 50 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:54.940166 |

```tsx
export { default } from "../../pos/pagers/page";

```

# dashboard\reports\page.tsx

| Property | Value |
|----------|-------|
| Path | `dashboard\reports\page.tsx` |
| Size | 14,461 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:54.943164 |

```tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  RefreshCw,
  Download,
  AlertTriangle,
  Calendar,
  Layers,
  ChevronDown,
} from 'lucide-react';
import reportService from '@/api/report.service';
import { RevenueOverviewReport, TopProductReport, LowStockIngredientReport } from '@/types/report';
import { RevenueSummaryCards } from '@/components/reports/RevenueSummaryCards';
import { RevenueBarChart } from '@/components/reports/RevenueBarChart';
import { ExportReportModal } from '@/components/reports/ExportReportModal';

export default function ReportsPage() {
  const [timeFilter, setTimeFilter] = useState<string>('Tuần này');
  const [customFromDate, setCustomFromDate] = useState<string>('');
  const [customToDate, setCustomToDate] = useState<string>('');

  const [loading, setLoading] = useState(true);
  const [revenueOverview, setRevenueOverview] = useState<RevenueOverviewReport | null>(null);
  const [topProducts, setTopProducts] = useState<TopProductReport[]>([]);
  const [lowStockIngredients, setLowStockIngredients] = useState<LowStockIngredientReport[]>([]);

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Compute date range based on timeFilter
  const getDateRange = useCallback(() => {
    const today = new Date();
    const formatDate = (d: Date) => d.toISOString().split('T')[0];

    if (timeFilter === 'Tùy chỉnh') {
      return {
        fromDate: customFromDate || undefined,
        toDate: customToDate || undefined,
      };
    }

    if (timeFilter === 'Hôm nay') {
      const start = formatDate(today);
      return { fromDate: start, toDate: start };
    }

    if (timeFilter === 'Tuần này') {
      const pastWeek = new Date();
      pastWeek.setDate(today.getDate() - 7);
      return { fromDate: formatDate(pastWeek), toDate: formatDate(today) };
    }

    if (timeFilter === 'Tháng này') {
      const pastMonth = new Date();
      pastMonth.setDate(today.getDate() - 30);
      return { fromDate: formatDate(pastMonth), toDate: formatDate(today) };
    }

    if (timeFilter === 'Năm nay') {
      const startOfYear = new Date(today.getFullYear(), 0, 1);
      return { fromDate: formatDate(startOfYear), toDate: formatDate(today) };
    }

    return {};
  }, [timeFilter, customFromDate, customToDate]);

  const fetchReportData = useCallback(async () => {
    setLoading(true);
    const { fromDate, toDate } = getDateRange();

    try {
      const [overviewData, topRes, lowStockRes] = await Promise.all([
        reportService.getRevenueOverview({ fromDate, toDate }).catch(() => null),
        reportService.getTopProducts({ limit: 5, fromDate, toDate }).catch(() => []),
        reportService.getLowStockAlert().catch(() => []),
      ]);

      setRevenueOverview(overviewData);
      setTopProducts(Array.isArray(topRes) ? topRes : []);
      setLowStockIngredients(Array.isArray(lowStockRes) ? lowStockRes : []);
    } catch (err) {
      console.error('Failed to load report data:', err);
    } finally {
      setLoading(false);
    }
  }, [getDateRange]);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  const handleExportData = (
    format: 'csv' | 'json',
    options: { includeTopProducts: boolean; includeLowStock: boolean }
  ) => {
    const exportPayload = {
      title: `Báo cáo Doanh thu & Kinh doanh (${timeFilter})`,
      exportedAt: new Date().toLocaleString('vi-VN'),
      revenueOverview,
      ...(options.includeTopProducts ? { topProducts } : {}),
      ...(options.includeLowStock ? { lowStockIngredients } : {}),
    };

    if (format === 'json') {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `bao-cao-doanh-thu-${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } else {
      // CSV format
      let csvContent = 'data:text/csv;charset=utf-8,\uFEFF';
      csvContent += 'BÁO CÁO DOANH THU & KINH DOANH\n';
      csvContent += `Thời gian,${timeFilter}\n`;
      csvContent += `Tổng số đơn hàng,${revenueOverview?.totalOrders || 0}\n`;
      csvContent += `Doanh thu thực nhận,${revenueOverview?.netRevenue || 0}\n`;
      csvContent += `Tổng chiết khấu,${revenueOverview?.totalDiscount || 0}\n\n`;

      if (options.includeTopProducts && topProducts.length > 0) {
        csvContent += 'TOP SẢN PHẨM BÁN CHẠY\n';
        csvContent += 'Tên sản phẩm,Số lượng bán,Doanh thu\n';
        topProducts.forEach((p) => {
          csvContent += `"${p.productName}",${p.totalQuantitySold},${p.totalRevenue}\n`;
        });
        csvContent += '\n';
      }

      if (options.includeLowStock && lowStockIngredients.length > 0) {
        csvContent += 'CẢNH BÁO NGUYÊN LIỆU SẮP HẾT\n';
        csvContent += 'Tên nguyên liệu,Đơn vị,Tồn hiện tại,Ngưỡng tối thiểu\n';
        lowStockIngredients.forEach((i) => {
          csvContent += `"${i.name}",${i.unit},${i.stockQuantity},${i.minimumThreshold}\n`;
        });
      }

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `bao-cao-doanh-thu-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }

    showToast(`Đã xuất báo cáo định dạng .${format.toUpperCase()} thành công!`);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(val || 0);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-semibold z-50 animate-in fade-in">
          {toastMessage}
        </div>
      )}

      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Báo cáo doanh thu & Kinh doanh
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Tổng hợp hiệu suất bán hàng, sản phẩm tiêu biểu và cảnh báo tồn kho
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={fetchReportData}
            className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#6F4E37]' : ''}`} />
          </button>

          {/* Time Filter Selector */}
          <div className="relative">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="pl-3.5 pr-8 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 text-xs font-semibold focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20 cursor-pointer appearance-none shadow-2xs"
            >
              <option value="Hôm nay">Hôm nay</option>
              <option value="Tuần này">Tuần này (7 ngày)</option>
              <option value="Tháng này">Tháng này (30 ngày)</option>
              <option value="Năm nay">Năm nay</option>
              <option value="Tùy chỉnh">Tùy chỉnh ngày</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Export Button */}
          <button
            type="button"
            onClick={() => setIsExportModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6F4E37] hover:bg-[#5A3F2C] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Xuất báo cáo</span>
          </button>
        </div>
      </div>

      {/* Custom Date Pickers (Shown if "Tùy chỉnh" is selected) */}
      {timeFilter === 'Tùy chỉnh' && (
        <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center gap-3 animate-in fade-in">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
            <Calendar className="w-4 h-4 text-[#6F4E37]" />
            <span>Khoảng thời gian:</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={customFromDate}
              onChange={(e) => setCustomFromDate(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-mono focus:outline-none focus:border-[#6F4E37]"
            />
            <span className="text-gray-400 text-xs">đến</span>
            <input
              type="date"
              value={customToDate}
              onChange={(e) => setCustomToDate(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-mono focus:outline-none focus:border-[#6F4E37]"
            />
            <button
              type="button"
              onClick={fetchReportData}
              className="px-3 py-1.5 bg-[#6F4E37] text-white rounded-xl text-xs font-semibold hover:bg-[#5A3F2C]"
            >
              Áp dụng
            </button>
          </div>
        </div>
      )}

      {/* 2. Stat Summary Cards */}
      <RevenueSummaryCards
        overview={revenueOverview}
        lowStockCount={lowStockIngredients.length}
        topProductName={topProducts[0]?.productName}
        topProductQty={topProducts[0]?.totalQuantitySold}
        loading={loading}
      />

      {/* 3. Top Products Chart & Low Stock Alert Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Top Selling Products */}
        <div className="lg:col-span-2">
          <RevenueBarChart
            topProducts={topProducts}
            loading={loading}
            timeFilterLabel={timeFilter}
          />
        </div>

        {/* Right Column: Low Stock Ingredients Table */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>Cảnh báo kho nguyên liệu</span>
              </h3>
              <span className="text-xs text-rose-600 font-semibold bg-rose-50 px-2.5 py-1 rounded-full">
                {lowStockIngredients.length} mặt hàng
              </span>
            </div>

            {loading ? (
              <div className="py-10 text-center text-xs text-gray-400">Đang tải dữ liệu kho...</div>
            ) : lowStockIngredients.length > 0 ? (
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {lowStockIngredients.map((item) => {
                  const shortage = item.minimumThreshold - item.stockQuantity;
                  return (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl border border-rose-100 bg-rose-50/40 flex items-center justify-between text-xs hover:bg-rose-50 transition-colors"
                    >
                      <div>
                        <p className="font-bold text-gray-900">{item.name}</p>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Tồn hiện tại: <span className="font-bold text-rose-600">{item.stockQuantity} {item.unit}</span>
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                          Thiếu {shortage > 0 ? shortage : 0} {item.unit}
                        </span>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          Ngưỡng tối thiểu: {item.minimumThreshold} {item.unit}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center text-gray-400 text-xs">
                Kho hàng đang ở trạng thái an toàn. Không có nguyên liệu dưới ngưỡng tối thiểu.
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-gray-100 text-right">
            <a
              href="/dashboard/inventory/ingredients"
              className="text-xs font-semibold text-[#6F4E37] hover:underline inline-flex items-center gap-1"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Quản lý kho nguyên liệu</span>
            </a>
          </div>
        </div>
      </div>

      {/* Export Report Modal */}
      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExportData}
      />
    </div>
  );
}
```

# error.tsx

| Property | Value |
|----------|-------|
| Path | `error.tsx` |
| Size | 687 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:54.944164 |

```tsx
'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
            <h2 className="text-xl font-bold">Đã có lỗi xảy ra!</h2>
            <button
                onClick={() => reset()}
                className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
                Thử lại
            </button>
        </div>
    );
}
```

# favicon.ico

| Property | Value |
|----------|-------|
| Path | `favicon.ico` |
| Size | 116 bytes |
| Extension | `.ico` |
| Modified | 2026-10-17 21:23:54.946176 |

> **File nhị phân** (đã bỏ qua nội dung)

# GlobalError.tsx

| Property | Value |
|----------|-------|
| Path | `GlobalError.tsx` |
| Size | 732 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:54.896451 |

```tsx
'use client';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html lang="vi">
            <body>
                <div className="flex min-h-screen flex-col items-center justify-center p-4">
                    <h2 className="text-xl font-bold">Lỗi hệ thống!</h2>
                    <button
                        onClick={() => reset()}
                        className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        Thử lại
                    </button>
                </div>
            </body>
        </html>
    );
}
```

# globals.css

| Property | Value |
|----------|-------|
| Path | `globals.css` |
| Size | 24 bytes |
| Extension | `.css` |
| Modified | 2026-10-17 21:23:54.948169 |

```css
@import "tailwindcss";

```

# kds\layout.tsx

| Property | Value |
|----------|-------|
| Path | `kds\layout.tsx` |
| Size | 609 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:54.950166 |

```tsx
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

export default function KDSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FAF6F0]">
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="min-h-screen flex flex-col">
        <Header title="Màn hình Bếp / Quầy Bar (KDS)" />
        <main className="flex-1 ml-64 pt-20 sm:pt-22 px-6 sm:px-8 pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}

```

# kds\queue\page.tsx

| Property | Value |
|----------|-------|
| Path | `kds\queue\page.tsx` |
| Size | 13,175 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:54.952177 |

```tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  ChefHat,
  Clock,
  RefreshCw,
  Play,
  CheckCircle2,
  CookingPot,
  Sparkles,
} from 'lucide-react';
import { kdsService } from '@/api/kds.service';
import { KdsQueueItem } from '@/types/kds';
import { KDSTicketCard } from '@/components/kds/KDSTicketCard';
import { QuickRecipeModal } from '@/components/kds/QuickRecipeModal';

function LiveClock() {
  const [time, setTime] = useState<string>('');
  useEffect(() => {
    const updateTime = () => {
      setTime(
        new Date().toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAF6F0] border border-[#F0E6DD] text-[#6F4E37] font-mono text-xs font-bold shrink-0">
      <Clock className="w-3.5 h-3.5 text-[#6F4E37]/70" />
      <span>{time || '14:30:00'}</span>
    </div>
  );
}

export default function KDSQueuePage() {
  const [queueItems, setQueueItems] = useState<KdsQueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'PREPARING'>('ALL');
  const [loadingId, setLoadingId] = useState<number | null>(null);

  // Recipe Modal
  const [isRecipeOpen, setIsRecipeOpen] = useState(false);
  const [selectedRecipeProduct, setSelectedRecipeProduct] = useState('');

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Fetch KDS Queue from Backend
  const fetchQueue = useCallback(async () => {
    try {
      const items = await kdsService.getQueue({
        status: activeTab,
      });
      setQueueItems(items || []);
    } catch {
      // Bỏ qua lỗi ngắt kết nối hoặc thử lại sau
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchQueue();
    // Tự động làm mới hàng đợi mỗi 5 giây (Real-time auto-polling)
    const interval = setInterval(fetchQueue, 5000);
    return () => clearInterval(interval);
  }, [fetchQueue]);

  // Barista chuyển trạng thái món (PENDING -> PREPARING -> DONE)
  const handleUpdateStatus = async (
    orderDetailId: number,
    status: 'PREPARING' | 'DONE' | 'CANCELLED'
  ) => {
    setLoadingId(orderDetailId);
    try {
      await kdsService.updateItemStatus(orderDetailId, { itemStatus: status });
      showToast(
        status === 'PREPARING'
          ? 'Đã bắt đầu pha chế món!'
          : status === 'DONE'
          ? 'Đã hoàn tất pha chế thành công!'
          : 'Đã hủy món'
      );
      await fetchQueue();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Cập nhật trạng thái thất bại');
    } finally {
      setLoadingId(null);
    }
  };

  // Rung chuông Pager báo khách hàng lấy đồ uống
  const handleNotifyOrderReady = async (orderId: number) => {
    try {
      const res = await kdsService.notifyOrderReady(orderId);
      const msg = res.data?.message || 'Đã kích hoạt rung chuông thẻ rung thành công!';
      showToast(msg);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Kích hoạt thẻ rung thất bại');
    }
  };

  // Stats counting
  const pendingCount = queueItems.filter((i) => i.itemStatus === 'PENDING').length;
  const preparingCount = queueItems.filter((i) => i.itemStatus === 'PREPARING').length;
  const doneCount = queueItems.filter((i) => i.itemStatus === 'DONE').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-16">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#6F4E37] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <span className="font-semibold text-sm">{toastMessage}</span>
        </div>
      )}

      {/* 1. Thẻ Metric Cards (Bố cục 'Icon bên trái - Thông số bên phải' chuẩn MePhaPhin) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Tổng số món chờ pha chế */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#F5EBE6] text-[#6F4E37] flex items-center justify-center shrink-0 font-bold">
            <CookingPot className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Hàng đợi hiện tại</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">
              {queueItems.length.toLocaleString('vi-VN')} <span className="text-xs font-normal text-gray-500">món</span>
            </p>
          </div>
        </div>

        {/* Card 2: Chờ pha chế (PENDING) */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Chờ pha chế</p>
            <p className="text-xl font-bold text-amber-800 mt-0.5">
              {pendingCount.toLocaleString('vi-VN')} <span className="text-xs font-normal text-amber-700/80">món</span>
            </p>
          </div>
        </div>

        {/* Card 3: Đang pha chế (PREPARING) */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-bold">
            <Play className="w-6 h-6 fill-blue-600/20" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Đang thực hiện</p>
            <p className="text-xl font-bold text-blue-700 mt-0.5">
              {preparingCount.toLocaleString('vi-VN')} <span className="text-xs font-normal text-blue-600/80">món</span>
            </p>
          </div>
        </div>

        {/* Card 4: Đã hoàn tất */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Đã xong ca làm việc</p>
            <p className="text-xl font-bold text-emerald-700 mt-0.5">
              {doneCount.toLocaleString('vi-VN')} <span className="text-xs font-normal text-emerald-600/80">món</span>
            </p>
          </div>
        </div>
      </div>

      {/* 2. Toolbar & Controls (Đóng gói trong Card trắng độc lập chuẩn MePhaPhin) */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveTab('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'ALL'
                ? 'bg-[#6F4E37] text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            Tất cả ({queueItems.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('PENDING')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'PENDING'
                ? 'bg-[#6F4E37] text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <span>Chờ pha chế</span>
            {pendingCount > 0 && (
              <span
                className={`w-5 h-5 rounded-full text-[10px] font-extrabold flex items-center justify-center ${
                  activeTab === 'PENDING'
                    ? 'bg-[#F5EBE6] text-[#6F4E37]'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {pendingCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('PREPARING')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'PREPARING'
                ? 'bg-[#6F4E37] text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <span>Đang pha chế</span>
            {preparingCount > 0 && (
              <span
                className={`w-5 h-5 rounded-full text-[10px] font-extrabold flex items-center justify-center ${
                  activeTab === 'PREPARING'
                    ? 'bg-[#F5EBE6] text-[#6F4E37]'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {preparingCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap justify-end">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
            Đồng bộ (5s)
          </span>

          <LiveClock />

          <button
            type="button"
            onClick={fetchQueue}
            className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer"
            title="Làm mới hàng đợi"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#6F4E37]' : ''}`} />
          </button>
        </div>
      </div>

      {/* 4. Grid Tickets KDS */}
      <div className="space-y-4">
        {loading && queueItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center text-gray-400 animate-pulse">
            <ChefHat className="w-12 h-12 mb-3 stroke-1 text-gray-300" />
            <p className="text-sm font-semibold text-gray-600">Đang đồng bộ hàng đợi KDS từ quầy POS...</p>
          </div>
        ) : queueItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {queueItems.map((item) => (
              <KDSTicketCard
                key={item.orderDetailId}
                item={item}
                loadingId={loadingId}
                onUpdateStatus={handleUpdateStatus}
                onNotifyReady={handleNotifyOrderReady}
                onViewRecipe={(pName) => {
                  setSelectedRecipeProduct(pName);
                  setIsRecipeOpen(true);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-16 border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center text-gray-400">
            <div className="w-16 h-16 rounded-2xl bg-[#FAF6F0] flex items-center justify-center text-[#6F4E37] mb-3">
              <ChefHat className="w-8 h-8" />
            </div>
            <p className="text-base font-bold text-gray-800">
              Hiện tại không có món nào cần pha chế
            </p>
            <p className="text-xs text-gray-400 mt-1 max-w-sm">
              Đơn gọi món mới từ quầy POS hoặc ứng dụng đặt hàng sẽ tự động xuất hiện tại đây theo thời gian thực (5s).
            </p>
          </div>
        )}
      </div>

      {/* Quick Recipe BOM Modal */}
      <QuickRecipeModal
        isOpen={isRecipeOpen}
        onClose={() => {
          setIsRecipeOpen(false);
          setSelectedRecipeProduct('');
        }}
        productName={selectedRecipeProduct}
      />
    </div>
  );
}

```

# layout.tsx

| Property | Value |
|----------|-------|
| Path | `layout.tsx` |
| Size | 834 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:54.954163 |

```tsx
// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/context/ToastContext';

export const metadata: Metadata = {
  title: 'MePhaPhin - Quản lý quán cà phê',
  description: 'Hệ thống quản lý chuỗi cà phê MePhaPhin - POS & Inventory',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="antialiased text-gray-900 bg-white">
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
```

# loading.tsx

| Property | Value |
|----------|-------|
| Path | `loading.tsx` |
| Size | 184 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:54.955164 |

```tsx
export default function Loading() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <p>Đang tải...</p>
        </div>
    );
}
```

# not-found.tsx

| Property | Value |
|----------|-------|
| Path | `not-found.tsx` |
| Size | 411 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:54.955387 |

```tsx
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
            <h2 className="text-2xl font-bold">404 - Không tìm thấy trang</h2>
            <Link href="/" className="mt-4 text-blue-600 hover:underline">
                Về trang chủ
            </Link>
        </div>
    );
}
```

# page.tsx

| Property | Value |
|----------|-------|
| Path | `page.tsx` |
| Size | 602 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:54.955387 |

```tsx
import Image from 'next/image';
import boCuteImg from '@/constants/bocute.webp';

export default function HomePage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-50">
            <h1 className="text-4xl font-bold text-gray-800">
                Chào các bạn
            </h1>
            <Image
                src={boCuteImg}
                alt="Bo cute"
                className="w-48 h-48 rounded-full border-4 border-white shadow-lg object-cover"
                priority
            />
        </main>
    );
}
```

# pos\layout.tsx

| Property | Value |
|----------|-------|
| Path | `pos\layout.tsx` |
| Size | 142 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:54.955387 |

```tsx
export default function Layout({ children }: { children: React.ReactNode }) {
    return <div className="min-h-screen">{children}</div>;
}

```

# pos\orders\[id]\page.tsx

| Property | Value |
|----------|-------|
| Path | `pos\orders\[id]\page.tsx` |
| Size | 215 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:54.955387 |

```tsx
export default function Page() {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-800">Chi tiết đơn hàng (POS Order Detail)</h1>
        </div>
    );
}

```

# pos\orders\page.tsx

| Property | Value |
|----------|-------|
| Path | `pos\orders\page.tsx` |
| Size | 24,054 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:54.963540 |

```tsx
// app/pos/orders/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Search,
  Eye,
  Printer,
  Ban,
  Clock,
  ArrowLeft,
  User,
  Radio,
  Coffee,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  Receipt,
  Plus,
  Calendar,
  X,
  LogOut,
  LayoutDashboard,
} from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';
import { posService } from '@/api/pos.service';
import { OrderItemResponse } from '@/types/pos';
import { OrderStatus } from '@/types/enums';
import { OrderDetailDrawer } from '@/components/pos/OrderDetailDrawer';
import { PrintReceiptModal } from '@/components/pos/PrintReceiptModal';
import { CancelOrderModal } from '@/components/pos/CancelOrderModal';
import { PosUserDropdown } from '@/components/pos/PosUserDropdown';

const STATUS_FILTERS: { key: OrderStatus | 'ALL'; label: string }[] = [
  { key: 'ALL', label: 'Tất cả' },
  { key: 'PENDING_PREP', label: 'Chờ pha chế' },
  { key: 'PREPARING', label: 'Đang pha chế' },
  { key: 'READY_FOR_PICKUP', label: 'Chờ lấy món' },
  { key: 'COMPLETED', label: 'Hoàn tất' },
  { key: 'CANCELLED', label: 'Đã hủy' },
];

export default function PosOrdersPage() {
  const { user, logout } = useAuthContext();
  const isManagerOrAdmin = user?.role === 'ADMIN' || user?.role === 'MANAGER';
  const [orders, setOrders] = useState<OrderItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ page: 1, limit: 10, totalItems: 0, totalPages: 1 });

  // Bộ lọc
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Modals & Drawer States
  const [selectedOrder, setSelectedOrder] = useState<OrderItemResponse | null>(null);
  const [printOrderId, setPrintOrderId] = useState<number | null>(null);
  const [cancelOrderId, setCancelOrderId] = useState<number | null>(null);
  const [cancelOrderCode, setCancelOrderCode] = useState<string>('');

  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchOrders = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params: any = {
        page,
        limit: 10,
      };

      if (search.trim()) params.search = search.trim();
      if (statusFilter !== 'ALL') params.status = statusFilter;
      if (fromDate) params.fromDate = fromDate;
      if (toDate) params.toDate = toDate;

      const res = await posService.getOrders(params);
      setOrders(res.items || res.data || []);
      if (res.meta) {
        setMeta(res.meta);
      }
    } catch (err: any) {
      setToastMessage({ type: 'error', message: err.message || 'Không thể tải danh sách đơn hàng' });
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, fromDate, toDate]);

  useEffect(() => {
    fetchOrders(1);
  }, [fetchOrders]);

  // Tự động tắt toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getTodayRange = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    return { from: dateStr, to: dateStr };
  };

  const getYesterdayRange = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yyyy = yesterday.getFullYear();
    const mm = String(yesterday.getMonth() + 1).padStart(2, '0');
    const dd = String(yesterday.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    return { from: dateStr, to: dateStr };
  };

  const setDatePreset = (type: 'TODAY' | 'YESTERDAY') => {
    if (type === 'TODAY') {
      const { from, to } = getTodayRange();
      setFromDate(from);
      setToDate(to);
    } else if (type === 'YESTERDAY') {
      const { from, to } = getYesterdayRange();
      setFromDate(from);
      setToDate(to);
    }
  };

  const clearDateFilter = () => {
    setFromDate('');
    setToDate('');
  };

  const isTodayActive = () => {
    const { from, to } = getTodayRange();
    return fromDate === from && toDate === to;
  };

  const isYesterdayActive = () => {
    const { from, to } = getYesterdayRange();
    return fromDate === from && toDate === to;
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING_PREP':
        return <span className="rounded-md bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300">Chờ pha chế</span>;
      case 'PREPARING':
        return <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-300">Đang pha chế</span>;
      case 'READY_FOR_PICKUP':
        return <span className="rounded-md bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-700 border border-purple-200 dark:bg-purple-950/40 dark:border-purple-800 dark:text-purple-300">Chờ lấy món</span>;
      case 'COMPLETED':
        return <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300">Hoàn tất</span>;
      case 'CANCELLED':
        return <span className="rounded-md bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300">Đã hủy</span>;
      default:
        return <span className="rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-bold text-zinc-700">{status}</span>;
    }
  };

  const handleOpenDetail = async (id: number) => {
    try {
      const data = await posService.getOrderById(id);
      setSelectedOrder(data);
    } catch (err: any) {
      setToastMessage({ type: 'error', message: err.message || 'Không thể xem chi tiết đơn hàng' });
    }
  };

  const handlePayOrder = async (orderId: number) => {
    try {
      await posService.completePayment(orderId, 'CASH');
      setToastMessage({ type: 'success', message: `Thanh toán thành công đơn #${orderId}` });
      fetchOrders(meta.page);
      if (selectedOrder?.id === orderId) {
        handleOpenDetail(orderId);
      }
    } catch (err: any) {
      setToastMessage({ type: 'error', message: err.message || 'Thanh toán thất bại' });
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#FAF6F0] dark:bg-zinc-950">
      {/* 1. Topbar */}
      <header className="flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-6 dark:border-zinc-800 dark:bg-zinc-900 shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            href="/pos/terminal"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-colors"
            title="Về POS Bán hàng"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#6F4E37] text-white font-black">
              <Receipt className="h-4 w-4" />
            </div>
            <div>
              <h1 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight">
                QUẢN LÝ ĐƠN HÀNG POS
              </h1>
              <p className="text-xs text-zinc-400 font-medium leading-none">Danh sách & Tra cứu hóa đơn</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isManagerOrAdmin && (
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs font-bold text-zinc-700 hover:bg-[#F5EBE6] hover:text-[#6F4E37] dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 transition-colors"
            >
              <LayoutDashboard className="h-4 w-4 text-[#6F4E37] dark:text-[#D4A373]" />
              <span>Về Dashboard</span>
            </Link>
          )}

          <Link
            href="/pos/terminal"
            className="flex items-center gap-2 rounded-xl bg-[#6F4E37] px-4 py-2 text-xs font-bold text-white shadow-md shadow-[#6F4E37]/30 hover:bg-[#5A3F2C] active:scale-95 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Mở POS Bán hàng</span>
          </Link>
          <button
            type="button"
            onClick={() => fetchOrders(meta.page)}
            title="Tải lại danh sách"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          {/* User Dropdown */}
          <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-700 mx-1" />
          <PosUserDropdown />
        </div>
      </header>

      {/* 2. Toast Thông báo */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 animate-bounce">
          <div
            className={`flex items-center gap-2.5 rounded-xl px-4 py-3 text-xs font-bold shadow-xl ${
              toastMessage.type === 'success'
                ? 'bg-emerald-600 text-white'
                : 'bg-rose-600 text-white'
            }`}
          >
            {toastMessage.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <span>{toastMessage.message}</span>
          </div>
        </div>
      )}

      {/* 3. Main Content Area */}
      <main className="flex-1 p-6 space-y-5 max-w-7xl mx-auto w-full">
        {/* Bộ lọc & Tìm kiếm */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 space-y-3.5">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Tìm mã đơn, tên khách, số điện thoại..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-4 py-2.5 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-[#6F4E37] focus:bg-white focus:outline-none dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-100"
              />
            </div>

            {/* Quick date presets & custom date range */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {/* Preset buttons on the left */}
              <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setDatePreset('TODAY')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isTodayActive()
                      ? 'bg-[#6F4E37] text-white shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  Hôm nay
                </button>
                <button
                  type="button"
                  onClick={() => setDatePreset('YESTERDAY')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isYesterdayActive()
                      ? 'bg-[#6F4E37] text-white shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  Hôm qua
                </button>
                {(fromDate || toDate) && (
                  <button
                    type="button"
                    onClick={clearDateFilter}
                    title="Bỏ lọc ngày"
                    className="p-1 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Date range inputs on the right */}
              <div className="flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 rounded-xl px-2.5 py-1">
                <Calendar className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="bg-transparent text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none cursor-pointer"
                />
                <span className="text-zinc-400 font-bold px-0.5">-</span>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="bg-transparent text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Status Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {STATUS_FILTERS.map((f) => {
              const active = statusFilter === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setStatusFilter(f.key)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? 'bg-[#6F4E37] text-white shadow-xs'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bảng danh sách đơn hàng */}
        <div className="rounded-2xl border border-zinc-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-200 bg-zinc-50/70 text-zinc-500 font-bold uppercase tracking-wider dark:border-zinc-800 dark:bg-zinc-850/50">
                <tr>
                  <th className="py-3 px-4">Mã đơn</th>
                  <th className="py-3 px-4">Thời gian</th>
                  <th className="py-3 px-4">Khách hàng</th>
                  <th className="py-3 px-4">Thẻ rung</th>
                  <th className="py-3 px-4">Tổng tiền</th>
                  <th className="py-3 px-4">Hình thức</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-zinc-400 font-medium">
                      Đang tải dữ liệu đơn hàng...
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-zinc-400 font-medium">
                      Không tìm thấy đơn hàng nào
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-850/40 transition-colors">
                      <td className="py-3 px-4 font-extrabold text-zinc-900 dark:text-zinc-100">
                        #{order.orderCode}
                      </td>
                      <td className="py-3 px-4 text-zinc-500 dark:text-zinc-400">
                        {new Date(order.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        <div className="text-[10px] text-zinc-400">
                          {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {order.customerName ? (
                          <div>
                            <div className="font-bold text-zinc-800 dark:text-zinc-200">{order.customerName}</div>
                            <div className="text-[10px] text-zinc-400">{order.customerPhone}</div>
                          </div>
                        ) : (
                          <span className="text-zinc-400 italic">Khách vãng lai</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {order.pagerId || order.pagerCode ? (
                          <span className="rounded-md bg-[#F5EBE6] text-[#6F4E37] border border-[#EBE3D5] dark:bg-[#6F4E37]/30 dark:border-zinc-700 dark:text-[#E8DDD4] px-2 py-0.5 text-xs font-black">
                            #{order.pagerId || order.pagerCode}
                          </span>
                        ) : (
                          <span className="text-zinc-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-black text-[#6F4E37] dark:text-[#D4A373]">
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td className="py-3 px-4 font-medium text-zinc-600 dark:text-zinc-300">
                        {order.paymentMethod || 'Tiền mặt'}
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(order.status)}</td>
                      <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(order.id)}
                          title="Xem chi tiết"
                          className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setPrintOrderId(order.id)}
                          title="In hóa đơn"
                          className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                        >
                          <Printer className="h-4 w-4" />
                        </button>
                        {order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
                          <button
                            type="button"
                            onClick={() => {
                              setCancelOrderId(order.id);
                              setCancelOrderCode(order.orderCode);
                            }}
                            title="Hủy đơn"
                            className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                          >
                            <Ban className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Phân trang */}
          {meta.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-zinc-200 px-4 py-3 dark:border-zinc-800">
              <div className="text-xs text-zinc-500">
                Hiển thị trang <strong className="text-zinc-800 dark:text-zinc-200">{meta.page}</strong> /{' '}
                {meta.totalPages} ({meta.totalItems} đơn hàng)
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={meta.page <= 1}
                  onClick={() => fetchOrders(meta.page - 1)}
                  className="rounded-lg border border-zinc-200 p-1.5 text-zinc-600 hover:bg-zinc-100 disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-300"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  disabled={meta.page >= meta.totalPages}
                  onClick={() => fetchOrders(meta.page + 1)}
                  className="rounded-lg border border-zinc-200 p-1.5 text-zinc-600 hover:bg-zinc-100 disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-300"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Drawer xem chi tiết */}
      <OrderDetailDrawer
        isOpen={Boolean(selectedOrder)}
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onPrintInvoice={(id) => setPrintOrderId(id)}
        onPayOrder={handlePayOrder}
        onCancelOrder={(id) => {
          setCancelOrderId(id);
          setCancelOrderCode(selectedOrder?.orderCode || '');
        }}
      />

      {/* Modal in hóa đơn */}
      <PrintReceiptModal
        isOpen={Boolean(printOrderId)}
        orderId={printOrderId}
        onClose={() => setPrintOrderId(null)}
      />

      {/* Modal hủy đơn */}
      <CancelOrderModal
        isOpen={Boolean(cancelOrderId)}
        orderId={cancelOrderId}
        orderCode={cancelOrderCode}
        onClose={() => setCancelOrderId(null)}
        onSuccess={() => {
          setToastMessage({ type: 'success', message: 'Hủy đơn hàng và giải phóng thẻ rung thành công!' });
          fetchOrders(meta.page);
          if (selectedOrder?.id === cancelOrderId) {
            handleOpenDetail(cancelOrderId);
          }
        }}
      />
    </div>
  );
}

```

# pos\pagers\page.tsx

| Property | Value |
|----------|-------|
| Path | `pos\pagers\page.tsx` |
| Size | 47,478 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:54.963540 |

```tsx
// app/pos/pagers/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  BellRing,
  BatteryLow,
  BatteryMedium,
  BatteryCharging,
  BatteryWarning,
  Clock,
  ArrowLeft,
  Search,
  Plus,
  CheckCircle2,
  X,
  Radio,
  SlidersHorizontal,
  Wrench,
  Zap,
  RotateCcw,
  Trash2,
  Edit2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Receipt,
  User,
  Coffee,
  Check,
  LogOut,
  LayoutDashboard,
} from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';
import { pagerService } from '@/api/pager.service';
import { ActivePagerDashboardItem, PagerDevice, CreatePagerPayload } from '@/types/pager';
import { PagerStatus } from '@/types/enums';
import { PosUserDropdown } from '@/components/pos/PosUserDropdown';

const PAGER_STATUS_TABS: { key: PagerStatus | 'ALL'; label: string }[] = [
  { key: 'ALL', label: 'Tất cả trạng thái' },
  { key: 'AVAILABLE', label: 'Sẵn sàng' },
  { key: 'IN_USE', label: 'Đang phát' },
  { key: 'CHARGING', label: 'Đang sạc' },
  { key: 'MAINTENANCE', label: 'Bảo trì' },
];

export default function PagersManagementPage() {
  const { user, logout } = useAuthContext();
  const isManagerOrAdmin = user?.role === 'ADMIN' || user?.role === 'MANAGER';
  const [activeTab, setActiveTab] = useState<'active_dashboard' | 'all_devices'>('active_dashboard');

  // Tab 1: Dashboard Data
  const [activePagers, setActivePagers] = useState<ActivePagerDashboardItem[]>([]);
  const [loadingDashboard, setLoadingDashboard] = useState(false);

  // Tab 2: Devices Data
  const [devices, setDevices] = useState<PagerDevice[]>([]);
  const [loadingDevices, setLoadingDevices] = useState(false);
  const [meta, setMeta] = useState({ page: 1, limit: 12, totalItems: 0, totalPages: 1 });
  const [statusFilter, setStatusFilter] = useState<PagerStatus | 'ALL'>('ALL');

  // Search
  const [searchQuery, setSearchQuery] = useState('');

  // Toast
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal: Thêm Thẻ Mới
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newBatteryLevel, setNewBatteryLevel] = useState(100);
  const [newStatus, setNewStatus] = useState<PagerStatus>('AVAILABLE');
  const [isSubmittingAdd, setIsSubmittingAdd] = useState(false);

  // Modal: Sửa Trạng Thái / Pin Thẻ
  const [editingDevice, setEditingDevice] = useState<PagerDevice | null>(null);
  const [editStatus, setEditStatus] = useState<PagerStatus>('AVAILABLE');
  const [editBattery, setEditBattery] = useState<number>(100);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  // Modal: Xác nhận Xóa
  const [deletingDevice, setDeletingDevice] = useState<PagerDevice | null>(null);
  const [isSubmittingDelete, setIsSubmittingDelete] = useState(false);

  // 1. Tải dữ liệu Dashboard (Tab 1)
  const fetchDashboard = useCallback(async () => {
    setLoadingDashboard(true);
    try {
      const data = await pagerService.getDashboard();
      setActivePagers(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setToastMessage({
        type: 'error',
        message: err.message || 'Không thể tải bảng điều phối thẻ rung',
      });
    } finally {
      setLoadingDashboard(false);
    }
  }, []);

  // 2. Tải danh sách toàn bộ thiết bị (Tab 2)
  const fetchDevices = useCallback(
    async (page = 1) => {
      setLoadingDevices(true);
      try {
        const params: any = {
          page,
          limit: 12,
        };
        if (searchQuery.trim()) params.search = searchQuery.trim();
        if (statusFilter !== 'ALL') params.status = statusFilter;

        const res = await pagerService.getPagers(params);
        setDevices(res.items || res.data || []);
        if (res.meta) {
          setMeta(res.meta);
        }
      } catch (err: any) {
        setToastMessage({
          type: 'error',
          message: err.message || 'Không thể tải danh sách thiết bị thẻ rung',
        });
      } finally {
        setLoadingDevices(false);
      }
    },
    [searchQuery, statusFilter]
  );

  // Effect load ban đầu hoặc khi đổi tab
  useEffect(() => {
    if (activeTab === 'active_dashboard') {
      fetchDashboard();
    } else {
      fetchDevices(1);
    }
  }, [activeTab, fetchDashboard, fetchDevices]);

  // Tự tắt toast sau 4s
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // 3. Xử lý rung chuông gọi khách
  const handleBuzzPager = (pagerCode: string, orderCode: string) => {
    setToastMessage({
      type: 'success',
      message: `Đang gửi tín hiệu RUNG & PHÁT ÂM THANH đến thẻ ${pagerCode} (Đơn #${orderCode})!`,
    });
  };

  // 4. Xử lý thu hồi thẻ (Release Pager)
  const handleReleasePager = async (pagerCode: string) => {
    try {
      // Tìm device ID từ pagerCode
      let targetId: number | null = null;
      const foundInDevices = devices.find((d) => d.pagerCode === pagerCode);
      if (foundInDevices) {
        targetId = foundInDevices.id;
      } else {
        // Fetch trực tiếp để lấy id
        const res = await pagerService.getPagers({ search: pagerCode, limit: 1 });
        if (res.items && res.items.length > 0) {
          targetId = res.items[0].id;
        }
      }

      if (!targetId) {
        throw new Error(`Không tìm thấy ID thiết bị cho thẻ ${pagerCode}`);
      }

      await pagerService.releasePager(targetId);
      setToastMessage({
        type: 'success',
        message: `Đã thu hồi thẻ ${pagerCode} về trạng thái Sẵn sàng thành công!`,
      });

      // Reload
      fetchDashboard();
      if (activeTab === 'all_devices') {
        fetchDevices(meta.page);
      }
    } catch (err: any) {
      setToastMessage({
        type: 'error',
        message: err.message || `Không thể thu hồi thẻ ${pagerCode}`,
      });
    }
  };

  // 5. Thêm mới thiết bị thẻ rung
  const handleAddDevice = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmittingAdd(true);
    try {
      const payload: CreatePagerPayload = {
        batteryLevel: Number(newBatteryLevel),
        status: newStatus,
      };

      const res = await pagerService.createPager(payload);
      const createdCode = res?.data?.pagerCode || '';
      setToastMessage({
        type: 'success',
        message: createdCode
          ? `Thêm thiết bị thẻ rung ${createdCode} thành công!`
          : 'Thêm thiết bị thẻ rung thành công!',
      });

      setIsAddModalOpen(false);
      setNewBatteryLevel(100);
      setNewStatus('AVAILABLE');

      fetchDevices(1);
    } catch (err: any) {
      setToastMessage({
        type: 'error',
        message: err.message || 'Thêm thiết bị thất bại',
      });
    } finally {
      setIsSubmittingAdd(false);
    }
  };

  // 6. Cập nhật thiết bị (Trạng thái / Pin)
  const handleSaveEditDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDevice) return;

    setIsSubmittingEdit(true);
    try {
      if (editStatus !== editingDevice.status) {
        await pagerService.updateStatus(editingDevice.id, editStatus);
      }
      if (editBattery !== editingDevice.batteryLevel) {
        await pagerService.updateBattery(editingDevice.id, editBattery);
      }

      setToastMessage({
        type: 'success',
        message: `Cập nhật thẻ ${editingDevice.pagerCode} thành công!`,
      });

      setEditingDevice(null);
      fetchDevices(meta.page);
      if (activeTab === 'active_dashboard') {
        fetchDashboard();
      }
    } catch (err: any) {
      setToastMessage({
        type: 'error',
        message: err.message || 'Cập nhật thiết bị thất bại',
      });
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  // 7. Xóa thiết bị
  const handleDeleteDevice = async () => {
    if (!deletingDevice) return;

    setIsSubmittingDelete(true);
    try {
      await pagerService.deletePager(deletingDevice.id);
      setToastMessage({
        type: 'success',
        message: `Đã xóa thiết bị thẻ ${deletingDevice.pagerCode}!`,
      });

      setDeletingDevice(null);
      fetchDevices(meta.page);
    } catch (err: any) {
      setToastMessage({
        type: 'error',
        message: err.message || 'Xóa thiết bị thất bại',
      });
    } finally {
      setIsSubmittingDelete(false);
    }
  };

  // Lọc tìm kiếm local cho Dashboard
  const filteredActivePagers = activePagers.filter(
    (p) =>
      p.pagerCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.orderCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.customerName && p.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.customerPhone && p.customerPhone.includes(searchQuery))
  );

  // Helper render mức pin
  const renderBatteryIndicator = (battery: number) => {
    if (battery < 15) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300">
          <BatteryWarning className="w-3.5 h-3.5 text-rose-600 animate-bounce" />
          {battery}% (Pin yếu)
        </span>
      );
    }
    if (battery < 50) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300">
          <BatteryLow className="w-3.5 h-3.5" />
          {battery}%
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300">
        <BatteryMedium className="w-3.5 h-3.5" />
        {battery}%
      </span>
    );
  };

  // Helper render Badge trạng thái
  const getDeviceStatusBadge = (status: PagerStatus) => {
    switch (status) {
      case 'AVAILABLE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Sẵn sàng
          </span>
        );
      case 'IN_USE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            Đang phát cho khách
          </span>
        );
      case 'CHARGING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-300">
            <BatteryCharging className="w-3.5 h-3.5 text-blue-600" />
            Đang sạc
          </span>
        );
      case 'MAINTENANCE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-zinc-100 text-zinc-700 border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300">
            <Wrench className="w-3.5 h-3.5 text-zinc-500" />
            Bảo trì / Hỏng
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 font-sans antialiased pb-12">
      {/* 1. HEADER */}
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 sticky top-0 z-20 shadow-2xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/pos/terminal"
              className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              title="Quay lại POS Terminal"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#6F4E37] text-white flex items-center justify-center font-bold shadow-xs">
                <BellRing className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
                  Bảng Điều Phối & Thu Hồi Thẻ Rung
                </h1>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Giám sát thẻ đang phục vụ, thời gian chờ khách và quản lý phần cứng Pager
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {isManagerOrAdmin && (
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs font-bold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
              >
                <LayoutDashboard className="h-4 w-4 text-[#6F4E37] dark:text-[#D4A373]" />
                <span>Về Dashboard</span>
              </Link>
            )}

            <button
              type="button"
              onClick={() => {
                if (activeTab === 'active_dashboard') fetchDashboard();
                else fetchDevices(meta.page);
              }}
              className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Làm mới dữ liệu"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <Link
              href="/pos/terminal"
              className="px-4 py-2 rounded-xl bg-[#6F4E37] hover:bg-[#5A3F2C] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Coffee className="w-4 h-4" />
              <span>Về Thu Ngân POS</span>
            </Link>

            {/* User Dropdown */}
            <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-700 mx-1" />
            <PosUserDropdown />
          </div>
        </div>
      </header>

      {/* 2. TOAST THÔNG BÁO */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 animate-bounce">
          <div
            className={`flex items-center gap-2.5 rounded-xl px-4 py-3 text-xs font-bold shadow-xl ${
              toastMessage.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <span>{toastMessage.message}</span>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-5">
        {/* 3. THANH TAB CHUYỂN ĐỔI & ACTIONS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 p-1.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xs w-fit">
            <button
              type="button"
              onClick={() => setActiveTab('active_dashboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'active_dashboard'
                  ? 'bg-[#6F4E37] text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
              }`}
            >
              <Radio className="w-4 h-4" />
              <span>Điều phối thẻ đang phát</span>
              <span
                className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold ${
                  activeTab === 'active_dashboard'
                    ? 'bg-[#F5EBE6] text-[#6F4E37]'
                    : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                }`}
              >
                {activePagers.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('all_devices')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'all_devices'
                  ? 'bg-[#6F4E37] text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Quản lý thiết bị phần cứng</span>
              <span
                className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold ${
                  activeTab === 'all_devices'
                    ? 'bg-[#F5EBE6] text-[#6F4E37]'
                    : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                }`}
              >
                {meta.totalItems || devices.length}
              </span>
            </button>
          </div>

          {/* Action button in Tab 2 */}
          {activeTab === 'all_devices' && (
            <button
              type="button"
              disabled={!isManagerOrAdmin}
              onClick={() => {
                if (isManagerOrAdmin) setIsAddModalOpen(true);
              }}
              title={isManagerOrAdmin ? 'Thêm thiết bị thẻ rung mới' : 'Chỉ Quản lý mới có quyền thêm thiết bị'}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-xs font-bold shadow-xs transition-colors ${
                isManagerOrAdmin
                  ? 'bg-[#6F4E37] hover:bg-[#5A3F2C] cursor-pointer'
                  : 'bg-zinc-400 dark:bg-zinc-700 opacity-50 cursor-not-allowed'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Thêm thẻ rung mới</span>
            </button>
          )}
        </div>

        {/* 4. TOOLBAR TÌM KIẾM & BỘ LỌC */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow-2xs border border-zinc-200 dark:border-zinc-800 space-y-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm mã thẻ PAGER-..., mã đơn, tên khách..."
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-850 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 transition-colors focus:outline-none focus:border-[#6F4E37]"
              />
            </div>

            <div className="text-xs text-zinc-500 font-medium">
              {activeTab === 'active_dashboard'
                ? `Đang có ${filteredActivePagers.length} thẻ rung đang cấp phát cho khách`
                : `Tổng cộng ${meta.totalItems || devices.length} thiết bị trong kho`}
            </div>
          </div>

          {/* Status Filter Pills for Tab 2 */}
          {activeTab === 'all_devices' && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-1 border-t border-zinc-100 dark:border-zinc-800">
              {PAGER_STATUS_TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setStatusFilter(tab.key)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all ${
                    statusFilter === tab.key
                      ? 'bg-[#6F4E37] text-white shadow-xs'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ========================================================
            5. TAB 1: BẢNG ĐIỀU PHỐI (Active Pagers Dashboard)
            ======================================================== */}
        {activeTab === 'active_dashboard' && (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xs border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-zinc-50/80 dark:bg-zinc-850/50 border-b border-zinc-200 dark:border-zinc-800 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                    <th scope="col" className="py-3.5 px-5">
                      Mã Thẻ Rung
                    </th>
                    <th scope="col" className="py-3.5 px-5">
                      Mức Pin
                    </th>
                    <th scope="col" className="py-3.5 px-5">
                      Mã Đơn Hàng
                    </th>
                    <th scope="col" className="py-3.5 px-5">
                      Khách Hàng & SĐT
                    </th>
                    <th scope="col" className="py-3.5 px-5">
                      Thời Gian Chờ
                    </th>
                    <th scope="col" className="py-3.5 px-5 text-right">
                      Thao Tác Điều Phối
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {loadingDashboard ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-zinc-400 font-medium">
                        Đang tải dữ liệu điều phối thẻ rung...
                      </td>
                    </tr>
                  ) : filteredActivePagers.length > 0 ? (
                    filteredActivePagers.map((pager) => {
                      const isOverdue = pager.waitingMinutes > 15;

                      return (
                        <tr
                          key={`${pager.pagerCode}-${pager.orderId}`}
                          className="hover:bg-zinc-50/60 dark:hover:bg-zinc-850/40 transition-colors group"
                        >
                          {/* Mã Thẻ */}
                          <td className="py-3.5 px-5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-xl bg-[#F5EBE6] text-[#6F4E37] dark:bg-[#6F4E37]/20 dark:text-[#D4A373] flex items-center justify-center font-bold text-xs shrink-0">
                                <Radio className="w-4 h-4" />
                              </div>
                              <span className="font-black text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-[#6F4E37] transition-colors">
                                {pager.pagerCode}
                              </span>
                            </div>
                          </td>

                          {/* Mức pin */}
                          <td className="py-3.5 px-5">{renderBatteryIndicator(pager.batteryLevel)}</td>

                          {/* Mã đơn liên kết */}
                          <td className="py-3.5 px-5">
                            <Link
                              href="/pos/orders"
                              className="font-bold text-[#6F4E37] dark:text-[#D4A373] hover:underline flex items-center gap-1 font-mono text-xs"
                              title="Xem chi tiết đơn trong Quản lý đơn"
                            >
                              <Receipt className="w-3.5 h-3.5" />
                              <span>#{pager.orderCode}</span>
                            </Link>
                          </td>

                          {/* Khách hàng & SĐT */}
                          <td className="py-3.5 px-5">
                            <div>
                              <span className="font-bold text-zinc-900 dark:text-zinc-100 block">
                                {pager.customerName || 'Khách vãng lai'}
                              </span>
                              {pager.customerPhone && (
                                <span className="text-[11px] text-zinc-400 font-mono">
                                  {pager.customerPhone}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Số phút đã chờ */}
                          <td className="py-3.5 px-5">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-zinc-400" />
                              <span
                                className={`font-bold px-2 py-0.5 rounded-md ${
                                  isOverdue
                                    ? 'text-rose-600 bg-rose-50 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-800'
                                    : 'text-zinc-700 bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300'
                                }`}
                              >
                                {pager.waitingMinutes} phút
                                {isOverdue && ' (Chờ lâu)'}
                              </span>
                            </div>
                          </td>

                          {/* Thao tác */}
                          <td className="py-3.5 px-5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* Rung chuông */}
                              <button
                                type="button"
                                onClick={() => handleBuzzPager(pager.pagerCode, pager.orderCode)}
                                className="px-2.5 py-1.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-300 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                                title="Rung chuông & Nhấp nháy gọi khách đến quầy nhận món"
                              >
                                <Zap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                <span>Rung chuông</span>
                              </button>

                              {/* Thu hồi thẻ */}
                              <button
                                type="button"
                                onClick={() => handleReleasePager(pager.pagerCode)}
                                className="px-3 py-1.5 rounded-xl bg-[#6F4E37] hover:bg-[#5A3F2C] text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                                title="Thu hồi thẻ về khay sạc"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Thu hồi thẻ</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-zinc-400 font-medium">
                        Không có thẻ rung nào đang được phát cho khách.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================
            6. TAB 2: QUẢN LÝ THIẾT BỊ PHẦN CỨNG (All Devices)
            ======================================================== */}
        {activeTab === 'all_devices' && (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xs border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-zinc-50/80 dark:bg-zinc-850/50 border-b border-zinc-200 dark:border-zinc-800 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                    <th scope="col" className="py-3.5 px-5">
                      Mã Thẻ (Pager Code)
                    </th>
                    <th scope="col" className="py-3.5 px-5">
                      Mức Pin
                    </th>
                    <th scope="col" className="py-3.5 px-5">
                      Trạng Thái Hoạt Động
                    </th>
                    <th scope="col" className="py-3.5 px-5">
                      Ngày Đăng Ký
                    </th>
                    <th scope="col" className="py-3.5 px-5 text-right">
                      Thao Tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {loadingDevices ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-zinc-400 font-medium">
                        Đang tải danh sách thiết bị thẻ rung...
                      </td>
                    </tr>
                  ) : devices.length > 0 ? (
                    devices.map((dev) => (
                      <tr
                        key={dev.id}
                        className="hover:bg-zinc-50/60 dark:hover:bg-zinc-850/40 transition-colors group"
                      >
                        <td className="py-3.5 px-5">
                          <span className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-[#6F4E37] transition-colors">
                            {dev.pagerCode}
                          </span>
                        </td>

                        <td className="py-3.5 px-5">{renderBatteryIndicator(dev.batteryLevel)}</td>

                        <td className="py-3.5 px-5">{getDeviceStatusBadge(dev.status)}</td>

                        <td className="py-3.5 px-5 text-zinc-500 font-mono">
                          {new Date(dev.createdAt).toLocaleDateString('vi-VN')}
                        </td>

                        <td className="py-3.5 px-5 text-right space-x-1.5 whitespace-nowrap">
                          {/* Nút thu hồi nhanh nếu đang IN_USE */}
                          {dev.status === 'IN_USE' && (
                            <button
                              type="button"
                              onClick={() => handleReleasePager(dev.pagerCode)}
                              className="px-2.5 py-1.5 rounded-lg border border-[#EBE3D5] bg-[#F5EBE6] hover:bg-[#F5EBE6]/80 text-[#6F4E37] dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300 font-bold"
                              title="Thu hồi thẻ"
                            >
                              Thu hồi
                            </button>
                          )}

                          {/* Nút sửa */}
                          <button
                            type="button"
                            onClick={() => {
                              setEditingDevice(dev);
                              setEditStatus(dev.status);
                              setEditBattery(dev.batteryLevel);
                            }}
                            className="p-1.5 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900"
                            title="Chỉnh sửa trạng thái / Mức pin"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Nút xóa */}
                          <button
                            type="button"
                            disabled={dev.status === 'IN_USE'}
                            onClick={() => setDeletingDevice(dev)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 disabled:opacity-30 disabled:cursor-not-allowed"
                            title={
                              dev.status === 'IN_USE'
                                ? 'Không thể xóa thẻ đang phát cho khách'
                                : 'Xóa thiết bị'
                            }
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-zinc-400 font-medium">
                        Không tìm thấy thiết bị thẻ rung nào phù hợp.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Phân trang */}
            {meta.totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 px-4 py-3">
                <div className="text-xs text-zinc-500">
                  Trang <strong className="text-zinc-800 dark:text-zinc-200">{meta.page}</strong> /{' '}
                  {meta.totalPages} ({meta.totalItems} thiết bị)
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={meta.page <= 1}
                    onClick={() => fetchDevices(meta.page - 1)}
                    className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-1.5 text-zinc-600 hover:bg-zinc-100 disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    disabled={meta.page >= meta.totalPages}
                    onClick={() => fetchDevices(meta.page + 1)}
                    className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-1.5 text-zinc-600 hover:bg-zinc-100 disabled:opacity-40"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ========================================================
          7. MODAL THÊM THẺ RUNG MỚI
          ======================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#F5EBE6] text-[#6F4E37] flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Thêm Thiết Bị Thẻ Rung Mới
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddDevice} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  Trạng thái thiết bị
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as PagerStatus)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-850 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-[#6F4E37] cursor-pointer"
                >
                  <option value="AVAILABLE">Sẵn sàng</option>
                  <option value="CHARGING">Đang sạc</option>
                  <option value="MAINTENANCE">Bảo trì</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  <span>Mức pin ban đầu</span>
                  <span className="text-[#6F4E37] dark:text-[#D4A373] font-mono font-bold">{newBatteryLevel}%</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={newBatteryLevel}
                  onChange={(e) => setNewBatteryLevel(Number(e.target.value))}
                  className="w-full accent-[#6F4E37] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingAdd}
                  className="px-4 py-2 rounded-xl bg-[#6F4E37] hover:bg-[#5A3F2C] text-white text-xs font-bold shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingAdd ? 'Đang lưu...' : 'Xác nhận thêm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          8. MODAL CHỈNH SỬA TRẠNG THÁI / PIN
          ======================================================== */}
      {editingDevice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#F5EBE6] text-[#6F4E37] flex items-center justify-center font-bold">
                  <Edit2 className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Cập Nhật Thẻ: {editingDevice.pagerCode}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingDevice(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditDevice} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  Trạng thái
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as PagerStatus)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-850 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-[#6F4E37] cursor-pointer"
                >
                  <option value="AVAILABLE">Sẵn sàng</option>
                  <option value="IN_USE">Đang phát cho khách</option>
                  <option value="CHARGING">Đang sạc</option>
                  <option value="MAINTENANCE">Bảo trì</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  <span>Mức pin (%)</span>
                  <span className="text-[#6F4E37] dark:text-[#D4A373] font-mono font-bold">{editBattery}%</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={editBattery}
                  onChange={(e) => setEditBattery(Number(e.target.value))}
                  className="w-full accent-[#6F4E37]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingDevice(null)}
                  className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingEdit}
                  className="px-4 py-2 rounded-xl bg-[#6F4E37] hover:bg-[#5A3F2C] text-white text-xs font-bold shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingEdit ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          9. MODAL XÁC NHẬN XÓA THIẾT BỊ
          ======================================================== */}
      {deletingDevice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Xác nhận xóa thiết bị
                </h3>
                <p className="text-xs text-zinc-500">Mã thẻ: {deletingDevice.pagerCode}</p>
              </div>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Bạn có chắc chắn muốn xóa thiết bị thẻ rung{' '}
              <strong className="text-zinc-900 dark:text-zinc-100">{deletingDevice.pagerCode}</strong>{' '}
              khỏi danh sách quản lý không?
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setDeletingDevice(null)}
                className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={isSubmittingDelete}
                onClick={handleDeleteDevice}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isSubmittingDelete ? 'Đang xóa...' : 'Xóa thiết bị'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

```

# pos\terminal\page.tsx

| Property | Value |
|----------|-------|
| Path | `pos\terminal\page.tsx` |
| Size | 12,680 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:54.963540 |

```tsx
// app/pos/terminal/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Coffee,
  Radio,
  Receipt,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  UserCheck,
  LogOut,
  LayoutDashboard,
} from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';
import { menuService } from '@/api/menu.service';
import { pagerService } from '@/api/pager.service';
import { loyaltyService, CustomerItem } from '@/api/loyalty.service';
import { posService } from '@/api/pos.service';
import { Category, Product, Topping } from '@/types/menu';
import { PagerDevice } from '@/types/pager';
import { usePosCart } from '@/hooks/usePosCart';
import { ProductGrid } from '@/components/pos/ProductGrid';
import { CartSidebar } from '@/components/pos/CartSidebar';
import { ProductOptionModal } from '@/components/pos/ProductOptionModal';
import { QuickCreateCustomerModal } from '@/components/pos/QuickCreateCustomerModal';
import { ApplyLoyaltyModal } from '@/components/pos/ApplyLoyaltyModal';
import { PrintReceiptModal } from '@/components/pos/PrintReceiptModal';
import { PosUserDropdown } from '@/components/pos/PosUserDropdown';

export default function PosTerminalPage() {
  const { user, logout } = useAuthContext();
  const isManagerOrAdmin = user?.role === 'ADMIN' || user?.role === 'MANAGER';
  // 1. Data States từ API
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [toppings, setToppings] = useState<Topping[]>([]);
  const [availablePagers, setAvailablePagers] = useState<PagerDevice[]>([]);
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(true);

  // 2. Modals States
  const [selectedProductForOption, setSelectedProductForOption] = useState<Product | null>(null);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState<boolean>(false);
  const [isLoyaltyModalOpen, setIsLoyaltyModalOpen] = useState<boolean>(false);
  const [createdOrderIdForReceipt, setCreatedOrderIdForReceipt] = useState<number | null>(null);

  // 3. Thông báo Toast
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // 4. Custom Hook giỏ hàng POS
  const {
    items,
    selectedCustomer,
    selectedPager,
    orderChannel,
    paymentMethod,
    pointsToRedeem,
    conversionRate,
    subTotal,
    discountAmount,
    totalAmount,
    totalItemCount,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    setSelectedCustomer,
    setSelectedPager,
    setOrderChannel,
    setPaymentMethod,
    setPointsToRedeem,
    buildPayload,
  } = usePosCart();

  // 5. Tải dữ liệu ban đầu
  const fetchData = async () => {
    setLoadingData(true);
    try {
      const [catsRes, prodsRes, topsRes, pagersRes, custsRes] = await Promise.all([
        menuService.getCategories({ displayStatus: 'SHOW' as any }).catch(() => [] as any),
        menuService.getProducts({ status: 'ACTIVE' as any }).catch(() => [] as any),
        menuService.getToppings({ status: 'ACTIVE' as any }).catch(() => [] as any),
        pagerService.getAvailablePagers().catch(() => [] as any),
        loyaltyService.getCustomers({ limit: 100 }).catch(() => ({ items: [] } as any)),
      ]);

      setCategories(Array.isArray(catsRes) ? (catsRes as any) : (catsRes as any)?.data || []);
      setProducts(Array.isArray(prodsRes) ? (prodsRes as any) : (prodsRes as any)?.data || []);
      setToppings(Array.isArray(topsRes) ? (topsRes as any) : (topsRes as any)?.data || []);
      setAvailablePagers(Array.isArray(pagersRes) ? (pagersRes as any) : (pagersRes as any)?.data || []);
      setCustomers((custsRes as any)?.items || (custsRes as any)?.data || []);
    } catch (error: any) {
      console.error('Lỗi khi tải dữ liệu POS:', error);
      setToastMessage({ type: 'error', message: 'Không thể tải đầy đủ danh mục và thực đơn' });
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Tự động tắt toast sau 4 giây
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // 6. Xử lý Chốt đơn & Thanh toán
  const handleCheckout = async () => {
    if (items.length === 0) {
      setToastMessage({ type: 'error', message: 'Vui lòng chọn ít nhất 1 món vào đơn hàng' });
      return;
    }

    setIsSubmitting(true);

    try {
      // employeeId lấy từ auth user profile hoặc 1
      const payload = buildPayload(user?.id || 1);
      const res = await posService.createOrder(payload);
      const createdOrder = res?.data || res;
      const newOrderId = createdOrder.id || res.orderId;

      setToastMessage({
        type: 'success',
        message: `Tạo đơn #${createdOrder.orderCode || newOrderId} thành công!`,
      });

      // Mở modal in hóa đơn
      if (newOrderId) {
        setCreatedOrderIdForReceipt(newOrderId);
      }

      // Reset giỏ hàng và reload lại danh sách thẻ rung trống
      clearCart();
      const updatedPagers = await pagerService.getAvailablePagers().catch(() => []);
      setAvailablePagers(updatedPagers);
    } catch (err: any) {
      setToastMessage({
        type: 'error',
        message: err.message || 'Không thể tạo đơn hàng. Vui lòng kiểm tra lại nguyên liệu hoặc thẻ rung.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col bg-[#FAF6F0] dark:bg-zinc-950 overflow-hidden select-none">
      {/* 1. Header Topbar POS */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-5 dark:border-zinc-800 dark:bg-zinc-900 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#6F4E37] text-white font-black shadow-xs">
              <Coffee className="h-4 w-4" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight">
                POS TERMINAL
              </h1>
              <p className="text-[10px] text-zinc-400 font-medium leading-none">Quầy Order</p>
            </div>
          </div>
        </div>

        {/* Quick Nav Links */}
        <div className="flex items-center gap-2">
          {isManagerOrAdmin && (
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-bold text-zinc-700 hover:bg-[#F5EBE6] hover:text-[#6F4E37] dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 transition-colors"
            >
              <LayoutDashboard className="h-3.5 w-3.5 text-[#6F4E37] dark:text-[#D4A373]" />
              <span>Về Dashboard</span>
            </Link>
          )}

          <Link
            href="/pos/orders"
            className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-bold text-zinc-700 hover:bg-[#F5EBE6] hover:text-[#6F4E37] dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 transition-colors"
          >
            <Receipt className="h-3.5 w-3.5 text-[#6F4E37] dark:text-[#D4A373]" />
            <span>Lịch sử hóa đơn</span>
          </Link>

          <Link
            href="/pos/pagers"
            className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-bold text-zinc-700 hover:bg-[#F5EBE6] hover:text-[#6F4E37] dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 transition-colors"
          >
            <Radio className="h-3.5 w-3.5 text-[#6F4E37] dark:text-[#D4A373]" />
            <span>Thẻ rung</span>
          </Link>

          <button
            type="button"
            onClick={fetchData}
            title="Làm mới thực đơn"
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-200 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>

          {/* User Dropdown */}
          <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-700 mx-1" />
          <PosUserDropdown />
        </div>
      </header>

      {/* 2. Toast Thông báo */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 animate-bounce">
          <div
            className={`flex items-center gap-2.5 rounded-xl px-4 py-3 text-xs font-bold shadow-xl ${toastMessage.type === 'success'
              ? 'bg-emerald-600 text-white'
              : 'bg-rose-600 text-white'
              }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <span>{toastMessage.message}</span>
          </div>
        </div>
      )}

      {/* 3. Khung làm việc chính: Chia 2 cột (Menu Grid 65% + Cart Sidebar 35%) */}
      <div className="flex flex-1 overflow-hidden">
        {/* Cột trái: Lưới sản phẩm */}
        <div className="flex-1 overflow-hidden">
          <ProductGrid
            categories={categories}
            products={products}
            isLoading={loadingData}
            onSelectProduct={(prod) => setSelectedProductForOption(prod)}
          />
        </div>

        {/* Cột phải: Giỏ hàng Sidebar */}
        <div className="w-[380px] lg:w-[420px] shrink-0 h-full">
          <CartSidebar
            items={items}
            subTotal={subTotal}
            discountAmount={discountAmount}
            totalAmount={totalAmount}
            totalItemCount={totalItemCount}
            orderChannel={orderChannel}
            paymentMethod={paymentMethod}
            selectedCustomer={selectedCustomer}
            selectedPager={selectedPager}
            availablePagers={availablePagers}
            allCustomers={customers}
            isSubmitting={isSubmitting}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeItem}
            onClearCart={clearCart}
            onSetOrderChannel={setOrderChannel}
            onSetPaymentMethod={setPaymentMethod}
            onSelectCustomer={setSelectedCustomer}
            onSelectPager={setSelectedPager}
            onOpenQuickCreateCustomer={() => setIsCustomerModalOpen(true)}
            onOpenApplyLoyalty={() => setIsLoyaltyModalOpen(true)}
            onSubmitOrder={handleCheckout}
          />
        </div>
      </div>

      {/* 4. Modals */}
      {/* Modal tùy chọn món */}
      <ProductOptionModal
        isOpen={Boolean(selectedProductForOption)}
        product={selectedProductForOption}
        toppings={toppings}
        onClose={() => setSelectedProductForOption(null)}
        onConfirm={addItem}
      />

      {/* Modal tạo nhanh khách hàng */}
      <QuickCreateCustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onCustomerCreated={(newCust) => {
          setSelectedCustomer(newCust);
          setCustomers((prev) => [newCust as any, ...prev]);
        }}
      />

      {/* Modal đổi điểm thưởng */}
      <ApplyLoyaltyModal
        isOpen={isLoyaltyModalOpen}
        customer={selectedCustomer}
        subTotal={subTotal}
        currentPointsToRedeem={pointsToRedeem}
        conversionRate={conversionRate}
        onClose={() => setIsLoyaltyModalOpen(false)}
        onApply={setPointsToRedeem}
      />

      {/* Modal in hóa đơn */}
      <PrintReceiptModal
        isOpen={Boolean(createdOrderIdForReceipt)}
        orderId={createdOrderIdForReceipt}
        onClose={() => setCreatedOrderIdForReceipt(null)}
      />
    </div>
  );
}

```

