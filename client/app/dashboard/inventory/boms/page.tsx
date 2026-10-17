"use client";

import { useState, useEffect } from "react";
import {
  FlaskConical,
  Plus,
  Trash2,
  Layers,
  Sparkles,
  Coffee,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Loader2,
  RefreshCw,
} from "lucide-react";
import inventoryService from "@/api/inventory.service";
import menuService from "@/api/menu.service";

type BomTab = "RECIPE_BOM" | "TOPPING_BOM";

interface Ingredient {
  id: number;
  name: string;
  unit: string;
  stockQuantity: number;
}

interface ProductVariant {
  id: number;
  size: string;
  price: number;
}

interface Product {
  id: number;
  name: string;
  categoryName?: string;
  variants: ProductVariant[];
}

interface Topping {
  id: number;
  name: string;
  price: number;
}

interface RecipeBOMDetail {
  variantId?: number;
  productName: string;
  productSize: string;
  ingredientId?: number;
  ingredientName: string;
  consumedQuantity: number;
  ingredientUnit: string;
}

interface ToppingBOMDetail {
  toppingId?: number;
  toppingName: string;
  ingredientId?: number;
  ingredientName: string;
  consumedQuantity: number;
  unit: string;
}

export default function BOMManagementPage() {
  const [activeTab, setActiveTab] = useState<BomTab>("RECIPE_BOM");
  const [loading, setLoading] = useState(true);

  // Data lists from API
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [toppings, setToppings] = useState<Topping[]>([]);
  const [recipeBoms, setRecipeBoms] = useState<RecipeBOMDetail[]>([]);
  const [toppingBoms, setToppingBoms] = useState<ToppingBOMDetail[]>([]);

  // Selected State
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const [selectedToppingId, setSelectedToppingId] = useState<number | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formIngredientId, setFormIngredientId] = useState<number | "">("");
  const [formQty, setFormQty] = useState<number>(0.01);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [ingsData, prodsData, topsData, recipeData, toppingData] = await Promise.all([
        inventoryService.getIngredients().catch(() => []),
        menuService.getProducts().catch(() => []),
        menuService.getToppings().catch(() => []),
        inventoryService.getRecipeBOMs().catch(() => []),
        inventoryService.getToppingBOMs().catch(() => []),
      ]);

      setIngredients(Array.isArray(ingsData) ? ingsData : []);
      const prodList = Array.isArray(prodsData) ? prodsData : [];
      setProducts(prodList);
      const topList = Array.isArray(topsData) ? topsData : [];
      setToppings(topList);
      setRecipeBoms(Array.isArray(recipeData) ? recipeData : []);
      setToppingBoms(Array.isArray(toppingData) ? toppingData : []);

      if (prodList.length > 0 && selectedProductId === null) {
        setSelectedProductId(prodList[0].id);
        if (prodList[0].variants?.length > 0) {
          setSelectedVariantId(prodList[0].variants[0].id);
        }
      }
      if (topList.length > 0 && selectedToppingId === null) {
        setSelectedToppingId(topList[0].id);
      }
    } catch (err) {
      console.error("Error loading BOM data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];
  const selectedVariant = selectedProduct?.variants?.find((v) => v.id === selectedVariantId) || selectedProduct?.variants?.[0];
  const selectedTopping = toppings.find((t) => t.id === selectedToppingId) || toppings[0];

  // Filter Recipe BOMs for current product & size
  const currentRecipeItems = recipeBoms.filter((rb) => {
    if (!selectedProduct) return false;
    const matchName = rb.productName === selectedProduct.name;
    const matchSize = selectedVariant ? rb.productSize === selectedVariant.size : true;
    return matchName && matchSize;
  });

  // Filter Topping BOMs for current topping
  const currentToppingItems = toppingBoms.filter((tb) => {
    if (!selectedTopping) return false;
    return tb.toppingName === selectedTopping.name;
  });

  const handleOpenAddModal = () => {
    if (ingredients.length > 0) {
      setFormIngredientId(ingredients[0].id);
    } else {
      setFormIngredientId("");
    }
    setFormQty(0.01);
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formIngredientId) {
      setErrorMsg("Vui lòng chọn nguyên liệu");
      return;
    }
    setSubmitting(true);
    setErrorMsg("");

    try {
      if (activeTab === "RECIPE_BOM") {
        if (!selectedVariantId) {
          setErrorMsg("Không tìm thấy thông tin biến thể size sản phẩm");
          setSubmitting(false);
          return;
        }
        await inventoryService.addRecipeBOMItem({
          variantId: Number(selectedVariantId),
          ingredientId: Number(formIngredientId),
          consumedQuantity: Number(formQty),
        });
        showToast("Đã lưu định lượng công thức!");
      } else {
        if (!selectedToppingId) {
          setErrorMsg("Không tìm thấy thông tin topping");
          setSubmitting(false);
          return;
        }
        await inventoryService.addToppingBOMItem({
          toppingId: Number(selectedToppingId),
          ingredientId: Number(formIngredientId),
          consumedQuantity: Number(formQty),
        });
        showToast("Đã lưu định lượng Topping!");
      }
      setIsModalOpen(false);
      await loadData();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Có lỗi xảy ra khi lưu định lượng");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRecipeItem = async (ingredientId?: number) => {
    if (!selectedVariantId || !ingredientId) return;
    if (!confirm("Bạn có chắc chắn muốn xóa nguyên liệu này khỏi công thức?")) return;

    try {
      await inventoryService.deleteRecipeBOMItem(selectedVariantId, ingredientId);
      showToast("Đã xóa nguyên liệu khỏi công thức!");
      await loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Không thể xóa nguyên liệu khỏi công thức");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
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
              <FlaskConical className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Cấu hình Định lượng (BOM)
            </h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Thiết lập định lượng nguyên vật liệu tiêu hao (Bill of Materials) để tự động trừ kho khi bán hàng
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
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs font-medium">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Độ chính xác định mức: 0.001</span>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab("RECIPE_BOM")}
          className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm cursor-pointer ${
            activeTab === "RECIPE_BOM"
              ? "bg-[#6F4E37] text-white shadow-[#6F4E37]/20"
              : "bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200"
          }`}
        >
          <Coffee className="w-4 h-4" />
          <span>Định lượng Đồ uống (RecipeBOM)</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
              activeTab === "RECIPE_BOM" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            {products.length} sản phẩm
          </span>
        </button>

        <button
          onClick={() => setActiveTab("TOPPING_BOM")}
          className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm cursor-pointer ${
            activeTab === "TOPPING_BOM"
              ? "bg-[#6F4E37] text-white shadow-[#6F4E37]/20"
              : "bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Định lượng Topping (ToppingBOM)</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
              activeTab === "TOPPING_BOM" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            {toppings.length} topping
          </span>
        </button>
      </div>

      {/* TAB 1: RECIPE BOM */}
      {activeTab === "RECIPE_BOM" && (
        <div className="space-y-6">
          {/* Controls Bar: Select Product & Select Size Variant */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 flex-1">
              {/* Product Selector */}
              <div className="flex-1 min-w-[260px]">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  1. Chọn Sản phẩm đồ uống
                </label>
                <div className="relative">
                  <select
                    value={selectedProductId || ""}
                    onChange={(e) => {
                      const prodId = Number(e.target.value);
                      setSelectedProductId(prodId);
                      const prod = products.find((p) => p.id === prodId);
                      if (prod && prod.variants?.length > 0) {
                        setSelectedVariantId(prod.variants[0].id);
                      } else {
                        setSelectedVariantId(null);
                      }
                    }}
                    className="w-full pl-3.5 pr-10 py-2.5 bg-[#FAF6F0] border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#6F4E37] appearance-none cursor-pointer"
                  >
                    {products.map((prod) => (
                      <option key={prod.id} value={prod.id}>
                        {prod.name} {prod.categoryName ? `(${prod.categoryName})` : ""}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Size Variant Selector */}
              <div className="w-full sm:w-[260px]">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  2. Chọn Biến thể Size
                </label>
                <div className="relative">
                  <select
                    value={selectedVariantId || ""}
                    onChange={(e) => setSelectedVariantId(Number(e.target.value))}
                    className="w-full pl-3.5 pr-10 py-2.5 bg-[#FAF6F0] border border-gray-200 rounded-xl text-sm font-semibold text-[#6F4E37] focus:outline-none focus:ring-2 focus:ring-[#6F4E37] appearance-none cursor-pointer"
                  >
                    {selectedProduct?.variants?.map((variant) => (
                      <option key={variant.id} value={variant.id}>
                        Size {variant.size} ({Number(variant.price).toLocaleString("vi-VN")}đ)
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#6F4E37] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#6F4E37] hover:bg-[#5A3F2C] text-white rounded-xl text-sm font-semibold transition-all shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm nguyên liệu</span>
              </button>
            </div>
          </div>

          {/* Table: BOM Items */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-base">
                  Bảng định mức: {selectedProduct?.name} -{" "}
                  <span className="text-[#6F4E37]">Size {selectedVariant?.size || "M"}</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Số lượng tiêu hao nguyên liệu khi chế biến 1 đơn vị sản phẩm
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg font-medium">
                {currentRecipeItems.length} thành phần
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FAF6F0] text-gray-600 text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
                    <th className="py-3.5 px-5">Tên nguyên liệu</th>
                    <th className="py-3.5 px-5 text-center">Định mức tiêu hao</th>
                    <th className="py-3.5 px-5">Đơn vị tính</th>
                    <th className="py-3.5 px-5 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-gray-400">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#6F4E37]" />
                        Đang tải định lượng công thức...
                      </td>
                    </tr>
                  ) : currentRecipeItems.length > 0 ? (
                    currentRecipeItems.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3.5 px-5 font-bold text-gray-900">
                          {item.ingredientName}
                        </td>
                        <td className="py-3.5 px-5 text-center">
                          <span className="inline-block px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg font-mono font-bold text-sm">
                            {Number(item.consumedQuantity).toFixed(3)}
                          </span>
                        </td>
                        <td className="py-3.5 px-5">
                          <span className="px-2.5 py-0.5 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                            {item.ingredientUnit}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteRecipeItem(item.ingredientId)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Xóa khỏi công thức"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-10 text-center text-gray-400">
                        <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        Chưa có nguyên liệu nào được cấu hình cho kích cỡ này.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TOPPING BOM */}
      {activeTab === "TOPPING_BOM" && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="w-full sm:w-[320px]">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Chọn Topping
              </label>
              <div className="relative">
                <select
                  value={selectedToppingId || ""}
                  onChange={(e) => setSelectedToppingId(Number(e.target.value))}
                  className="w-full pl-3.5 pr-10 py-2.5 bg-[#FAF6F0] border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#6F4E37] appearance-none cursor-pointer"
                >
                  {toppings.map((top) => (
                    <option key={top.id} value={top.id}>
                      {top.name} (+{Number(top.price).toLocaleString("vi-VN")}đ)
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <button
              type="button"
              onClick={handleOpenAddModal}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#6F4E37] hover:bg-[#5A3F2C] text-white rounded-xl text-sm font-semibold transition-all shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm nguyên liệu Topping</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-base">
                  Bảng định mức Topping: {selectedTopping?.name}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Định lượng nguyên liệu tiêu hao cho 1 suất topping
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg font-medium">
                {currentToppingItems.length} thành phần
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FAF6F0] text-gray-600 text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
                    <th className="py-3.5 px-5">Tên nguyên liệu</th>
                    <th className="py-3.5 px-5 text-center">Định mức tiêu hao</th>
                    <th className="py-3.5 px-5">Đơn vị tính</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {loading ? (
                    <tr>
                      <td colSpan={3} className="py-12 text-center text-gray-400">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#6F4E37]" />
                        Đang tải định lượng Topping...
                      </td>
                    </tr>
                  ) : currentToppingItems.length > 0 ? (
                    currentToppingItems.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3.5 px-5 font-bold text-gray-900">
                          {item.ingredientName}
                        </td>
                        <td className="py-3.5 px-5 text-center">
                          <span className="inline-block px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg font-mono font-bold text-sm">
                            {Number(item.consumedQuantity).toFixed(3)}
                          </span>
                        </td>
                        <td className="py-3.5 px-5">
                          <span className="px-2.5 py-0.5 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                            {item.unit}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-10 text-center text-gray-400">
                        <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        Chưa có nguyên liệu nào được cấu hình cho topping này.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal Thêm nguyên liệu vào định lượng */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-gray-900">
              Thêm nguyên liệu vào định lượng
            </h2>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSaveItem} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Chọn nguyên liệu từ kho <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={formIngredientId}
                  onChange={(e) => setFormIngredientId(Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
                >
                  {ingredients.map((ing) => (
                    <option key={ing.id} value={ing.id}>
                      {ing.name} ({ing.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Định mức tiêu hao <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="0.0001"
                  step="any"
                  required
                  value={formQty}
                  onChange={(e) => setFormQty(Number(e.target.value))}
                  placeholder="Ví dụ: 0.02"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20 font-mono font-bold"
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
                  <span>Lưu định lượng</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
