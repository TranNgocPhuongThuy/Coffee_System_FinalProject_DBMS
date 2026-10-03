import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { CustomerItem } from '@/api/loyalty.service';

interface CustomerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { fullName: string; phoneNumber: string; password?: string }) => Promise<void>;
  customer?: CustomerItem | null;
}

export const CustomerFormModal: React.FC<CustomerFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  customer,
}) => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (customer) {
      setFullName(customer.fullName || '');
      setPhoneNumber(customer.phoneNumber || '');
      setPassword('');
    } else {
      setFullName('');
      setPhoneNumber('');
      setPassword('');
    }
    setError(null);
  }, [customer, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSubmit({ fullName, phoneNumber, password: password || undefined });
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Thao tác thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={customer ? 'Chỉnh sửa thông tin khách hàng' : 'Thêm khách hàng mới'}
    >
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-medium">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Họ và tên"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Nhập họ tên..."
          required
        />
        <Input
          label="Số điện thoại"
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Nhập số điện thoại..."
          required
        />
        {!customer && (
          <Input
            label="Mật khẩu (Tùy chọn)"
            isPassword
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Để trống nếu tạo tại quầy"
          />
        )}
        <div className="pt-2 flex gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" isLoading={loading}>
            {customer ? 'Lưu thay đổi' : 'Tạo khách hàng'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CustomerFormModal;
