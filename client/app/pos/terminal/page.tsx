"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Coffee,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Banknote,
  QrCode,
  ArrowLeft,
  Utensils,
  ShoppingBag,
  Sparkles,
  CupSoda,
  Cake,
  Flame,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  imageColor: string;
}

interface CartItem {
  product: Product;
  quantity: number;
  note?: string;
}

const CATEGORIES = [
  { id: "all", name: "Tất cả", icon: Sparkles },
  { id: "coffee_phin", name: "Cà phê phin", icon: Coffee },
  { id: "coffee_machine", name: "Cà phê máy", icon: Flame },
  { id: "tea", name: "Trà trái cây", icon: CupSoda },
  { id: "cake", name: "Bánh ngọt", icon: Cake },
];

const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Cà phê đen đá",
    category: "coffee_phin",
    price: 25000,
    imageColor: "bg-amber-100 text-amber-900",
  },
  {
    id: "p2",
    name: "Cà phê sữa đá",
    category: "coffee_phin",
    price: 29000,
    imageColor: "bg-[#F5EBE6] text-[#6F4E37]",
  },
  {
    id: "p3",
    name: "Bạc xỉu 3 tầng",
    category: "coffee_phin",
    price: 32000,
    imageColor: "bg-orange-100 text-orange-800",
  },
  {
    id: "p4",
    name: "Espresso Single",
    category: "coffee_machine",
    price: 30000,
    imageColor: "bg-stone-200 text-stone-800",
  },
  {
    id: "p5",
    name: "Cappuccino nóng",
    category: "coffee_machine",
    price: 42000,
    imageColor: "bg-amber-50 text-amber-800",
  },
  {
    id: "p6",
    name: "Caramel Macchiato",
    category: "coffee_machine",
    price: 45000,
    imageColor: "bg-yellow-100 text-yellow-800",
  },
  {
    id: "p7",
    name: "Trà đào cam sả",
    category: "tea",
    price: 35000,
    imageColor: "bg-emerald-100 text-emerald-800",
  },
  {
    id: "p8",
    name: "Trà vải hoa hồng",
    category: "tea",
    price: 38000,
    imageColor: "bg-rose-100 text-rose-800",
  },
  {
    id: "p9",
    name: "Trà sen vàng",
    category: "tea",
    price: 39000,
    imageColor: "bg-teal-100 text-teal-800",
  },
  {
    id: "p10",
    name: "Bánh Tiramisu",
    category: "cake",
    price: 45000,
    imageColor: "bg-stone-100 text-stone-700",
  },
  {
    id: "p11",
    name: "Croissant bơ Pháp",
    category: "cake",
    price: 32000,
    imageColor: "bg-amber-100 text-amber-700",
  },
  {
    id: "p12",
    name: "Cheesecake chanh dây",
    category: "cake",
    price: 42000,
    imageColor: "bg-yellow-100 text-yellow-700",
  },
];

