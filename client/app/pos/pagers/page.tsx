"use client";

import { useState } from "react";
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
} from "lucide-react";

type PagerStatus = "AVAILABLE" | "IN_USE" | "CHARGING" | "MAINTENANCE";

interface ActivePager {
  id: string;
  pagerCode: string;
  batteryLevel: number; // percentage
  orderNumber: string;
  customerName: string;
  customerPhone?: string;
  orderTime: string;
  waitingMinutes: number;
  orderStatus: "COOKING" | "READY";
}

interface PagerDevice {
  id: string;
  pagerCode: string;
  batteryLevel: number;
  status: PagerStatus;
  currentOrder?: string;
  chargingDock: string;
  lastMaintenance: string;
}

const MOCK_ACTIVE_PAGERS: ActivePager[] = [
  {
    id: "ap-1",
    pagerCode: "PAGER-04",
    batteryLevel: 85,
    orderNumber: "#ORD-2026-001",
    customerName: "Nguyễn Văn An",
    customerPhone: "0901 234 567",
    orderTime: "20:15",
    waitingMinutes: 6,
    orderStatus: "COOKING",
  },
  {
    id: "ap-2",
    pagerCode: "PAGER-12",
    batteryLevel: 12, // Pin yếu < 15%
    orderNumber: "#ORD-2026-002",
    customerName: "Trần Thị Mai",
    customerPhone: "0912 345 678",
    orderTime: "19:42",
    waitingMinutes: 18, // Chờ lâu > 15 phút
    orderStatus: "READY",
  },
  {
    id: "ap-3",
    pagerCode: "PAGER-08",
    batteryLevel: 64,
    orderNumber: "#ORD-2026-005",
    customerName: "Lê Hoàng Phúc",
    customerPhone: "0988 765 432",
    orderTime: "20:05",
    waitingMinutes: 16, // Chờ lâu > 15 phút
    orderStatus: "COOKING",
  },
  {
    id: "ap-4",
    pagerCode: "PAGER-02",
    batteryLevel: 95,
    orderNumber: "#ORD-2026-006",
    customerName: "Vũ Đức Thắng",
    customerPhone: "0933 888 999",
    orderTime: "20:18",
    waitingMinutes: 3,
    orderStatus: "COOKING",
  },
];

const MOCK_ALL_DEVICES: PagerDevice[] = [
  {
    id: "dev-1",
    pagerCode: "PAGER-01",
    batteryLevel: 100,
    status: "AVAILABLE",
    chargingDock: "Khay A - Vị trí 01",
    lastMaintenance: "20/09/2026",
  },
  {
    id: "dev-2",
    pagerCode: "PAGER-02",
    batteryLevel: 95,
    status: "IN_USE",
    currentOrder: "#ORD-2026-006",
    chargingDock: "Khay A - Vị trí 02",
    lastMaintenance: "20/09/2026",
  },
  {
    id: "dev-3",
    pagerCode: "PAGER-03",
    batteryLevel: 45,
    status: "CHARGING",
    chargingDock: "Khay A - Vị trí 03",
    lastMaintenance: "22/09/2026",
  },
  {
    id: "dev-4",
    pagerCode: "PAGER-04",
    batteryLevel: 85,
    status: "IN_USE",
    currentOrder: "#ORD-2026-001",
    chargingDock: "Khay A - Vị trí 04",
    lastMaintenance: "20/09/2026",
  },
  {
    id: "dev-5",
    pagerCode: "PAGER-08",
    batteryLevel: 64,
    status: "IN_USE",
    currentOrder: "#ORD-2026-005",
    chargingDock: "Khay B - Vị trí 01",
    lastMaintenance: "15/09/2026",
  },
  {
    id: "dev-6",
    pagerCode: "PAGER-12",
    batteryLevel: 12,
    status: "IN_USE",
    currentOrder: "#ORD-2026-002",
    chargingDock: "Khay B - Vị trí 05",
    lastMaintenance: "18/09/2026",
  },
  {
    id: "dev-7",
    pagerCode: "PAGER-15",
    batteryLevel: 0,
    status: "MAINTENANCE",
    chargingDock: "Khu kỹ thuật",
    lastMaintenance: "01/10/2026",
  },
];

