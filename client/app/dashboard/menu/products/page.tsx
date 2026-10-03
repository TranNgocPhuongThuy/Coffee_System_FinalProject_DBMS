"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Coffee,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface ProductItem {
  id: string;
  code: string;
  name: string;
  category: string;
  price: number;
  status: "available" | "out_of_stock";
  imageColor: string;
}

const mockProducts: ProductItem[] = [
  {
    id: "1",
    code: "CF-01",
    name: "Cà phê sữa đá",
    category: "Cà phê",
    price: 29000,
    status: "available",
    imageColor: "bg-amber-100 text-amber-800",
  },
  {
    id: "2",
    code: "CF-02",
    name: "Bạc xỉu đá Sài Gòn",
    category: "Cà phê",
    price: 32000,
    status: "available",
    imageColor: "bg-orange-100 text-orange-800",
  },
  {
    id: "3",
    code: "TEA-01",
    name: "Trà đào cam sả",
    category: "Trà",
    price: 35000,
    status: "available",
    imageColor: "bg-emerald-100 text-emerald-800",
  },
  {
    id: "4",
    code: "TEA-02",
    name: "Trà sen vàng macchiato",
    category: "Trà",
    price: 39000,
    status: "out_of_stock",
    imageColor: "bg-yellow-100 text-yellow-800",
  },
  {
    id: "5",
    code: "CAKE-01",
    name: "Bánh Tiramisu Espresso",
    category: "Bánh ngọt",
    price: 45000,
    status: "available",
    imageColor: "bg-rose-100 text-rose-800",
  },
];

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Danh sách Thực đơn
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Quản lý các món đồ uống, đồ ăn và trạng thái kinh doanh
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#6F4E37] hover:bg-[#5A3F2C] text-white font-medium text-sm shadow-sm transition-all duration-200 cursor-pointer active:scale-[0.98] w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" strokeWidth={2.2} />
          <span>Thêm món mới</span>
        </button>
      </div>

      {/* 2. Toolbar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm tên món hoặc mã..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 text-sm transition-colors focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
          />
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Filter className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-10 pr-8 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium transition-colors focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20 cursor-pointer appearance-none"
            >
              <option value="all">Tất cả danh mục</option>
              <option value="Cà phê">Cà phê</option>
              <option value="Trà">Trà</option>
              <option value="Bánh ngọt">Bánh ngọt</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                <th scope="col" className="py-3.5 px-5">
                  Hình ảnh
                </th>
                <th scope="col" className="py-3.5 px-5">
                  Tên món
                </th>
                <th scope="col" className="py-3.5 px-5">
                  Danh mục
                </th>
                <th scope="col" className="py-3.5 px-5">
                  Giá bán
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
              {filteredProducts.length > 0 ? (
                filteredProducts.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50/60 transition-colors group"
                  >
                    {/* Hình ảnh */}
                    <td className="py-3 px-5">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center font-semibold text-xs ${item.imageColor}`}
                      >
                        <Coffee className="w-5 h-5 opacity-80" />
                      </div>
                    </td>

                    {/* Tên món & mã */}
                    <td className="py-3 px-5">
                      <div>
                        <span className="font-semibold text-gray-900 group-hover:text-[#6F4E37] transition-colors">
                          {item.name}
                        </span>
                        <p className="text-xs text-gray-400 font-mono mt-0.5">
                          #{item.code}
                        </p>
                      </div>
                    </td>

                    {/* Danh mục */}
                    <td className="py-3 px-5 text-gray-600 font-medium">
                      {item.category}
                    </td>

                    {/* Giá bán */}
                    <td className="py-3 px-5 font-semibold text-gray-900">
                      {formatCurrency(item.price)}
                    </td>

                    {/* Trạng thái */}
                    <td className="py-3 px-5">
                      {item.status === "available" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Đang bán
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200/60">
                          <XCircle className="w-3.5 h-3.5" />
                          Hết hàng
                        </span>
                      )}
                    </td>

                    {/* Thao tác */}
                    <td className="py-3 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                          aria-label="Chỉnh sửa món"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          aria-label="Xóa món"
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
                    Không tìm thấy món nào phù hợp với điều kiện tìm kiếm.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Summary */}
        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 bg-white">
          <p>
            Hiển thị{" "}
            <span className="font-semibold text-gray-700">
              {filteredProducts.length}
            </span>{" "}
            trên tổng số{" "}
            <span className="font-semibold text-gray-700">
              {mockProducts.length}
            </span>{" "}
            món
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
