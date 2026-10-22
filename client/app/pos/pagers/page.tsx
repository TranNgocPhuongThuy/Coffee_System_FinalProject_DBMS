// app/pos/pagers/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  BellRing,
  BatteryLow,
  BatteryMedium,
  BatteryCharging,
  BatteryWarning,
  Clock,
  ArrowLeft,
  Search,
  Plus,
  CheckCircle2,
  X,
  Radio,
  SlidersHorizontal,
  Wrench,
  Zap,
  RotateCcw,
  Trash2,
  Edit2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Receipt,
  User,
  Coffee,
  Check,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import { pagerService } from "@/api/pager.service";
import {
  ActivePagerDashboardItem,
  PagerDevice,
  CreatePagerPayload,
} from "@/types/pager";
import { PagerStatus } from "@/types/enums";
import { PosUserDropdown } from "@/components/pos/PosUserDropdown";

const PAGER_STATUS_TABS: { key: PagerStatus | "ALL"; label: string }[] = [
  { key: "ALL", label: "Tất cả trạng thái" },
  { key: "AVAILABLE", label: "Sẵn sàng" },
  { key: "IN_USE", label: "Đang phát" },
  { key: "CHARGING", label: "Đang sạc" },
  { key: "MAINTENANCE", label: "Bảo trì" },
];

