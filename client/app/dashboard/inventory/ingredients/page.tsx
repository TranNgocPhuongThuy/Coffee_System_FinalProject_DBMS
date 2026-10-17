"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Package,
  AlertTriangle,
  Coins,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import inventoryService from "@/api/inventory.service";

interface Ingredient {
  id: number;
  name: string;
  unit: string;
  stockQuantity: number;
  minimumThreshold: number;
  createdAt?: string;
  updatedAt?: string;
}

export default function IngredientsPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Ingredient | null>(null);
  const [formName, setFormName] = useState("");
  const [formUnit, setFormUnit] = useState("kg");
  const [formStock, setFormStock] = useState<number>(0);
  const [formMinThreshold, setFormMinThreshold] = useState<number>(10);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchIngredients = async () => {
    setLoading(true);
    try {
      const data = await inventoryService.getIngredients();
      setIngredients(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch ingredients:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setFormName("");
    setFormUnit("kg");
    setFormStock(0);
    setFormMinThreshold(10);
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: Ingredient) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormUnit(item.unit);
    setFormStock(item.stockQuantity);
    setFormMinThreshold(item.minimumThreshold);
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setErrorMsg("Tên nguyên liệu không được để trống");
      return;
    }
    setSubmitting(true);
    setErrorMsg("");

    try {
      if (editingItem) {
        await inventoryService.updateIngredient(editingItem.id, {
          name: formName.trim(),
          unit: formUnit.trim(),
          stockQuantity: Number(formStock),
          minimumThreshold: Number(formMinThreshold),
        });
      } else {
        await inventoryService.createIngredient({
          name: formName.trim(),
          unit: formUnit.trim(),
          stockQuantity: Number(formStock),
          minimumThreshold: Number(formMinThreshold),
        });
      }
      setIsModalOpen(false);
      await fetchIngredients();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Có lỗi xảy ra khi lưu nguyên liệu");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa nguyên liệu này?")) return;
    try {
      await inventoryService.deleteIngredient(id);
      await fetchIngredients();
    } catch (err: any) {
      alert(err.response?.data?.message || "Không thể xóa nguyên liệu");
    }
  };

  const getStatus = (stock: number, minStock: number) => {
    if (stock <= 0) return "out_of_stock";
    if (stock <= minStock) return "low_stock";
    return "in_stock";
  };

  const getStatusBadge = (status: "in_stock" | "low_stock" | "out_of_stock") => {
    switch (status) {
      case "in_stock":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Còn hàng
          </span>
        );
      case "low_stock":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/70">
            <AlertCircle className="w-3.5 h-3.5" />
            Sắp hết
          </span>
        );
      case "out_of_stock":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/70">
            <XCircle className="w-3.5 h-3.5" />
            Hết hàng
          </span>
        );
    }
  };

  const filteredIngredients = ingredients.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(query) ||
      item.id.toString().includes(query) ||
      item.unit.toLowerCase().includes(query)
    );
  });

  const warningCount = ingredients.filter(
    (item) => Number(item.stockQuantity) <= Number(item.minimumThreshold)
  ).length;
  const safeCount = ingredients.length - warningCount;
  const unitCount = Array.from(new Set(ingredients.map((i) => i.unit))).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-16">
      {/* 1. Page Header (Chuẩn như trang Khách hàng) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Kho nguyên liệu
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Theo dõi số lượng tồn kho và định mức an toàn nguyên liệu
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchIngredients}
            className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer"
            title="Làm mới"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 bg-[#6F4E37] hover:bg-[#5A3F2C] text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition-all cursor-pointer active:scale-[0.99]"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm nguyên liệu</span>
          </button>
        </div>
      </div>

      {/* 2. Thống kê tổng quan (4 Thẻ Metric Cards: Icon Trái - Thông Số Phải) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Tổng số mặt hàng */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#F5EBE6] text-[#6F4E37] flex items-center justify-center shrink-0 font-bold">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Tổng mặt hàng</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">{ingredients.length.toLocaleString('vi-VN')}</p>
          </div>
        </div>

        {/* Card 2: Cảnh báo sắp hết / hết hàng */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 font-bold">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Cảnh báo tồn kho</p>
            <p className="text-xl font-bold text-rose-600 mt-0.5">{warningCount.toLocaleString('vi-VN')}</p>
          </div>
        </div>

        {/* Card 3: Nguyên liệu an toàn */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Mức tồn an toàn</p>
            <p className="text-xl font-bold text-emerald-700 mt-0.5">{safeCount.toLocaleString('vi-VN')}</p>
          </div>
        </div>

        {/* Card 4: Số loại đơn vị tính */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 font-bold">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Đơn vị quản lý</p>
            <p className="text-xl font-bold text-amber-900 mt-0.5">{unitCount} <span className="text-xs font-normal text-gray-500">loại</span></p>
          </div>
        </div>
      </div>

      {/* 3. Toolbar (Đóng gói trong Card trắng chuẩn) */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên nguyên liệu..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20 transition-all"
          />
        </div>

        <div className="flex items-center justify-end shrink-0">
          <span className="text-xs text-gray-500 font-medium">
            Hiển thị: <b className="text-gray-900 font-bold">{filteredIngredients.length}</b>/{ingredients.length} nguyên liệu
          </span>
        </div>
      </div>

      {/* 3. Bảng dữ liệu */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                <th scope="col" className="py-3.5 px-5">Tên nguyên liệu</th>
                <th scope="col" className="py-3.5 px-5">Đơn vị tính</th>
                <th scope="col" className="py-3.5 px-5">Số lượng tồn</th>
                <th scope="col" className="py-3.5 px-5">Định mức an toàn</th>
                <th scope="col" className="py-3.5 px-5">Trạng thái</th>
                <th scope="col" className="py-3.5 px-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#6F4E37]" />
                    Đang tải dữ liệu nguyên liệu...
                  </td>
                </tr>
              ) : filteredIngredients.length > 0 ? (
                filteredIngredients.map((item) => {
                  const status = getStatus(Number(item.stockQuantity), Number(item.minimumThreshold));
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50/60 transition-colors group"
                    >
                      <td className="py-3.5 px-5">
                        <span className="font-bold text-gray-900 group-hover:text-[#6F4E37] transition-colors">
                          {item.name}
                        </span>
                      </td>

                      <td className="py-3.5 px-5">
                        <span className="px-2.5 py-1 rounded-md bg-gray-100 text-xs text-gray-600 font-semibold">
                          {item.unit}
                        </span>
                      </td>

                      <td className="py-3.5 px-5">
                        <span className="font-bold text-gray-900">
                          {Number(item.stockQuantity).toLocaleString("vi-VN")}
                        </span>
                        <span className="text-xs text-gray-400 ml-1">
                          {item.unit}
                        </span>
                      </td>

                      <td className="py-3.5 px-5 font-medium text-gray-600">
                        {Number(item.minimumThreshold).toLocaleString("vi-VN")} {item.unit}
                      </td>

                      <td className="py-3.5 px-5">
                        {getStatusBadge(status)}
                      </td>

                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(item)}
                            className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                            title="Chỉnh sửa nguyên liệu"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Xóa nguyên liệu"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400 text-sm">
                    Không có nguyên liệu nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Thêm/Sửa Nguyên Liệu */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-gray-900">
              {editingItem ? "Chỉnh sửa nguyên liệu" : "Thêm nguyên liệu mới"}
            </h2>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Tên nguyên liệu <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ví dụ: Hạt cà phê Robusta"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Đơn vị tính <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    placeholder="kg, lít, chai,..."
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Định mức an toàn
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={formMinThreshold}
                    onChange={(e) => setFormMinThreshold(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Số lượng tồn kho ban đầu
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={formStock}
                  onChange={(e) => setFormStock(Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#6F4E37] hover:bg-[#5A3F2C] rounded-xl flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingItem ? "Cập nhật" : "Tạo mới"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

