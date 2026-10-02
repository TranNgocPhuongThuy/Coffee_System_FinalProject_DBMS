"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Package,
} from "lucide-react";

interface Topping {
  id: string;
  code: string;
  name: string;
  extraPrice: number;
  linkedIngredient: string;
  portion: string;
  status: "available" | "low_stock" | "out_of_stock";
}

const MOCK_TOPPINGS: Topping[] = [
  {
    id: "1",
    code: "TOP-01",
    name: "Trân châu hoàng kim",
    extraPrice: 10000,
    linkedIngredient: "Trân châu sống (Kho NL)",
    portion: "30g / phần",
    status: "available",
  },
  {
    id: "2",
    code: "TOP-02",
    name: "Kem Cheese Macchiato",
    extraPrice: 12000,
    linkedIngredient: "Whipping Cream & Phô mai",
    portion: "45ml / phần",
    status: "available",
  },
  {
    id: "3",
    code: "TOP-03",
    name: "Shot Espresso thêm",
    extraPrice: 10000,
    linkedIngredient: "Hạt Robusta Đắk Lắk",
    portion: "18g hạt / shot",
    status: "available",
  },
  {
    id: "4",
    code: "TOP-04",
    name: "Thạch dừa lá dứa",
    extraPrice: 8000,
    linkedIngredient: "Thạch dừa thô & Siro dứa",
    portion: "35g / phần",
    status: "available",
  },
  {
    id: "5",
    code: "TOP-05",
    name: "Thạch đào giòn",
    extraPrice: 10000,
    linkedIngredient: "Đào ngâm & Gelatin",
    portion: "40g / phần",
    status: "low_stock",
  },
  {
    id: "6",
    code: "TOP-06",
    name: "Trân châu trắng 3Q",
    extraPrice: 10000,
    linkedIngredient: "Trân châu 3Q túi 2kg",
    portion: "30g / phần",
    status: "out_of_stock",
  },
];

export default function ToppingsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredToppings = MOCK_TOPPINGS.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.linkedIngredient.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);
  };

  const getStatusBadge = (status: Topping["status"]) => {
    switch (status) {
      case "available":
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

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Quản lý Topping & Tùy chọn
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Danh sách các loại topping, món thêm và nguyên liệu kho liên kết khi order món
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#6F4E37] hover:bg-[#5A3F2C] text-white font-medium text-sm shadow-sm transition-all duration-200 cursor-pointer active:scale-[0.98] w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" strokeWidth={2.2} />
          <span>Thêm topping mới</span>
        </button>
      </div>

      {/* 2. Toolbar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm topping hoặc nguyên liệu..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 text-sm transition-colors focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
          />
        </div>

        <div className="text-xs text-gray-500 hidden sm:block">
          Tổng cộng:{" "}
          <span className="font-semibold text-gray-800">
            {filteredToppings.length}
          </span>{" "}
          loại topping
        </div>
      </div>

      {/* 3. Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                <th scope="col" className="py-3.5 px-5">
                  Tên Topping & Mã
                </th>
                <th scope="col" className="py-3.5 px-5">
                  Giá cộng thêm
                </th>
                <th scope="col" className="py-3.5 px-5">
                  Nguyên liệu kho liên kết
                </th>
                <th scope="col" className="py-3.5 px-5">
                  Định lượng
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
              {filteredToppings.length > 0 ? (
                filteredToppings.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50/60 transition-colors group"
                  >
                    {/* Tên Topping & Mã */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#F5EBE6] text-[#6F4E37] flex items-center justify-center shrink-0">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="font-semibold text-gray-900 group-hover:text-[#6F4E37] transition-colors block">
                            {item.name}
                          </span>
                          <span className="text-xs text-gray-400 font-mono">
                            #{item.code}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Giá cộng thêm */}
                    <td className="py-3.5 px-5">
                      <span className="font-bold text-[#6F4E37]">
                        +{formatCurrency(item.extraPrice)}
                      </span>
                    </td>

                    {/* Nguyên liệu kho liên kết */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-1.5 text-gray-700 text-xs font-medium">
                        <Package className="w-3.5 h-3.5 text-gray-400" />
                        <span>{item.linkedIngredient}</span>
                      </div>
                    </td>

                    {/* Định lượng */}
                    <td className="py-3.5 px-5 text-gray-500 text-xs">
                      {item.portion}
                    </td>

                    {/* Trạng thái */}
                    <td className="py-3.5 px-5">
                      {getStatusBadge(item.status)}
                    </td>

                    {/* Thao tác */}
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                          title="Chỉnh sửa topping"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Xóa topping"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-gray-400 text-sm"
                  >
                    Không tìm thấy topping nào phù hợp với điều kiện tìm kiếm.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 bg-white">
          <p>
            Hiển thị{" "}
            <span className="font-semibold text-gray-700">
              {filteredToppings.length}
            </span>{" "}
            trên tổng số{" "}
            <span className="font-semibold text-gray-700">
              {MOCK_TOPPINGS.length}
            </span>{" "}
            loại topping
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
    </div>
  );
}
