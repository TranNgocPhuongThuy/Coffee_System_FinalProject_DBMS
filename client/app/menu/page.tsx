"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Coffee,
  ShoppingBag,
  Search,
  Plus,
  Minus,
  Trash2,
  X,
  Award,
  User,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Truck,
  MapPin,
  Phone,
  ChevronRight,
  LogOut,
  RefreshCw,
  CupSoda,
  Receipt,
  Check,
  Package,
  Store,
  LogIn,
} from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import { menuService } from "@/api/menu.service";
import { posService } from "@/api/pos.service";
import { Category, Product, Topping, ProductVariant } from "@/types/menu";
import { SafeProductImage } from "@/components/common/SafeProductImage";
import {
  useCustomerCart,
  CustomerCartItem,
  CustomerCartTopping,
} from "@/hooks/useCustomerCart";
import { loyaltyService } from "@/api";

export default function CustomerStorefrontPage() {
  const { user, logout, refreshUser } = useAuthContext();
  const router = useRouter();

  // Data states
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [toppings, setToppings] = useState<Topping[]>([]);
  const [loading, setLoading] = useState(true);

  // Active view tab: 'MENU' | 'MY_ORDERS'
  const [activeView, setActiveView] = useState<"MENU" | "MY_ORDERS">("MENU");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | "ALL">(
    "ALL",
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Cart & Order states
  const cart = useCustomerCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderSuccessData, setOrderSuccessData] = useState<any | null>(null);
  const [orderType, setOrderType] = useState<"DELIVERY" | "TAKE_AWAY">(
    "DELIVERY",
  );

  // State xem Profile & Điểm thưởng
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [pointsHistory, setPointsHistory] = useState<any[]>([]);
  const [loadingPointsHistory, setLoadingPointsHistory] = useState(false);

  // State đổi điểm trong giỏ hàng
  const [pointsToRedeem, setPointsToRedeem] = useState<number>(0);
  const conversionRate = 1000; // 1 điểm = 1.000đ

  // Tính số tiền giảm giá và tổng thanh toán COD
  const maxRedeemablePoints = Math.min(
    user?.rewardPoints || 0,
    Math.floor(cart.subTotal / conversionRate),
  );
  const discountAmount = Math.min(
    cart.subTotal,
    pointsToRedeem * conversionRate,
  );
  const finalTotalAmount = Math.max(0, cart.subTotal - discountAmount);

  // Xem lịch sử điểm khi mở Profile
  const handleOpenProfile = async () => {
    setIsProfileModalOpen(true);
    if (user?.id) {
      setLoadingPointsHistory(true);
      try {
        const res: any = await loyaltyService.getLoyaltyHistory({
          customerId: user.id,
          limit: 10,
        });
        setPointsHistory(res?.items || res?.data || []);
      } catch (err) {
        setPointsHistory([]);
      } finally {
        setLoadingPointsHistory(false);
      }
    }
  };

  // Hàm xử lý "Mua ngay"
  const handleBuyNow = () => {
    if (!user) {
      router.push("/login?callbackUrl=/menu");
      return;
    }
    handleAddToCart();
    setIsCartOpen(true);
  };

  // Auto pre-fill customer info when logged in
  useEffect(() => {
    if (user) {
      if (!cart.contactName && user.fullName) {
        cart.setContactName(user.fullName);
      }
      const phone = (user as any).phoneNumber || (user as any).phone;
      if (!cart.contactPhone && phone) {
        cart.setContactPhone(phone);
      }
      const addr = (user as any).address;
      if (!cart.deliveryAddress && addr) {
        cart.setDeliveryAddress(addr);
      }
    }
  }, [user]);

  // Product Customization Modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null,
  );
  const [modalToppings, setModalToppings] = useState<
    Record<number, { topping: Topping; quantity: number }>
  >({});
  const [modalNote, setModalNote] = useState("");
  const [modalQuantity, setModalQuantity] = useState(1);

  // Customer Orders List state
  const [customerOrders, setCustomerOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // 1. Fetch Menu Data
  const fetchMenuData = useCallback(async () => {
    setLoading(true);
    try {
      const [catsRes, prodsRes, topsRes] = await Promise.all([
        menuService
          .getCategories({ displayStatus: "SHOW" as any })
          .catch(() => [] as any),
        menuService
          .getProducts({ status: "ACTIVE" as any })
          .catch(() => [] as any),
        // Không truyền param status để Backend không ép lọc WHERE
        menuService.getToppings().catch(() => [] as any),
      ]);

      setCategories(
        Array.isArray(catsRes) ? catsRes : (catsRes as any)?.data || [],
      );
      setProducts(
        Array.isArray(prodsRes) ? prodsRes : (prodsRes as any)?.data || [],
      );

      // Tương thích mềm: Nhận cả 'AVAILABLE' lẫn 'ACTIVE'
      const rawToppings = Array.isArray(topsRes)
        ? topsRes
        : (topsRes as any)?.data || [];
      const validToppings = rawToppings.filter(
        (t: any) => t.status === "AVAILABLE" || t.status === "ACTIVE",
      );
      setToppings(validToppings);
    } catch (err) {
      console.error("Lỗi khi tải thực đơn:", err);
      showToast("Không thể tải thực đơn. Vui lòng thử lại sau", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Fetch Customer Orders
  const fetchCustomerOrders = useCallback(async () => {
    if (!user) return;
    setLoadingOrders(true);
    try {
      const res = await posService.getOrders({ limit: 30 } as any);
      const items = res?.items || res?.data || (Array.isArray(res) ? res : []);
      setCustomerOrders(items);
    } catch (err) {
      console.error("Lỗi khi tải đơn hàng:", err);
    } finally {
      setLoadingOrders(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMenuData();
  }, [fetchMenuData]);

  useEffect(() => {
    if (activeView === "MY_ORDERS") {
      fetchCustomerOrders();
    }
  }, [activeView, fetchCustomerOrders]);


  // Open modal for product options
  const handleOpenOptionModal = (product: Product) => {
    setSelectedProduct(product);
    setSelectedVariant(product.variants?.[0] || null);
    setModalToppings({});
    setModalNote("");
    setModalQuantity(1);
  };

  const handleCloseOptionModal = () => {
    setSelectedProduct(null);
    setSelectedVariant(null);
    setModalToppings({});
  };

  const handleToggleTopping = (t: Topping) => {
    setModalToppings((prev) => {
      const next = { ...prev };
      if (next[t.id]) {
        delete next[t.id];
      } else {
        next[t.id] = { topping: t, quantity: 1 };
      }
      return next;
    });
  };

  const handleUpdateToppingQty = (toppingId: number, delta: number) => {
    setModalToppings((prev) => {
      const curr = prev[toppingId];
      if (!curr) return prev;
      const newQty = curr.quantity + delta;
      if (newQty <= 0) {
        const next = { ...prev };
        delete next[toppingId];
        return next;
      }
      return {
        ...prev,
        [toppingId]: { ...curr, quantity: newQty },
      };
    });
  };

  // Add customized product to cart
  const handleAddToCart = () => {
    if (!user) {
      router.push("/login?callbackUrl=/menu");
      return;
    }
    if (!selectedProduct || !selectedVariant) return;

    const toppingPayload: CustomerCartTopping[] = Object.values(modalToppings)
      .filter((item) => (item.quantity || 0) > 0)
      .map((item) => ({
        toppingId: item.topping.id,
        toppingSnapshotName: item.topping.name,
        toppingPrice: Math.max(0, item.topping.price),
        quantity: Math.max(1, item.quantity),
      }));

    cart.addItem({
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      variantId: selectedVariant.id,
      size: selectedVariant.size,
      unitPrice: selectedVariant.price,
      quantity: Math.max(1, modalQuantity),
      note: modalNote.trim(),
      toppings: toppingPayload,
    });

    handleCloseOptionModal();
    showToast(`Đã thêm "${selectedProduct.name}" vào giỏ hàng!`);
  };

  // Modal total price preview
  const modalTotalPrice = useMemo(() => {
    if (!selectedVariant) return 0;
    const toppingSum = Object.values(modalToppings).reduce(
      (sum, item) => sum + item.topping.price * item.quantity,
      0,
    );
    return (selectedVariant.price + toppingSum) * modalQuantity;
  }, [selectedVariant, modalToppings, modalQuantity]);

  // Filter products by category and search
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        selectedCategoryId === "ALL" || p.categoryId === selectedCategoryId;
      const matchesSearch =
        !searchQuery.trim() ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description || "").toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategoryId, searchQuery]);

  // Handle Checkout (Place Order)
  const handlePlaceOrder = async () => {
    if (!user) {
      router.push("/login?callbackUrl=/menu");
      return;
    }
    if (cart.items.length === 0) return;
    // Chỉ bắt buộc nhập địa chỉ khi chọn Giao tận nơi (DELIVERY)
    if (orderType === "DELIVERY" && !cart.deliveryAddress.trim()) {
      showToast("Vui lòng nhập địa chỉ giao hàng nhận món (COD)", "error");
      return;
    }

    setIsSubmittingOrder(true);
    try {
      const deliverySummary = [
        cart.contactName ? `KH: ${cart.contactName}` : '',
        cart.contactPhone ? `SĐT: ${cart.contactPhone}` : '',
        orderType === 'DELIVERY' && cart.deliveryAddress ? `Đ/c: ${cart.deliveryAddress}` : 'Lấy tại quán',
        cart.customerNote ? `Lưu ý: ${cart.customerNote}` : '',
      ]
        .filter(Boolean)
        .join(' | ');

      const orderItems = cart.items.map((item, idx) => {
        const combinedNote =
          idx === 0 && deliverySummary
            ? [item.note, `[${deliverySummary}]`].filter(Boolean).join(' - ').slice(0, 255)
            : item.note || null;

        return {
          variantId: item.variantId,
          quantity: item.quantity,
          note: combinedNote,
          itemSnapshotName: item.productName,
          sizeSnapshot: item.size,
          unitPrice: item.unitPrice,
          totalToppingPriceSnapshot: item.totalToppingPrice,
          totalPrice: item.totalPrice,
          toppings: item.toppings.map((t) => ({
            toppingId: t.toppingId || null,
            toppingSnapshotName: t.toppingSnapshotName,
            toppingPrice: t.toppingPrice,
            quantity: t.quantity,
          })),
        };
      });

      // Đưa chiết khấu điểm vào đơn hàng
      const payload = {
        employeeId: 2,
        customerId: user?.id || null,
        orderChannel: (orderType === 'DELIVERY' ? 'DELIVERY' : 'APP') as any,
        subTotal: cart.subTotal,
        discountAmount: 0,
        totalAmount: cart.subTotal,
        paymentMethod: "CASH" as const,
        items: orderItems,
        pointsToRedeem: pointsToRedeem > 0 ? pointsToRedeem : undefined,
      };

      const res = await posService.createOrder(payload as any);
      const created = res?.data || res;
      const orderId = created.id || created.newOrderId || res.orderId;

      // Nếu có đổi điểm thưởng: Gọi API trừ điểm ngay lập tức
      if (orderId && pointsToRedeem > 0 && user?.id) {
        try {
          await posService.applyLoyaltyPoints(
            orderId,
            user.id,
            pointsToRedeem,
            conversionRate,
          );
          setPointsToRedeem(0);
          await refreshUser();
        } catch (pointErr) {
          console.error("Lỗi trừ điểm thưởng:", pointErr);
        }
      }

      cart.clearCart();
      setIsCartOpen(false);
      setOrderSuccessData(created);
      showToast("Đặt hàng thành công! Đơn hàng đang được chuẩn bị.");
    } catch (err: any) {
      showToast(
        err.response?.data?.message || err.message || "Đặt hàng thất bại.",
        "error",
      );
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING_PREP":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            Đang chờ quán xác nhận
          </span>
        );
      case "PREPARING":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <Coffee className="w-3.5 h-3.5 text-blue-600" />
            Đang pha chế món
          </span>
        );
      case "READY_FOR_PICKUP":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <Truck className="w-3.5 h-3.5 text-emerald-600" />
            Sẵn sàng giao / Nhận món
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-zinc-100 text-zinc-800 border border-zinc-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Đã hoàn thành
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            Đã hủy đơn
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-gray-900 flex flex-col font-sans">
      {/* Toast Popup */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 text-white font-semibold text-sm ${
            toastMessage.type === "error" ? "bg-rose-600" : "bg-[#6F4E37]"
          }`}
        >
          {toastMessage.type === "error" ? (
            <AlertCircle className="w-5 h-5 text-rose-200" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          )}
          <span>{toastMessage.message}</span>
        </div>
      )}

      {/* 1. Header Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#F0E6DD] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
          {/* Logo Brand */}
          <Link
            href="/menu"
            className="flex items-center gap-2.5 shrink-0 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#6F4E37] to-[#5A3F2C] text-white flex items-center justify-center shadow-md shadow-[#6F4E37]/20 group-hover:scale-105 transition-transform">
              <Coffee className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-[#6F4E37]">
                MePhaPhin
              </span>
              <span className="block text-[10px] font-bold text-amber-700 tracking-widest uppercase">
                Coffee & Tea
              </span>
            </div>
          </Link>

          {/* Navigation Tabs */}
          <div className="hidden md:flex items-center gap-1 bg-[#FAF6F0] p-1 rounded-xl border border-[#F0E6DD]">
            <button
              type="button"
              onClick={() => setActiveView("MENU")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeView === "MENU"
                  ? "bg-white text-[#6F4E37] shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Thực đơn đặt món
            </button>
            <button
              type="button"
              onClick={() => {
                if (!user) {
                  router.push("/login?callbackUrl=/menu");
                  return;
                }
                setActiveView("MY_ORDERS");
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeView === "MY_ORDERS"
                  ? "bg-white text-[#6F4E37] shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              Đơn hàng của tôi
            </button>
          </div>

          {/* Right Area: Customer Info & Cart Button */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleOpenProfile}
                  className="flex items-center gap-2.5 bg-[#FAF6F0] hover:bg-[#F5EBE6] border border-[#F0E6DD] px-3 py-1.5 rounded-2xl transition-all cursor-pointer text-left"
                  title="Bấm để xem hạng thẻ và điểm thưởng"
                >
                  <div className="w-8 h-8 rounded-full bg-[#6F4E37] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                    {user.fullName
                      ? user.fullName.charAt(0).toUpperCase()
                      : "K"}
                  </div>
                  <div className="hidden sm:block text-xs leading-tight">
                    <div className="font-extrabold text-gray-900 line-clamp-1">
                      {user.fullName}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-[#6F4E37] font-bold">
                      <Award className="w-3 h-3 text-amber-600 fill-amber-500" />
                      <span>
                        {user.rewardPoints || 0} pts • Hạng{" "}
                        {user.membershipTier || "STANDARD"}
                      </span>
                    </div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={logout}
                  title="Đăng xuất"
                  className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#6F4E37] hover:bg-[#FAF6F0] transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#6F4E37] text-white hover:bg-[#5A3F2C] shadow-sm transition-all"
                >
                  Đăng ký
                </Link>
              </div>
            )}

            {/* Cart Trigger Button */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-[#6F4E37] hover:bg-[#5A3F2C] text-white px-4 py-2.5 rounded-2xl font-bold text-xs shadow-md shadow-[#6F4E37]/20 active:scale-95 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Giỏ hàng</span>
              {cart.totalItemCount > 0 && (
                <span className="flex items-center justify-center h-5 min-w-5 px-1 rounded-full bg-amber-400 text-[#6F4E37] text-[10px] font-black">
                  {cart.totalItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile View Switcher */}
        <div className="md:hidden flex border-t border-gray-100 bg-[#FAF6F0] p-1.5">
          <button
            type="button"
            onClick={() => setActiveView("MENU")}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold text-center cursor-pointer ${
              activeView === "MENU"
                ? "bg-white text-[#6F4E37] shadow-xs"
                : "text-gray-500"
            }`}
          >
            Thực đơn đặt món
          </button>
          <button
            type="button"
            onClick={() => {
              if (!user) {
                router.push("/login?callbackUrl=/menu");
                return;
              }
              setActiveView("MY_ORDERS");
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold text-center cursor-pointer ${
              activeView === "MY_ORDERS"
                ? "bg-white text-[#6F4E37] shadow-xs"
                : "text-gray-500"
            }`}
          >
            Đơn hàng của tôi
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {activeView === "MENU" ? (
          <>
            {/* Banner Khuyến Mãi / Lời chào */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#6F4E37] via-[#855D40] to-[#A27B5C] text-white p-6 sm:p-8 shadow-xl shadow-[#6F4E37]/15">
              <div className="relative z-10 max-w-2xl space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold tracking-wide uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  Đậm đà phong vị cà phê Việt
                </span>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                  Chào mừng {user?.fullName || "bạn"} đến với MePhaPhin!
                </h1>
                <p className="text-xs sm:text-sm text-white/90 leading-relaxed max-w-xl">
                  Khám phá hương vị cà phê phin truyền thống và thức uống hiện
                  đại. Đặt món giao tận nơi với hình thức thanh toán COD nhanh
                  chóng, tiện lợi.
                </p>
              </div>
              <div className="absolute right-4 -bottom-6 opacity-15 pointer-events-none hidden sm:block">
                <Coffee className="w-64 h-64 stroke-[1]" />
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <button
                  type="button"
                  onClick={() => setSelectedCategoryId("ALL")}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                    selectedCategoryId === "ALL"
                      ? "bg-[#6F4E37] text-white shadow-md shadow-[#6F4E37]/20"
                      : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200/80"
                  }`}
                >
                  Tất cả ({products.length})
                </button>
                {categories.map((c) => {
                  const count = products.filter(
                    (p) => p.categoryId === c.id,
                  ).length;
                  const isSelected = selectedCategoryId === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedCategoryId(c.id)}
                      className={`px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? "bg-[#6F4E37] text-white shadow-md shadow-[#6F4E37]/20"
                          : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200/80"
                      }`}
                    >
                      <span>{c.name}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                          isSelected
                            ? "bg-white/20 text-white"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Live Search Input */}
              <div className="relative w-full sm:w-72 shrink-0">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm tên món, hương vị..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-gray-200/90 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/15 shadow-2xs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* 3. Product Catalog Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <div
                    key={n}
                    className="bg-white rounded-3xl p-4 border border-gray-100 animate-pulse space-y-3"
                  >
                    <div className="aspect-4/3 w-full bg-gray-200 rounded-2xl" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                    <div className="h-8 bg-gray-200 rounded-xl mt-4" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredProducts.map((p) => {
                  const minPrice = p.variants?.reduce(
                    (min, v) => (v.price < min ? v.price : min),
                    p.variants[0]?.price || 0,
                  );
                  const maxPrice = p.variants?.reduce(
                    (max, v) => (v.price > max ? v.price : max),
                    p.variants[0]?.price || 0,
                  );

                  return (
                    <div
                      key={p.id}
                      className="group bg-white rounded-3xl border border-[#F0E6DD] p-4 shadow-sm hover:shadow-xl hover:border-[#6F4E37]/40 hover:-translate-y-1 transition-all flex flex-col justify-between"
                    >
                      <div>
                        {/* Thumbnail Image */}
                        <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-[#FAF6F0] mb-3.5 flex items-center justify-center">
                          <SafeProductImage
                            src={p.image}
                            alt={p.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            fallbackIcon={
                              <Coffee className="w-10 h-10 text-[#6F4E37]/40 stroke-[1.5]" />
                            }
                          />
                          {p.categoryName && (
                            <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-xs text-[10px] font-bold text-white">
                              {p.categoryName}
                            </span>
                          )}
                          {p.variants && p.variants.length > 0 && (
                            <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-amber-500/90 text-[10px] font-bold text-white shadow-xs">
                              {p.variants.map((v) => v.size).join(" • ")}
                            </span>
                          )}
                        </div>

                        {/* Title & Description */}
                        <h3 className="font-extrabold text-base text-gray-900 group-hover:text-[#6F4E37] transition-colors line-clamp-1">
                          {p.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                          {p.description ||
                            "Hương vị thơm ngon đậm đà, được pha chế từ nguyên liệu sạch nguyên chất."}
                        </p>
                      </div>

                      {/* Footer & Add Button */}
                      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] text-gray-400 font-semibold block">
                            Giá chỉ từ
                          </span>
                          <span className="font-black text-sm text-[#6F4E37]">
                            {minPrice === maxPrice
                              ? formatCurrency(minPrice || 0)
                              : `${formatCurrency(minPrice || 0)}`}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleOpenOptionModal(p)}
                          className="px-3.5 py-2 rounded-xl bg-[#FAF6F0] hover:bg-[#6F4E37] text-[#6F4E37] hover:text-white border border-[#EBE3D5] hover:border-[#6F4E37] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Chọn món</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm max-w-md mx-auto space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#FAF6F0] flex items-center justify-center mx-auto text-[#6F4E37]">
                  <CupSoda className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h4 className="font-bold text-base text-gray-900">
                  Không tìm thấy món phù hợp
                </h4>
                <p className="text-xs text-gray-500">
                  Thử tìm kiếm với từ khóa khác hoặc chuyển sang danh mục món
                  khác.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategoryId("ALL");
                    setSearchQuery("");
                  }}
                  className="px-4 py-2 rounded-xl bg-[#6F4E37] text-white text-xs font-bold hover:bg-[#5A3F2C]"
                >
                  Xem toàn bộ thực đơn
                </button>
              </div>
            )}
          </>
        ) : (
          /* 4. Customer Order History View */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-gray-900">
                  Lịch sử đơn hàng của bạn
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Theo dõi trạng thái các đơn giao hàng COD và tại quầy
                </p>
              </div>
              <button
                type="button"
                onClick={fetchCustomerOrders}
                disabled={loadingOrders}
                className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${loadingOrders ? "animate-spin" : ""}`}
                />
                <span>Làm mới</span>
              </button>
            </div>

            {loadingOrders ? (
              <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm">
                <RefreshCw className="w-8 h-8 text-[#6F4E37] animate-spin mx-auto mb-3" />
                <p className="text-xs font-bold text-gray-600">
                  Đang đồng bộ danh sách đơn hàng...
                </p>
              </div>
            ) : customerOrders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customerOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-white rounded-3xl border border-[#F0E6DD] p-5 shadow-xs hover:shadow-md transition-all space-y-3.5"
                  >
                    <div className="flex items-start justify-between gap-2 border-b border-gray-100 pb-3">
                      <div>
                        <div className="font-mono font-bold text-base text-gray-900">
                          #{ord.orderCode || ord.id}
                        </div>
                        <div className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1.5">
                          <Clock className="w-3 h-3" />
                          <span>
                            {ord.createdAt
                              ? new Date(ord.createdAt).toLocaleString(
                                  "vi-VN",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                  },
                                )
                              : "Vừa đặt"}
                          </span>
                          <span>•</span>
                          <span className="font-semibold text-amber-800">
                            {ord.orderChannel === "DELIVERY"
                              ? "Giao hàng (COD)"
                              : "Tại quầy"}
                          </span>
                        </div>
                      </div>
                      <div>{getStatusBadge(ord.status)}</div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-gray-500 font-medium">
                        Tổng thanh toán (COD):
                      </span>
                      <span className="font-black text-base text-[#6F4E37]">
                        {formatCurrency(ord.totalAmount || 0)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm max-w-md mx-auto space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#FAF6F0] flex items-center justify-center mx-auto text-[#6F4E37]">
                  <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h4 className="font-bold text-base text-gray-900">
                  Bạn chưa có đơn hàng nào
                </h4>
                <p className="text-xs text-gray-500">
                  Hãy chọn những món thức uống yêu thích từ thực đơn để lên đơn
                  ngay!
                </p>
                <button
                  type="button"
                  onClick={() => setActiveView("MENU")}
                  className="px-5 py-2.5 rounded-xl bg-[#6F4E37] text-white text-xs font-bold hover:bg-[#5A3F2C]"
                >
                  Khám phá thực đơn
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* 5. Product Customization Option Modal */}
      {selectedProduct && selectedVariant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-white shadow-2xl border border-gray-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-[#FAF6F0]/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white border border-[#F0E6DD] overflow-hidden flex items-center justify-center shrink-0">
                  <SafeProductImage
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    fallbackIcon={<Coffee className="w-5 h-5 text-[#6F4E37]" />}
                  />
                </div>
                <div>
                  <h3 className="font-bold text-base text-gray-900">
                    {selectedProduct.name}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">
                    {selectedProduct.categoryName || "Tùy chọn món"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseOptionModal}
                className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* 1. Chọn Size */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2.5">
                  1. Chọn kích cỡ (Bắt buộc)
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {selectedProduct.variants?.map((v) => {
                    const isSelected = selectedVariant?.id === v.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariant(v)}
                        className={`rounded-2xl border p-3 text-center transition-all cursor-pointer ${
                          isSelected
                            ? "border-[#6F4E37] bg-[#F5EBE6] text-[#6F4E37] ring-2 ring-[#6F4E37]/20 shadow-xs"
                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        <div className="text-sm font-black">Size {v.size}</div>
                        <div className="text-xs font-semibold mt-0.5">
                          {formatCurrency(v.price)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Chọn Topping */}
              {toppings.length > 0 && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2.5">
                    2. Thêm Topping thơm ngon
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {toppings.map((t) => {
                      const isChecked = !!modalToppings[t.id];
                      const selectedItem = modalToppings[t.id];

                      return (
                        <div
                          key={t.id}
                          className={`flex items-center justify-between p-2.5 rounded-2xl border transition-all ${
                            isChecked
                              ? "border-[#6F4E37] bg-[#FAF6F0]"
                              : "border-gray-200/80 bg-white hover:border-gray-300"
                          }`}
                        >
                          <div
                            onClick={() => handleToggleTopping(t)}
                            className="flex items-center gap-2.5 cursor-pointer flex-1"
                          >
                            <div
                              className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                                isChecked
                                  ? "border-[#6F4E37] bg-[#6F4E37] text-white"
                                  : "border-gray-300 bg-white"
                              }`}
                            >
                              {isChecked && (
                                <Check className="w-3 h-3 stroke-[3]" />
                              )}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-gray-900">
                                {t.name}
                              </div>
                              <div className="text-[10px] font-semibold text-[#6F4E37]">
                                +{formatCurrency(t.price)}
                              </div>
                            </div>
                          </div>

                          {isChecked && (
                            <div className="flex items-center gap-1.5 bg-white rounded-lg border border-gray-200 px-1.5 py-0.5 shadow-2xs">
                              <button
                                type="button"
                                onClick={() => handleUpdateToppingQty(t.id, -1)}
                                className="p-0.5 text-gray-500 hover:text-gray-900 cursor-pointer"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-bold w-4 text-center">
                                {selectedItem.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleUpdateToppingQty(t.id, 1)}
                                className="p-0.5 text-gray-500 hover:text-gray-900 cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3. Ghi chú món */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  3. Ghi chú yêu cầu pha chế
                </label>
                <input
                  type="text"
                  placeholder="VD: 50% đường, ít đá, để đá riêng, ấm nóng..."
                  value={modalNote}
                  onChange={(e) => setModalNote(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50/60 px-4 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-[#6F4E37] focus:outline-none focus:ring-2 focus:ring-[#6F4E37]/15"
                />
              </div>
            </div>

            {/* Modal Footer Actions */}
            {/* Modal Footer Actions: Thêm vào giỏ hàng & Mua ngay */}
            <div className="border-t border-gray-100 bg-[#FAF6F0]/60 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Số lượng:
                </span>
                <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-2 py-1 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setModalQuantity((q) => Math.max(1, q - 1))}
                    className="p-1 text-gray-500 hover:text-gray-900 cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-6 text-center text-sm font-black text-gray-900">
                    {modalQuantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setModalQuantity((q) => q + 1)}
                    className="p-1 text-gray-500 hover:text-gray-900 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Lời nhắc nếu chưa đăng nhập */}
              {!user && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200/70 text-amber-800 text-[11px] font-medium">
                  <LogIn className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                  <span>Yêu cầu đăng nhập tài khoản để thêm giỏ hoặc mua hàng.</span>
                </div>
              )}

              {/* Hàng 2 nút: Thêm giỏ hàng + Mua ngay */}
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 py-3 px-4 rounded-2xl border-2 border-[#6F4E37] text-[#6F4E37] hover:bg-[#F5EBE6] text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Thêm giỏ hàng</span>
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="flex-1 py-3 px-4 rounded-2xl bg-[#6F4E37] hover:bg-[#5A3F2C] text-white text-xs font-black shadow-lg shadow-[#6F4E37]/25 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Mua ngay ({formatCurrency(modalTotalPrice)})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Customer Cart Slide-Over Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-[#FAF6F0]/60">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#6F4E37] text-white flex items-center justify-center shadow-xs">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-gray-900">
                    Giỏ hàng của bạn
                  </h3>
                  <p className="text-xs text-gray-500">
                    {cart.totalItemCount} ly món đang chọn
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Scrollable Body: Items + Delivery Form */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {cart.items.length === 0 ? (
                <div className="py-16 text-center text-gray-400 space-y-2">
                  <ShoppingBag className="w-12 h-12 stroke-[1.5] mx-auto opacity-30 text-[#6F4E37]" />
                  <p className="text-sm font-bold text-gray-700">
                    Giỏ hàng chưa có món nào
                  </p>
                  <p className="text-xs text-gray-400">
                    Chọn những món yêu thích từ thực đơn để thưởng thức
                  </p>
                </div>
              ) : (
                <>
                  {/* Danh sách món trong giỏ */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-wider">
                      <span>Món đã chọn</span>
                      <button
                        type="button"
                        onClick={cart.clearCart}
                        className="text-rose-600 hover:underline cursor-pointer lowercase"
                      >
                        xóa tất cả
                      </button>
                    </div>

                    {cart.items.map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-2xl border border-gray-200/90 bg-[#FAF6F0]/40 space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="font-bold text-sm text-gray-900">
                              {item.productName}{" "}
                              <span className="text-xs px-1.5 py-0.5 rounded-md bg-white border border-gray-200 text-gray-700 font-bold">
                                Size {item.size}
                              </span>
                            </div>
                            {item.toppings.length > 0 && (
                              <div className="text-[11px] text-gray-500 mt-0.5">
                                +{" "}
                                {item.toppings
                                  .map(
                                    (t) =>
                                      `${t.toppingSnapshotName} (x${t.quantity})`,
                                  )
                                  .join(", ")}
                              </div>
                            )}
                            {item.note && (
                              <div className="text-[11px] text-amber-800 italic mt-0.5">
                                "{item.note}"
                              </div>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => cart.removeItem(item.id)}
                            className="text-gray-400 hover:text-rose-600 p-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-gray-200/60">
                          <div className="flex items-center gap-1.5 bg-white rounded-lg border border-gray-200 px-1.5 py-0.5">
                            <button
                              type="button"
                              onClick={() => cart.updateQuantity(item.id, -1)}
                              className="p-0.5 text-gray-500 hover:text-gray-900 cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold w-4 text-center">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => cart.updateQuantity(item.id, 1)}
                              className="p-0.5 text-gray-500 hover:text-gray-900 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="font-black text-xs text-[#6F4E37]">
                            {formatCurrency(item.totalPrice)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Hình thức nhận hàng */}
                  <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-2xl text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setOrderType("DELIVERY")}
                      className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        orderType === "DELIVERY"
                          ? "bg-white text-[#6F4E37] shadow-xs"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Giao tận nơi</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderType("TAKE_AWAY")}
                      className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        orderType === "TAKE_AWAY"
                          ? "bg-white text-[#6F4E37] shadow-xs"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <Store className="w-3.5 h-3.5" />
                      <span>Lấy tại quán</span>
                    </button>
                  </div>

                  {/* Thông tin nhận món */}
                  <div className="p-4 rounded-3xl border border-amber-200 bg-amber-50/50 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                      {orderType === "DELIVERY" ? (
                        <>
                          <Truck className="w-4 h-4 text-amber-700" />
                          <span>Thông tin giao hàng nhận món (COD)</span>
                        </>
                      ) : (
                        <>
                          <Store className="w-4 h-4 text-amber-700" />
                          <span>Thông tin nhận tại quầy quán</span>
                        </>
                      )}
                    </div>

                    <div className="space-y-2.5 text-xs">
                      <div>
                        <label className="block text-gray-600 font-semibold mb-1">
                          Họ và tên người nhận:
                        </label>
                        <input
                          type="text"
                          value={cart.contactName}
                          onChange={(e) => cart.setContactName(e.target.value)}
                          placeholder="Nhập tên người nhận món..."
                          className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs focus:outline-none focus:border-[#6F4E37]"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-600 font-semibold mb-1">
                          Số điện thoại:
                        </label>
                        <input
                          type="tel"
                          value={cart.contactPhone}
                          onChange={(e) => cart.setContactPhone(e.target.value)}
                          placeholder="Nhập số điện thoại nhận thông báo..."
                          className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs focus:outline-none focus:border-[#6F4E37]"
                        />
                      </div>

                      {orderType === "DELIVERY" && (
                        <div>
                          <label className="block text-gray-600 font-semibold mb-1">
                            Địa chỉ giao hàng nhận món{" "}
                            <span className="text-rose-500">*</span>:
                          </label>
                          <input
                            type="text"
                            required
                            value={cart.deliveryAddress}
                            onChange={(e) =>
                              cart.setDeliveryAddress(e.target.value)
                            }
                            placeholder="Số nhà, tên đường, tòa nhà/phòng..."
                            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs focus:outline-none focus:border-[#6F4E37]"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-gray-600 font-semibold mb-1">
                          Ghi chú cho quán:
                        </label>
                        <input
                          type="text"
                          value={cart.customerNote}
                          onChange={(e) => cart.setCustomerNote(e.target.value)}
                          placeholder="Ghi chú thêm về đơn hàng..."
                          className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs focus:outline-none focus:border-[#6F4E37]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Lời nhắc đăng nhập */}
                  {!user && (
                    <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#EADBCC] text-xs text-gray-700 flex items-center justify-between gap-3">
                      <div className="space-y-0.5">
                        <div className="font-extrabold text-[#6F4E37] flex items-center gap-1.5">
                          <LogIn className="w-3.5 h-3.5" />
                          <span>Yêu cầu đăng nhập</span>
                        </div>
                        <div className="text-[11px] text-gray-500">
                          Đăng nhập để đặt hàng online và tích lũy điểm thưởng
                        </div>
                      </div>
                      <Link
                        href="/login?callbackUrl=/menu"
                        className="px-3 py-1.5 rounded-xl bg-[#6F4E37] text-white text-xs font-bold hover:bg-[#5A3F2C] shrink-0"
                      >
                        Đăng nhập
                      </Link>
                    </div>
                  )}

                  {/* Ô Đổi điểm thưởng hội viên lấy giảm giá (Nếu đã đăng nhập) */}
                  {user && (user.rewardPoints || 0) > 0 && (
                    <div className="p-3.5 rounded-2xl border border-amber-200 bg-amber-50/70 space-y-2 text-xs">
                      <div className="flex items-center justify-between font-bold text-amber-900">
                        <span className="flex items-center gap-1.5">
                          <Award className="w-4 h-4 text-amber-600 fill-amber-500" />
                          <span>
                            Dùng điểm giảm giá (Có {user.rewardPoints} pts)
                          </span>
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setPointsToRedeem(
                              pointsToRedeem > 0 ? 0 : maxRedeemablePoints,
                            )
                          }
                          className="text-[11px] text-[#6F4E37] font-extrabold underline cursor-pointer"
                        >
                          {pointsToRedeem > 0
                            ? "Bỏ dùng"
                            : `Dùng hết (${maxRedeemablePoints} pts)`}
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={0}
                          max={maxRedeemablePoints}
                          value={pointsToRedeem || ""}
                          onChange={(e) =>
                            setPointsToRedeem(
                              Math.min(
                                maxRedeemablePoints,
                                Math.max(0, Number(e.target.value) || 0),
                              ),
                            )
                          }
                          placeholder="Nhập số điểm muốn đổi..."
                          className="flex-1 bg-white border border-amber-300 rounded-xl px-3 py-1.5 font-bold text-xs text-gray-900 focus:outline-none"
                        />
                        <span className="font-bold text-amber-800 shrink-0">
                          = -{formatCurrency(discountAmount)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Phương thức thanh toán COD */}
                  <div className="flex items-center justify-between p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                        <Check className="w-4 h-4 stroke-[2.5]" />
                      </div>
                      <div>
                        <div className="font-bold text-emerald-900">
                          {orderType === "DELIVERY"
                            ? "Thanh toán tiền mặt khi nhận hàng (COD)"
                            : "Thanh toán khi nhận món tại quầy"}
                        </div>
                        <div className="text-[11px] text-emerald-700">
                          Kiểm tra đồ uống và thanh toán an toàn
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Drawer Footer Actions */}
            {cart.items.length > 0 && (
              <div className="p-5 border-t border-gray-100 bg-[#FAF6F0]/60 space-y-3">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-gray-500">
                    <span>Tạm tính ({cart.totalItemCount} món):</span>
                    <span className="font-bold text-gray-900">
                      {formatCurrency(cart.subTotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Phí vận chuyển:</span>
                    <span className="font-bold text-emerald-600">
                      Miễn phí (0 đ)
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-black text-gray-900 pt-2 border-t border-gray-200">
                    <span>TỔNG CỘNG:</span>
                    <span className="text-[#6F4E37]">
                      {formatCurrency(cart.subTotal)}
                    </span>
                  </div>
                </div>

                <button
                  id="btn-confirm-order"
                  type="button"
                  disabled={isSubmittingOrder || cart.items.length === 0}
                  onClick={handlePlaceOrder}
                  className="w-full py-3.5 rounded-2xl bg-[#6F4E37] hover:bg-[#5A3F2C] text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-[#6F4E37]/30 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {!user ? (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>
                        Đăng nhập để đặt hàng ({formatCurrency(cart.subTotal)})
                      </span>
                    </>
                  ) : isSubmittingOrder ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Đang gửi đơn hàng...</span>
                    </>
                  ) : orderType === "DELIVERY" ? (
                    <>
                      <Truck className="w-4 h-4" />
                      <span>
                        Xác nhận đặt hàng COD ({formatCurrency(cart.subTotal)})
                      </span>
                    </>
                  ) : (
                    <>
                      <Store className="w-4 h-4" />
                      <span>
                        Xác nhận đặt lấy tại quán (
                        {formatCurrency(cart.subTotal)})
                      </span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 7. Order Confirmation Modal */}
      {orderSuccessData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-gray-100 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="font-black text-xl text-gray-900">
                Đặt hàng thành công!
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Đơn hàng #
                {orderSuccessData.orderCode ||
                  orderSuccessData.id ||
                  orderSuccessData.newOrderId}{" "}
                của bạn đã được tiếp nhận.
              </p>
            </div>

            <div className="bg-[#FAF6F0] rounded-2xl p-4 text-xs space-y-2 text-left border border-[#F0E6DD]">
              <div className="flex justify-between">
                <span className="text-gray-500">Mã đơn hàng:</span>
                <span className="font-mono font-bold text-gray-900">
                  #
                  {orderSuccessData.orderCode ||
                    orderSuccessData.id ||
                    orderSuccessData.newOrderId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Phương thức:</span>
                <span className="font-bold text-amber-800">
                  Thanh toán COD khi nhận món
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Trạng thái:</span>
                <span className="font-bold text-blue-600">
                  Đang chờ pha chế
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setOrderSuccessData(null);
                  setActiveView("MY_ORDERS");
                }}
                className="w-full py-3 rounded-2xl bg-[#6F4E37] text-white font-bold text-xs hover:bg-[#5A3F2C] cursor-pointer shadow-md shadow-[#6F4E37]/20"
              >
                Xem trạng thái đơn hàng
              </button>
              <button
                type="button"
                onClick={() => setOrderSuccessData(null)}
                className="w-full py-2.5 rounded-2xl bg-gray-100 text-gray-700 font-bold text-xs hover:bg-gray-200 cursor-pointer"
              >
                Tiếp tục xem thực đơn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Xem Hồ sơ Khách hàng & Điểm thưởng */}
      {isProfileModalOpen && user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#6F4E37] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : "K"}
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-gray-900">
                    {user.fullName}
                  </h3>
                  <p className="text-xs text-gray-400 font-mono">
                    {user.phoneNumber}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Thẻ Thống Kê Hạng và Điểm */}
            <div className="p-4 bg-gradient-to-br from-[#FAF6F0] to-[#F5EBE6] rounded-2xl border border-[#EBE3D5] flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                  Hạng thành viên
                </span>
                <span className="text-lg font-black text-[#6F4E37]">
                  HẠNG {user.membershipTier || "STANDARD"}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                  Điểm khả dụng
                </span>
                <span className="text-2xl font-black text-amber-700">
                  {user.rewardPoints || 0} pts
                </span>
              </div>
            </div>

            {/* Lịch sử điểm thưởng */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Lịch sử tích / đổi điểm gần đây
              </h4>
              <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                {loadingPointsHistory ? (
                  <p className="text-xs text-center text-gray-400 py-6">
                    Đang tải lịch sử điểm...
                  </p>
                ) : pointsHistory.length > 0 ? (
                  pointsHistory.map((tx) => (
                    <div
                      key={tx.id}
                      className="p-2.5 bg-gray-50 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-gray-900 block">
                          {tx.transactionType === "EARN"
                            ? "Tích điểm đơn hàng"
                            : "Đổi điểm giảm giá"}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {new Date(tx.createdAt).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                      <span
                        className={`font-black ${tx.transactionType === "EARN" ? "text-emerald-600" : "text-rose-600"}`}
                      >
                        {tx.transactionType === "EARN"
                          ? `+${tx.points}`
                          : `-${tx.points}`}{" "}
                        pts
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-center text-gray-400 py-6">
                    Chưa có giao dịch điểm nào.
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsProfileModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
