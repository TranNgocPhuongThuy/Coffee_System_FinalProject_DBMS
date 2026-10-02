"use client";

import {
  TrendingUp,
  ShoppingBag,
  Users,
  DollarSign,
  Coffee,
  ArrowUpRight,
} from "lucide-react";

export default function DashboardOverviewPage() {
  const stats = [
    {
      title: "Doanh thu hôm nay",
      value: "4.850.000 đ",
      change: "+12.5%",
      icon: DollarSign,
      color: "bg-emerald-100 text-emerald-800",
    },
    {
      title: "Đơn hàng đã bán",
      value: "142",
      change: "+8.2%",
      icon: ShoppingBag,
      color: "bg-amber-100 text-amber-800",
    },
    {
      title: "Khách hàng mới",
      value: "28",
      change: "+15.3%",
      icon: Users,
      color: "bg-blue-100 text-blue-800",
    },
    {
      title: "Món bán chạy nhất",
      value: "Cà phê sữa đá",
      change: "68 ly",
      icon: Coffee,
      color: "bg-[#F5EBE6] text-[#6F4E37]",
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Tổng quan kinh doanh
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Theo dõi doanh số và hoạt động của cửa hàng theo thời gian thực
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start justify-between"
            >
              <div>
                <p className="text-xs font-medium text-gray-500">{stat.title}</p>
                <h3 className="text-xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </h3>
                <div className="flex items-center gap-1 mt-2 text-xs font-medium text-emerald-600">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{stat.change}</span>
                </div>
              </div>
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${stat.color}`}
              >
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Access Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-base font-bold text-gray-900 mb-4">
          Lối tắt nhanh
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <a
            href="/dashboard/menu/products"
            className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-[#6F4E37]/30 hover:bg-[#FAF6F0] transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#F5EBE6] text-[#6F4E37] flex items-center justify-center">
                <Coffee className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 group-hover:text-[#6F4E37]">
                  Quản lý Thực đơn
                </h4>
                <p className="text-xs text-gray-400">Xem và chỉnh sửa danh mục món</p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-[#6F4E37]" />
          </a>
        </div>
      </div>
    </div>
  );
}
