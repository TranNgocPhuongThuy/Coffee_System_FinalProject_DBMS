"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChefHat,
  Clock,
  CheckCircle2,
  Play,
  ArrowLeft,
  Utensils,
  ShoppingBag,
  CheckCheck,
} from "lucide-react";

type OrderStatus = "pending" | "in_progress" | "completed";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  note?: string;
}

interface KDSOrder {
  id: string;
  orderNumber: string;
  table: string;
  orderType: "dine_in" | "take_away";
  createdAt: string;
  minutesAgo: number;
  status: OrderStatus;
  items: OrderItem[];
}

const INITIAL_ORDERS: KDSOrder[] = [
  {
    id: "ord-1",
    orderNumber: "#ORD-104",
    table: "Bàn 04",
    orderType: "dine_in",
    createdAt: "14:25",
    minutesAgo: 4,
    status: "pending",
    items: [
      { id: "i1", name: "Cà phê sữa đá", quantity: 2, note: "Ít đường, nhiều đá" },
      { id: "i2", name: "Bạc xỉu 3 tầng", quantity: 1, note: "Ít sữa đặc" },
      { id: "i3", name: "Bánh Tiramisu Espresso", quantity: 1 },
    ],
  },
  {
    id: "ord-2",
    orderNumber: "#ORD-105",
    table: "Mang về #12",
    orderType: "take_away",
    createdAt: "14:22",
    minutesAgo: 7,
    status: "in_progress",
    items: [
      { id: "i4", name: "Trà đào cam sả", quantity: 2, note: "70% đường, 100% đá" },
      { id: "i5", name: "Trà sen vàng macchiato", quantity: 1, note: "Thêm trân châu trắng" },
    ],
  },
  {
    id: "ord-3",
    orderNumber: "#ORD-106",
    table: "Bàn 02",
    orderType: "dine_in",
    createdAt: "14:18",
    minutesAgo: 11,
    status: "pending",
    items: [
      { id: "i6", name: "Cappuccino nóng", quantity: 1, note: "Tạo hình Latte Art" },
      { id: "i7", name: "Croissant bơ Pháp", quantity: 2, note: "Làm nóng bánh" },
    ],
  },
  {
    id: "ord-4",
    orderNumber: "#ORD-107",
    table: "Bàn 07",
    orderType: "dine_in",
    createdAt: "14:15",
    minutesAgo: 14,
    status: "in_progress",
    items: [
      { id: "i8", name: "Caramel Macchiato đá", quantity: 2 },
      { id: "i9", name: "Sinh tố xoài đá xay", quantity: 1, note: "Không lấy kem tươi" },
    ],
  },
  {
    id: "ord-5",
    orderNumber: "#ORD-103",
    table: "Bàn 01",
    orderType: "dine_in",
    createdAt: "14:05",
    minutesAgo: 24,
    status: "completed",
    items: [
      { id: "i10", name: "Cà phê đen đá", quantity: 2, note: "Đậm vị" },
      { id: "i11", name: "Trà vải hoa hồng", quantity: 1 },
    ],
  },
];