export default function POSTerminalPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [orderType, setOrderType] = useState<"dine_in" | "take_away">("dine_in");
  const [selectedTable, setSelectedTable] = useState("Bàn 04");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "qr">("cash");

  // Giỏ hàng mẫu ban đầu
  const [cart, setCart] = useState<CartItem[]>([
    { product: MOCK_PRODUCTS[1], quantity: 2, note: "Ít ngọt, nhiều đá" },
    { product: MOCK_PRODUCTS[6], quantity: 1, note: "" },
    { product: MOCK_PRODUCTS[9], quantity: 1, note: "" },
  ]);

  // Lọc sản phẩm
  const filteredProducts = MOCK_PRODUCTS.filter((item) => {
    const matchCat =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  // Thêm vào giỏ
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  // Cập nhật số lượng
  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  // Xóa món khỏi giỏ
  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Tính toán chi phí
  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const discount = 0;
  const tax = Math.round(subtotal * 0.08); // VAT 8%
  const total = subtotal - discount + tax;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-white text-gray-800 antialiased font-sans">
      {/* ========================================================
          CỘT 1: DANH MỤC & TÌM KIẾM (w-64)
          ======================================================== */}
      <aside className="w-64 h-full bg-white border-r border-gray-100 flex flex-col shrink-0">
        {/* Top Header Logo */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#F5EBE6] text-[#6F4E37] flex items-center justify-center font-bold">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-gray-900 text-base leading-none block">
                DineDesk
              </span>
              <span className="text-[11px] text-[#6F4E37] font-semibold">
                POS Terminal
              </span>
            </div>
          </div>

          <Link
            href="/dashboard"
            title="Về Trang quản trị"
            className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        {/* Ô tìm kiếm món */}
        <div className="p-3 border-b border-gray-100">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm món..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50/50 placeholder:text-gray-400 text-gray-900 transition-colors focus:outline-none focus:bg-white focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
            />
          </div>
        </div>

        {/* Danh sách danh mục */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
            Danh mục món
          </p>
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#6F4E37] text-white shadow-sm"
                    : "text-gray-600 hover:bg-[#F5EBE6] hover:text-[#6F4E37]"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? "text-white" : "text-gray-400"
                  }`}
                />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Footer nhân viên thu ngân */}
        <div className="p-3 border-t border-gray-100 bg-gray-50/50 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#6F4E37] text-white text-xs font-bold flex items-center justify-center">
            NV
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-semibold text-gray-800 truncate">
              Nguyễn Thu Ngân
            </p>
            <p className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              Ca sáng • Online
            </p>
          </div>
        </div>
      </aside>

      {/* ========================================================
          CỘT 2: KHU VỰC LƯỚI SẢN PHẨM (flex-1)
          ======================================================== */}
      <main className="flex-1 h-full bg-[#F8FAFC] flex flex-col overflow-hidden">
        {/* Header Cột 2: Chọn hình thức phục vụ & Thống kê */}
        <header className="h-16 px-6 bg-white border-b border-gray-100 flex items-center justify-between shrink-0">
          {/* Nút chọn loại phục vụ */}
          <div className="flex items-center gap-2 bg-gray-100/80 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setOrderType("dine_in")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                orderType === "dine_in"
                  ? "bg-white text-[#6F4E37] shadow-xs"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Dùng tại quán</span>
            </button>
            <button
              type="button"
              onClick={() => setOrderType("take_away")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                orderType === "take_away"
                  ? "bg-white text-[#6F4E37] shadow-xs"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Mang đi</span>
            </button>
          </div>

          <div className="text-xs text-gray-500">
            Hiển thị{" "}
            <span className="font-semibold text-gray-800">
              {filteredProducts.length}
            </span>{" "}
            sản phẩm
          </div>
        </header>

        {/* Lưới sản phẩm (Grid Card) */}
        <div className="flex-1 overflow-y-auto p-5">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="bg-white rounded-2xl border border-gray-100 hover:border-[#6F4E37]/30 hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden flex flex-col group active:scale-[0.98]"
                >
                  {/* Khung ảnh sản phẩm */}
                  <div
                    className={`h-28 flex items-center justify-center transition-transform group-hover:scale-105 duration-200 ${product.imageColor}`}
                  >
                    <Coffee className="w-9 h-9 opacity-80" strokeWidth={1.8} />
                  </div>

                  {/* Chi tiết sản phẩm */}
                  <div className="p-3.5 flex flex-col justify-between flex-1 gap-2">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-1 group-hover:text-[#6F4E37] transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-xs font-bold text-gray-700 mt-1">
                        {formatCurrency(product.price)}
                      </p>
                    </div>

                    <div className="flex items-center justify-end pt-1">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#6F4E37] bg-[#F5EBE6] group-hover:bg-[#6F4E37] group-hover:text-white px-2.5 py-1 rounded-lg transition-colors">
                        <Plus className="w-3 h-3" strokeWidth={2.5} />
                        Thêm
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-gray-400">
              <Coffee className="w-12 h-12 mb-3 stroke-1 text-gray-300" />
              <p className="text-sm font-medium">Không tìm thấy món phù hợp</p>
              <p className="text-xs text-gray-400 mt-1">
                Thử tìm với từ khóa khác hoặc chọn lại danh mục
              </p>
            </div>
          )}
        </div>
      </main>

      {/* ========================================================
          CỘT 3: GIỎ HÀNG & THANH TOÁN (w-[400px])
          ======================================================== */}
      <aside className="w-[400px] h-full bg-white flex flex-col shrink-0 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] border-l border-gray-100 z-10">
        {/* Header Giỏ hàng */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-base">
              Đơn hàng hiện tại
            </h3>
            <span className="text-xs text-gray-400">
              {cart.reduce((total, i) => total + i.quantity, 0)} món được chọn
            </span>
          </div>

          {/* Chọn bàn */}
          <div className="flex items-center gap-1.5">
            <select
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              className="text-xs font-semibold bg-[#F5EBE6] text-[#6F4E37] px-2.5 py-1.5 rounded-lg border-0 focus:ring-2 focus:ring-[#6F4E37] cursor-pointer"
            >
              <option value="Bàn 01">Bàn 01</option>
              <option value="Bàn 02">Bàn 02</option>
              <option value="Bàn 03">Bàn 03</option>
              <option value="Bàn 04">Bàn 04</option>
              <option value="Bàn 05">Bàn 05</option>
              <option value="Mang về">Mang về</option>
            </select>
          </div>
        </div>

        {/* Danh sách món trong giỏ (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-gray-50">
          {cart.length > 0 ? (
            cart.map((item) => (
              <div key={item.product.id} className="pt-3 first:pt-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h5 className="text-sm font-semibold text-gray-900">
                      {item.product.name}
                    </h5>
                    <p className="text-xs font-medium text-[#6F4E37]">
                      {formatCurrency(item.product.price)}
                    </p>
                    {item.note && (
                      <span className="inline-block text-[11px] text-gray-400 italic mt-0.5">
                        {item.note}
                      </span>
                    )}
                  </div>

                  {/* Bộ đếm số lượng & Xóa */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50/50 p-0.5">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, -1)}
                        className="w-6 h-6 flex items-center justify-center rounded text-gray-600 hover:bg-white hover:text-gray-900 transition-colors cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center text-xs font-bold text-gray-800">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, 1)}
                        className="w-6 h-6 flex items-center justify-center rounded text-gray-600 hover:bg-white hover:text-gray-900 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Xóa món"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400">
              <ShoppingBag className="w-10 h-10 mb-2 stroke-1 text-gray-300" />
              <p className="text-xs font-medium">Chưa có món nào trong đơn</p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Nhấn chọn món từ menu bên cạnh
              </p>
            </div>
          )}
        </div>

        {/* Tóm tắt chi phí & Thanh toán (Cố định dưới đáy) */}
        <div className="p-4 border-t border-gray-100 bg-white space-y-3.5">
          {/* Bảng kê chi phí */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-gray-500">
              <span>Tạm tính</span>
              <span className="font-semibold text-gray-800">
                {formatCurrency(subtotal)}
              </span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Giảm giá</span>
              <span className="font-semibold text-gray-800">
                {formatCurrency(discount)}
              </span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Thuế (VAT 8%)</span>
              <span className="font-semibold text-gray-800">
                {formatCurrency(tax)}
              </span>
            </div>
            <div className="pt-2 border-t border-gray-100 flex justify-between items-baseline">
              <span className="font-bold text-gray-900 text-sm">Tổng tiền</span>
              <span className="font-extrabold text-xl text-[#6F4E37]">
                {formatCurrency(total)}
              </span>
            </div>
          </div>

          {/* 3 Nút Phương thức thanh toán */}
          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Hình thức thanh toán
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod("cash")}
                className={`py-2 px-1 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                  paymentMethod === "cash"
                    ? "border-[#6F4E37] bg-[#F5EBE6] text-[#6F4E37]"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Banknote className="w-4 h-4" />
                <span>Tiền mặt</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`py-2 px-1 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                  paymentMethod === "card"
                    ? "border-[#6F4E37] bg-[#F5EBE6] text-[#6F4E37]"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Thẻ</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("qr")}
                className={`py-2 px-1 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                  paymentMethod === "qr"
                    ? "border-[#6F4E37] bg-[#F5EBE6] text-[#6F4E37]"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>Chuyển khoản</span>
              </button>
            </div>
          </div>

          {/* Nút Submit Thanh toán */}
          <button
            type="button"
            disabled={cart.length === 0}
            className="w-full py-3.5 px-4 rounded-xl bg-[#6F4E37] hover:bg-[#5A3F2C] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-sm shadow-md transition-all duration-200 cursor-pointer active:scale-[0.99]"
          >
            Thanh toán • {formatCurrency(total)}
          </button>
        </div>
      </aside>
    </div>
  );
}
