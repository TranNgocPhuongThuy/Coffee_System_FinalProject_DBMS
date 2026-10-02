"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Edit,
  History,
  Package,
  AlertTriangle,
  Coins,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from "lucide-react";

interface Ingredient {
  id: string;
  code: string;
  name: string;
  category: string;
  unit: string;
  stock: number;
  minStock: number;
  unitPrice: number;
  status: "in_stock" | "low_stock" | "out_of_stock";
}

const MOCK_INGREDIENTS: Ingredient[] = [
  {
    id: "1",
    code: "NL001",
    name: "Hạt cà phê Robusta Đắk Lắk",
    category: "Hạt cà phê",
    unit: "kg",
    stock: 45.5,
    minStock: 15,
    unitPrice: 180000,
    status: "in_stock",
  },
  {
    id: "2",
    code: "NL002",
    name: "Hạt cà phê Arabica Cầu Đất",
    category: "Hạt cà phê",
    unit: "kg",
    stock: 8.2,
    minStock: 10,
    unitPrice: 280000,
    status: "low_stock",
  },
  {
    id: "3",
    code: "NL003",
    name: "Sữa tươi thanh trùng Barista",
    category: "Sữa/Đường",
    unit: "lít",
    stock: 32.0,
    minStock: 12,
    unitPrice: 38000,
    status: "in_stock",
  },
  {
    id: "4",
    code: "NL004",
    name: "Syrup Vani Monin 700ml",
    category: "Hương liệu/Syrup",
    unit: "chai",
    stock: 0,
    minStock: 5,
    unitPrice: 245000,
    status: "out_of_stock",
  },
  {
    id: "5",
    code: "NL005",
    name: "Ly giấy Takeaway 500ml",
    category: "Bao bì",
    unit: "cái",
    stock: 1200,
    minStock: 300,
    unitPrice: 1200,
    status: "in_stock",
  },
  {
    id: "6",
    code: "NL006",
    name: "Đường cát trắng Biên Hòa",
    category: "Sữa/Đường",
    unit: "kg",
    stock: 4.5,
    minStock: 10,
    unitPrice: 26000,
    status: "low_stock",
  },
];

export default function IngredientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredIngredients = MOCK_INGREDIENTS.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat =
      selectedCategory === "all" || item.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const getStatusBadge = (status: Ingredient["status"]) => {
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

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Kho nguyên liệu
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Theo dõi số lượng tồn kho, định mức an toàn và lịch sử nhập xuất hàng
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#6F4E37] hover:bg-[#5A3F2C] text-white font-medium text-sm shadow-sm transition-all duration-200 cursor-pointer active:scale-[0.98] w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" strokeWidth={2.2} />
          <span>Nhập hàng</span>
        </button>
      </div>

      {/* 3 Thẻ Card Thống kê nhanh */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {/* Card 1: Tổng số mặt hàng */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Tổng số mặt hàng
            </p>
            <h3 className="text-2xl font-extrabold text-gray-900 mt-1.5">
              {MOCK_INGREDIENTS.length}{" "}
              <span className="text-sm font-normal text-gray-500">nguyên liệu</span>
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Phục vụ hoạt động pha chế & đóng gói
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#F5EBE6] text-[#6F4E37] flex items-center justify-center shrink-0">
            <Package className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Cảnh báo sắp hết / hết hàng */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Cảnh báo hết hàng
            </p>
            <h3 className="text-2xl font-extrabold text-rose-600 mt-1.5">
              3 <span className="text-sm font-normal text-rose-500">mặt hàng</span>
            </h3>
            <p className="text-xs text-rose-500/80 font-medium mt-1">
              Cần tạo đơn nhập hàng sớm
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Tổng giá trị kho */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Tổng giá trị tồn kho
            </p>
            <h3 className="text-2xl font-extrabold text-[#6F4E37] mt-1.5">
              13.560.000 đ
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Ước tính theo giá nhập gần nhất
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Coins className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 2. Toolbar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Ô tìm kiếm */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm nguyên liệu hoặc mã..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 text-sm transition-colors focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
          />
        </div>

        {/* Lọc danh mục */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Filter className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-10 pr-8 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium transition-colors focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20 cursor-pointer appearance-none"
            >
              <option value="all">Tất cả danh mục</option>
              <option value="Hạt cà phê">Hạt cà phê</option>
              <option value="Sữa/Đường">Sữa/Đường</option>
              <option value="Hương liệu/Syrup">Hương liệu/Syrup</option>
              <option value="Bao bì">Bao bì</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Bảng dữ liệu (Data Table) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                <th scope="col" className="py-3.5 px-5">
                  Tên nguyên liệu & Mã
                </th>
                <th scope="col" className="py-3.5 px-5">
                  Danh mục
                </th>
                <th scope="col" className="py-3.5 px-5">
                  Đơn vị tính
                </th>
                <th scope="col" className="py-3.5 px-5">
                  Số lượng tồn
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
              {filteredIngredients.length > 0 ? (
                filteredIngredients.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50/60 transition-colors group"
                  >
                    {/* Tên & Mã */}
                    <td className="py-3.5 px-5">
                      <div>
                        <span className="font-semibold text-gray-900 group-hover:text-[#6F4E37] transition-colors block">
                          {item.name}
                        </span>
                        <span className="text-xs text-gray-400 font-mono">
                          #{item.code}
                        </span>
                      </div>
                    </td>

                    {/* Danh mục */}
                    <td className="py-3.5 px-5 text-gray-600 font-medium">
                      {item.category}
                    </td>

                    {/* Đơn vị tính */}
                    <td className="py-3.5 px-5 text-gray-700 font-medium">
                      <span className="px-2 py-0.5 rounded-md bg-gray-100 text-xs text-gray-600 font-semibold">
                        {item.unit}
                      </span>
                    </td>

                    {/* Số lượng tồn */}
                    <td className="py-3.5 px-5">
                      <span className="font-bold text-gray-900">
                        {item.stock.toLocaleString("vi-VN")}
                      </span>
                      <span className="text-xs text-gray-400 ml-1">
                        /{item.unit}
                      </span>
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
                          title="Chỉnh sửa nguyên liệu"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          className="p-2 rounded-lg text-[#6F4E37] hover:bg-[#F5EBE6] transition-colors cursor-pointer"
                          title="Lịch sử nhập/xuất"
                        >
                          <History className="w-4 h-4" />
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
                    Không tìm thấy nguyên liệu phù hợp với điều kiện tìm kiếm.
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
              {filteredIngredients.length}
            </span>{" "}
            trên tổng số{" "}
            <span className="font-semibold text-gray-700">
              {MOCK_INGREDIENTS.length}
            </span>{" "}
            mặt hàng
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
