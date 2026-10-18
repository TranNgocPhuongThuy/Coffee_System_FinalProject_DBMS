"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  ShoppingBag,
  Users,
  DollarSign,
  Coffee,
  ArrowUpRight,
  Loader2,
  RefreshCw,
} from "lucide-react";
import reportService from "@/api/report.service";

export default function DashboardOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [revenue, setRevenue] = useState(0);
  const [totalOrdersCount, setTotalOrdersCount] = useState(0);
  const [topProductName, setTopProductName] = useState("—");
  const [topProductQty, setTopProductQty] = useState(0);

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const [revRes, topRes] = await Promise.all([
        reportService.getRevenueOverview().catch(() => null),
        reportService.getTopProducts().catch(() => []),
      ]);

      // Backend trả về Object { netRevenue, totalOrders, ... }, không phải Array!
      const overviewData = revRes?.data || revRes;
      const totalRev = Number(overviewData?.netRevenue || 0);
      const totalOrders = Number(overviewData?.totalOrders || 0);

      setRevenue(totalRev);
      setTotalOrdersCount(totalOrders);

      const topList = Array.isArray(topRes)
        ? topRes
        : (topRes as any)?.data || [];
      if (topList.length > 0) {
        setTopProductName(topList[0].productName || topList[0].name || "—");
        setTopProductQty(
          topList[0].totalQuantitySold || topList[0].totalQuantity || 0,
        );
      }
    } catch (err) {
      console.error("Error fetching overview:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const stats = [
    {
      title: "Tổng doanh thu",
      value: `${revenue.toLocaleString("vi-VN")} đ`,
      change: "Thời gian thực",
      icon: DollarSign,
      color: "bg-emerald-100 text-emerald-800",
    },
    {
      title: "Đơn hàng đã ghi nhận",
      value: `${totalOrdersCount}`,
      change: "Qua hệ thống POS",
      icon: ShoppingBag,
      color: "bg-amber-100 text-amber-800",
    },
    {
      title: "Món bán chạy nhất",
      value: topProductName,
      change: `${topProductQty} ly`,
      icon: Coffee,
      color: "bg-[#F5EBE6] text-[#6F4E37]",
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Tổng quan kinh doanh
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Theo dõi doanh số và hoạt động của cửa hàng theo thời gian thực
          </p>
        </div>

        <button
          type="button"
          onClick={fetchOverview}
          className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer"
          title="Làm mới"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start justify-between"
            >
              <div>
                <p className="text-xs font-medium text-gray-500">
                  {stat.title}
                </p>
                <h3 className="text-xl font-bold text-gray-900 mt-1">
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-[#6F4E37]" />
                  ) : (
                    stat.value
                  )}
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
          <Link
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
                <p className="text-xs text-gray-400">
                  Xem và chỉnh sửa danh mục món
                </p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-[#6F4E37]" />
          </Link>
        </div>
      </div>
    </div>
  );
}
