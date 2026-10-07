"use client";

import { useState, useEffect } from "react";
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
  Loader2,
  RefreshCw,
} from "lucide-react";
import inventoryService from "@/api/inventory.service";

interface Ingredient {
  id: number;
  name: string;
  unit: string;
  stockQuantity: number;
}

interface AdjustmentRecord {
  id: number;
  ticketCode?: string;
  ingredientId: number;
  ingredientName?: string;
  unit?: string;
  staffName?: string;
  oldQuantity?: number;
  newQuantity?: number;
  difference?: number;
  reason?: string;
  adjustedAt?: string;
  createdAt?: string;
}

export default function InventoryAdjustmentsPage() {
  const [adjustments, setAdjustments] = useState<AdjustmentRecord[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "LOSS" | "SURPLUS">("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIngId, setSelectedIngId] = useState<number | "">("");
  const [inputNewQty, setInputNewQty] = useState<number>(0);
  const [inputReason, setInputReason] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [adjRes, ingsRes] = await Promise.all([
        inventoryService.getAdjustments().catch(() => []),
        inventoryService.getIngredients().catch(() => []),
      ]);
      setAdjustments(Array.isArray(adjRes) ? adjRes : []);
      setIngredients(Array.isArray(ingsRes) ? ingsRes : []);
    } catch (err) {
      console.error("Failed to load adjustments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const currentIngredient = ingredients.find((i) => i.id === selectedIngId) || ingredients[0];
  const calculatedDiff = currentIngredient
    ? Number((inputNewQty - Number(currentIngredient.stockQuantity)).toFixed(3))
    : 0;

  const filteredAdjustments = adjustments.filter((adj) => {
    const query = searchQuery.toLowerCase();
    const matchSearch =
      !searchQuery ||
      (adj.ingredientName || "").toLowerCase().includes(query) ||
      (adj.reason || "").toLowerCase().includes(query) ||
      adj.id.toString().includes(query);

    const diff = Number(adj.difference || 0);
    const matchType =
      filterType === "ALL" ||
      (filterType === "LOSS" && diff < 0) ||
      (filterType === "SURPLUS" && diff > 0);

    return matchSearch && matchType;
  });

  const totalAdjustments = adjustments.length;
  const lossCount = adjustments.filter((a) => Number(a.difference || 0) < 0).length;
  const surplusCount = adjustments.filter((a) => Number(a.difference || 0) > 0).length;

  const handleOpenModal = () => {
    if (ingredients.length > 0) {
      setSelectedIngId(ingredients[0].id);
      setInputNewQty(Number(ingredients[0].stockQuantity));
    } else {
      setSelectedIngId("");
      setInputNewQty(0);
    }
    setInputReason("");
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleIngredientChange = (id: number) => {
    setSelectedIngId(id);
    const ing = ingredients.find((i) => i.id === id);
    if (ing) {
      setInputNewQty(Number(ing.stockQuantity));
    }
  };

  const handleCreateAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIngId) {
      setErrorMsg("Vui lòng chọn nguyên liệu");
      return;
    }
    if (!inputReason.trim()) {
      setErrorMsg("Vui lòng nhập lý do điều chỉnh hao hụt / thừa kho");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      await inventoryService.createAdjustment({
        ingredientId: Number(selectedIngId),
        employeeId: 1,
        newQuantity: Number(inputNewQty),
        reason: inputReason.trim(),
      });

      setIsModalOpen(false);
      showToast("Đã ghi nhận phiếu cân kho hao hụt!");
      await loadData();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Có lỗi xảy ra khi lập phiếu cân kho");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
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
            Ghi nhận chênh lệch thực tế, đối soát tồn kho định kỳ và hạch toán hao hụt nguyên vật liệu
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadData}
            className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer"
            title="Làm mới"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            type="button"
            onClick={handleOpenModal}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#6F4E37] hover:bg-[#5A3F2C] text-white rounded-xl font-semibold text-sm transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Lập phiếu cân kho hao hụt</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#F5EBE6] text-[#6F4E37] flex items-center justify-center font-bold">
            <History className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Tổng số lần cân kho</p>
            <p className="text-lg font-bold text-gray-900">
              {totalAdjustments} <span className="text-xs text-gray-500 font-normal">phiếu</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Lần hao hụt (Âm)</p>
            <p className="text-lg font-bold text-rose-600">
              {lossCount} <span className="text-xs text-gray-500 font-normal">lần</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Lần dư kho (Dương)</p>
            <p className="text-lg font-bold text-emerald-700">
              {surplusCount} <span className="text-xs text-gray-500 font-normal">lần</span>
            </p>
          </div>
        </div>
      </div>

      {/* Toolbar: Search & Type Filter */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Tìm theo tên nguyên liệu hoặc lý do..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6F4E37] focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilterType("ALL")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
              filterType === "ALL"
                ? "bg-[#6F4E37] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Tất cả ({adjustments.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType("LOSS")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
              filterType === "LOSS"
                ? "bg-rose-600 text-white"
                : "bg-rose-50 text-rose-600 hover:bg-rose-100"
            }`}
          >
            Hao hụt âm ({lossCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterType("SURPLUS")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
              filterType === "SURPLUS"
                ? "bg-emerald-600 text-white"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            }`}
          >
            Thừa kho dương ({surplusCount})
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF6F0] text-gray-600 text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
                <th className="py-3.5 px-5">Mã phiếu</th>
                <th className="py-3.5 px-5">Tên nguyên liệu</th>
                <th className="py-3.5 px-4 text-center">Tồn cũ</th>
                <th className="py-3.5 px-4 text-center">Tồn thực tế</th>
                <th className="py-3.5 px-4 text-center">Chênh lệch</th>
                <th className="py-3.5 px-5">Lý do điều chỉnh</th>
                <th className="py-3.5 px-5 text-right">Thời gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#6F4E37]" />
                    Đang tải danh sách cân kho...
                  </td>
                </tr>
              ) : filteredAdjustments.length > 0 ? (
                filteredAdjustments.map((adj) => {
                  const diff = Number(adj.difference || 0);
                  const isNegative = diff < 0;
                  const isPositive = diff > 0;

                  return (
                    <tr key={adj.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3.5 px-5">
                        <span className="font-mono font-bold text-[#6F4E37] bg-[#F5EBE6] px-2.5 py-1 rounded-lg text-xs">
                          #ADJ-{String(adj.id).padStart(3, "0")}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 font-semibold text-gray-900">
                        {adj.ingredientName || `Nguyên liệu #${adj.ingredientId}`}
                      </td>
                      <td className="py-3.5 px-4 text-center font-medium text-gray-600">
                        {adj.oldQuantity ?? "—"}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-gray-900">
                        {adj.newQuantity ?? "—"}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {isNegative && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg font-mono font-bold text-xs">
                            <TrendingDown className="w-3 h-3" />
                            {diff} {adj.unit || ""}
                          </span>
                        )}
                        {isPositive && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg font-mono font-bold text-xs">
                            <TrendingUp className="w-3 h-3" />
                            +{diff} {adj.unit || ""}
                          </span>
                        )}
                        {!isNegative && !isPositive && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs font-mono font-medium">
                            0
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-5 text-xs text-gray-700 max-w-xs">
                        <p className="line-clamp-2">{adj.reason || "—"}</p>
                      </td>
                      <td className="py-3.5 px-5 text-right text-xs text-gray-500 font-medium">
                        {adj.adjustedAt || adj.createdAt
                          ? new Date(adj.adjustedAt || adj.createdAt!).toLocaleString("vi-VN")
                          : "—"}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    Chưa có lịch sử cân kho hao hụt.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Cân kho Hao hụt */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="p-5 bg-[#FAF6F0] border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white rounded-xl text-[#6F4E37] shadow-xs">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Lập phiếu cân kho & hao hụt</h3>
                  <p className="text-xs text-gray-500">
                    Cập nhật lại số tồn thực tế và hạch toán chênh lệch
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateAdjustment} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                  1. Chọn nguyên liệu kiểm kê <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedIngId}
                    onChange={(e) => handleIngredientChange(Number(e.target.value))}
                    className="w-full pl-3.5 pr-10 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6F4E37] appearance-none cursor-pointer"
                  >
                    {ingredients.map((ing) => (
                      <option key={ing.id} value={ing.id}>
                        {ing.name} (Tồn hệ thống: {Number(ing.stockQuantity)} {ing.unit})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div>
                  <span className="text-xs font-medium text-gray-500">Tồn cũ hệ thống:</span>
                  <div className="text-lg font-bold text-gray-800 mt-1">
                    {currentIngredient ? Number(currentIngredient.stockQuantity) : 0}{" "}
                    <span className="text-xs font-normal text-gray-500">
                      {currentIngredient?.unit}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Tồn thực tế kiểm kê <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      min="0"
                      required
                      value={inputNewQty}
                      onChange={(e) => setInputNewQty(parseFloat(e.target.value) || 0)}
                      className="w-full pl-3 pr-10 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-medium">
                      {currentIngredient?.unit}
                    </span>
                  </div>
                </div>
              </div>

              <div
                className={`p-4 rounded-xl border flex items-center justify-between transition-colors ${
                  calculatedDiff < 0
                    ? "bg-rose-50 border-rose-200 text-rose-800"
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
                </div>
                <div className="text-right">
                  <span className="text-xl font-mono font-bold">
                    {calculatedDiff > 0 ? `+${calculatedDiff}` : calculatedDiff}{" "}
                    {currentIngredient?.unit}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                  Lý do hao hụt / căn cứ điều chỉnh <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={inputReason}
                  onChange={(e) => setInputReason(e.target.value)}
                  placeholder="VD: Rơi vỡ trong ca, hao hụt bọt sữa, hỏng nguyên liệu khi pha chế..."
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-[#6F4E37] hover:bg-[#5A3F2C] text-white rounded-xl text-sm font-semibold transition-colors shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Xác nhận điều chỉnh</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
