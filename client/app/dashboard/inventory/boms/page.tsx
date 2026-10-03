"use client";

import { useState } from "react";
import {
  FlaskConical,
  Plus,
  Edit2,
  Trash2,
  Layers,
  Sparkles,
  Coffee,
  X,
  Scale,
  CheckCircle2,
  AlertCircle,
  Copy,
  DollarSign,
  ChevronDown,
} from "lucide-react";

// Types
type BomTab = "RECIPE_BOM" | "TOPPING_BOM";

interface BomItem {
  id: string;
  ingredientId: string;
  ingredientName: string;
  consumedQuantity: number; // e.g. 0.025
  unit: string;
  unitCost: number; // VNĐ per unit
  note?: string;
}

interface ProductSizeVariant {
  sizeId: string;
  sizeName: string;
  volume: string;
  sellingPrice: number;
  items: BomItem[];
}

interface ProductRecipe {
  productId: string;
  productName: string;
  category: string;
  variants: ProductSizeVariant[];
}

interface ToppingBomConfig {
  toppingId: string;
  toppingName: string;
  extraPrice: number;
  servingUnit: string;
  items: BomItem[];
}

interface AvailableIngredient {
  id: string;
  name: string;
  unit: string;
  unitCost: number;
  currentStock: number;
}

// Master Ingredients Catalog for BOM selection
const MOCK_RAW_INGREDIENTS: AvailableIngredient[] = [
  { id: "ING-01", name: "Hạt Robusta xay sẵn", unit: "kg", unitCost: 160000, currentStock: 45.5 },
  { id: "ING-02", name: "Hạt Arabica Cầu Đất", unit: "kg", unitCost: 280000, currentStock: 22.0 },
  { id: "ING-03", name: "Sữa đặc Ông Thọ", unit: "lon", unitCost: 24000, currentStock: 120 },
  { id: "ING-04", name: "Sữa tươi tiệt trùng Barista", unit: "lít", unitCost: 32000, currentStock: 68.5 },
  { id: "ING-05", name: "Kem béo thực vật Rich's", unit: "hộp", unitCost: 38000, currentStock: 35 },
  { id: "ING-06", name: "Whipping Cream Anchor", unit: "lít", unitCost: 145000, currentStock: 14.0 },
  { id: "ING-07", name: "Syrup Caramel Davinci", unit: "chai", unitCost: 210000, currentStock: 8 },
  { id: "ING-08", name: "Trà sen Bảo Lộc thượng hạng", unit: "kg", unitCost: 220000, currentStock: 18.2 },
  { id: "ING-09", name: "Hạt sen ngâm đường", unit: "hộp", unitCost: 65000, currentStock: 25 },
  { id: "ING-10", name: "Bột Phô mai béo nguyên chất", unit: "kg", unitCost: 190000, currentStock: 12.5 },
  { id: "ING-11", name: "Trân châu sống Gia Uy", unit: "kg", unitCost: 42000, currentStock: 50.0 },
  { id: "ING-12", name: "Đường đen Nữ Hoàng", unit: "kg", unitCost: 38000, currentStock: 30.0 },
  { id: "ING-13", name: "Thạch dừa thô Bến Tre", unit: "kg", unitCost: 28000, currentStock: 40.0 },
  { id: "ING-14", name: "Muối biển tinh khiết", unit: "kg", unitCost: 15000, currentStock: 20.0 },
  { id: "ING-15", name: "Ly giấy nắp cầu 360ml", unit: "cái", unitCost: 950, currentStock: 1500 },
  { id: "ING-16", name: "Ly nhựa PP nắp tim 500ml", unit: "cái", unitCost: 1100, currentStock: 2200 },
  { id: "ING-17", name: "Ly nhựa PP nắp tim 700ml", unit: "cái", unitCost: 1350, currentStock: 1800 },
];

