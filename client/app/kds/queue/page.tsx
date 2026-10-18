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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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

  if (!mounted) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAF6F0] border border-[#F0E6DD] text-[#6F4E37] font-mono text-xs font-bold shrink-0">
        <Clock className="w-3.5 h-3.5 text-[#6F4E37]/70" />
        <span>--:--:--</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAF6F0] border border-[#F0E6DD] text-[#6F4E37] font-mono text-xs font-bold shrink-0">
      <Clock className="w-3.5 h-3.5 text-[#6F4E37]/70" />
      <span>{time}</span>
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
      const res: any = await kdsService.updateItemStatus(orderDetailId, { itemStatus: status });
      showToast(
        res?.data?.message ||
        res?.message ||
        (status === 'PREPARING'
          ? 'Đã bắt đầu pha chế món!'
          : status === 'DONE'
          ? 'Đã hoàn tất pha chế thành công!'
          : 'Đã hủy món')
      );
      await fetchQueue();
    } catch (err: any) {
      // Tự động xóa thẻ rác khỏi hàng đợi trên giao diện và fetch lại
      setQueueItems((prev) => prev.filter((i) => i.orderDetailId !== orderDetailId));
      await fetchQueue();
      alert(err.response?.data?.message || 'Món này không còn tồn tại trên hệ thống, đã tự động làm mới hàng đợi.');
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
  {/* Card 1: Chờ pha chế (PENDING) */}
  <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
    <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 font-bold">
      <Clock className="w-6 h-6" />
    </div>
    <div>
      <p className="text-xs text-gray-400 font-medium">Chờ pha chế</p>
      <p className="text-xl font-bold text-amber-800 mt-0.5">
        {pendingCount.toLocaleString('vi-VN')}{' '}
        <span className="text-xs font-normal text-amber-700/80">món</span>
      </p>
    </div>
  </div>

  {/* Card 2: Đang pha chế (PREPARING) */}
  <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-bold">
      <Play className="w-6 h-6 fill-blue-600/20" />
    </div>
    <div>
      <p className="text-xs text-gray-400 font-medium">Đang thực hiện</p>
      <p className="text-xl font-bold text-blue-700 mt-0.5">
        {preparingCount.toLocaleString('vi-VN')}{' '}
        <span className="text-xs font-normal text-blue-600/80">món</span>
      </p>
    </div>
  </div>

  {/* Card 3: Đã hoàn tất (DONE) */}
  <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-bold">
      <CheckCircle2 className="w-6 h-6" />
    </div>
    <div>
      <p className="text-xs text-gray-400 font-medium">Đã xong ca làm việc</p>
      <p className="text-xl font-bold text-emerald-700 mt-0.5">
        {doneCount.toLocaleString('vi-VN')}{' '}
        <span className="text-xs font-normal text-emerald-600/80">món</span>
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
