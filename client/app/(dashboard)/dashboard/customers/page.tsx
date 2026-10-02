"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Gift,
  Crown,
  Shield,
  Medal,
  Clock,
} from "lucide-react";

interface Customer {
  id: string;
  code: string;
  name: string;
  phone: string;
  email: string;
  points: number;
  tier: "Vàng" | "Bạc" | "Đồng";
  lastVisit: string;
}

const MOCK_CUSTOMERS: Customer[] = [
  {
    id: "1",
    code: "KH001",
    name: "Nguyễn Văn An",
    phone: "0901 234 567",
    email: "an.nguyen@gmail.com",
    points: 1250,
    tier: "Vàng",
    lastVisit: "Hôm nay (14:30)",
  },
  {
    id: "2",
    code: "KH002",
    name: "Trần Thị Mai",
    phone: "0912 345 678",
    email: "mai.tran@gmail.com",
    points: 680,
    tier: "Bạc",
    lastVisit: "Hôm qua (09:15)",
  },
  {
    id: "3",
    code: "KH003",
    name: "Lê Hoàng Phúc",
    phone: "0988 765 432",
    email: "phuc.le@gmail.com",
    points: 120,
    tier: "Đồng",
    lastVisit: "28/09/2026",
  },
  {
    id: "4",
    code: "KH004",
    name: "Phạm Thùy Linh",
    phone: "0977 123 456",
    email: "linh.pham@gmail.com",
    points: 2450,
    tier: "Vàng",
    lastVisit: "Hôm nay (10:05)",
  },
  {
    id: "5",
    code: "KH005",
    name: "Vũ Đức Thắng",
    phone: "0933 888 999",
    email: "thang.vu@gmail.com",
    points: 450,
    tier: "Bạc",
    lastVisit: "25/09/2026",
  },
];

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTier, setSelectedTier] = useState("all");

  const filteredCustomers = MOCK_CUSTOMERS.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery) ||
      customer.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier =
      selectedTier === "all" || customer.tier === selectedTier;
    return matchesSearch && matchesTier;
  });

  const getTierBadge = (tier: Customer["tier"]) => {
    switch (tier) {
      case "Vàng":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/80">
            <Crown className="w-3.5 h-3.5 text-amber-600" />
            Hạng Vàng
          </span>
        );
      case "Bạc":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <Shield className="w-3.5 h-3.5 text-slate-500" />
            Hạng Bạc
          </span>
        );
      case "Đồng":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-800 border border-orange-200/80">
            <Medal className="w-3.5 h-3.5 text-orange-600" />
            Hạng Đồng
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
            Danh sách Khách hàng
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Quản lý thông tin thành viên, tích lũy điểm thưởng và phân hạng
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#6F4E37] hover:bg-[#5A3F2C] text-white font-medium text-sm shadow-sm transition-all duration-200 cursor-pointer active:scale-[0.98] w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" strokeWidth={2.2} />
          <span>Thêm khách hàng</span>
        </button>
      </div>

      {/* 2. Toolbar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên, số điện thoại, mã KH..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 text-sm transition-colors focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
          />
        </div>

        {/* Tier Filter */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Filter className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="pl-10 pr-8 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium transition-colors focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20 cursor-pointer appearance-none"
            >
              <option value="all">Tất cả hạng thẻ</option>
              <option value="Vàng">Hạng Vàng</option>
              <option value="Bạc">Hạng Bạc</option>
              <option value="Đồng">Hạng Đồng</option>
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
                  Họ Tên & Mã KH
                </th>
                <th scope="col" className="py-3.5 px-5">
                  Số điện thoại
                </th>
                <th scope="col" className="py-3.5 px-5">
                  Điểm tích lũy
                </th>
                <th scope="col" className="py-3.5 px-5">
                  Hạng thẻ
                </th>
                <th scope="col" className="py-3.5 px-5">
                  Lần ghé cuối
                </th>
                <th scope="col" className="py-3.5 px-5 text-right">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => {
                  const initial = customer.name.charAt(0);
                  return (
                    <tr
                      key={customer.id}
                      className="hover:bg-gray-50/60 transition-colors group"
                    >
                      {/* Họ tên & Avatar */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#F5EBE6] text-[#6F4E37] font-bold text-xs flex items-center justify-center shrink-0">
                            {initial}
                          </div>
                          <div>
                            <span className="font-semibold text-gray-900 group-hover:text-[#6F4E37] transition-colors block">
                              {customer.name}
                            </span>
                            <span className="text-xs text-gray-400 font-mono">
                              #{customer.code} • {customer.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Số điện thoại */}
                      <td className="py-3.5 px-5 font-mono text-gray-700 font-medium text-xs">
                        {customer.phone}
                      </td>

                      {/* Điểm tích lũy */}
                      <td className="py-3.5 px-5">
                        <span className="font-bold text-[#6F4E37]">
                          {customer.points.toLocaleString("vi-VN")}
                        </span>
                        <span className="text-xs text-gray-400 ml-1">pts</span>
                      </td>

                      {/* Hạng thẻ */}
                      <td className="py-3.5 px-5">
                        {getTierBadge(customer.tier)}
                      </td>

                      {/* Lần ghé cuối */}
                      <td className="py-3.5 px-5 text-gray-500 text-xs">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          <span>{customer.lastVisit}</span>
                        </div>
                      </td>

                      {/* Thao tác */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                            title="Chỉnh sửa thông tin"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            className="p-2 rounded-lg text-[#6F4E37] hover:bg-[#F5EBE6] transition-colors cursor-pointer"
                            title="Tặng điểm / Đổi thưởng"
                          >
                            <Gift className="w-4 h-4" />
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
                    className="py-12 text-center text-gray-400 text-sm"
                  >
                    Không tìm thấy khách hàng phù hợp với điều kiện tìm kiếm.
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
              {filteredCustomers.length}
            </span>{" "}
            trên tổng số{" "}
            <span className="font-semibold text-gray-700">
              {MOCK_CUSTOMERS.length}
            </span>{" "}
            khách hàng
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
