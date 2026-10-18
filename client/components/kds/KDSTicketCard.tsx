import React from 'react';
import { Clock, Utensils, ShoppingBag, BellRing, CheckCheck, Play, BookOpen } from 'lucide-react';
import { KdsQueueItem } from '@/types/kds';

interface KDSTicketCardProps {
  item: KdsQueueItem;
  onUpdateStatus: (orderDetailId: number, status: 'PREPARING' | 'DONE' | 'CANCELLED') => Promise<void>;
  onNotifyReady?: (orderId: number) => Promise<void>;
  onViewRecipe?: (productName: string) => void;
  loadingId?: number | null;
}

export const KDSTicketCard: React.FC<KDSTicketCardProps> = ({
  item,
  onUpdateStatus,
  onNotifyReady,
  onViewRecipe,
  loadingId,
}) => {
  const isLoading = loadingId === item.orderDetailId;
  const isUrgent = item.waitingMinutes >= 10 && item.itemStatus !== 'DONE';

  return (
    <div
      className={`bg-white rounded-2xl border flex flex-col justify-between overflow-hidden shadow-sm transition-all duration-200 ${
        item.itemStatus === 'PREPARING'
          ? 'border-blue-400 ring-2 ring-blue-400/20'
          : item.itemStatus === 'DONE'
          ? 'border-emerald-300 opacity-80'
          : isUrgent
          ? 'border-rose-400 ring-2 ring-rose-400/20'
          : 'border-[#F0E6DD]'
      }`}
    >
      {/* Ticket Header */}
      <div className="p-4 border-b border-gray-100 bg-[#FAF6F0]/40 flex items-center justify-between gap-3 min-h-[72px]">
  <div className="flex-1 min-w-0">
    <div className="flex items-center gap-2 flex-wrap">
      <span className="font-mono font-bold text-base text-gray-900 tracking-tight">
        #{item.orderCode || item.orderId}
      </span>
      {item.pagerCode ? (
        <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-200">
          Thẻ #{item.pagerCode}
        </span>
      ) : (
        <span className="text-[11px] font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">
          Không thẻ
        </span>
      )}
    </div>

    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
      <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
      <span>{item.itemCreatedAt ? new Date(item.itemCreatedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : ''}</span>
      <span>•</span>
      <span className={`font-semibold ${isUrgent ? 'text-rose-600' : 'text-gray-600'}`}>
        {item.waitingMinutes} phút trước
      </span>
    </div>
  </div>

  {/* Order Channel Badge luôn cố định bên phải */}
  <div className="shrink-0 self-start">
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
        item.orderChannel === 'ONLINE' || item.orderChannel === 'DELIVERY'
          ? 'bg-blue-50 text-blue-700 border border-blue-200'
          : 'bg-[#F5EBE6] text-[#6F4E37] border border-[#EADBCC]'
      }`}
    >
      {item.orderChannel === 'ONLINE' || item.orderChannel === 'DELIVERY' ? (
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
  </div>
</div>

      {/* Ticket Body: Item Info */}
      <div className="p-4 space-y-3 flex-1 bg-white">
        <div className="p-3.5 rounded-xl bg-[#FAF6F0]/60 border border-gray-100 flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5 flex-1">
            <span className="w-7 h-7 rounded-xl bg-[#6F4E37] text-white text-sm font-bold flex items-center justify-center shrink-0 shadow-xs">
              {item.quantity}x
            </span>
            <div>
              <p className="font-bold text-base text-gray-900 leading-snug">
                {item.itemSnapshotName}{' '}
                {item.sizeSnapshot && (
                  <span className="text-xs text-gray-500 font-normal">({item.sizeSnapshot})</span>
                )}
              </p>

              {/* Toppings list */}
              {item.toppings && item.toppings.length > 0 && (
                <div className="mt-1.5 space-y-0.5">
                  {item.toppings.map((tp, idx) => (
                    <span
                      key={idx}
                      className="inline-block text-[11px] font-medium text-amber-900 bg-amber-50 border border-amber-200/70 rounded-md px-2 py-0.5 mr-1"
                    >
                      + {tp.name} (x{tp.quantity})
                    </span>
                  ))}
                </div>
              )}

              {/* Note */}
              {item.note && (
                <p className="text-xs font-medium text-amber-900 bg-amber-50 border border-amber-200/80 rounded-md px-2 py-1 mt-2 inline-block">
                  ⭐ Ghi chú: {item.note}
                </p>
              )}
            </div>
          </div>

          {/* Quick Recipe Button */}
          {onViewRecipe && (
            <button
              type="button"
              onClick={() => onViewRecipe(item.itemSnapshotName)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-[#6F4E37] hover:bg-[#F5EBE6] transition-colors cursor-pointer shrink-0"
              title="Xem công thức pha chế"
            >
              <BookOpen className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Ticket Footer Actions */}
      <div className="p-4 border-t border-gray-100 bg-white space-y-2">
        {item.itemStatus === 'PENDING' && (
          <button
            type="button"
            disabled={isLoading}
            onClick={() => onUpdateStatus(item.orderDetailId, 'PREPARING')}
            className="w-full py-3 px-4 rounded-xl bg-[#6F4E37] hover:bg-[#5A3F2C] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-[0.98] disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Bắt đầu pha chế</span>
          </button>
        )}

        {item.itemStatus === 'PREPARING' && (
          <div className="flex gap-2">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => onUpdateStatus(item.orderDetailId, 'DONE')}
              className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-[0.98] disabled:opacity-50"
            >
              <CheckCheck className="w-5 h-5" />
              <span>Hoàn tất món</span>
            </button>

            {item.pagerCode && onNotifyReady && (
              <button
                type="button"
                onClick={() => onNotifyReady(item.orderId)}
                className="py-3 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                title="Báo rung chuông Pager"
              >
                <BellRing className="w-4 h-4 text-amber-600 animate-bounce" />
                <span>Rung chuông</span>
              </button>
            )}
          </div>
        )}

        {item.itemStatus === 'DONE' && (
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <span className="flex items-center gap-1.5">
              <CheckCheck className="w-4 h-4 text-emerald-600" />
              Đã hoàn thành pha chế
            </span>
            {item.pagerCode && onNotifyReady && (
              <button
                type="button"
                onClick={() => onNotifyReady(item.orderId)}
                className="text-[11px] font-bold text-amber-800 bg-white px-2 py-1 rounded border border-amber-200 hover:bg-amber-50 cursor-pointer"
              >
                Rung Pager #{item.pagerCode}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default KDSTicketCard;
