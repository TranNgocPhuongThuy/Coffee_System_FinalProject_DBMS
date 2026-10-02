"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Coffee,
  CupSoda,
  Cake,
  Sparkles,
  CheckCircle2,
  FolderTree,
} from "lucide-react";

interface Category {
  id: string;
  code: string;
  name: string;
  description: string;
  productCount: number;
  status: "active" | "hidden";
  icon: typeof Coffee;
  iconColor: string;
}

const MOCK_CATEGORIES: Category[] = [
  {
    id: "1",
    code: "CAT-CF",
    name: "Cà phê",
    description: "Các dòng cà phê truyền thống, pha phin và cà phê máy Espresso",
    productCount: 12,
    status: "active",
    icon: Coffee,
    iconColor: "bg-[#F5EBE6] text-[#6F4E37]",
  },
  {
    id: "2",
    code: "CAT-TEA",
    name: "Trà trái cây",
    description: "Trà hoa quả tươi mát, trà thanh nhiệt giải khát bốn mùa",
    productCount: 8,
    status: "active",
    icon: CupSoda,
    iconColor: "bg-emerald-100 text-emerald-800",
  },
  {
    id: "3",
    code: "CAT-SMOOTHIE",
    name: "Sinh tố & Đá xay",
    description: "Đồ uống đá xay mát lạnh, sinh tố trái cây nhiệt đới bổ dưỡng",
    productCount: 6,
    status: "active",
    icon: Sparkles,
    iconColor: "bg-amber-100 text-amber-800",
  },
  {
    id: "4",
    code: "CAT-CAKE",
    name: "Bánh ngọt",
    description: "Bánh tươi nướng mỗi ngày, bánh tráng miệng cao cấp và pastry",
    productCount: 5,
    status: "active",
    icon: Cake,
    iconColor: "bg-rose-100 text-rose-800",
  },
  {
    id: "5",
    code: "CAT-TOPPING",
    name: "Topping & Thêm",
    description: "Trân châu hoàng kim, thạch dừa, kem macchiato béo ngậy",
    productCount: 7,
    status: "active",
    icon: FolderTree,
    iconColor: "bg-blue-100 text-blue-800",
  },
];

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = MOCK_CATEGORIES.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Danh mục thực đơn
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Phân loại các nhóm đồ uống và món ăn để dễ dàng quản lý và bán hàng
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#6F4E37] hover:bg-[#5A3F2C] text-white font-medium text-sm shadow-sm transition-all duration-200 cursor-pointer active:scale-[0.98] w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" strokeWidth={2.2} />
          <span>Thêm danh mục</span>
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
            placeholder="Tìm kiếm danh mục món..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 text-sm transition-colors focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
          />
        </div>

        <div className="text-xs text-gray-500 hidden sm:block">
          Tổng cộng:{" "}
          <span className="font-semibold text-gray-800">
            {filteredCategories.length}
          </span>{" "}
          nhóm món
        </div>
      </div>

      {/* 3. Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                <th scope="col" className="py-3.5 px-5">
                  Tên danh mục & Mã
                </th>
                <th scope="col" className="py-3.5 px-5">
                  Mô tả ngắn
                </th>
                <th scope="col" className="py-3.5 px-5">
                  Số lượng món
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
              {filteredCategories.length > 0 ? (
                filteredCategories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <tr
                      key={cat.id}
                      className="hover:bg-gray-50/60 transition-colors group"
                    >
                      {/* Tên danh mục & Icon */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${cat.iconColor}`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="font-semibold text-gray-900 group-hover:text-[#6F4E37] transition-colors block">
                              {cat.name}
                            </span>
                            <span className="text-xs text-gray-400 font-mono">
                              #{cat.code}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Mô tả ngắn */}
                      <td className="py-3.5 px-5 text-gray-500 text-xs max-w-xs truncate">
                        {cat.description}
                      </td>

                      {/* Số lượng món hiện có */}
                      <td className="py-3.5 px-5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 font-semibold text-gray-800 text-xs">
                          {cat.productCount} món
                        </span>
                      </td>

                      {/* Trạng thái */}
                      <td className="py-3.5 px-5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Đang hiển thị
                        </span>
                      </td>

                      {/* Thao tác */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                            title="Chỉnh sửa danh mục"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Xóa danh mục"
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
                  <td
                    colSpan={5}
                    className="py-12 text-center text-gray-400 text-sm"
                  >
                    Không tìm thấy danh mục nào phù hợp với điều kiện tìm kiếm.
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
              {filteredCategories.length}
            </span>{" "}
            trên tổng số{" "}
            <span className="font-semibold text-gray-700">
              {MOCK_CATEGORIES.length}
            </span>{" "}
            danh mục
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
