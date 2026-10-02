"use client";

import { useState, useSyncExternalStore } from "react";
import {
  Scale,
  Plus,
  Search,
  X,
  CheckCircle2,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  History,
  ChevronDown,
} from "lucide-react";

// Safe hydration hook recommended by React 18 & 19
const emptySubscribe = () => () => {};
function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

// Types
interface MasterIngredient {
  id: string;
  name: string;
  unit: string;
  currentStock: number;
  unitCost: number;
}

interface AdjustmentRecord {
  id: string;
  ticketCode: string;
  ingredientId: string;
  ingredientName: string;
  unit: string;
  staffName: string;
  oldQuantity: number;
  newQuantity: number;
  difference: number; // newQuantity - oldQuantity
  unitCost: number;
  financialImpact: number; // difference * unitCost
  reason: string;
  adjustedAt: string;
}

const RAW_INGREDIENTS: MasterIngredient[] = [
  { id: "ING-01", name: "Hạt Robusta xay sẵn", unit: "kg", currentStock: 45.5, unitCost: 160000 },
  { id: "ING-02", name: "Hạt Arabica Cầu Đất", unit: "kg", currentStock: 22.0, unitCost: 280000 },
  { id: "ING-03", name: "Sữa đặc Ông Thọ", unit: "lon", currentStock: 120, unitCost: 24000 },
  { id: "ING-04", name: "Sữa tươi tiệt trùng Barista", unit: "lít", currentStock: 68.5, unitCost: 32000 },
  { id: "ING-05", name: "Kem béo thực vật Rich's", unit: "hộp", currentStock: 35, unitCost: 38000 },
  { id: "ING-06", name: "Whipping Cream Anchor", unit: "lít", currentStock: 14.0, unitCost: 145000 },
  { id: "ING-07", name: "Syrup Caramel Davinci", unit: "chai", currentStock: 8, unitCost: 210000 },
  { id: "ING-08", name: "Trà sen Bảo Lộc thượng hạng", unit: "kg", currentStock: 18.2, unitCost: 220000 },
  { id: "ING-09", name: "Hạt sen ngâm đường", unit: "hộp", currentStock: 25, unitCost: 65000 },
  { id: "ING-10", name: "Bột Phô mai béo nguyên chất", unit: "kg", currentStock: 12.5, unitCost: 190000 },
  { id: "ING-11", name: "Trân châu sống Gia Uy", unit: "kg", currentStock: 50.0, unitCost: 42000 },
  { id: "ING-12", name: "Đường đen Nữ Hoàng", unit: "kg", currentStock: 30.0, unitCost: 38000 },
];

const MOCK_ADJUSTMENTS: AdjustmentRecord[] = [
  {
    id: "adj-1",
    ticketCode: "ADJ-2026-001",
    ingredientId: "ING-04",
    ingredientName: "Sữa tươi tiệt trùng Barista",
    unit: "lít",
    staffName: "Nguyễn Văn Hùng (Barista Lead)",
    oldQuantity: 70.0,
    newQuantity: 68.5,
    difference: -1.5,
    unitCost: 32000,
    financialImpact: -48000,
    reason: "Đổ vỡ 1 hộp sữa và hao hụt bọt sữa trong ca sáng",
    adjustedAt: "02/10/2026 15:30",
  },
  {
    id: "adj-2",
    ticketCode: "ADJ-2026-002",
    ingredientId: "ING-01",
    ingredientName: "Hạt Robusta xay sẵn",
    unit: "kg",
    staffName: "Lê Văn Kho (Thủ kho)",
    oldQuantity: 46.2,
    newQuantity: 45.5,
    difference: -0.7,
    unitCost: 160000,
    financialImpact: -112000,
    reason: "Cân chỉnh cối xay máy pha espresso đầu ca",
    adjustedAt: "01/10/2026 19:45",
  },
  {
    id: "adj-3",
    ticketCode: "ADJ-2026-003",
    ingredientId: "ING-03",
    ingredientName: "Sữa đặc Ông Thọ",
    unit: "lon",
    staffName: "Trần Thị Mai (Quản lý)",
    oldQuantity: 118,
    newQuantity: 120,
    difference: 2,
    unitCost: 24000,
    financialImpact: 48000,
    reason: "Kiểm kê bù số lượng từ đợt nhập bổ sung chưa lên phiếu",
    adjustedAt: "30/09/2026 21:00",
  },
  {
    id: "adj-4",
    ticketCode: "ADJ-2026-004",
    ingredientId: "ING-06",
    ingredientName: "Whipping Cream Anchor",
    unit: "lít",
    staffName: "Lê Văn Kho (Thủ kho)",
    oldQuantity: 14.8,
    newQuantity: 14.0,
    difference: -0.8,
    unitCost: 145000,
    financialImpact: -116000,
    reason: "Hao hụt dính bình xịt kem và đánh bông foam",
    adjustedAt: "28/09/2026 18:20",
  },
  {
    id: "adj-5",
    ticketCode: "ADJ-2026-005",
    ingredientId: "ING-11",
    ingredientName: "Trân châu sống Gia Uy",
    unit: "kg",
    staffName: "Nguyễn Văn Hùng (Barista Lead)",
    oldQuantity: 52.0,
    newQuantity: 50.0,
    difference: -2.0,
    unitCost: 42000,
    financialImpact: -84000,
    reason: "Hỏng mẻ luộc trân châu cuối ngày do quên hẹn giờ",
    adjustedAt: "26/09/2026 22:15",
  },
];