export default function KDSQueuePage() {
  const [orders, setOrders] = useState<KDSOrder[]>(INITIAL_ORDERS);
  const [activeTab, setActiveTab] = useState<"all" | OrderStatus>("all");
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const advanceOrderStatus = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        if (order.status === "pending") {
          return { ...order, status: "in_progress" };
        }
        if (order.status === "in_progress") {
          return { ...order, status: "completed" };
        }
        return order;
      })
    );
  };

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true;
    return order.status === activeTab;
  });

  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const inProgressCount = orders.filter((o) => o.status === "in_progress").length;
  const completedCount = orders.filter((o) => o.status === "completed").length;

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-gray-800 flex flex-col font-sans antialiased">
      {/* ========================================================
          1. HEADER KDS MÀN HÌNH BẾP (Light Cream Theme)
          ======================================================== */}
      <header className="bg-white border-b border-gray-200/80 px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sticky top-0 z-30 shadow-xs">
        {/* Left: Brand Logo & Clock */}
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
                Hàng đợi pha chế (KDS)
              </h1>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
                Hệ thống thời gian thực • Quầy Bar
              </p>
            </div>
          </div>

          {/* Clock Widget */}
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#FAF6F0] border border-[#F0E6DD] text-[#6F4E37] font-mono text-sm font-bold ml-3">
            <Clock className="w-4 h-4 text-[#6F4E37]/70" />
            <span>{currentTime || "14:30:00"}</span>
          </div>
        </div>

        {/* Right: Status Filters Horizontal Tabs */}
        <div className="flex items-center gap-1.5 bg-gray-100/80 p-1.5 rounded-2xl">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "all"
                ? "bg-[#6F4E37] text-white shadow-xs"
                : "text-gray-600 hover:text-gray-900 hover:bg-white"
            }`}
          >
            Tất cả ({orders.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("pending")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "pending"
                ? "bg-[#6F4E37] text-white shadow-xs"
                : "text-gray-600 hover:text-gray-900 hover:bg-white"
            }`}
          >
            <span>Chờ làm</span>
            {pendingCount > 0 && (
              <span
                className={`w-5 h-5 rounded-full text-[10px] font-extrabold flex items-center justify-center ${
                  activeTab === "pending"
                    ? "bg-[#F5EBE6] text-[#6F4E37]"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {pendingCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("in_progress")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "in_progress"
                ? "bg-[#6F4E37] text-white shadow-xs"
                : "text-gray-600 hover:text-gray-900 hover:bg-white"
            }`}
          >
            <span>Đang làm</span>
            {inProgressCount > 0 && (
              <span
                className={`w-5 h-5 rounded-full text-[10px] font-extrabold flex items-center justify-center ${
                  activeTab === "in_progress"
                    ? "bg-[#F5EBE6] text-[#6F4E37]"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {inProgressCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("completed")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "completed"
                ? "bg-[#6F4E37] text-white shadow-xs"
                : "text-gray-600 hover:text-gray-900 hover:bg-white"
            }`}
          >
            <span>Xong</span>
            {completedCount > 0 && (
              <span
                className={`w-5 h-5 rounded-full text-[10px] font-extrabold flex items-center justify-center ${
                  activeTab === "completed"
                    ? "bg-[#F5EBE6] text-[#6F4E37]"
                    : "bg-emerald-100 text-emerald-800"
                }`}
              >
                {completedCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ========================================================
          2. LƯỚI THẺ ORDER (Grid Card - White Card on Cream Background)
          ======================================================== */}
      <main className="flex-1 p-6 overflow-y-auto max-w-7xl w-full mx-auto">
        {filteredOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredOrders.map((order) => {
              const isUrgent = order.minutesAgo >= 10 && order.status !== "completed";

              return (
                <div
                  key={order.id}
                  className={`bg-white rounded-2xl border flex flex-col justify-between overflow-hidden shadow-sm transition-all duration-200 ${
                    order.status === "in_progress"
                      ? "border-blue-400 ring-2 ring-blue-400/20"
                      : order.status === "completed"
                      ? "border-emerald-300 opacity-90"
                      : isUrgent
                      ? "border-rose-400 ring-2 ring-rose-400/20"
                      : "border-[#F0E6DD]"
                  }`}
                >
                  {/* Header Thẻ Order */}
                  <div className="p-4 border-b border-gray-100 bg-[#FAF6F0]/40 flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg text-gray-900 tracking-tight">
                          {order.table}
                        </span>
                        <span className="text-xs font-mono text-gray-400 font-medium">
                          {order.orderNumber}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span>{order.createdAt}</span>
                        <span>•</span>
                        <span
                          className={`font-semibold ${
                            isUrgent ? "text-rose-600" : "text-gray-600"
                          }`}
                        >
                          {order.minutesAgo} phút trước
                        </span>
                      </div>
                    </div>

                    {/* Loại hình phục vụ */}
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        order.orderType === "dine_in"
                          ? "bg-[#F5EBE6] text-[#6F4E37]"
                          : "bg-amber-50 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {order.orderType === "dine_in" ? (
                        <>
                          <Utensils className="w-3 h-3" />
                          Tại quán
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3 h-3" />
                          Mang đi
                        </>
                      )}
                    </span>
                  </div>

                  {/* Thân Thẻ: Danh sách món */}
                  <div className="p-4 space-y-2.5 flex-1 overflow-y-auto bg-white">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl bg-gray-50/80 border border-gray-100 flex items-start justify-between gap-3"
                      >
                        <div className="flex items-start gap-2.5 flex-1">
                          <span className="w-6 h-6 rounded-lg bg-[#6F4E37] text-white text-xs font-bold flex items-center justify-center shrink-0">
                            {item.quantity}
                          </span>
                          <div>
                            <p className="font-semibold text-sm text-gray-900 leading-snug">
                              {item.name}
                            </p>
                            {item.note && (
                              <p className="text-xs font-medium text-amber-900 bg-amber-50 border border-amber-200/80 rounded-md px-2 py-0.5 mt-1 inline-block">
                                ⭐ {item.note}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer Thẻ: Nút chuyển trạng thái */}
                  <div className="p-4 border-t border-gray-100 bg-white">
                    {order.status === "pending" && (
                      <button
                        type="button"
                        onClick={() => advanceOrderStatus(order.id)}
                        className="w-full py-3 px-4 rounded-xl bg-[#6F4E37] hover:bg-[#5A3F2C] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-[0.98]"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        <span>Bắt đầu pha chế</span>
                      </button>
                    )}

                    {order.status === "in_progress" && (
                      <button
                        type="button"
                        onClick={() => advanceOrderStatus(order.id)}
                        className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-[0.98]"
                      >
                        <CheckCheck className="w-5 h-5" />
                        <span>Hoàn thành món</span>
                      </button>
                    )}

                    {order.status === "completed" && (
                      <div className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-700 font-semibold text-xs flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Đã giao bàn / Hoàn tất</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-96 flex flex-col items-center justify-center text-center p-8 text-gray-400">
            <ChefHat className="w-16 h-16 mb-3 stroke-1 text-gray-300" />
            <p className="text-base font-semibold text-gray-700">
              Không có đơn hàng nào trong mục này
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Đơn hàng mới từ quầy POS sẽ tự động xuất hiện tại đây
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