export default function PagersManagementPage() {
  const { user, logout } = useAuthContext();
  const isManagerOrAdmin = user?.role === "ADMIN" || user?.role === "MANAGER";
  const [activeTab, setActiveTab] = useState<
    "active_dashboard" | "all_devices"
  >("active_dashboard");

  // Tab 1: Dashboard Data
  const [activePagers, setActivePagers] = useState<ActivePagerDashboardItem[]>(
    [],
  );
  const [loadingDashboard, setLoadingDashboard] = useState(false);

  // Tab 2: Devices Data
  const [devices, setDevices] = useState<PagerDevice[]>([]);
  const [loadingDevices, setLoadingDevices] = useState(false);
  const [meta, setMeta] = useState({
    page: 1,
    limit: 12,
    totalItems: 0,
    totalPages: 1,
  });
  const [statusFilter, setStatusFilter] = useState<PagerStatus | "ALL">("ALL");

  // Search
  const [searchQuery, setSearchQuery] = useState("");

  // Toast
  const [toastMessage, setToastMessage] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Modal: Thêm Thẻ Mới
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newBatteryLevel, setNewBatteryLevel] = useState(100);
  const [newStatus, setNewStatus] = useState<PagerStatus>("AVAILABLE");
  const [isSubmittingAdd, setIsSubmittingAdd] = useState(false);

  // Modal: Sửa Trạng Thái / Pin Thẻ
  const [editingDevice, setEditingDevice] = useState<PagerDevice | null>(null);
  const [editStatus, setEditStatus] = useState<PagerStatus>("AVAILABLE");
  const [editBattery, setEditBattery] = useState<number>(100);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  // Modal: Xác nhận Xóa
  const [deletingDevice, setDeletingDevice] = useState<PagerDevice | null>(
    null,
  );
  const [isSubmittingDelete, setIsSubmittingDelete] = useState(false);

  // 1. Tải dữ liệu Dashboard (Tab 1)
  const fetchDashboard = useCallback(async () => {
    setLoadingDashboard(true);
    try {
      const data = await pagerService.getDashboard();
      setActivePagers(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setToastMessage({
        type: "error",
        message: err.message || "Không thể tải bảng điều phối thẻ rung",
      });
    } finally {
      setLoadingDashboard(false);
    }
  }, []);

  // 2. Tải danh sách toàn bộ thiết bị (Tab 2)
  const fetchDevices = useCallback(
    async (page = 1) => {
      setLoadingDevices(true);
      try {
        const params: any = {
          page,
          limit: 12,
        };
        if (searchQuery.trim()) params.search = searchQuery.trim();
        if (statusFilter !== "ALL") params.status = statusFilter;

        const res = await pagerService.getPagers(params);
        setDevices(res.items || res.data || []);
        if (res.meta) {
          setMeta(res.meta);
        }
      } catch (err: any) {
        setToastMessage({
          type: "error",
          message: err.message || "Không thể tải danh sách thiết bị thẻ rung",
        });
      } finally {
        setLoadingDevices(false);
      }
    },
    [searchQuery, statusFilter],
  );

  // Effect load ban đầu hoặc khi đổi tab
  useEffect(() => {
    if (activeTab === "active_dashboard") {
      fetchDashboard();
    } else {
      fetchDevices(1);
    }
  }, [activeTab, fetchDashboard, fetchDevices]);

  // Tự tắt toast sau 4s
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // 3. Xử lý rung chuông gọi khách
  const handleBuzzPager = (pagerCode: string, orderCode: string) => {
    setToastMessage({
      type: "success",
      message: `Đang gửi tín hiệu RUNG & PHÁT ÂM THANH đến thẻ ${pagerCode} (Đơn #${orderCode})!`,
    });
  };

  // 4. Xử lý thu hồi thẻ (Release Pager)
  const handleReleasePager = async (pagerCode: string) => {
    try {
      // Tìm device ID từ pagerCode
      let targetId: number | null = null;
      const foundInDevices = devices.find((d) => d.pagerCode === pagerCode);
      if (foundInDevices) {
        targetId = foundInDevices.id;
      } else {
        // Fetch trực tiếp để lấy id
        const res = await pagerService.getPagers({
          search: pagerCode,
          limit: 1,
        });
        if (res.items && res.items.length > 0) {
          targetId = res.items[0].id;
        }
      }

      if (!targetId) {
        throw new Error(`Không tìm thấy ID thiết bị cho thẻ ${pagerCode}`);
      }

      await pagerService.releasePager(targetId);
      setToastMessage({
        type: "success",
        message: `Đã thu hồi thẻ ${pagerCode} về trạng thái Sẵn sàng thành công!`,
      });

      // Reload
      fetchDashboard();
      if (activeTab === "all_devices") {
        fetchDevices(meta.page);
      }
    } catch (err: any) {
      setToastMessage({
        type: "error",
        message: err.message || `Không thể thu hồi thẻ ${pagerCode}`,
      });
    }
  };

  // 5. Thêm mới thiết bị thẻ rung
  const handleAddDevice = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmittingAdd(true);
    try {
      const payload: CreatePagerPayload = {
        batteryLevel: Number(newBatteryLevel),
        status: newStatus,
      };

      const res = await pagerService.createPager(payload);
      const createdCode = res?.data?.pagerCode || "";
      setToastMessage({
        type: "success",
        message: createdCode
          ? `Thêm thiết bị thẻ rung ${createdCode} thành công!`
          : "Thêm thiết bị thẻ rung thành công!",
      });

      setIsAddModalOpen(false);
      setNewBatteryLevel(100);
      setNewStatus("AVAILABLE");

      fetchDevices(1);
    } catch (err: any) {
      setToastMessage({
        type: "error",
        message: err.message || "Thêm thiết bị thất bại",
      });
    } finally {
      setIsSubmittingAdd(false);
    }
  };

  // 6. Cập nhật thiết bị (Trạng thái / Pin)
  const handleSaveEditDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDevice) return;

    setIsSubmittingEdit(true);
    try {
      if (editStatus !== editingDevice.status) {
        await pagerService.updateStatus(editingDevice.id, editStatus);
      }
      if (editBattery !== editingDevice.batteryLevel) {
        await pagerService.updateBattery(editingDevice.id, editBattery);
      }

      setToastMessage({
        type: "success",
        message: `Cập nhật thẻ ${editingDevice.pagerCode} thành công!`,
      });

      setEditingDevice(null);
      fetchDevices(meta.page);
      if (activeTab === "active_dashboard") {
        fetchDashboard();
      }
    } catch (err: any) {
      setToastMessage({
        type: "error",
        message: err.message || "Cập nhật thiết bị thất bại",
      });
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  // 7. Xóa thiết bị
  const handleDeleteDevice = async () => {
    if (!deletingDevice) return;

    setIsSubmittingDelete(true);
    try {
      await pagerService.deletePager(deletingDevice.id);
      setToastMessage({
        type: "success",
        message: `Đã xóa thiết bị thẻ ${deletingDevice.pagerCode}!`,
      });

      setDeletingDevice(null);
      fetchDevices(meta.page);
    } catch (err: any) {
      setToastMessage({
        type: "error",
        message: err.message || "Xóa thiết bị thất bại",
      });
    } finally {
      setIsSubmittingDelete(false);
    }
  };

  // Lọc tìm kiếm local cho Dashboard
  const filteredActivePagers = activePagers.filter(
    (p) =>
      p.pagerCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.orderCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.customerName &&
        p.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.customerPhone && p.customerPhone.includes(searchQuery)),
  );

  // Helper render mức pin
  const renderBatteryIndicator = (battery: number) => {
    if (battery < 15) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300">
          <BatteryWarning className="w-3.5 h-3.5 text-rose-600 animate-bounce" />
          {battery}% (Pin yếu)
        </span>
      );
    }
    if (battery < 50) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300">
          <BatteryLow className="w-3.5 h-3.5" />
          {battery}%
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300">
        <BatteryMedium className="w-3.5 h-3.5" />
        {battery}%
      </span>
    );
  };

  // Helper render Badge trạng thái
  const getDeviceStatusBadge = (status: PagerStatus) => {
    switch (status) {
      case "AVAILABLE":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Sẵn sàng
          </span>
        );
      case "IN_USE":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            Đang phát cho khách
          </span>
        );
      case "CHARGING":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-300">
            <BatteryCharging className="w-3.5 h-3.5 text-blue-600" />
            Đang sạc
          </span>
        );
      case "MAINTENANCE":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-zinc-100 text-zinc-700 border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300">
            <Wrench className="w-3.5 h-3.5 text-zinc-500" />
            Bảo trì / Hỏng
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 font-sans antialiased pb-12">
      {/* 1. HEADER */}
      

      {/* 2. TOAST THÔNG BÁO */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 animate-bounce">
          <div
            className={`flex items-center gap-2.5 rounded-xl px-4 py-3 text-xs font-bold shadow-xl ${
              toastMessage.type === "success"
                ? "bg-emerald-600 text-white"
                : "bg-rose-600 text-white"
            }`}
          >
            {toastMessage.type === "success" ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <span>{toastMessage.message}</span>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-5">
        {/* 3. THANH TAB CHUYỂN ĐỔI & ACTIONS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 p-1.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xs w-fit">
            <button
              type="button"
              onClick={() => setActiveTab("active_dashboard")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "active_dashboard"
                  ? "bg-[#6F4E37] text-white shadow-xs"
                  : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              }`}
            >
              <Radio className="w-4 h-4" />
              <span>Điều phối thẻ đang phát</span>
              <span
                className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold ${
                  activeTab === "active_dashboard"
                    ? "bg-[#F5EBE6] text-[#6F4E37]"
                    : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                }`}
              >
                {activePagers.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("all_devices")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "all_devices"
                  ? "bg-[#6F4E37] text-white shadow-xs"
                  : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Quản lý thiết bị phần cứng</span>
              <span
                className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold ${
                  activeTab === "all_devices"
                    ? "bg-[#F5EBE6] text-[#6F4E37]"
                    : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                }`}
              >
                {meta.totalItems || devices.length}
              </span>
            </button>
          </div>

          {/* Actions & Navigation */}
          <div className="flex items-center gap-2.5">
            {isManagerOrAdmin && (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 text-xs font-bold shadow-2xs hover:bg-[#F5EBE6] hover:text-[#6F4E37] dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <LayoutDashboard className="w-4 h-4 text-[#6F4E37] dark:text-[#D4A373]" />
                <span>Quay về Dashboard</span>
              </Link>
            )}

            {/* Action button in Tab 2 */}
            {activeTab === "all_devices" && (
              <button
                type="button"
                disabled={!isManagerOrAdmin}
                onClick={() => {
                  if (isManagerOrAdmin) setIsAddModalOpen(true);
                }}
                title={
                  isManagerOrAdmin
                    ? "Thêm thiết bị thẻ rung mới"
                    : "Chỉ Quản lý mới có quyền thêm thiết bị"
                }
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-xs font-bold shadow-xs transition-colors ${
                  isManagerOrAdmin
                    ? "bg-[#6F4E37] hover:bg-[#5A3F2C] cursor-pointer"
                    : "bg-zinc-400 dark:bg-zinc-700 opacity-50 cursor-not-allowed"
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Thêm thẻ rung mới</span>
              </button>
            )}
          </div>
        </div>

        {/* 4. TOOLBAR TÌM KIẾM & BỘ LỌC */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow-2xs border border-zinc-200 dark:border-zinc-800 space-y-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm mã thẻ PAGER-..., mã đơn, tên khách..."
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-850 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 transition-colors focus:outline-none focus:border-[#6F4E37]"
              />
            </div>

            <div className="text-xs text-zinc-500 font-medium">
              {activeTab === "active_dashboard"
                ? `Đang có ${filteredActivePagers.length} thẻ rung đang cấp phát cho khách`
                : `Tổng cộng ${meta.totalItems || devices.length} thiết bị trong kho`}
            </div>
          </div>

          {/* Status Filter Pills for Tab 2 */}
          {activeTab === "all_devices" && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-1 border-t border-zinc-100 dark:border-zinc-800">
              {PAGER_STATUS_TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setStatusFilter(tab.key)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all ${
                    statusFilter === tab.key
                      ? "bg-[#6F4E37] text-white shadow-xs"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ========================================================
            5. TAB 1: BẢNG ĐIỀU PHỐI (Active Pagers Dashboard)
            ======================================================== */}
        {activeTab === "active_dashboard" && (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xs border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-zinc-50/80 dark:bg-zinc-850/50 border-b border-zinc-200 dark:border-zinc-800 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                    <th scope="col" className="py-3.5 px-5">
                      Mã Thẻ Rung
                    </th>
                    <th scope="col" className="py-3.5 px-5">
                      Mức Pin
                    </th>
                    <th scope="col" className="py-3.5 px-5">
                      Mã Đơn Hàng
                    </th>
                    <th scope="col" className="py-3.5 px-5">
                      Khách Hàng & SĐT
                    </th>
                    <th scope="col" className="py-3.5 px-5">
                      Thời Gian Chờ
                    </th>
                    <th scope="col" className="py-3.5 px-5 text-right">
                      Thao Tác Điều Phối
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {loadingDashboard ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-12 text-center text-zinc-400 font-medium"
                      >
                        Đang tải dữ liệu điều phối thẻ rung...
                      </td>
                    </tr>
                  ) : filteredActivePagers.length > 0 ? (
                    filteredActivePagers.map((pager) => {
                      const isOverdue = pager.waitingMinutes > 15;

                      return (
                        <tr
                          key={`${pager.pagerCode}-${pager.orderId}`}
                          className="hover:bg-zinc-50/60 dark:hover:bg-zinc-850/40 transition-colors group"
                        >
                          {/* Mã Thẻ */}
                          <td className="py-3.5 px-5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-xl bg-[#F5EBE6] text-[#6F4E37] dark:bg-[#6F4E37]/20 dark:text-[#D4A373] flex items-center justify-center font-bold text-xs shrink-0">
                                <Radio className="w-4 h-4" />
                              </div>
                              <span className="font-black text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-[#6F4E37] transition-colors">
                                {pager.pagerCode}
                              </span>
                            </div>
                          </td>

                          {/* Mức pin */}
                          <td className="py-3.5 px-5">
                            {renderBatteryIndicator(pager.batteryLevel)}
                          </td>

                          {/* Mã đơn liên kết */}
                          <td className="py-3.5 px-5">
                            <Link
                              href="/pos/orders"
                              className="font-bold text-[#6F4E37] dark:text-[#D4A373] hover:underline flex items-center gap-1 font-mono text-xs"
                              title="Xem chi tiết đơn trong Quản lý đơn"
                            >
                              <Receipt className="w-3.5 h-3.5" />
                              <span>#{pager.orderCode}</span>
                            </Link>
                          </td>

                          {/* Khách hàng & SĐT */}
                          <td className="py-3.5 px-5">
                            <div>
                              <span className="font-bold text-zinc-900 dark:text-zinc-100 block">
                                {pager.customerName || "Khách vãng lai"}
                              </span>
                              {pager.customerPhone && (
                                <span className="text-[11px] text-zinc-400 font-mono">
                                  {pager.customerPhone}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Số phút đã chờ */}
                          <td className="py-3.5 px-5">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-zinc-400" />
                              <span
                                className={`font-bold px-2 py-0.5 rounded-md ${
                                  isOverdue
                                    ? "text-rose-600 bg-rose-50 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-800"
                                    : "text-zinc-700 bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300"
                                }`}
                              >
                                {pager.waitingMinutes} phút
                                {isOverdue && " (Chờ lâu)"}
                              </span>
                            </div>
                          </td>

                          {/* Thao tác */}
                          <td className="py-3.5 px-5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* Rung chuông */}
                              <button
                                type="button"
                                onClick={() =>
                                  handleBuzzPager(
                                    pager.pagerCode,
                                    pager.orderCode,
                                  )
                                }
                                className="px-2.5 py-1.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-300 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                                title="Rung chuông & Nhấp nháy gọi khách đến quầy nhận món"
                              >
                                <Zap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                <span>Rung chuông</span>
                              </button>

                              {/* Thu hồi thẻ */}
                              <button
                                type="button"
                                onClick={() =>
                                  handleReleasePager(pager.pagerCode)
                                }
                                className="px-3 py-1.5 rounded-xl bg-[#6F4E37] hover:bg-[#5A3F2C] text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                                title="Thu hồi thẻ về khay sạc"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Thu hồi thẻ</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-12 text-center text-zinc-400 font-medium"
                      >
                        Không có thẻ rung nào đang được phát cho khách.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================
            6. TAB 2: QUẢN LÝ THIẾT BỊ PHẦN CỨNG (All Devices)
            ======================================================== */}
        {activeTab === "all_devices" && (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xs border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-zinc-50/80 dark:bg-zinc-850/50 border-b border-zinc-200 dark:border-zinc-800 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                    <th scope="col" className="py-3.5 px-5">
                      Mã Thẻ (Pager Code)
                    </th>
                    <th scope="col" className="py-3.5 px-5">
                      Mức Pin
                    </th>
                    <th scope="col" className="py-3.5 px-5">
                      Trạng Thái Hoạt Động
                    </th>
                    <th scope="col" className="py-3.5 px-5">
                      Ngày Đăng Ký
                    </th>
                    <th scope="col" className="py-3.5 px-5 text-right">
                      Thao Tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {loadingDevices ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-12 text-center text-zinc-400 font-medium"
                      >
                        Đang tải danh sách thiết bị thẻ rung...
                      </td>
                    </tr>
                  ) : devices.length > 0 ? (
                    devices.map((dev) => (
                      <tr
                        key={dev.id}
                        className="hover:bg-zinc-50/60 dark:hover:bg-zinc-850/40 transition-colors group"
                      >
                        <td className="py-3.5 px-5">
                          <span className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-[#6F4E37] transition-colors">
                            {dev.pagerCode}
                          </span>
                        </td>

                        <td className="py-3.5 px-5">
                          {renderBatteryIndicator(dev.batteryLevel)}
                        </td>

                        <td className="py-3.5 px-5">
                          {getDeviceStatusBadge(dev.status)}
                        </td>

                        <td className="py-3.5 px-5 text-zinc-500 font-mono">
                          {new Date(dev.createdAt).toLocaleDateString("vi-VN")}
                        </td>

                        <td className="py-3.5 px-5 text-right space-x-1.5 whitespace-nowrap">
                          {/* Nút thu hồi nhanh nếu đang IN_USE */}
                          {dev.status === "IN_USE" && (
                            <button
                              type="button"
                              onClick={() => handleReleasePager(dev.pagerCode)}
                              className="px-2.5 py-1.5 rounded-lg border border-[#EBE3D5] bg-[#F5EBE6] hover:bg-[#F5EBE6]/80 text-[#6F4E37] dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300 font-bold"
                              title="Thu hồi thẻ"
                            >
                              Thu hồi
                            </button>
                          )}

                          {/* Nút sửa */}
                          <button
                            type="button"
                            onClick={() => {
                              setEditingDevice(dev);
                              setEditStatus(dev.status);
                              setEditBattery(dev.batteryLevel);
                            }}
                            className="p-1.5 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900"
                            title="Chỉnh sửa trạng thái / Mức pin"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Nút xóa */}
                          <button
                            type="button"
                            disabled={dev.status === "IN_USE"}
                            onClick={() => setDeletingDevice(dev)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 disabled:opacity-30 disabled:cursor-not-allowed"
                            title={
                              dev.status === "IN_USE"
                                ? "Không thể xóa thẻ đang phát cho khách"
                                : "Xóa thiết bị"
                            }
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-12 text-center text-zinc-400 font-medium"
                      >
                        Không tìm thấy thiết bị thẻ rung nào phù hợp.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Phân trang */}
            {meta.totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 px-4 py-3">
                <div className="text-xs text-zinc-500">
                  Trang{" "}
                  <strong className="text-zinc-800 dark:text-zinc-200">
                    {meta.page}
                  </strong>{" "}
                  / {meta.totalPages} ({meta.totalItems} thiết bị)
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={meta.page <= 1}
                    onClick={() => fetchDevices(meta.page - 1)}
                    className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-1.5 text-zinc-600 hover:bg-zinc-100 disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    disabled={meta.page >= meta.totalPages}
                    onClick={() => fetchDevices(meta.page + 1)}
                    className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-1.5 text-zinc-600 hover:bg-zinc-100 disabled:opacity-40"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ========================================================
          7. MODAL THÊM THẺ RUNG MỚI
          ======================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#F5EBE6] text-[#6F4E37] flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Thêm Thiết Bị Thẻ Rung Mới
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddDevice} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                  Trạng thái thiết bị
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as PagerStatus)}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-800 text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#6F4E37] cursor-pointer"
                >
                  <option
                    value="AVAILABLE"
                    className="bg-zinc-800 text-white py-1"
                  >
                    Sẵn sàng
                  </option>
                  <option
                    value="CHARGING"
                    className="bg-zinc-800 text-white py-1"
                  >
                    Đang sạc
                  </option>
                  <option
                    value="MAINTENANCE"
                    className="bg-zinc-800 text-white py-1"
                  >
                    Bảo trì
                  </option>
                </select>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  <span>Mức pin ban đầu</span>
                  <span className="text-[#6F4E37] dark:text-[#D4A373] font-mono font-bold">
                    {newBatteryLevel}%
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={newBatteryLevel}
                  onChange={(e) => setNewBatteryLevel(Number(e.target.value))}
                  className="w-full accent-[#6F4E37] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingAdd}
                  className="px-4 py-2 rounded-xl bg-[#6F4E37] hover:bg-[#5A3F2C] text-white text-xs font-bold shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingAdd ? "Đang lưu..." : "Xác nhận thêm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          8. MODAL CHỈNH SỬA TRẠNG THÁI / PIN
          ======================================================== */}
      {editingDevice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#F5EBE6] text-[#6F4E37] flex items-center justify-center font-bold">
                  <Edit2 className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Cập Nhật Thẻ: {editingDevice.pagerCode}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingDevice(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditDevice} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  Trạng thái
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as PagerStatus)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-850 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-[#6F4E37] cursor-pointer"
                >
                  <option value="AVAILABLE">Sẵn sàng</option>
                  <option value="IN_USE">Đang phát cho khách</option>
                  <option value="CHARGING">Đang sạc</option>
                  <option value="MAINTENANCE">Bảo trì</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  <span>Mức pin (%)</span>
                  <span className="text-[#6F4E37] dark:text-[#D4A373] font-mono font-bold">
                    {editBattery}%
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={editBattery}
                  onChange={(e) => setEditBattery(Number(e.target.value))}
                  className="w-full accent-[#6F4E37]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingDevice(null)}
                  className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingEdit}
                  className="px-4 py-2 rounded-xl bg-[#6F4E37] hover:bg-[#5A3F2C] text-white text-xs font-bold shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingEdit ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          9. MODAL XÁC NHẬN XÓA THIẾT BỊ
          ======================================================== */}
      {deletingDevice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Xác nhận xóa thiết bị
                </h3>
                <p className="text-xs text-zinc-500">
                  Mã thẻ: {deletingDevice.pagerCode}
                </p>
              </div>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Bạn có chắc chắn muốn xóa thiết bị thẻ rung{" "}
              <strong className="text-zinc-900 dark:text-zinc-100">
                {deletingDevice.pagerCode}
              </strong>{" "}
              khỏi danh sách quản lý không?
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setDeletingDevice(null)}
                className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={isSubmittingDelete}
                onClick={handleDeleteDevice}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isSubmittingDelete ? "Đang xóa..." : "Xóa thiết bị"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
