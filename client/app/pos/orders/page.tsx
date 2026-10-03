"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Eye,
  Printer,
  XCircle,
  Clock,
  ArrowLeft,
  User,
  CreditCard,
  Banknote,
  QrCode,
  X,
  AlertTriangle,
  RotateCcw,
  Utensils,
  ShoppingBag,
  BellRing,
  CheckCircle2,
} from "lucide-react";

type OrderStatus = "PENDING_PREP" | "READY_FOR_PICKUP" | "COMPLETED" | "CANCELLED";
type PaymentMethod = "CASH" | "CARD" | "QR_CODE";

interface OrderItemDetail {
  id: string;
  name: string;
  size: "M" | "L";
  quantity: number;
  price: number;
  toppings?: string[];
  note?: string;
  itemStatus: "WAITING" | "COOKING" | "READY";
}

interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  customerPhone?: string;
  cashierName: string;
  buzzerNumber: string;
  orderType: "DINE_IN" | "TAKE_AWAY";
  paymentMethod: PaymentMethod;
  paymentStatus: "PAID" | "UNPAID";
  status: OrderStatus;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  cancelReason?: string;
  items: OrderItemDetail[];
}

const MOCK_ORDERS: Order[] = [
  {
    id: "ord-001",
    orderNumber: "#ORD-2026-001",
    createdAt: "20:15 - 02/10/2026",
    customerName: "Nguyễn Văn An",
    customerPhone: "0901 234 567",
    cashierName: "Nguyễn Thu Ngân",
    buzzerNumber: "Thẻ rung #04",
    orderType: "DINE_IN",
    paymentMethod: "QR_CODE",
    paymentStatus: "PAID",
    status: "PENDING_PREP",
    subtotal: 78000,
    discount: 0,
    tax: 6240,
    total: 84240,
    items: [
      {
        id: "it-1",
        name: "Cà phê sữa đá",
        size: "L",
        quantity: 2,
        price: 34000,
        toppings: ["Trân châu hoàng kim (+10k)"],
        note: "Ít ngọt, nhiều đá",
        itemStatus: "COOKING",
      },
      {
        id: "it-2",
        name: "Bánh Tiramisu Espresso",
        size: "M",
        quantity: 1,
        price: 45000,
        itemStatus: "READY",
      },
    ],
  },
  {
    id: "ord-002",
    orderNumber: "#ORD-2026-002",
    createdAt: "19:42 - 02/10/2026",
    customerName: "Trần Thị Mai",
    customerPhone: "0912 345 678",
    cashierName: "Nguyễn Thu Ngân",
    buzzerNumber: "Thẻ rung #12",
    orderType: "TAKE_AWAY",
    paymentMethod: "CASH",
    paymentStatus: "PAID",
    status: "READY_FOR_PICKUP",
    subtotal: 109000,
    discount: 10000,
    tax: 7920,
    total: 106920,
    items: [
      {
        id: "it-3",
        name: "Trà đào cam sả",
        size: "L",
        quantity: 2,
        price: 39000,
        toppings: ["Thạch đào giòn (+10k)"],
        note: "70% đường, 100% đá",
        itemStatus: "READY",
      },
      {
        id: "it-4",
        name: "Trà sen vàng macchiato",
        size: "M",
        quantity: 1,
        price: 41000,
        toppings: ["Kem Cheese Macchiato (+12k)"],
        itemStatus: "READY",
      },
    ],
  },
  {
    id: "ord-003",
    orderNumber: "#ORD-2026-003",
    createdAt: "18:30 - 02/10/2026",
    customerName: "Khách vãng lai",
    cashierName: "Lê Quốc Bảo",
    buzzerNumber: "Bàn 02",
    orderType: "DINE_IN",
    paymentMethod: "CARD",
    paymentStatus: "PAID",
    status: "COMPLETED",
    subtotal: 125000,
    discount: 0,
    tax: 10000,
    total: 135000,
    items: [
      {
        id: "it-5",
        name: "Cappuccino nóng",
        size: "M",
        quantity: 2,
        price: 42000,
        note: "Latte Art hình hoa hồng",
        itemStatus: "READY",
      },
      {
        id: "it-6",
        name: "Croissant bơ Pháp",
        size: "M",
        quantity: 1,
        price: 32000,
        note: "Làm nóng bánh",
        itemStatus: "READY",
      },
    ],
  },
  {
    id: "ord-004",
    orderNumber: "#ORD-2026-004",
    createdAt: "17:15 - 02/10/2026",
    customerName: "Phạm Thùy Linh",
    customerPhone: "0977 123 456",
    cashierName: "Lê Quốc Bảo",
    buzzerNumber: "Mang về #08",
    orderType: "TAKE_AWAY",
    paymentMethod: "QR_CODE",
    paymentStatus: "UNPAID",
    status: "CANCELLED",
    cancelReason: "Khách có việc gấp không chờ lấy món được",
    subtotal: 64000,
    discount: 0,
    tax: 5120,
    total: 69120,
    items: [
      {
        id: "it-7",
        name: "Bạc xỉu 3 tầng",
        size: "M",
        quantity: 2,
        price: 32000,
        itemStatus: "WAITING",
      },
    ],
  },
];