export default function InventoryAdjustmentsPage() {
  // Hydration safe mounting state with useSyncExternalStore
  const isMounted = useIsMounted();

  const [adjustments, setAdjustments] = useState<AdjustmentRecord[]>(MOCK_ADJUSTMENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "LOSS" | "SURPLUS">("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIngId, setSelectedIngId] = useState<string>(RAW_INGREDIENTS[0].id);
  const [inputNewQty, setInputNewQty] = useState<number>(RAW_INGREDIENTS[0].currentStock);
  const [inputReason, setInputReason] = useState<string>("");

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Selected Ingredient for Modal
  const currentIngredient = RAW_INGREDIENTS.find((i) => i.id === selectedIngId) || RAW_INGREDIENTS[0];
  const calculatedDiff = Number((inputNewQty - currentIngredient.currentStock).toFixed(3));
  const estimatedCostImpact = Math.round(calculatedDiff * currentIngredient.unitCost);

  // Filtered Records
  const filteredAdjustments = adjustments.filter((adj) => {
    const matchSearch =
      !searchQuery ||
      adj.ingredientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      adj.ticketCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      adj.staffName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      adj.reason.toLowerCase().includes(searchQuery.toLowerCase());

    const matchType =
      filterType === "ALL" ||
      (filterType === "LOSS" && adj.difference < 0) ||
      (filterType === "SURPLUS" && adj.difference > 0);

    return matchSearch && matchType;
  });

  // Calculate KPIs
  const totalAdjustments = adjustments.length;
  const lossCount = adjustments.filter((a) => a.difference < 0).length;
  const surplusCount = adjustments.filter((a) => a.difference > 0).length;
  const totalLossValue = adjustments
    .filter((a) => a.difference < 0)
    .reduce((sum, a) => sum + Math.abs(a.financialImpact), 0);

  // Open Modal
  const handleOpenModal = () => {
    const first = RAW_INGREDIENTS[0];
    setSelectedIngId(first.id);
    setInputNewQty(first.currentStock);
    setInputReason("");
    setIsModalOpen(true);
  };

  // Handle Ingredient Change in Modal
  const handleIngredientChange = (id: string) => {
    setSelectedIngId(id);
    const ing = RAW_INGREDIENTS.find((i) => i.id === id);
    if (ing) {
      setInputNewQty(ing.currentStock);
    }
  };

  // Handle Form Submit
  const handleCreateAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputReason.trim()) {
      alert("Vui lòng nhập lý do điều chỉnh hao hụt / thừa kho!");
      return;
    }

    if (calculatedDiff === 0) {
      alert("Số lượng kiểm kê thực tế bằng tồn cũ hệ thống (Độ chênh lệch = 0). Không cần điều chỉnh!");
      return;
    }

    const nextNumber = adjustments.length + 1;
    const paddedNum = nextNumber.toString().padStart(3, "0");
    const todayStr = "02/10/2026 22:30";

    const newRecord: AdjustmentRecord = {
      id: `adj-${paddedNum}`,
      ticketCode: `ADJ-2026-${paddedNum}`,
      ingredientId: currentIngredient.id,
      ingredientName: currentIngredient.name,
      unit: currentIngredient.unit,
      staffName: "Nguyễn Thu Ngân (Thủ kho)",
      oldQuantity: currentIngredient.currentStock,
      newQuantity: Number(inputNewQty),
      difference: calculatedDiff,
      unitCost: currentIngredient.unitCost,
      financialImpact: estimatedCostImpact,
      reason: inputReason.trim(),
      adjustedAt: todayStr,
    };

    setAdjustments([newRecord, ...adjustments]);
    setIsModalOpen(false);
    showToast(`Đã ghi nhận phiếu cân kho hao hụt #${newRecord.ticketCode}!`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#6F4E37] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <span className="font-medium text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-[#F5EBE6] rounded-xl text-[#6F4E37]">
              <Scale className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Kiểm kê & Cân kho Hao hụt
            </h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Ghi nhận chênh lệch thực tế, đối soát tồn kho định kỳ và hạch toán chi phí hao hụt nguyên vật liệu
          </p>
        </div>

        <button
          onClick={handleOpenModal}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#6F4E37] hover:bg-[#5A3F2C] text-white rounded-xl font-semibold text-sm transition-all shadow-sm shadow-[#6F4E37]/20"
        >
          <Plus className="w-4 h-4" />
          <span>+ Lập phiếu cân kho hao hụt</span>
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#F5EBE6] text-[#6F4E37] flex items-center justify-center font-bold">
            <History className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Tổng số lần cân kho</p>
            <p className="text-lg font-bold text-gray-900">
              {isMounted ? totalAdjustments : 0}{" "}
              <span className="text-xs text-gray-500 font-normal">phiếu</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Hao hụt (Thiếu kho)</p>
            <p className="text-lg font-bold text-red-600">
              {isMounted ? lossCount : 0}{" "}
              <span className="text-xs text-gray-500 font-normal">mặt hàng</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Thừa kho (Dương)</p>
            <p className="text-lg font-bold text-emerald-700">
              {isMounted ? surplusCount : 0}{" "}
              <span className="text-xs text-gray-500 font-normal">mặt hàng</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Giá trị hao hụt ước tính</p>
            <p className="text-lg font-bold text-amber-700">
              {isMounted ? `-${totalLossValue.toLocaleString()} đ` : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Toolbar: Search & Type Filter */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên nguyên liệu, nhân viên kiểm kê, lý do hoặc mã phiếu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6F4E37] focus:bg-white"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterType("ALL")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterType === "ALL"
                ? "bg-[#6F4E37] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Tất cả ({isMounted ? adjustments.length : 0})
          </button>
          <button
            onClick={() => setFilterType("LOSS")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterType === "LOSS"
                ? "bg-red-600 text-white"
                : "bg-red-50 text-red-600 hover:bg-red-100"
            }`}
          >
            Hao hụt âm ({isMounted ? lossCount : 0})
          </button>
          <button
            onClick={() => setFilterType("SURPLUS")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterType === "SURPLUS"
                ? "bg-emerald-600 text-white"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            }`}
          >
            Thừa kho dương ({isMounted ? surplusCount : 0})
          </button>
        </div>
      </div>

      {/* History Data Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF6F0] text-gray-600 text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
                <th className="py-3.5 px-5">Mã phiếu</th>
                <th className="py-3.5 px-5">Tên nguyên liệu</th>
                <th className="py-3.5 px-3 text-center">ĐVT</th>
                <th className="py-3.5 px-5">Nhân viên kiểm kê</th>
                <th className="py-3.5 px-4 text-center">Tồn cũ hệ thống</th>
                <th className="py-3.5 px-4 text-center">Tồn thực tế</th>
                <th className="py-3.5 px-4 text-center">Chênh lệch</th>
                <th className="py-3.5 px-5">Lý do điều chỉnh / hao hụt</th>
                <th className="py-3.5 px-5 text-right">Ngày thực hiện</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredAdjustments.length > 0 ? (
                filteredAdjustments.map((adj) => {
                  const isNegative = adj.difference < 0;
                  const isPositive = adj.difference > 0;

                  return (
                    <tr key={adj.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3.5 px-5">
                        <span className="font-mono font-bold text-[#6F4E37] bg-[#F5EBE6] px-2.5 py-1 rounded-lg text-xs">
                          #{adj.ticketCode}
                        </span>
                      </td>
                      <td className="py-3.5 px-5">
                        <div className="font-semibold text-gray-900">{adj.ingredientName}</div>
                        <span className="text-xs text-gray-400 font-mono">{adj.ingredientId}</span>
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                          {adj.unit}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-gray-800 text-xs font-medium">
                        {adj.staffName}
                      </td>
                      <td className="py-3.5 px-4 text-center font-medium text-gray-600">
                        {adj.oldQuantity}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-gray-900">
                        {adj.newQuantity}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {isNegative && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 rounded-lg font-mono font-bold text-xs">
                            <TrendingDown className="w-3 h-3" />
                            {adj.difference} {adj.unit}
                          </span>
                        )}
                        {isPositive && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg font-mono font-bold text-xs">
                            <TrendingUp className="w-3 h-3" />
                            +{adj.difference} {adj.unit}
                          </span>
                        )}
                        {adj.difference === 0 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs font-mono font-medium">
                            0 {adj.unit}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-5 text-xs text-gray-700 max-w-xs">
                        <p className="line-clamp-2">{adj.reason}</p>
                      </td>
                      <td className="py-3.5 px-5 text-right text-xs text-gray-500 font-medium">
                        {isMounted ? adj.adjustedAt : "—"}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-gray-400">
                    Không tìm thấy phiếu kiểm kê cân kho nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Cân kho Hao hụt (InventoryAdjustmentModal) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-5 bg-[#FAF6F0] border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white rounded-xl text-[#6F4E37] shadow-xs">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Lập phiếu cân kho & điều chỉnh hao hụt</h3>
                  <p className="text-xs text-gray-500">
                    Cập nhật lại số tồn thực tế và hạch toán chênh lệch
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200/50 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateAdjustment} className="p-6 space-y-4">
              {/* 1. Chọn Nguyên liệu */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                  1. Chọn nguyên liệu kiểm kê <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedIngId}
                    onChange={(e) => handleIngredientChange(e.target.value)}
                    className="w-full pl-3.5 pr-10 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6F4E37] appearance-none cursor-pointer"
                  >
                    {RAW_INGREDIENTS.map((ing) => (
                      <option key={ing.id} value={ing.id}>
                        {ing.name} (Tồn hệ thống: {ing.currentStock} {ing.unit})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* 2. Hiển thị Tồn cũ & Nhập Tồn mới */}
              <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div>
                  <span className="text-xs font-medium text-gray-500">Tồn cũ hệ thống:</span>
                  <div className="text-lg font-bold text-gray-800 mt-1">
                    {currentIngredient.currentStock}{" "}
                    <span className="text-xs font-normal text-gray-500">{currentIngredient.unit}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Tồn thực tế kiểm kê <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.001"
                      min="0"
                      required
                      value={inputNewQty}
                      onChange={(e) => setInputNewQty(parseFloat(e.target.value) || 0)}
                      className="w-full pl-3 pr-10 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-medium">
                      {currentIngredient.unit}
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. Chênh lệch tự động tính */}
              <div
                className={`p-4 rounded-xl border flex items-center justify-between transition-colors ${
                  calculatedDiff < 0
                    ? "bg-red-50 border-red-200 text-red-800"
                    : calculatedDiff > 0
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : "bg-gray-100 border-gray-200 text-gray-700"
                }`}
              >
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    {calculatedDiff < 0
                      ? "Phát hiện hao hụt (Thiếu kho):"
                      : calculatedDiff > 0
                      ? "Phát hiện dôi dư (Thừa kho):"
                      : "Không có chênh lệch:"}
                  </span>
                  <p className="text-xs opacity-80 mt-0.5">
                    Ảnh hưởng giá vốn: ~{Math.abs(estimatedCostImpact).toLocaleString()} VNĐ
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-mono font-bold">
                    {calculatedDiff > 0 ? `+${calculatedDiff}` : calculatedDiff} {currentIngredient.unit}
                  </span>
                </div>
              </div>

              {/* 4. Lý do hao hụt (Bắt buộc) */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                  Lý do hao hụt / căn cứ điều chỉnh <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={inputReason}
                  onChange={(e) => setInputReason(e.target.value)}
                  placeholder="VD: Rơi vỡ trong ca, hao hụt bọt sữa, hỏng nguyên liệu khi pha chế, cân kiểm định kỳ..."
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#6F4E37] hover:bg-[#5A3F2C] text-white rounded-xl text-sm font-semibold transition-colors shadow-sm shadow-[#6F4E37]/20"
                >
                  Xác nhận điều chỉnh kho
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
