'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ChefHat,
  Clock,
  RefreshCw,
  Play,
  CheckCircle2,
  BellRing,
  BookOpen,
  Utensils,
  ShoppingBag,
  Maximize2,
  X,
  Loader2,
} from 'lucide-react';
import { kdsService } from '@/api/kds.service';
import { KdsQueueItem } from '@/types/kds';
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

interface GroupedOrderTicket {
  orderId: number;
  orderCode: string;
  orderChannel: string;
  pagerCode: string | null;
  batteryLevel: number | null;
  waitingMinutes: number;
  createdAt: string;
  items: KdsQueueItem[];
}

export default function KDSQueuePage() {
  const [queueItems, setQueueItems] = useState<KdsQueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'PREPARING'>('ALL');
  const [actionLoadingOrderId, setActionLoadingOrderId] = useState<number | null>(null);

  // Modal phóng to chi tiết đơn hàng
  const [selectedTicketModal, setSelectedTicketModal] = useState<GroupedOrderTicket | null>(null);

  // Recipe Modal
  const [isRecipeOpen, setIsRecipeOpen] = useState(false);
  const [selectedRecipeProduct, setSelectedRecipeProduct] = useState('');

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchQueue = useCallback(async () => {
    try {
      const items = await kdsService.getQueue({ status: activeTab });
      setQueueItems(items || []);
    } catch {
      // Bỏ qua lỗi ngắt kết nối tạm thời
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 5000);
    return () => clearInterval(interval);
  }, [fetchQueue]);

  // NHÓM CÁC MÓN CÙNG MỘT ĐƠN VÀO 1 TICKET DUY NHẤT
  const groupedOrders: GroupedOrderTicket[] = useMemo(() => {
    const map = new Map<number, GroupedOrderTicket>();

    queueItems.forEach((item) => {
      if (!map.has(item.orderId)) {
        map.set(item.orderId, {
          orderId: item.orderId,
          orderCode: item.orderCode,
          orderChannel: item.orderChannel,
          pagerCode: item.pagerCode,
          batteryLevel: item.batteryLevel,
          waitingMinutes: item.waitingMinutes,
          createdAt: item.itemCreatedAt,
          items: [],
        });
      }
      map.get(item.orderId)!.items.push(item);
    });

    return Array.from(map.values());
  }, [queueItems]);

  // Đồng bộ lại dữ liệu của ticket phóng to nếu danh sách thay đổi
  useEffect(() => {
    if (selectedTicketModal) {
      const updated = groupedOrders.find((o) => o.orderId === selectedTicketModal.orderId);
      if (updated) {
        setSelectedTicketModal(updated);
      }
    }
  }, [groupedOrders, selectedTicketModal]);

  // BẮT ĐẦU PHA CHẾ TOÀN BỘ ĐƠN
  const handleStartPreparingOrder = async (ticket: GroupedOrderTicket) => {
    setActionLoadingOrderId(ticket.orderId);
    try {
      const pendingItems = ticket.items.filter((it) => it.itemStatus === 'PENDING');
      await Promise.all(
        pendingItems.map((it) =>
          kdsService.updateItemStatus(it.orderDetailId, { itemStatus: 'PREPARING' })
        )
      );
      showToast(`Đơn #${ticket.orderCode || ticket.orderId} đã bắt đầu pha chế!`);
      await fetchQueue();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Không thể cập nhật trạng thái đơn');
    } finally {
      setActionLoadingOrderId(null);
    }
  };

  // HOÀN TẤT TOÀN BỘ ĐƠN (Trừ kho BOM và sẵn sàng trả món)
  const handleCompleteOrder = async (ticket: GroupedOrderTicket) => {
    setActionLoadingOrderId(ticket.orderId);
    try {
      const unDoneItems = ticket.items.filter((it) => it.itemStatus !== 'DONE');
      await Promise.all(
        unDoneItems.map((it) =>
          kdsService.updateItemStatus(it.orderDetailId, { itemStatus: 'DONE' })
        )
      );

      // Chuyển đơn sang trạng thái sẵn sàng
      await kdsService.notifyOrderReady(ticket.orderId);
      showToast(`Đã hoàn tất pha chế đơn #${ticket.orderCode || ticket.orderId}!`);

      if (selectedTicketModal?.orderId === ticket.orderId) {
        setSelectedTicketModal(null);
      }
      await fetchQueue();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Không thể hoàn tất đơn hàng');
    } finally {
      setActionLoadingOrderId(null);
    }
  };

  // Rung chuông báo thẻ rung
  const handleNotifyReady = async (orderId: number) => {
    try {
      const res = await kdsService.notifyOrderReady(orderId);
      showToast(res.data?.message || 'Đã kích hoạt chuông báo thẻ rung!');
      await fetchQueue();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Kích hoạt thẻ rung thất bại');
    }
  };

  const pendingCount = queueItems.filter((i) => i.itemStatus === 'PENDING').length;
  const preparingCount = queueItems.filter((i) => i.itemStatus === 'PREPARING').length;
  const doneCount = queueItems.filter((i) => i.itemStatus === 'DONE').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-16 font-sans">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#6F4E37] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <span className="font-semibold text-sm">{toastMessage}</span>
        </div>
      )}

      {/* 1. Thẻ Metric Cards (3 Cột Chuẩn Gọn Gàng) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

      {/* 2. Toolbar & Controls */}
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
            Tất cả đơn ({groupedOrders.length} vé đơn)
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
            <span>Có món chờ</span>
            {pendingCount > 0 && (
              <span className="w-5 h-5 rounded-full text-[10px] font-extrabold flex items-center justify-center bg-amber-100 text-amber-800">
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
              <span className="w-5 h-5 rounded-full text-[10px] font-extrabold flex items-center justify-center bg-blue-100 text-blue-800">
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

      {/* 3. LƯỚI THẺ ORDER KDS (Mỗi order = 1 thẻ gọn gàng, có nút chung phía dưới) */}
      <div className="space-y-4">
        {loading && groupedOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center text-gray-400 animate-pulse">
            <ChefHat className="w-12 h-12 mb-3 stroke-1 text-gray-300" />
            <p className="text-sm font-semibold text-gray-600">Đang đồng bộ hàng đợi KDS từ quầy POS...</p>
          </div>
        ) : groupedOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {groupedOrders.map((ticket) => {
              const allDone = ticket.items.every((it) => it.itemStatus === 'DONE');
              const hasPreparing = ticket.items.some((it) => it.itemStatus === 'PREPARING');
              const isUrgent = ticket.waitingMinutes >= 10 && !allDone;
              const isActionLoading = actionLoadingOrderId === ticket.orderId;

              return (
                <div
                  key={ticket.orderId}
                  className={`bg-white rounded-2xl border flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 ${
                    allDone
                      ? 'border-emerald-300 ring-1 ring-emerald-200 bg-emerald-50/10'
                      : hasPreparing
                      ? 'border-blue-400 ring-2 ring-blue-400/20'
                      : isUrgent
                      ? 'border-rose-400 ring-2 ring-rose-400/20'
                      : 'border-[#F0E6DD]'
                  }`}
                >
                  {/* Header Thẻ: Bấm vào mở xem chi tiết */}
                  <div
                    onClick={() => setSelectedTicketModal(ticket)}
                    className="p-3.5 border-b border-gray-100 bg-[#FAF6F0]/60 flex items-center justify-between gap-2 cursor-pointer hover:bg-[#F5EBE6] transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-mono font-bold text-base text-gray-900">
                          #{ticket.orderCode || ticket.orderId}
                        </span>
                        {ticket.pagerCode ? (
                          <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-200">
                            Thẻ #{ticket.pagerCode}
                          </span>
                        ) : (
                          <span className="text-[11px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                            Không thẻ
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5 text-xs text-gray-500 font-medium">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span className={isUrgent ? 'text-rose-600 font-bold' : ''}>
                          {ticket.waitingMinutes} phút trước
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold ${
                          ticket.orderChannel === 'ONLINE' || ticket.orderChannel === 'DELIVERY'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-[#F5EBE6] text-[#6F4E37]'
                        }`}
                      >
                        {ticket.orderChannel === 'ONLINE' || ticket.orderChannel === 'DELIVERY' ? (
                          <>
                            <ShoppingBag className="w-3 h-3" />
                            <span>Giao đi</span>
                          </>
                        ) : (
                          <>
                            <Utensils className="w-3 h-3" />
                            <span>Tại quầy</span>
                          </>
                        )}
                      </span>
                      <Maximize2 className="w-3.5 h-3.5 text-gray-400 hover:text-gray-700" />
                    </div>
                  </div>

                  {/* Body: Danh sách món có GIỚI HẠN CHIỀU CAO (max-h-56) và cuộn lướt bên trong */}
                  <div className="p-3 space-y-2 flex-1 max-h-56 overflow-y-auto divide-y divide-gray-100/80">
                    {ticket.items.map((drink) => (
                      <div key={drink.orderDetailId} className="pt-2 first:pt-0 flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 flex-1 min-w-0">
                          <span className="w-6 h-6 rounded-lg bg-[#6F4E37] text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-2xs">
                            {drink.quantity}x
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-sm text-gray-900 leading-snug truncate">
                              {drink.itemSnapshotName}{' '}
                              {drink.sizeSnapshot && (
                                <span className="text-xs text-gray-500 font-normal">({drink.sizeSnapshot})</span>
                              )}
                            </p>

                            {/* Toppings */}
                            {drink.toppings && drink.toppings.length > 0 && (
                              <div className="mt-1 flex flex-wrap gap-1">
                                {drink.toppings.map((tp, idx) => (
                                  <span
                                    key={idx}
                                    className="text-[10px] font-medium text-amber-900 bg-amber-50 border border-amber-200/70 rounded px-1.5 py-0.2"
                                  >
                                    +{tp.name} (x{tp.quantity})
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Note */}
                            {drink.note && (
                              <p className="text-[11px] text-amber-800 italic mt-0.5 line-clamp-1">
                                * {drink.note}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Icon mở xem công thức */}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedRecipeProduct(drink.itemSnapshotName);
                            setIsRecipeOpen(true);
                          }}
                          className="p-1 text-gray-400 hover:text-[#6F4E37] rounded shrink-0 cursor-pointer"
                          title="Xem công thức pha chế"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Footer: Nút hành động CHUNG DƯỚI CÙNG theo đúng vòng đời đơn */}
                  <div className="p-3 border-t border-gray-100 bg-[#FAF6F0]/40 space-y-2">
                    {/* Trạng thái 1: Đơn đang chờ pha chế (Tất cả món còn PENDING) */}
                    {!hasPreparing && !allDone && (
                      <button
                        type="button"
                        disabled={isActionLoading}
                        onClick={() => handleStartPreparingOrder(ticket)}
                        className="w-full py-2.5 px-3 rounded-xl bg-[#6F4E37] hover:bg-[#5A3F2C] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer active:scale-[0.98] disabled:opacity-50"
                      >
                        {isActionLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Play className="w-4 h-4 fill-white" />
                        )}
                        <span>Bắt đầu pha chế đơn ({ticket.items.length} món)</span>
                      </button>
                    )}

                    {/* Trạng thái 2: Đơn đang pha chế -> Nút Hoàn tất toàn bộ đơn */}
                    {hasPreparing && !allDone && (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          disabled={isActionLoading}
                          onClick={() => handleCompleteOrder(ticket)}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-[0.98] disabled:opacity-50"
                        >
                          {isActionLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4" />
                          )}
                          <span>Hoàn tất đơn</span>
                        </button>

                        {ticket.pagerCode && (
                          <button
                            type="button"
                            onClick={() => handleNotifyReady(ticket.orderId)}
                            className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold flex items-center justify-center cursor-pointer"
                            title="Rung chuông Pager"
                          >
                            <BellRing className="w-4 h-4 text-amber-600 animate-bounce" />
                          </button>
                        )}
                      </div>
                    )}

                    {/* Trạng thái 3: Tất cả món đã xong -> Nút rung chuông hoặc báo hoàn tất */}
                    {allDone && (
                      <div className="space-y-1.5">
                        <div className="text-center text-xs font-bold text-emerald-700 flex items-center justify-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Đã xong tất cả các món!</span>
                        </div>
                        {ticket.pagerCode ? (
                          <button
                            type="button"
                            onClick={() => handleNotifyReady(ticket.orderId)}
                            className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                          >
                            <BellRing className="w-4 h-4 animate-bounce" />
                            <span>Rung chuông Thẻ #{ticket.pagerCode}</span>
                          </button>
                        ) : (
                          <div className="text-center text-[11px] text-gray-500 font-medium">
                            Sẵn sàng giao cho khách
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-16 border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center text-gray-400">
            <div className="w-16 h-16 rounded-2xl bg-[#FAF6F0] flex items-center justify-center text-[#6F4E37] mb-3">
              <ChefHat className="w-8 h-8" />
            </div>
            <p className="text-base font-bold text-gray-800">Hiện tại không có món nào cần pha chế</p>
            <p className="text-xs text-gray-400 mt-1 max-w-sm">
              Đơn gọi món mới từ quầy POS hoặc ứng dụng đặt hàng sẽ tự động xuất hiện tại đây theo thời gian thực (5s).
            </p>
          </div>
        )}
      </div>

      {/* 4. MODAL PHÓNG TO CHI TIẾT ĐƠN HÀNG (MỜ BACKGROUND XUNG QUANH & CUỘN LƯỚT XEM) */}
      {selectedTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header Modal */}
            <div className="p-5 border-b border-gray-100 bg-[#FAF6F0]/80 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#6F4E37] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  <ChefHat className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-gray-900">
                      Chi tiết Đơn #{selectedTicketModal.orderCode || selectedTicketModal.orderId}
                    </h3>
                    {selectedTicketModal.pagerCode ? (
                      <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-lg border border-amber-200">
                        Thẻ #{selectedTicketModal.pagerCode}
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                        Không thẻ
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Thời gian chờ: {selectedTicketModal.waitingMinutes} phút • Kênh bán:{' '}
                    <strong className="text-gray-700">{selectedTicketModal.orderChannel}</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTicketModal(null)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body: Danh sách toàn bộ các ly nước cuộn lướt thoải mái */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Danh sách đồ uống ({selectedTicketModal.items.length} món)
              </h4>

              <div className="space-y-3">
                {selectedTicketModal.items.map((drink, idx) => (
                  <div
                    key={drink.orderDetailId}
                    className="p-4 rounded-2xl border border-gray-200 bg-[#FAF6F0]/30 flex items-start justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 rounded-xl bg-[#6F4E37] text-white text-xs font-bold flex items-center justify-center shrink-0">
                        {drink.quantity}x
                      </span>
                      <div>
                        <p className="font-bold text-base text-gray-900 leading-snug">
                          {drink.itemSnapshotName}{' '}
                          {drink.sizeSnapshot && (
                            <span className="text-xs font-bold text-[#6F4E37] bg-[#F5EBE6] px-2 py-0.5 rounded-md border border-[#EBE3D5]">
                              Size {drink.sizeSnapshot}
                            </span>
                          )}
                        </p>

                        {/* Toppings */}
                        {drink.toppings && drink.toppings.length > 0 && (
                          <div className="mt-1.5 flex flex-wrap gap-1.5">
                            {drink.toppings.map((tp, tIdx) => (
                              <span
                                key={tIdx}
                                className="text-xs font-medium text-amber-900 bg-amber-50 border border-amber-200 rounded-md px-2 py-0.5"
                              >
                                + {tp.name} (x{tp.quantity})
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Ghi chú */}
                        {drink.note && (
                          <p className="text-xs font-medium text-amber-800 bg-amber-100/70 rounded-md px-2.5 py-1 mt-2 inline-block">
                            ⭐ Ghi chú: {drink.note}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRecipeProduct(drink.itemSnapshotName);
                        setIsRecipeOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold text-[#6F4E37] flex items-center gap-1.5 cursor-pointer shrink-0 shadow-2xs"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Công thức</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Modal: Các nút hành động chính */}
            <div className="p-4 border-t border-gray-100 bg-[#FAF6F0]/60 flex items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setSelectedTicketModal(null)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                Đóng
              </button>

              <div className="flex items-center gap-2">
                {!selectedTicketModal.items.some((it) => it.itemStatus === 'PREPARING') &&
                  !selectedTicketModal.items.every((it) => it.itemStatus === 'DONE') && (
                    <button
                      type="button"
                      disabled={actionLoadingOrderId === selectedTicketModal.orderId}
                      onClick={() => handleStartPreparingOrder(selectedTicketModal)}
                      className="px-5 py-2.5 rounded-xl bg-[#6F4E37] hover:bg-[#5A3F2C] text-white text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>Bắt đầu pha chế đơn này</span>
                    </button>
                  )}

                {!selectedTicketModal.items.every((it) => it.itemStatus === 'DONE') && (
                  <button
                    type="button"
                    disabled={actionLoadingOrderId === selectedTicketModal.orderId}
                    onClick={() => handleCompleteOrder(selectedTicketModal)}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Hoàn tất toàn bộ đơn</span>
                  </button>
                )}

                {selectedTicketModal.pagerCode && (
                  <button
                    type="button"
                    onClick={() => handleNotifyReady(selectedTicketModal.orderId)}
                    className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer"
                  >
                    <BellRing className="w-4 h-4 animate-bounce" />
                    <span>Rung thẻ #{selectedTicketModal.pagerCode}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Recipe Modal */}
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