export default function POSOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Modals & Drawer state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [cancellingOrder, setCancellingOrder] = useState<Order | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [printingOrder, setPrintingOrder] = useState<Order | null>(null);

  // Lọc đơn hàng
  const filteredOrders = orders.filter((ord) => {
    const matchSearch =
      ord.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ord.customerPhone && ord.customerPhone.includes(searchQuery)) ||
      ord.buzzerNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchStatus = statusFilter === "ALL" || ord.status === statusFilter;
    const matchPayment = paymentFilter === "ALL" || ord.paymentMethod === paymentFilter;

    return matchSearch && matchStatus && matchPayment;
  });

  const handleResetFilter = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
    setPaymentFilter("ALL");
    setFromDate("");
    setToDate("");
  };

  const handleOpenDetail = (order: Order) => {
    setSelectedOrder(order);
    setIsDrawerOpen(true);
  };

  const handleOpenCancel = (order: Order) => {
    setCancellingOrder(order);
    setCancelReason("");
  };

  const handleConfirmCancel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancellingOrder) return;
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === cancellingOrder.id
          ? {
              ...ord,
              status: "CANCELLED",
              cancelReason: cancelReason || "Hủy theo yêu cầu của khách",
            }
          : ord
      )
    );
    setCancellingOrder(null);
  };

  const handlePayOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId ? { ...ord, paymentStatus: "PAID" } : ord
      )
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, paymentStatus: "PAID" });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "PENDING_PREP":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Chờ pha chế
          </span>
        );
      case "READY_FOR_PICKUP":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80">
            <BellRing className="w-3.5 h-3.5" />
            Chờ nhận món
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Hoàn thành
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80">
            <XCircle className="w-3.5 h-3.5" />
            Đã hủy
          </span>
        );
    }
  };

  const getPaymentMethodBadge = (method: PaymentMethod) => {
    switch (method) {
      case "CASH":
        return (
          <span className="inline-flex items-center gap-1 text-xs text-gray-700 font-medium">
            <Banknote className="w-3.5 h-3.5 text-emerald-600" />
            Tiền mặt
          </span>
        );
      case "CARD":
        return (
          <span className="inline-flex items-center gap-1 text-xs text-gray-700 font-medium">
            <CreditCard className="w-3.5 h-3.5 text-blue-600" />
            Quẹt thẻ
          </span>
        );
      case "QR_CODE":
        return (
          <span className="inline-flex items-center gap-1 text-xs text-gray-700 font-medium">
            <QrCode className="w-3.5 h-3.5 text-[#6F4E37]" />
            Chuyển khoản QR
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-gray-800 font-sans antialiased pb-12">
      {/* 1. HEADER THANH ĐIỀU HƯỚNG */}
      <header className="bg-white border-b border-gray-200/80 px-6 py-4 sticky top-0 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/pos/terminal"
              className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              title="Quay lại POS Terminal"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Lịch sử hóa đơn & Đơn hàng
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Tra cứu chi tiết hóa đơn, trạng thái pha chế và in lại hóa đơn POS
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/pos/terminal"
              className="px-4 py-2 rounded-xl bg-[#6F4E37] hover:bg-[#5A3F2C] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Vào màn hình Bán hàng (POS)
            </Link>
          </div>
        </div>
      </header>

      {/* 2. BỘ LỌC CÔNG CỤ (Toolbar Filter) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-5">
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo mã #ORD, tên khách, SĐT, thẻ rung..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 transition-colors focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-3 pr-7 py-2 text-xs font-medium rounded-xl border border-gray-200 bg-white text-gray-700 transition-colors focus:outline-none focus:border-[#6F4E37] cursor-pointer"
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value="PENDING_PREP">Chờ pha chế</option>
                <option value="READY_FOR_PICKUP">Chờ nhận món</option>
                <option value="COMPLETED">Hoàn thành</option>
                <option value="CANCELLED">Đã hủy</option>
              </select>
            </div>

            <div className="relative">
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="pl-3 pr-7 py-2 text-xs font-medium rounded-xl border border-gray-200 bg-white text-gray-700 transition-colors focus:outline-none focus:border-[#6F4E37] cursor-pointer"
              >
                <option value="ALL">Tất cả thanh toán</option>
                <option value="CASH">Tiền mặt</option>
                <option value="CARD">Thẻ ngân hàng</option>
                <option value="QR_CODE">Chuyển khoản QR</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="px-2.5 py-1.5 text-xs rounded-xl border border-gray-200 bg-white text-gray-700 focus:outline-none focus:border-[#6F4E37]"
                title="Từ ngày"
              />
              <span>-</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="px-2.5 py-1.5 text-xs rounded-xl border border-gray-200 bg-white text-gray-700 focus:outline-none focus:border-[#6F4E37]"
                title="Đến ngày"
              />
            </div>

            <button
              type="button"
              onClick={handleResetFilter}
              className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-colors cursor-pointer"
              title="Đặt lại bộ lọc"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3. BẢNG DỮ LIỆU ĐƠN HÀNG (Data Table) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  <th scope="col" className="py-3.5 px-5">
                    Mã HĐ & Ngày tạo
                  </th>
                  <th scope="col" className="py-3.5 px-5">
                    Khách hàng
                  </th>
                  <th scope="col" className="py-3.5 px-5">
                    Thẻ rung / Bàn
                  </th>
                  <th scope="col" className="py-3.5 px-5">
                    Thu ngân
                  </th>
                  <th scope="col" className="py-3.5 px-5">
                    Thanh toán
                  </th>
                  <th scope="col" className="py-3.5 px-5">
                    Tổng tiền
                  </th>
                  <th scope="col" className="py-3.5 px-5">
                    Trạng thái
                  </th>
                  <th scope="col" className="py-3.5 px-5 text-right">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50/60 transition-colors group"
                    >
                      <td className="py-3.5 px-5">
                        <span className="font-bold text-gray-900 group-hover:text-[#6F4E37] transition-colors block">
                          {order.orderNumber}
                        </span>
                        <span className="text-xs text-gray-400 font-mono flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {order.createdAt}
                        </span>
                      </td>

                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#F5EBE6] text-[#6F4E37] text-xs font-bold flex items-center justify-center shrink-0">
                            <User className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="font-semibold text-gray-800 text-xs block">
                              {order.customerName}
                            </span>
                            {order.customerPhone && (
                              <span className="text-[11px] text-gray-400 font-mono">
                                {order.customerPhone}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 text-gray-800 text-xs font-semibold">
                          {order.orderType === "DINE_IN" ? (
                            <Utensils className="w-3 h-3 text-[#6F4E37]" />
                          ) : (
                            <ShoppingBag className="w-3 h-3 text-[#6F4E37]" />
                          )}
                          {order.buzzerNumber}
                        </span>
                      </td>

                      <td className="py-3.5 px-5 text-xs text-gray-600 font-medium">
                        {order.cashierName}
                      </td>

                      <td className="py-3.5 px-5">
                        {getPaymentMethodBadge(order.paymentMethod)}
                      </td>

                      <td className="py-3.5 px-5 font-bold text-[#6F4E37]">
                        {formatCurrency(order.total)}
                      </td>

                      <td className="py-3.5 px-5">
                        {getStatusBadge(order.status)}
                      </td>

                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenDetail(order)}
                            className="p-1.5 rounded-lg text-gray-600 hover:text-[#6F4E37] hover:bg-[#F5EBE6] transition-colors cursor-pointer"
                            title="Xem chi tiết đơn"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setPrintingOrder(order)}
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                            title="In hóa đơn K80"
                          >
                            <Printer className="w-4 h-4" />
                          </button>

                          {order.status !== "CANCELLED" && (
                            <button
                              type="button"
                              onClick={() => handleOpenCancel(order)}
                              className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Hủy đơn hàng"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-12 text-center text-gray-400 text-sm"
                    >
                      Không tìm thấy đơn hàng nào phù hợp với bộ lọc.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 bg-white">
            <p>
              Hiển thị{" "}
              <span className="font-semibold text-gray-800">
                {filteredOrders.length}
              </span>{" "}
              trên tổng số{" "}
              <span className="font-semibold text-gray-800">
                {orders.length}
              </span>{" "}
              đơn hàng
            </p>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-400 text-xs font-medium opacity-50 cursor-not-allowed"
              >
                Trước
              </button>
              <button
                type="button"
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-medium cursor-pointer"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* 4. ORDER DETAIL DRAWER */}
      {isDrawerOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-xs transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />

          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-[#FAF6F0]/50">
              <div>
                <span className="text-xs font-mono text-gray-400">Chi tiết đơn hàng</span>
                <h3 className="text-lg font-bold text-gray-900">
                  {selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 rounded-xl hover:bg-gray-200/60 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Thời gian tạo:</span>
                  <span className="font-semibold text-gray-800">{selectedOrder.createdAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Khách hàng:</span>
                  <span className="font-semibold text-gray-800">
                    {selectedOrder.customerName} {selectedOrder.customerPhone ? `(${selectedOrder.customerPhone})` : ""}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Vị trí / Thẻ rung:</span>
                  <span className="font-semibold text-gray-800">{selectedOrder.buzzerNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Thu ngân phụ trách:</span>
                  <span className="font-semibold text-gray-800">{selectedOrder.cashierName}</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-gray-200/60">
                  <span className="text-gray-400">Trạng thái:</span>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                {selectedOrder.cancelReason && (
                  <div className="p-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                    <strong>Lý do hủy:</strong> {selectedOrder.cancelReason}
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                  Danh sách món ({selectedOrder.items.length})
                </h4>
                <div className="space-y-2.5 divide-y divide-gray-100">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="pt-2.5 first:pt-0 space-y-1">
                      <div className="flex justify-between items-start text-xs">
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 rounded-md bg-[#6F4E37] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                            {item.quantity}
                          </span>
                          <div>
                            <p className="font-bold text-gray-900">
                              {item.name} <span className="text-gray-400 font-normal">({item.size})</span>
                            </p>
                            {item.toppings && item.toppings.length > 0 && (
                              <p className="text-[11px] text-[#6F4E37] font-medium">
                                + {item.toppings.join(", ")}
                              </p>
                            )}
                            {item.note && (
                              <p className="text-[11px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded inline-block mt-0.5">
                                💬 {item.note}
                              </p>
                            )}
                          </div>
                        </div>
                        <span className="font-semibold text-gray-800">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-2xs space-y-2 text-xs">
                <div className="flex justify-between text-gray-500">
                  <span>Tạm tính</span>
                  <span className="font-medium text-gray-800">{formatCurrency(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Giảm giá</span>
                  <span className="font-medium text-gray-800">{formatCurrency(selectedOrder.discount)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Thuế VAT (8%)</span>
                  <span className="font-medium text-gray-800">{formatCurrency(selectedOrder.tax)}</span>
                </div>
                <div className="pt-2 border-t border-gray-100 flex justify-between items-baseline">
                  <span className="font-bold text-gray-900 text-sm">Tổng cộng</span>
                  <span className="font-extrabold text-lg text-[#6F4E37]">
                    {formatCurrency(selectedOrder.total)}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-white flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setPrintingOrder(selectedOrder);
                }}
                className="flex-1 py-2.5 px-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4 text-gray-500" />
                <span>In hóa đơn</span>
              </button>

              {selectedOrder.paymentStatus === "UNPAID" && selectedOrder.status !== "CANCELLED" && (
                <button
                  type="button"
                  onClick={() => handlePayOrder(selectedOrder.id)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Hoàn tất thanh toán</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. CANCEL ORDER MODAL */}
      {cancellingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Hủy đơn hàng {cancellingOrder.orderNumber}
                </h3>
                <p className="text-xs text-gray-500">
                  Thao tác này sẽ hoàn trả nguyên liệu vào kho
                </p>
              </div>
            </div>

            <form onSubmit={handleConfirmCancel} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700">
                  Lý do hủy đơn <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Nhập lý do hủy (VD: Khách đổi ý, Hết nguyên liệu, Nhập sai đơn...)"
                  className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCancellingOrder(null)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-50 cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  Xác nhận hủy đơn
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. INVOICE PRINT MODAL */}
      {printingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-200 flex flex-col space-y-4 max-h-[90vh]">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Xem trước Hóa đơn K80
              </span>
              <button
                type="button"
                onClick={() => setPrintingOrder(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-gray-50/80 rounded-xl border border-dashed border-gray-300 font-mono text-[11px] text-gray-800 space-y-3 overflow-y-auto flex-1">
              <div className="text-center space-y-0.5 border-b border-dashed border-gray-300 pb-3">
                <h4 className="font-extrabold text-sm text-gray-900 tracking-wider">
                  DINEDESK COFFEE
                </h4>
                <p className="text-[10px] text-gray-500">123 Đường Cà Phê, Quận 1, TP.HCM</p>
                <p className="text-[10px] text-gray-500">Hotline: 1900 6868 • WiFi: d製品desk</p>
              </div>

              <div className="space-y-1 border-b border-dashed border-gray-300 pb-2.5">
                <div className="flex justify-between">
                  <span>Hóa đơn:</span>
                  <span className="font-bold">{printingOrder.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Thời gian:</span>
                  <span>{printingOrder.createdAt}</span>
                </div>
                <div className="flex justify-between">
                  <span>Thu ngân:</span>
                  <span>{printingOrder.cashierName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Vị trí:</span>
                  <span className="font-bold">{printingOrder.buzzerNumber}</span>
                </div>
              </div>

              <div className="space-y-1.5 border-b border-dashed border-gray-300 pb-3">
                <div className="flex justify-between font-bold text-[10px] uppercase text-gray-400">
                  <span>Món</span>
                  <span>T.Tiền</span>
                </div>
                {printingOrder.items.map((it) => (
                  <div key={it.id} className="space-y-0.5">
                    <div className="flex justify-between">
                      <span className="font-semibold">
                        {it.quantity}x {it.name} ({it.size})
                      </span>
                      <span>{formatCurrency(it.price * it.quantity)}</span>
                    </div>
                    {it.toppings && (
                      <p className="text-[10px] text-gray-500 pl-3">
                        + {it.toppings.join(", ")}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-1 pt-1 border-b border-dashed border-gray-300 pb-3">
                <div className="flex justify-between">
                  <span>Tạm tính:</span>
                  <span>{formatCurrency(printingOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Giảm giá:</span>
                  <span>-{formatCurrency(printingOrder.discount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>VAT (8%):</span>
                  <span>{formatCurrency(printingOrder.tax)}</span>
                </div>
                <div className="flex justify-between font-extrabold text-xs text-gray-900 pt-1">
                  <span>TỔNG TIỀN:</span>
                  <span>{formatCurrency(printingOrder.total)}</span>
                </div>
              </div>

              <div className="text-center pt-2 space-y-1">
                <p className="font-bold text-[10px]">CẢMƠN QUÝ KHÁCH & HẸN GẶP LẠI!</p>
                <p className="text-[9px] text-gray-400">Powered by DineDesk POS</p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPrintingOrder(null)}
                className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-50 cursor-pointer"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => {
                  alert("Đã gửi lệnh in đến máy in nhiệt K80 thành công!");
                  setPrintingOrder(null);
                }}
                className="flex-1 py-2 rounded-xl bg-[#6F4E37] hover:bg-[#5A3F2C] text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>In ngay</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
