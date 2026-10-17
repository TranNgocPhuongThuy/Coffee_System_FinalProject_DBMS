"use client";

import { useState, useEffect } from "react";
import {
  FileDown,
  Plus,
  Search,
  Eye,
  X,
  Trash2,
  CheckCircle2,
  PackagePlus,
  Printer,
  DollarSign,
  TrendingUp,
  Building2,
  FileText,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import inventoryService from "@/api/inventory.service";

interface ImportDetail {
  id?: number;
  ingredientId: number;
  ingredientName?: string;
  unit?: string;
  quantity: number;
  unitPrice: number;
  totalLineAmount?: number;
}

interface ImportTicket {
  id: number;
  supplierName?: string;
  createdByName?: string;
  importDate?: string;
  totalAmount: number;
  note?: string;
  details?: ImportDetail[];
}

interface Ingredient {
  id: number;
  name: string;
  unit: string;
}

export default function InventoryImportsPage() {
  const { user } = useAuthContext();
  const [tickets, setTickets] = useState<ImportTicket[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchSupplier, setSearchSupplier] = useState("");

  // Drawer Detail State
  const [selectedTicket, setSelectedTicket] = useState<ImportTicket | null>(null);
  const [drawerDetails, setDrawerDetails] = useState<ImportDetail[]>([]);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Modal Create Ticket State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formSupplier, setFormSupplier] = useState("");
  const [formNote, setFormNote] = useState("");
  const [formLines, setFormLines] = useState<
    { id: string; ingredientId: number; quantity: number; unitPrice: number }[]
  >([]);
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
      const [importsRes, ingsRes] = await Promise.all([
        inventoryService.getImports().catch(() => []),
        inventoryService.getIngredients().catch(() => []),
      ]);
      setTickets(Array.isArray(importsRes) ? importsRes : []);
      setIngredients(Array.isArray(ingsRes) ? ingsRes : []);
    } catch (err) {
      console.error("Failed to load imports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredTickets = tickets.filter((t) => {
    const query = searchSupplier.toLowerCase();
    const matchSupplier = (t.supplierName || "").toLowerCase().includes(query);
    const matchCode = (t.id ? `PNK-${t.id}` : "").toLowerCase().includes(query);
    return matchSupplier || matchCode;
  });

  const totalImportValue = tickets.reduce((sum, t) => sum + (Number(t.totalAmount) || 0), 0);
  const totalTicketsCount = tickets.length;

  const handleOpenDrawer = async (ticket: ImportTicket) => {
    setSelectedTicket(ticket);
    setIsDrawerOpen(true);
    setLoadingDetail(true);
    try {
      const res = await inventoryService.getImportDetail(ticket.id);
      setDrawerDetails(Array.isArray(res) ? res : res?.details || []);
    } catch (err) {
      console.error("Failed to load import detail:", err);
      setDrawerDetails(ticket.details || []);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleOpenCreateModal = () => {
    setFormSupplier("");
    setFormNote("");
    if (ingredients.length > 0) {
      setFormLines([
        {
          id: `line-${Date.now()}`,
          ingredientId: ingredients[0].id,
          quantity: 10,
          unitPrice: 50000,
        },
      ]);
    } else {
      setFormLines([]);
    }
    setErrorMsg("");
    setIsCreateModalOpen(true);
  };

  const handleAddLine = () => {
    if (ingredients.length === 0) return;
    setFormLines([
      ...formLines,
      {
        id: `line-${Date.now()}-${Math.random()}`,
        ingredientId: ingredients[0].id,
        quantity: 1,
        unitPrice: 10000,
      },
    ]);
  };

  const handleRemoveLine = (id: string) => {
    if (formLines.length === 1) {
      alert("Phiếu nhập cần ít nhất một mặt hàng!");
      return;
    }
    setFormLines(formLines.filter((l) => l.id !== id));
  };

  const handleUpdateLine = (id: string, field: string, value: number) => {
    setFormLines((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [field]: value } : l))
    );
  };

  const modalTotalAmount = formLines.reduce(
    (sum, l) => sum + (Number(l.quantity) || 0) * (Number(l.unitPrice) || 0),
    0
  );

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSupplier.trim()) {
      setErrorMsg("Vui lòng nhập tên nhà cung cấp");
      return;
    }
    if (formLines.length === 0) {
      setErrorMsg("Vui lòng thêm ít nhất 1 mặt hàng");
      return;
    }
    setSubmitting(true);
    setErrorMsg("");

    try {
      await inventoryService.createImportTicket({
        supplierName: formSupplier.trim(),
        employeeId: user?.id || 1,
        note: formNote.trim() || undefined,
        details: formLines.map((l) => ({
          ingredientId: Number(l.ingredientId),
          quantity: Number(l.quantity),
          unitPrice: Number(l.unitPrice),
        })),
      });
      setIsCreateModalOpen(false);
      showToast("Đã tạo phiếu nhập kho thành công!");
      await loadData();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Có lỗi xảy ra khi tạo phiếu nhập kho");
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
              <PackagePlus className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Lịch sử & Quản lý Nhập kho
            </h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Theo dõi danh sách các phiếu nhập hàng từ nhà cung cấp, cập nhật giá vốn và tồn kho
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
            onClick={handleOpenCreateModal}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#6F4E37] hover:bg-[#5A3F2C] text-white rounded-xl font-semibold text-sm transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Lập phiếu nhập kho mới</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#F5EBE6] text-[#6F4E37] flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Tổng giá trị nhập kho</p>
            <p className="text-xl font-bold text-gray-900">
              {totalImportValue.toLocaleString("vi-VN")} <span className="text-sm font-normal text-gray-500">đ</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Tổng số phiếu nhập</p>
            <p className="text-xl font-bold text-gray-900">
              {totalTicketsCount} <span className="text-sm font-normal text-gray-500">phiếu</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Số loại nguyên liệu</p>
            <p className="text-xl font-bold text-amber-700">
              {ingredients.length} <span className="text-sm font-normal text-gray-500">mặt hàng</span>
            </p>
          </div>
        </div>
      </div>

      {/* Toolbar: Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Tìm theo tên nhà cung cấp hoặc mã phiếu (#PNK-...)"
            value={searchSupplier}
            onChange={(e) => setSearchSupplier(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6F4E37] focus:bg-white"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF6F0] text-gray-600 text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
                <th className="py-3.5 px-5">Mã phiếu</th>
                <th className="py-3.5 px-5">Nhà cung cấp</th>
                <th className="py-3.5 px-5">Ngày giờ nhập</th>
                <th className="py-3.5 px-5">Tổng tiền</th>
                <th className="py-3.5 px-5">Ghi chú</th>
                <th className="py-3.5 px-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#6F4E37]" />
                    Đang tải phiếu nhập kho...
                  </td>
                </tr>
              ) : filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-5">
                      <span className="font-mono font-bold text-[#6F4E37] bg-[#F5EBE6] px-2.5 py-1 rounded-lg text-xs">
                        #PNK-{String(ticket.id).padStart(3, "0")}
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="font-bold text-gray-900 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-gray-400" />
                        <span>{ticket.supplierName || "Nhà cung cấp tự do"}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-gray-600 text-xs">
                      {ticket.importDate ? new Date(ticket.importDate).toLocaleString("vi-VN") : "—"}
                    </td>
                    <td className="py-3.5 px-5 font-bold text-gray-900">
                      {Number(ticket.totalAmount).toLocaleString("vi-VN")}{" "}
                      <span className="text-xs text-gray-400 font-normal">đ</span>
                    </td>
                    <td className="py-3.5 px-5 text-xs text-gray-500 max-w-xs truncate">
                      {ticket.note || "—"}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenDrawer(ticket)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF6F0] hover:bg-[#F5EBE6] text-[#6F4E37] font-semibold text-xs rounded-lg transition-colors border border-[#6F4E37]/15 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Xem chi tiết</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    Chưa có phiếu nhập kho nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Lập Phiếu Nhập Kho Mới */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 bg-[#FAF6F0] border-b border-gray-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white rounded-xl text-[#6F4E37] shadow-xs">
                  <PackagePlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Lập phiếu nhập kho nguyên liệu</h3>
                  <p className="text-xs text-gray-500">
                    Cập nhật số lượng tồn kho tự động
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
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

            <form onSubmit={handleCreateTicket} className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                    Tên Nhà Cung Cấp
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Công ty Cà phê Việt"
                    value={formSupplier}
                    onChange={(e) => setFormSupplier(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                    Ghi chú
                  </label>
                  <input
                    type="text"
                    placeholder="Ghi chú phiếu nhập..."
                    value={formNote}
                    onChange={(e) => setFormNote(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Danh sách mặt hàng nhập ({formLines.length})
                  </label>
                  <button
                    type="button"
                    onClick={handleAddLine}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF6F0] hover:bg-[#F5EBE6] text-[#6F4E37] text-xs font-semibold rounded-lg transition-colors border border-[#6F4E37]/20 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm mặt hàng</span>
                  </button>
                </div>

                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#FAF6F0] text-gray-600 font-semibold uppercase tracking-wider border-b border-gray-200">
                        <th className="py-2.5 px-3">Tên Nguyên liệu</th>
                        <th className="py-2.5 px-3 w-28 text-center">Số lượng</th>
                        <th className="py-2.5 px-3 w-36 text-right">Đơn giá nhập</th>
                        <th className="py-2.5 px-3 w-36 text-right">Thành tiền</th>
                        <th className="py-2.5 px-2 w-10 text-center"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {formLines.map((line) => {
                        const subtotal = (Number(line.quantity) || 0) * (Number(line.unitPrice) || 0);
                        return (
                          <tr key={line.id} className="hover:bg-gray-50">
                            <td className="py-2.5 px-3">
                              <select
                                value={line.ingredientId}
                                onChange={(e) =>
                                  handleUpdateLine(line.id, "ingredientId", Number(e.target.value))
                                }
                                className="w-full py-1.5 px-2 bg-white border border-gray-300 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#6F4E37]"
                              >
                                {ingredients.map((ing) => (
                                  <option key={ing.id} value={ing.id}>
                                    {ing.name} ({ing.unit})
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <input
                                type="number"
                                step="any"
                                min="0.01"
                                required
                                value={line.quantity}
                                onChange={(e) =>
                                  handleUpdateLine(line.id, "quantity", parseFloat(e.target.value) || 0)
                                }
                                className="w-full py-1.5 px-2 text-center font-bold bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6F4E37]"
                              />
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <input
                                type="number"
                                step="1000"
                                min="0"
                                required
                                value={line.unitPrice}
                                onChange={(e) =>
                                  handleUpdateLine(line.id, "unitPrice", parseFloat(e.target.value) || 0)
                                }
                                className="w-full py-1.5 px-2 text-right font-medium bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6F4E37]"
                              />
                            </td>
                            <td className="py-2.5 px-3 text-right font-bold text-gray-900">
                              {Math.round(subtotal).toLocaleString("vi-VN")} đ
                            </td>
                            <td className="py-2.5 px-2 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveLine(line.id)}
                                className="p-1 text-gray-400 hover:text-rose-600 rounded cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-4 bg-[#FAF6F0] rounded-xl border border-gray-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-gray-600 uppercase">Tổng tiền thanh toán:</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-[#6F4E37]">
                    {modalTotalAmount.toLocaleString("vi-VN")}{" "}
                    <span className="text-sm font-normal text-gray-600">VNĐ</span>
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
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
                  <span>Hoàn tất & Nhập kho</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DRAWER: Xem Chi Tiết Phiếu Nhập */}
      {isDrawerOpen && selectedTicket && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xl bg-white shadow-2xl border-l border-gray-100 flex flex-col">
              <div className="p-6 bg-[#FAF6F0] border-b border-gray-200 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">
                      Phiếu nhập #PNK-{String(selectedTicket.id).padStart(3, "0")}
                    </span>
                  </div>
                  {selectedTicket.importDate && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      Ngày nhập: {new Date(selectedTicket.importDate).toLocaleString("vi-VN")}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-xl cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-xs">Nhà cung cấp:</span>
                    <span className="font-bold text-gray-900">{selectedTicket.supplierName || "—"}</span>
                  </div>
                  <div className="flex items-start justify-between">
                    <span className="text-gray-500 text-xs">Ghi chú:</span>
                    <span className="text-gray-700 text-xs text-right max-w-xs">{selectedTicket.note || "—"}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 text-sm mb-3">
                    Chi tiết danh sách hàng nhập
                  </h4>
                  {loadingDetail ? (
                    <div className="py-8 text-center text-gray-400">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#6F4E37]" />
                      Đang tải chi tiết phiếu nhập...
                    </div>
                  ) : drawerDetails.length > 0 ? (
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-[#FAF6F0] text-gray-600 font-semibold uppercase tracking-wider border-b border-gray-200">
                            <th className="py-2.5 px-3">Nguyên liệu</th>
                            <th className="py-2.5 px-3 text-center">Số lượng</th>
                            <th className="py-2.5 px-3 text-right">Đơn giá</th>
                            <th className="py-2.5 px-3 text-right">Thành tiền</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {drawerDetails.map((item, idx) => {
                            const qty = Number(item.quantity) || 0;
                            const price = Number(item.unitPrice) || 0;
                            const total = item.totalLineAmount || qty * price;
                            return (
                              <tr key={idx} className="hover:bg-gray-50">
                                <td className="py-3 px-3">
                                  <div className="font-semibold text-gray-900">
                                    {item.ingredientName || `Nguyên liệu #${item.ingredientId}`}
                                  </div>
                                </td>
                                <td className="py-3 px-3 text-center font-bold text-gray-900">
                                  {qty} {item.unit || ""}
                                </td>
                                <td className="py-3 px-3 text-right text-gray-600">
                                  {price.toLocaleString("vi-VN")} đ
                                </td>
                                <td className="py-3 px-3 text-right font-bold text-[#6F4E37]">
                                  {total.toLocaleString("vi-VN")} đ
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400">Không có chi tiết hàng nhập.</p>
                  )}
                </div>

                <div className="bg-[#FAF6F0] p-4 rounded-xl border border-gray-200 flex items-center justify-between">
                  <span className="font-semibold text-gray-800 text-sm">Tổng cộng thanh toán:</span>
                  <span className="text-xl font-bold text-[#6F4E37]">
                    {Number(selectedTicket.totalAmount).toLocaleString("vi-VN")} VNĐ
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
