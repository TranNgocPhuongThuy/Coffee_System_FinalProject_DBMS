import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { loyaltyService, CustomerItem, AdjustPointsPayload } from '@/api/loyalty.service';
import { PlusCircle, MinusCircle } from 'lucide-react';

interface AdjustPointsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  customer?: CustomerItem | null;
  customersList?: CustomerItem[];
}

export const AdjustPointsModal: React.FC<AdjustPointsModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  customer,
  customersList = [],
}) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | ''>('');
  const [transactionType, setTransactionType] = useState<'EARN' | 'REDEEM'>('EARN');
  const [points, setPoints] = useState<number | ''>('');
  const [orderId, setOrderId] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (customer) {
      setSelectedCustomerId(customer.id);
    } else if (customersList.length > 0) {
      setSelectedCustomerId(customersList[0].id);
    } else {
      setSelectedCustomerId('');
    }
    setTransactionType('EARN');
    setPoints('');
    setOrderId('');
    setDescription('');
    setError(null);
  }, [customer, customersList, isOpen]);

  const activeCustomer = customer || customersList.find((c) => c.id === Number(selectedCustomerId));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId) {
      setError('Vui lòng chọn khách hàng');
      return;
    }
    const numPoints = Number(points);
    if (!numPoints || numPoints <= 0) {
      setError('Số điểm điều chỉnh phải lớn hơn 0');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload: AdjustPointsPayload = {
        customerId: Number(selectedCustomerId),
        transactionType,
        points: numPoints,
        orderId: orderId ? Number(orderId) : null,
        description: description.trim() || undefined,
      };

      await loyaltyService.adjustPoints(payload);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Điều chỉnh điểm thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Điều chỉnh điểm thưởng thủ công">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-medium animate-in fade-in">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Customer Selection or Info Display */}
        {customer ? (
          <div className="p-3 bg-[#FAF6F0] rounded-xl border border-[#EBE3D5] flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">Khách hàng áp dụng</p>
              <p className="font-bold text-gray-900 text-sm">{customer.fullName}</p>
              <p className="text-xs text-gray-500 font-mono">{customer.phoneNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Điểm hiện tại</p>
              <p className="text-base font-bold text-[#6F4E37]">
                {(customer.rewardPoints || 0).toLocaleString('vi-VN')} pts
              </p>
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Chọn khách hàng <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20 transition-all"
              required
            >
              <option value="">-- Chọn khách hàng --</option>
              {customersList.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.fullName} - {c.phoneNumber} ({c.rewardPoints || 0} pts)
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Transaction Type Selector */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Loại điều chỉnh</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setTransactionType('EARN')}
              className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                transactionType === 'EARN'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-sm'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-emerald-600" />
              <span>Cộng điểm (+)</span>
            </button>
            <button
              type="button"
              onClick={() => setTransactionType('REDEEM')}
              className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                transactionType === 'REDEEM'
                  ? 'bg-red-50 border-red-300 text-red-800 shadow-sm'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <MinusCircle className="w-4 h-4 text-red-600" />
              <span>Trừ điểm (-)</span>
            </button>
          </div>
        </div>

        {/* Points input */}
        <Input
          label="Số điểm điều chỉnh"
          type="number"
          min="1"
          placeholder="Nhập số điểm..."
          value={points}
          onChange={(e) => setPoints(e.target.value ? Number(e.target.value) : '')}
          required
        />

        {/* Order ID (Optional) */}
        <Input
          label="Mã đơn hàng liên quan (Tùy chọn)"
          type="number"
          placeholder="Nhập Order ID nếu có (ví dụ: 102)"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
        />

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Lý do / Ghi chú <span className="text-gray-400 font-normal">(không bắt buộc)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Ví dụ: Thưởng sinh nhật khách hàng, Đổi quà tại quầy, Sửa sai sót..."
            className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20 transition-all resize-none"
          />
        </div>

        {/* Summary preview */}
        {activeCustomer && points && Number(points) > 0 && (
          <div className="p-3 bg-gray-50 rounded-xl text-xs space-y-1">
            <div className="flex justify-between text-gray-600">
              <span>Điểm hiện tại:</span>
              <span className="font-semibold">{activeCustomer.rewardPoints || 0} pts</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900">
              <span>Điểm dự kiến sau thay đổi:</span>
              <span className={transactionType === 'EARN' ? 'text-emerald-600' : 'text-red-600'}>
                {transactionType === 'EARN'
                  ? (activeCustomer.rewardPoints || 0) + Number(points)
                  : Math.max(0, (activeCustomer.rewardPoints || 0) - Number(points))}{' '}
                pts
              </span>
            </div>
          </div>
        )}

        <div className="pt-2 flex gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" isLoading={loading}>
            Xác nhận điều chỉnh
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AdjustPointsModal;