// Mock Products & Recipes
const INITIAL_PRODUCT_RECIPES: ProductRecipe[] = [
  {
    productId: "PROD-01",
    productName: "Cà phê sữa đá truyền thống",
    category: "Cà phê",
    variants: [
      {
        sizeId: "SIZE-S",
        sizeName: "Size S (Nhỏ)",
        volume: "360ml",
        sellingPrice: 29000,
        items: [
          { id: "bom-1", ingredientId: "ING-01", ingredientName: "Hạt Robusta xay sẵn", consumedQuantity: 0.02, unit: "kg", unitCost: 160000, note: "Chiết xuất 35ml Espresso" },
          { id: "bom-2", ingredientId: "ING-03", ingredientName: "Sữa đặc Ông Thọ", consumedQuantity: 0.08, unit: "lon", unitCost: 24000, note: "Khoảng 30g sữa đặc" },
          { id: "bom-3", ingredientId: "ING-15", ingredientName: "Ly giấy nắp cầu 360ml", consumedQuantity: 1, unit: "cái", unitCost: 950, note: "Bao bì Size S" },
        ],
      },
      {
        sizeId: "SIZE-M",
        sizeName: "Size M (Vừa)",
        volume: "500ml",
        sellingPrice: 35000,
        items: [
          { id: "bom-4", ingredientId: "ING-01", ingredientName: "Hạt Robusta xay sẵn", consumedQuantity: 0.025, unit: "kg", unitCost: 160000, note: "Chiết xuất 45ml Espresso" },
          { id: "bom-5", ingredientId: "ING-03", ingredientName: "Sữa đặc Ông Thọ", consumedQuantity: 0.1, unit: "lon", unitCost: 24000, note: "Khoảng 38g sữa đặc" },
          { id: "bom-6", ingredientId: "ING-16", ingredientName: "Ly nhựa PP nắp tim 500ml", consumedQuantity: 1, unit: "cái", unitCost: 1100, note: "Bao bì Size M" },
        ],
      },
      {
        sizeId: "SIZE-L",
        sizeName: "Size L (Lớn)",
        volume: "700ml",
        sellingPrice: 42000,
        items: [
          { id: "bom-7", ingredientId: "ING-01", ingredientName: "Hạt Robusta xay sẵn", consumedQuantity: 0.035, unit: "kg", unitCost: 160000, note: "Chiết xuất Double Shot 60ml" },
          { id: "bom-8", ingredientId: "ING-03", ingredientName: "Sữa đặc Ông Thọ", consumedQuantity: 0.14, unit: "lon", unitCost: 24000, note: "Khoảng 50g sữa đặc" },
          { id: "bom-9", ingredientId: "ING-17", ingredientName: "Ly nhựa PP nắp tim 700ml", consumedQuantity: 1, unit: "cái", unitCost: 1350, note: "Bao bì Size L" },
        ],
      },
    ],
  },
  {
    productId: "PROD-02",
    productName: "Trà sen vàng Củ năng",
    category: "Trà & Trà sữa",
    variants: [
      {
        sizeId: "SIZE-M",
        sizeName: "Size M (Vừa)",
        volume: "500ml",
        sellingPrice: 45000,
        items: [
          { id: "bom-10", ingredientId: "ING-08", ingredientName: "Trà sen Bảo Lộc thượng hạng", consumedQuantity: 0.015, unit: "kg", unitCost: 220000, note: "Ủ 150ml cốt trà sen" },
          { id: "bom-11", ingredientId: "ING-09", ingredientName: "Hạt sen ngâm đường", consumedQuantity: 0.08, unit: "hộp", unitCost: 65000, note: "4-5 hạt sen mềm" },
          { id: "bom-12", ingredientId: "ING-04", ingredientName: "Sữa tươi tiệt trùng Barista", consumedQuantity: 0.06, unit: "lít", unitCost: 32000, note: "Lớp milk foam nền" },
          { id: "bom-13", ingredientId: "ING-16", ingredientName: "Ly nhựa PP nắp tim 500ml", consumedQuantity: 1, unit: "cái", unitCost: 1100 },
        ],
      },
      {
        sizeId: "SIZE-L",
        sizeName: "Size L (Lớn)",
        volume: "700ml",
        sellingPrice: 52000,
        items: [
          { id: "bom-14", ingredientId: "ING-08", ingredientName: "Trà sen Bảo Lộc thượng hạng", consumedQuantity: 0.022, unit: "kg", unitCost: 220000, note: "Ủ 220ml cốt trà sen" },
          { id: "bom-15", ingredientId: "ING-09", ingredientName: "Hạt sen ngâm đường", consumedQuantity: 0.12, unit: "hộp", unitCost: 65000, note: "6-7 hạt sen mềm" },
          { id: "bom-16", ingredientId: "ING-04", ingredientName: "Sữa tươi tiệt trùng Barista", consumedQuantity: 0.09, unit: "lít", unitCost: 32000 },
          { id: "bom-17", ingredientId: "ING-17", ingredientName: "Ly nhựa PP nắp tim 700ml", consumedQuantity: 1, unit: "cái", unitCost: 1350 },
        ],
      },
    ],
  },
  {
    productId: "PROD-03",
    productName: "Caramel Macchiato Nóng/Đá",
    category: "Cà phê",
    variants: [
      {
        sizeId: "SIZE-M",
        sizeName: "Size M (Vừa)",
        volume: "500ml",
        sellingPrice: 49000,
        items: [
          { id: "bom-18", ingredientId: "ING-02", ingredientName: "Hạt Arabica Cầu Đất", consumedQuantity: 0.022, unit: "kg", unitCost: 280000, note: "Shot Espresso dịu thanh" },
          { id: "bom-19", ingredientId: "ING-04", ingredientName: "Sữa tươi tiệt trùng Barista", consumedQuantity: 0.18, unit: "lít", unitCost: 32000, note: "Đánh bọt sữa mịn" },
          { id: "bom-20", ingredientId: "ING-07", ingredientName: "Syrup Caramel Davinci", consumedQuantity: 0.025, unit: "chai", unitCost: 210000, note: "2 pumps siro + vân sốt" },
          { id: "bom-21", ingredientId: "ING-16", ingredientName: "Ly nhựa PP nắp tim 500ml", consumedQuantity: 1, unit: "cái", unitCost: 1100 },
        ],
      },
      {
        sizeId: "SIZE-L",
        sizeName: "Size L (Lớn)",
        volume: "700ml",
        sellingPrice: 59000,
        items: [
          { id: "bom-22", ingredientId: "ING-02", ingredientName: "Hạt Arabica Cầu Đất", consumedQuantity: 0.03, unit: "kg", unitCost: 280000, note: "Double Shot Espresso" },
          { id: "bom-23", ingredientId: "ING-04", ingredientName: "Sữa tươi tiệt trùng Barista", consumedQuantity: 0.25, unit: "lít", unitCost: 32000 },
          { id: "bom-24", ingredientId: "ING-07", ingredientName: "Syrup Caramel Davinci", consumedQuantity: 0.035, unit: "chai", unitCost: 210000 },
          { id: "bom-25", ingredientId: "ING-17", ingredientName: "Ly nhựa PP nắp tim 700ml", consumedQuantity: 1, unit: "cái", unitCost: 1350 },
        ],
      },
    ],
  },
];

