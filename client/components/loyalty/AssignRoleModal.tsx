import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { CustomerItem } from '@/api/loyalty.service';

interface AssignRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    fullName: string;
    username: string;
    password: string;
    role: 'CASHIER' | 'BARISTA' | 'STOREKEEPER';
    phoneNumber?: string;
  }) => Promise<void>;
  customer?: CustomerItem | null;
}

export const AssignRoleModal: React.FC<AssignRoleModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  customer,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'CASHIER' | 'BARISTA' | 'STOREKEEPER'>('CASHIER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (customer) {
      setUsername(customer.phoneNumber ? `emp_${customer.phoneNumber}` : '');
      setPassword('');
      setRole('CASHIER');
    }
    setError(null);
  }, [customer, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) return;
    setLoading(true);
    setError(null);
    try {
      await onSubmit({
        fullName: customer.fullName,
        username,
        password,
        role,
        phoneNumber: customer.phoneNumber,
      });
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Cấp quyền thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Cấp quyền Nhân viên: ${customer?.fullName || ''}`}>
      <div className="mb-4 text-xs text-gray-500">
        Tạo tài khoản Nhân viên nội bộ dựa trên thông tin khách hàng.
      </div>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-medium">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Tên đăng nhập (Username)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Nhập tên đăng nhập..."
          required
        />
        <Input
          label="Mật khẩu khởi tạo"
          isPassword
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Nhập mật khẩu..."
          required
        />
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Vai trò Nhân viên</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
          >
            <option value="CASHIER">Thu ngân (CASHIER)</option>
            <option value="BARISTA">Pha chế (BARISTA)</option>
            <option value="STOREKEEPER">Thủ kho (STOREKEEPER)</option>
          </select>
          <p className="text-[11px] text-amber-600 font-medium">
            ⚠️ Lưu ý: Không được phép chọn quyền Manager cho tài khoản này.
          </p>
        </div>
        <div className="pt-2 flex gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" isLoading={loading}>
            Xác nhận cấp quyền
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AssignRoleModal;
