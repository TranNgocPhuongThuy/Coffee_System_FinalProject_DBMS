'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ChefHat,
  Clock,
  ArrowLeft,
  RefreshCw,
  BellRing,
} from 'lucide-react';
import { kdsService } from '@/api/kds.service';
import { KdsQueueItem } from '@/types/kds';
import { KDSTicketCard } from '@/components/kds/KDSTicketCard';
import { QuickRecipeModal } from '@/components/kds/QuickRecipeModal';

export default function KDSQueuePage() {
  const [queueItems, setQueueItems] = useState<KdsQueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'PREPARING'>('ALL');
  const [currentTime, setCurrentTime] = useState<string>('');
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

  // Clock widget update
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('vi-VN', {
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
          ? 'Đã bắt đầu pha chế!'
          : status === 'DONE'
          ? 'Hoàn tất pha chế thành công!'
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
    <div className="min-h-screen bg-[#FAF6F0] text-gray-800 flex flex-col font-sans antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-semibold z-50 animate-in fade-in">
          {toastMessage}
        </div>
      )}

      {/* Header Bar */}
      <header className="bg-white border-b border-gray-200/80 px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sticky top-0 z-30 shadow-xs">
        {/* Left: Logo & Time */}
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            title="Quay về Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F5EBE6] text-[#6F4E37] flex items-center justify-center font-bold shadow-xs">
              <ChefHat className="w-6 h-6" strokeWidth={2.2} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-none">
                Màn hình Bếp / Quầy Bar (KDS)
              </h1>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
                Real-time Sync (5s) • Quầy pha chế
              </p>
            </div>
          </div>

          {/* Clock Widget */}
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#FAF6F0] border border-[#F0E6DD] text-[#6F4E37] font-mono text-sm font-bold ml-3">
            <Clock className="w-4 h-4 text-[#6F4E37]/70" />
            <span>{currentTime || '14:30:00'}</span>
          </div>
        </div>

        {/* Right: Controls & Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={fetchQueue}
            className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
            title="Làm mới hàng đợi"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#6F4E37]' : ''}`} />
          </button>

          <div className="flex items-center gap-1.5 bg-gray-100/80 p-1.5 rounded-2xl">
            <button
              type="button"
              onClick={() => setActiveTab('ALL')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'ALL'
                  ? 'bg-[#6F4E37] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white'
              }`}
            >
              Tất cả ({queueItems.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('PENDING')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'PENDING'
                  ? 'bg-[#6F4E37] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white'
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
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'PREPARING'
                  ? 'bg-[#6F4E37] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white'
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
        </div>
      </header>

      {/* Main Grid Content */}
      <main className="flex-1 p-6 overflow-y-auto max-w-7xl w-full mx-auto">
        {loading && queueItems.length === 0 ? (
          <div className="h-96 flex flex-col items-center justify-center text-center p-8 text-gray-400 animate-pulse">
            <ChefHat className="w-12 h-12 mb-3 stroke-1 text-gray-300" />
            <p className="text-sm font-semibold text-gray-600">Đang đồng bộ hàng đợi KDS từ hệ thống...</p>
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
          <div className="h-96 flex flex-col items-center justify-center text-center p-8 text-gray-400">
            <ChefHat className="w-16 h-16 mb-3 stroke-1 text-gray-300" />
            <p className="text-base font-semibold text-gray-700">
              Không có món nào cần pha chế trong danh mục này
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Đơn gọi món mới từ quầy POS sẽ tự động xuất hiện tại đây theo thời gian thực (5s)
            </p>
          </div>
        )}
      </main>

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