export default function PagersManagementPage() {
  const [activeTab, setActiveTab] = useState<"active_dashboard" | "all_devices">("active_dashboard");
  const [activePagers, setActivePagers] = useState<ActivePager[]>(MOCK_ACTIVE_PAGERS);
  const [devices, setDevices] = useState<PagerDevice[]>(MOCK_ALL_DEVICES);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal Thêm Thẻ Mới
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPagerCode, setNewPagerCode] = useState("");
  const [newBatteryLevel, setNewBatteryLevel] = useState(100);
  const [newChargingDock, setNewChargingDock] = useState("Khay A");

  // Xử lý thu hồi thẻ (Release)
  const handleReleasePager = (pagerId: string, pagerCode: string) => {
    setActivePagers((prev) => prev.filter((p) => p.id !== pagerId));
    setDevices((prev) =>
      prev.map((d) =>
        d.pagerCode === pagerCode
          ? { ...d, status: "AVAILABLE", currentOrder: undefined }
          : d
      )
    );
  };

  // Xử lý rung chuông gọi khách
  const handleBuzzPager = (pagerCode: string) => {
    alert(`Đang gửi tín hiệu RUNG & PHÁT ÂM THANH đến thẻ ${pagerCode}!`);
  };

  // Thêm thẻ mới
  const handleAddDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPagerCode) return;
    const newDev: PagerDevice = {
      id: `dev-${Date.now()}`,
      pagerCode: newPagerCode.toUpperCase(),
      batteryLevel: Number(newBatteryLevel),
      status: "AVAILABLE",
      chargingDock: newChargingDock,
      lastMaintenance: new Date().toLocaleDateString("vi-VN"),
    };
    setDevices((prev) => [...prev, newDev]);
    setIsAddModalOpen(false);
    setNewPagerCode("");
    setNewBatteryLevel(100);
  };

  // Lọc danh sách theo search
  const filteredActivePagers = activePagers.filter(
    (p) =>
      p.pagerCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDevices = devices.filter(
    (d) =>
      d.pagerCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.chargingDock.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderBatteryIndicator = (battery: number) => {
    if (battery < 15) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200/80">
          <BatteryWarning className="w-3.5 h-3.5 text-rose-600 animate-bounce" />
          {battery}% (Pin yếu)
        </span>
      );
    }
    if (battery < 50) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/80">
          <BatteryLow className="w-3.5 h-3.5" />
          {battery}%
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
        <BatteryMedium className="w-3.5 h-3.5" />
        {battery}%
      </span>
    );
  };

  const getDeviceStatusBadge = (status: PagerStatus) => {
    switch (status) {
      case "AVAILABLE":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Sẵn sàng
          </span>
        );
      case "IN_USE":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#F5EBE6] text-[#6F4E37] border border-[#E8D6CB]">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            Đang phát
          </span>
        );
      case "CHARGING":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/70">
            <BatteryCharging className="w-3.5 h-3.5 text-blue-600" />
            Đang sạc
          </span>
        );
      case "MAINTENANCE":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <Wrench className="w-3.5 h-3.5 text-slate-500" />
            Bảo trì
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-gray-800 font-sans antialiased pb-12">
      {/* 1. HEADER */}
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
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#F5EBE6] text-[#6F4E37] flex items-center justify-center font-bold">
                <BellRing className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  Bảng điều phối & Thu hồi Thẻ rung
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  Giám sát thẻ rung đang phục vụ, mức pin và quản lý thiết bị phần cứng
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/pos/terminal"
              className="px-4 py-2 rounded-xl bg-[#6F4E37] hover:bg-[#5A3F2C] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Về Thu ngân POS
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-5">
        {/* 2. THANH TAB CHUYỂN ĐỔI */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-gray-200/80 shadow-2xs w-fit">
            <button
              type="button"
              onClick={() => setActiveTab("active_dashboard")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "active_dashboard"
                  ? "bg-[#6F4E37] text-white shadow-xs"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <Radio className="w-4 h-4" />
              <span>Điều phối thẻ đang phát</span>
              <span
                className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold ${
                  activeTab === "active_dashboard"
                    ? "bg-[#F5EBE6] text-[#6F4E37]"
                    : "bg-gray-100 text-gray-700"
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
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Quản lý thiết bị phần cứng</span>
              <span
                className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold ${
                  activeTab === "all_devices"
                    ? "bg-[#F5EBE6] text-[#6F4E37]"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {devices.length}
              </span>
            </button>
          </div>

          {/* Action button if tab 2 */}
          {activeTab === "all_devices" && (
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6F4E37] hover:bg-[#5A3F2C] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm thẻ rung mới</span>
            </button>
          )}
        </div>

        {/* 3. TOOLBAR TÌM KIẾM */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo mã thẻ PAGER-..., mã đơn, tên khách..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 transition-colors focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
            />
          </div>

          <div className="text-xs text-gray-500 font-medium hidden sm:block">
            {activeTab === "active_dashboard"
              ? `Đang có ${filteredActivePagers.length} thẻ đang giao cho khách`
              : `Tổng ${filteredDevices.length} thiết bị trong hệ thống`}
          </div>
        </div>

        {/* ========================================================
            4. TAB 1: BẢNG ĐIỀU PHỐI (Active Pagers Dashboard)
            ======================================================== */}
        {activeTab === "active_dashboard" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                    <th scope="col" className="py-3.5 px-5">
                      Mã Thẻ (Pager Code)
                    </th>
                    <th scope="col" className="py-3.5 px-5">
                      Mức Pin
                    </th>
                    <th scope="col" className="py-3.5 px-5">
                      Mã đơn liên kết
                    </th>
                    <th scope="col" className="py-3.5 px-5">
                      Khách hàng & SĐT
                    </th>
                    <th scope="col" className="py-3.5 px-5">
                      Thời gian chờ
                    </th>
                    <th scope="col" className="py-3.5 px-5">
                      Trạng thái món
                    </th>
                    <th scope="col" className="py-3.5 px-5 text-right">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {filteredActivePagers.length > 0 ? (
                    filteredActivePagers.map((pager) => {
                      const isOverdue = pager.waitingMinutes > 15;

                      return (
                        <tr
                          key={pager.id}
                          className="hover:bg-gray-50/60 transition-colors group"
                        >
                          {/* Mã Thẻ */}
                          <td className="py-3.5 px-5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-xl bg-[#F5EBE6] text-[#6F4E37] flex items-center justify-center font-bold text-xs shrink-0">
                                <Radio className="w-4 h-4" />
                              </div>
                              <span className="font-extrabold text-gray-900 group-hover:text-[#6F4E37] transition-colors">
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
                            <span className="font-semibold text-gray-800 text-xs font-mono">
                              {pager.orderNumber}
                            </span>
                          </td>

                          {/* Khách hàng & SĐT */}
                          <td className="py-3.5 px-5">
                            <div>
                              <span className="font-semibold text-gray-900 text-xs block">
                                {pager.customerName}
                              </span>
                              {pager.customerPhone && (
                                <span className="text-[11px] text-gray-400 font-mono">
                                  {pager.customerPhone}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Số phút đã chờ */}
                          <td className="py-3.5 px-5">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-gray-400" />
                              <span
                                className={`text-xs font-bold ${
                                  isOverdue
                                    ? "text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200"
                                    : "text-gray-700"
                                }`}
                              >
                                {pager.waitingMinutes} phút
                              </span>
                            </div>
                          </td>

                          {/* Trạng thái món */}
                          <td className="py-3.5 px-5">
                            {pager.orderStatus === "READY" ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                                Món đã xong • Gọi khách
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                Đang pha chế
                              </span>
                            )}
                          </td>

                          {/* Thao tác */}
                          <td className="py-3.5 px-5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* Rung chuông */}
                              <button
                                type="button"
                                onClick={() => handleBuzzPager(pager.pagerCode)}
                                className="px-2.5 py-1.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                                title="Rung chuông & Nhấp nháy gọi khách"
                              >
                                <Zap className="w-3.5 h-3.5 text-blue-600" />
                                <span>Rung chuông</span>
                              </button>

                              {/* Thu hồi thẻ */}
                              <button
                                type="button"
                                onClick={() => handleReleasePager(pager.id, pager.pagerCode)}
                                className="px-3 py-1.5 rounded-xl bg-[#6F4E37] hover:bg-[#5A3F2C] text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                                title="Thu hồi thẻ về khay sạc"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Thu hồi</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-12 text-center text-gray-400 text-sm"
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
            5. TAB 2: QUẢN LÝ THIẾT BỊ PHẦN CỨNG (All Devices)
            ======================================================== */}
        {activeTab === "all_devices" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                    <th scope="col" className="py-3.5 px-5">
                      Mã Thiết bị
                    </th>
                    <th scope="col" className="py-3.5 px-5">
                      Mức Pin
                    </th>
                    <th scope="col" className="py-3.5 px-5">
                      Trạng thái hoạt động
                    </th>
                    <th scope="col" className="py-3.5 px-5">
                      Đơn hàng hiện tại
                    </th>
                    <th scope="col" className="py-3.5 px-5">
                      Khay sạc / Vị trí
                    </th>
                    <th scope="col" className="py-3.5 px-5">
                      Bảo dưỡng gần nhất
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {filteredDevices.length > 0 ? (
                    filteredDevices.map((dev) => (
                      <tr
                        key={dev.id}
                        className="hover:bg-gray-50/60 transition-colors group"
                      >
                        <td className="py-3.5 px-5">
                          <span className="font-extrabold text-gray-900 group-hover:text-[#6F4E37] transition-colors">
                            {dev.pagerCode}
                          </span>
                        </td>

                        <td className="py-3.5 px-5">
                          {renderBatteryIndicator(dev.batteryLevel)}
                        </td>

                        <td className="py-3.5 px-5">
                          {getDeviceStatusBadge(dev.status)}
                        </td>

                        <td className="py-3.5 px-5 font-mono text-xs text-gray-700">
                          {dev.currentOrder ? (
                            <span className="font-bold text-[#6F4E37]">
                              {dev.currentOrder}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>

                        <td className="py-3.5 px-5 text-xs text-gray-600">
                          {dev.chargingDock}
                        </td>

                        <td className="py-3.5 px-5 text-xs text-gray-400 font-mono">
                          {dev.lastMaintenance}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-12 text-center text-gray-400 text-sm"
                      >
                        Không tìm thấy thiết bị nào phù hợp.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================
          6. MODAL THÊM THẺ RUNG MỚI
          ======================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#F5EBE6] text-[#6F4E37] flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-gray-900">
                  Thêm Thẻ rung mới
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddDevice} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700">
                  Mã thẻ rung (VD: PAGER-16) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newPagerCode}
                  onChange={(e) => setNewPagerCode(e.target.value)}
                  placeholder="Nhập mã thẻ rung..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20 uppercase"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700">
                  Mức pin ban đầu (%)
                </label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={newBatteryLevel}
                  onChange={(e) => setNewBatteryLevel(Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700">
                  Vị trí khay sạc
                </label>
                <input
                  type="text"
                  value={newChargingDock}
                  onChange={(e) => setNewChargingDock(e.target.value)}
                  placeholder="VD: Khay A - Vị trí 06"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-50 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#6F4E37] hover:bg-[#5A3F2C] text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Xác nhận thêm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