// Mock Topping BOMs
const INITIAL_TOPPING_BOMS: ToppingBomConfig[] = [
  {
    toppingId: "TOP-01",
    toppingName: "Kem Cheese (Macchiato Foam)",
    extraPrice: 10000,
    servingUnit: "Phần (50ml)",
    items: [
      { id: "tbom-1", ingredientId: "ING-06", ingredientName: "Whipping Cream Anchor", consumedQuantity: 0.03, unit: "lít", unitCost: 145000, note: "Tạo bọt sánh ngậy" },
      { id: "tbom-2", ingredientId: "ING-05", ingredientName: "Kem béo thực vật Rich's", consumedQuantity: 0.02, unit: "hộp", unitCost: 38000, note: "Tăng độ mịn thơm" },
      { id: "tbom-3", ingredientId: "ING-10", ingredientName: "Bột Phô mai béo nguyên chất", consumedQuantity: 0.008, unit: "kg", unitCost: 190000, note: "Hương vị phô mai mặn mà" },
      { id: "tbom-4", ingredientId: "ING-14", ingredientName: "Muối biển tinh khiết", consumedQuantity: 0.001, unit: "kg", unitCost: 15000, note: "Dằn vị béo" },
    ],
  },
  {
    toppingId: "TOP-02",
    toppingName: "Trân châu đường đen",
    extraPrice: 8000,
    servingUnit: "Vá (40g)",
    items: [
      { id: "tbom-5", ingredientId: "ING-11", ingredientName: "Trân châu sống Gia Uy", consumedQuantity: 0.035, unit: "kg", unitCost: 42000, note: "Luộc 30p, ủ 20p" },
      { id: "tbom-6", ingredientId: "ING-12", ingredientName: "Đường đen Nữ Hoàng", consumedQuantity: 0.015, unit: "kg", unitCost: 38000, note: "Nấu sốt sệt" },
    ],
  },
  {
    toppingId: "TOP-03",
    toppingName: "Thạch dừa giòn tươi",
    extraPrice: 8000,
    servingUnit: "Vá (50g)",
    items: [
      { id: "tbom-7", ingredientId: "ING-13", ingredientName: "Thạch dừa thô Bến Tre", consumedQuantity: 0.045, unit: "kg", unitCost: 28000, note: "Xả nước, ngâm đường phèn" },
    ],
  },
  {
    toppingId: "TOP-04",
    toppingName: "Shot Espresso thêm (Extra Shot)",
    extraPrice: 12000,
    servingUnit: "1 Shot (30ml)",
    items: [
      { id: "tbom-8", ingredientId: "ING-01", ingredientName: "Hạt Robusta xay sẵn", consumedQuantity: 0.018, unit: "kg", unitCost: 160000, note: "Chiết xuất tươi trực tiếp" },
    ],
  },
];

export default function BOMManagementPage() {
  const [activeTab, setActiveTab] = useState<BomTab>("RECIPE_BOM");

  // State Tab 1: Recipe BOM
  const [productRecipes, setProductRecipes] = useState<ProductRecipe[]>(INITIAL_PRODUCT_RECIPES);
  const [selectedProductId, setSelectedProductId] = useState<string>("PROD-01");
  const [selectedSizeId, setSelectedSizeId] = useState<string>("SIZE-M");

  // State Tab 2: Topping BOM
  const [toppingBoms, setToppingBoms] = useState<ToppingBomConfig[]>(INITIAL_TOPPING_BOMS);
  const [selectedToppingId, setSelectedToppingId] = useState<string>("TOP-01");

  // Modal State (Add / Edit Item)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [selectedIngredientId, setSelectedIngredientId] = useState<string>(MOCK_RAW_INGREDIENTS[0].id);
  const [inputConsumedQty, setInputConsumedQty] = useState<number>(0.02);
  const [inputNote, setInputNote] = useState<string>("");

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Currently selected Product & Size Variant
  const currentProduct = productRecipes.find((p) => p.productId === selectedProductId) || productRecipes[0];
  const currentVariant =
    currentProduct?.variants.find((v) => v.sizeId === selectedSizeId) || currentProduct?.variants[0];

  // Currently selected Topping
  const currentTopping = toppingBoms.find((t) => t.toppingId === selectedToppingId) || toppingBoms[0];

  // Cost calculation for Drink Size
  const totalDrinkCost = currentVariant
    ? currentVariant.items.reduce((sum, item) => sum + item.consumedQuantity * item.unitCost, 0)
    : 0;
  const drinkProfitMargin =
    currentVariant && currentVariant.sellingPrice > 0
      ? ((currentVariant.sellingPrice - totalDrinkCost) / currentVariant.sellingPrice) * 100
      : 0;

  // Cost calculation for Topping
  const totalToppingCost = currentTopping
    ? currentTopping.items.reduce((sum, item) => sum + item.consumedQuantity * item.unitCost, 0)
    : 0;
  const toppingProfitMargin =
    currentTopping && currentTopping.extraPrice > 0
      ? ((currentTopping.extraPrice - totalToppingCost) / currentTopping.extraPrice) * 100
      : 0;

  // Open Modal to Add
  const handleOpenAddModal = () => {
    setEditingItemId(null);
    setSelectedIngredientId(MOCK_RAW_INGREDIENTS[0].id);
    setInputConsumedQty(0.01);
    setInputNote("");
    setIsModalOpen(true);
  };

  // Open Modal to Edit
  const handleOpenEditModal = (item: BomItem) => {
    setEditingItemId(item.id);
    setSelectedIngredientId(item.ingredientId);
    setInputConsumedQty(item.consumedQuantity);
    setInputNote(item.note || "");
    setIsModalOpen(true);
  };

  // Save Item (Add or Update)
  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    const rawIng = MOCK_RAW_INGREDIENTS.find((i) => i.id === selectedIngredientId);
    if (!rawIng) return;

    if (activeTab === "RECIPE_BOM") {
      setProductRecipes((prev) =>
        prev.map((prod) => {
          if (prod.productId !== currentProduct.productId) return prod;
          return {
            ...prod,
            variants: prod.variants.map((variant) => {
              if (variant.sizeId !== currentVariant.sizeId) return variant;

              if (editingItemId) {
                // Update
                return {
                  ...variant,
                  items: variant.items.map((item) =>
                    item.id === editingItemId
                      ? {
                          ...item,
                          ingredientId: rawIng.id,
                          ingredientName: rawIng.name,
                          consumedQuantity: Number(inputConsumedQty),
                          unit: rawIng.unit,
                          unitCost: rawIng.unitCost,
                          note: inputNote,
                        }
                      : item
                  ),
                };
              } else {
                // Add new
                const newItem: BomItem = {
                  id: `bom-${Date.now()}`,
                  ingredientId: rawIng.id,
                  ingredientName: rawIng.name,
                  consumedQuantity: Number(inputConsumedQty),
                  unit: rawIng.unit,
                  unitCost: rawIng.unitCost,
                  note: inputNote,
                };
                return {
                  ...variant,
                  items: [...variant.items, newItem],
                };
              }
            }),
          };
        })
      );
      showToast(editingItemId ? "Đã cập nhật định lượng nguyên liệu!" : "Đã thêm nguyên liệu vào công thức!");
    } else {
      // TOPPING BOM
      setToppingBoms((prev) =>
        prev.map((top) => {
          if (top.toppingId !== currentTopping.toppingId) return top;

          if (editingItemId) {
            return {
              ...top,
              items: top.items.map((item) =>
                item.id === editingItemId
                  ? {
                      ...item,
                      ingredientId: rawIng.id,
                      ingredientName: rawIng.name,
                      consumedQuantity: Number(inputConsumedQty),
                      unit: rawIng.unit,
                      unitCost: rawIng.unitCost,
                      note: inputNote,
                    }
                  : item
              ),
            };
          } else {
            const newItem: BomItem = {
              id: `tbom-${Date.now()}`,
              ingredientId: rawIng.id,
              ingredientName: rawIng.name,
              consumedQuantity: Number(inputConsumedQty),
              unit: rawIng.unit,
              unitCost: rawIng.unitCost,
              note: inputNote,
            };
            return {
              ...top,
              items: [...top.items, newItem],
            };
          }
        })
      );
      showToast(editingItemId ? "Đã cập nhật định lượng Topping!" : "Đã thêm nguyên liệu vào Topping!");
    }

    setIsModalOpen(false);
  };

  // Delete Item
  const handleDeleteItem = (itemId: string, name: string) => {
    if (!confirm(`Bạn có chắc muốn xóa nguyên liệu "${name}" khỏi công thức định lượng?`)) {
      return;
    }

    if (activeTab === "RECIPE_BOM") {
      setProductRecipes((prev) =>
        prev.map((prod) => {
          if (prod.productId !== currentProduct.productId) return prod;
          return {
            ...prod,
            variants: prod.variants.map((variant) => {
              if (variant.sizeId !== currentVariant.sizeId) return variant;
              return {
                ...variant,
                items: variant.items.filter((item) => item.id !== itemId),
              };
            }),
          };
        })
      );
    } else {
      setToppingBoms((prev) =>
        prev.map((top) => {
          if (top.toppingId !== currentTopping.toppingId) return top;
          return {
            ...top,
            items: top.items.filter((item) => item.id !== itemId),
          };
        })
      );
    }
    showToast(`Đã xóa nguyên liệu "${name}"!`);
  };

  // Copy Recipe from another size
  const handleCopyFromOtherSize = (sourceSizeId: string) => {
    const sourceVariant = currentProduct.variants.find((v) => v.sizeId === sourceSizeId);
    if (!sourceVariant) return;

    setProductRecipes((prev) =>
      prev.map((prod) => {
        if (prod.productId !== currentProduct.productId) return prod;
        return {
          ...prod,
          variants: prod.variants.map((v) => {
            if (v.sizeId !== currentVariant.sizeId) return v;
            return {
              ...v,
              items: sourceVariant.items.map((i) => ({
                ...i,
                id: `bom-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
              })),
            };
          }),
        };
      })
    );
    showToast(`Đã sao chép công thức từ ${sourceVariant.sizeName}!`);
  };

  const selectedIngredientObj = MOCK_RAW_INGREDIENTS.find((i) => i.id === selectedIngredientId);

  return (
    <div className="space-y-6">
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
            Thiết lập bảng nguyên vật liệu tiêu hao (Bill of Materials) để tự động trừ kho chính xác khi bán hàng
          </p>
        </div>

        {/* Quick Guide Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs font-medium">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Hệ thống hỗ trợ bước nhảy định mức chính xác đến 0.001</span>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
        <button
          onClick={() => {
            setActiveTab("RECIPE_BOM");
          }}
          className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm ${
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
            {productRecipes.length} món
          </span>
        </button>

        <button
          onClick={() => {
            setActiveTab("TOPPING_BOM");
          }}
          className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm ${
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
            {toppingBoms.length} topping
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
                    value={selectedProductId}
                    onChange={(e) => {
                      setSelectedProductId(e.target.value);
                      const prod = productRecipes.find((p) => p.productId === e.target.value);
                      if (prod && prod.variants.length > 0) {
                        setSelectedSizeId(prod.variants[0].sizeId);
                      }
                    }}
                    className="w-full pl-3.5 pr-10 py-2.5 bg-[#FAF6F0] border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#6F4E37] appearance-none cursor-pointer"
                  >
                    {productRecipes.map((prod) => (
                      <option key={prod.productId} value={prod.productId}>
                        {prod.productName} ({prod.category})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Size Variant Selector */}
              <div className="w-full sm:w-[240px]">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  2. Chọn Biến thể Size
                </label>
                <div className="relative">
                  <select
                    value={selectedSizeId}
                    onChange={(e) => setSelectedSizeId(e.target.value)}
                    className="w-full pl-3.5 pr-10 py-2.5 bg-[#FAF6F0] border border-gray-200 rounded-xl text-sm font-semibold text-[#6F4E37] focus:outline-none focus:ring-2 focus:ring-[#6F4E37] appearance-none cursor-pointer"
                  >
                    {currentProduct?.variants.map((variant) => (
                      <option key={variant.sizeId} value={variant.sizeId}>
                        {variant.sizeName} - {variant.volume} ({variant.sellingPrice.toLocaleString()}đ)
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#6F4E37] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-gray-100">
              {/* Copy Recipe Dropdown */}
              {currentProduct.variants.length > 1 && (
                <div className="relative group">
                  <button className="flex items-center gap-2 px-3.5 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-sm font-medium border border-gray-200 transition-colors">
                    <Copy className="w-4 h-4 text-gray-500" />
                    <span>Sao chép từ Size khác</span>
                  </button>
                  <div className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-gray-100 rounded-xl shadow-lg p-1 hidden group-hover:block z-20">
                    <p className="px-3 py-1.5 text-xs font-medium text-gray-400">Sao chép định mức từ:</p>
                    {currentProduct.variants
                      .filter((v) => v.sizeId !== currentVariant?.sizeId)
                      .map((v) => (
                        <button
                          key={v.sizeId}
                          onClick={() => handleCopyFromOtherSize(v.sizeId)}
                          className="w-full text-left px-3 py-2 text-xs font-medium text-gray-700 hover:bg-[#F5EBE6] hover:text-[#6F4E37] rounded-lg transition-colors"
                        >
                          {v.sizeName} ({v.items.length} nguyên liệu)
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* Add Ingredient Button */}
              <button
                onClick={handleOpenAddModal}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#6F4E37] hover:bg-[#5A3F2C] text-white rounded-xl text-sm font-semibold transition-all shadow-sm shadow-[#6F4E37]/20"
              >
                <Plus className="w-4 h-4" />
                <span>+ Thêm nguyên liệu</span>
              </button>
            </div>
          </div>

          {/* KPI Summary Cards for Current Variant */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#F5EBE6] text-[#6F4E37] flex items-center justify-center font-bold">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Giá bán niêm yết</p>
                <p className="text-lg font-bold text-gray-900">
                  {currentVariant?.sellingPrice.toLocaleString()} <span className="text-xs text-gray-500 font-normal">đ</span>
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Ước tính giá vốn (Cost/Ly)</p>
                <p className="text-lg font-bold text-amber-700">
                  {Math.round(totalDrinkCost).toLocaleString()} <span className="text-xs text-gray-500 font-normal">đ</span>
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Tỷ suất lợi nhuận gộp</p>
                <p className="text-lg font-bold text-emerald-600">
                  {drinkProfitMargin.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          {/* Table: BOM Items */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-base">
                  Bảng định mức: {currentProduct?.productName} -{" "}
                  <span className="text-[#6F4E37]">{currentVariant?.sizeName}</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Khi pha chế 1 ly {currentVariant?.sizeName}, hệ thống tự động trừ kho các định mức bên dưới
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg font-medium">
                {currentVariant?.items.length || 0} thành phần
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FAF6F0] text-gray-600 text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
                    <th className="py-3.5 px-5">Mã / Tên nguyên liệu</th>
                    <th className="py-3.5 px-5 text-center">Định mức tiêu hao (Step: 0.001)</th>
                    <th className="py-3.5 px-5">Đơn vị tính</th>
                    <th className="py-3.5 px-5">Đơn giá kho</th>
                    <th className="py-3.5 px-5">Thành tiền vốn</th>
                    <th className="py-3.5 px-5">Ghi chú pha chế</th>
                    <th className="py-3.5 px-5 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {currentVariant && currentVariant.items.length > 0 ? (
                    currentVariant.items.map((item) => {
                      const cost = item.consumedQuantity * item.unitCost;
                      return (
                        <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="py-3.5 px-5">
                            <div className="font-semibold text-gray-900">{item.ingredientName}</div>
                            <span className="text-xs text-gray-400 font-mono">{item.ingredientId}</span>
                          </td>
                          <td className="py-3.5 px-5 text-center">
                            <span className="inline-block px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg font-mono font-bold text-sm">
                              {item.consumedQuantity.toFixed(3)}
                            </span>
                          </td>
                          <td className="py-3.5 px-5">
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                              {item.unit}
                            </span>
                          </td>
                          <td className="py-3.5 px-5 text-gray-600 text-xs">
                            {item.unitCost.toLocaleString()} đ/{item.unit}
                          </td>
                          <td className="py-3.5 px-5 font-semibold text-gray-900 text-sm">
                            {Math.round(cost).toLocaleString()} đ
                          </td>
                          <td className="py-3.5 px-5 text-xs text-gray-500 max-w-xs truncate">
                            {item.note || "—"}
                          </td>
                          <td className="py-3.5 px-5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEditModal(item)}
                                className="p-1.5 text-gray-500 hover:text-[#6F4E37] hover:bg-[#F5EBE6] rounded-lg transition-colors"
                                title="Chỉnh sửa định mức"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteItem(item.id, item.ingredientName)}
                                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Xóa khỏi công thức"
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
                      <td colSpan={7} className="py-10 text-center text-gray-400">
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
          {/* Controls Bar: Select Topping */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="w-full sm:w-[320px]">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Chọn Topping / Món thêm
              </label>
              <div className="relative">
                <select
                  value={selectedToppingId}
                  onChange={(e) => setSelectedToppingId(e.target.value)}
                  className="w-full pl-3.5 pr-10 py-2.5 bg-[#FAF6F0] border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#6F4E37] appearance-none cursor-pointer"
                >
                  {toppingBoms.map((top) => (
                    <option key={top.toppingId} value={top.toppingId}>
                      {top.toppingName} (+{top.extraPrice.toLocaleString()}đ)
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#6F4E37] hover:bg-[#5A3F2C] text-white rounded-xl text-sm font-semibold transition-all shadow-sm shadow-[#6F4E37]/20"
            >
              <Plus className="w-4 h-4" />
              <span>+ Thêm nguyên liệu cho Topping</span>
            </button>
          </div>

          {/* Summary for Current Topping */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#F5EBE6] text-[#6F4E37] flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Giá phụ thu</p>
                <p className="text-lg font-bold text-gray-900">
                  +{currentTopping?.extraPrice.toLocaleString()} <span className="text-xs text-gray-500 font-normal">đ</span>
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Giá vốn / 1 phần topping</p>
                <p className="text-lg font-bold text-amber-700">
                  {Math.round(totalToppingCost).toLocaleString()} <span className="text-xs text-gray-500 font-normal">đ</span>
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Biên lợi nhuận topping</p>
                <p className="text-lg font-bold text-emerald-600">
                  {toppingProfitMargin.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          {/* Table: Topping BOM Items */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-base">
                  Nguyên liệu cấu thành: <span className="text-[#6F4E37]">{currentTopping?.toppingName}</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Quy chuẩn tiêu hao trên 1 khẩu phần: {currentTopping?.servingUnit}
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg font-medium">
                {currentTopping?.items.length || 0} thành phần
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FAF6F0] text-gray-600 text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
                    <th className="py-3.5 px-5">Mã / Tên nguyên liệu</th>
                    <th className="py-3.5 px-5 text-center">Định mức tiêu hao (Step: 0.001)</th>
                    <th className="py-3.5 px-5">Đơn vị tính</th>
                    <th className="py-3.5 px-5">Đơn giá kho</th>
                    <th className="py-3.5 px-5">Thành tiền vốn</th>
                    <th className="py-3.5 px-5">Ghi chú</th>
                    <th className="py-3.5 px-5 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {currentTopping && currentTopping.items.length > 0 ? (
                    currentTopping.items.map((item) => {
                      const cost = item.consumedQuantity * item.unitCost;
                      return (
                        <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="py-3.5 px-5">
                            <div className="font-semibold text-gray-900">{item.ingredientName}</div>
                            <span className="text-xs text-gray-400 font-mono">{item.ingredientId}</span>
                          </td>
                          <td className="py-3.5 px-5 text-center">
                            <span className="inline-block px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg font-mono font-bold text-sm">
                              {item.consumedQuantity.toFixed(3)}
                            </span>
                          </td>
                          <td className="py-3.5 px-5">
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                              {item.unit}
                            </span>
                          </td>
                          <td className="py-3.5 px-5 text-gray-600 text-xs">
                            {item.unitCost.toLocaleString()} đ/{item.unit}
                          </td>
                          <td className="py-3.5 px-5 font-semibold text-gray-900 text-sm">
                            {Math.round(cost).toLocaleString()} đ
                          </td>
                          <td className="py-3.5 px-5 text-xs text-gray-500 max-w-xs truncate">
                            {item.note || "—"}
                          </td>
                          <td className="py-3.5 px-5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEditModal(item)}
                                className="p-1.5 text-gray-500 hover:text-[#6F4E37] hover:bg-[#F5EBE6] rounded-lg transition-colors"
                                title="Chỉnh sửa định mức"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteItem(item.id, item.ingredientName)}
                                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Xóa khỏi Topping"
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
                      <td colSpan={7} className="py-10 text-center text-gray-400">
                        <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        Chưa có nguyên liệu cấu thành nào cho topping này.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Thêm / Sửa Nguyên liệu vào BOM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-5 bg-[#FAF6F0] border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white rounded-xl text-[#6F4E37] shadow-xs">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">
                    {editingItemId ? "Chỉnh sửa định mức" : "Thêm nguyên liệu vào BOM"}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {activeTab === "RECIPE_BOM"
                      ? `${currentProduct?.productName} (${currentVariant?.sizeName})`
                      : currentTopping?.toppingName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200/50 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveItem} className="p-6 space-y-4">
              {/* Ingredient Selection */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                  Nguyên liệu kho <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedIngredientId}
                    onChange={(e) => setSelectedIngredientId(e.target.value)}
                    disabled={editingItemId !== null}
                    className="w-full pl-3.5 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6F4E37] appearance-none disabled:bg-gray-100 disabled:text-gray-500 cursor-pointer"
                  >
                    {MOCK_RAW_INGREDIENTS.map((ing) => (
                      <option key={ing.id} value={ing.id}>
                        {ing.name} (ĐVT: {ing.unit} - {ing.unitCost.toLocaleString()}đ/{ing.unit})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                {selectedIngredientObj && (
                  <p className="text-xs text-gray-500 mt-1 flex items-center justify-between">
                    <span>Tồn kho hiện tại: <strong className="text-gray-700">{selectedIngredientObj.currentStock} {selectedIngredientObj.unit}</strong></span>
                    <span>Đơn giá: <strong className="text-amber-700">{selectedIngredientObj.unitCost.toLocaleString()}đ</strong></span>
                  </p>
                )}
              </div>

              {/* Consumed Quantity with step 0.001 */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Định mức tiêu hao / ly <span className="text-red-500">*</span>
                  </label>
                  <span className="text-xs text-amber-700 font-medium">Bước nhảy: 0.001</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    step="0.001"
                    min="0.001"
                    max="1000"
                    required
                    value={inputConsumedQty}
                    onChange={(e) => setInputConsumedQty(parseFloat(e.target.value) || 0)}
                    className="w-full pl-4 pr-16 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-mono font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
                    placeholder="0.025"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {selectedIngredientObj?.unit || "đv"}
                  </span>
                </div>
                {selectedIngredientObj && (
                  <p className="text-xs text-gray-500 mt-1">
                    Giá vốn thành phần:{" "}
                    <strong className="text-emerald-600">
                      {Math.round(inputConsumedQty * selectedIngredientObj.unitCost).toLocaleString()} VNĐ
                    </strong>
                  </p>
                )}
              </div>

              {/* Note */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                  Ghi chú pha chế / Kỹ thuật
                </label>
                <input
                  type="text"
                  value={inputNote}
                  onChange={(e) => setInputNote(e.target.value)}
                  placeholder="VD: Chiết xuất Single Shot, Đánh bọt lạnh..."
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
                />
              </div>

              {/* Modal Footer */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#6F4E37] hover:bg-[#5A3F2C] text-white rounded-xl text-sm font-semibold transition-colors shadow-sm shadow-[#6F4E37]/20"
                >
                  {editingItemId ? "Lưu thay đổi" : "Thêm vào công thức"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
