import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { BookOpen, Coffee, CheckCircle2 } from 'lucide-react';
import { inventoryService } from '@/api/inventory.service';

interface QuickRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
}

export const QuickRecipeModal: React.FC<QuickRecipeModalProps> = ({
  isOpen,
  onClose,
  productName,
}) => {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && productName) {
      const fetchRecipe = async () => {
        setLoading(true);
        try {
          const res = await inventoryService.getRecipeBOMs();
          const filtered = res.filter(
            (r: any) =>
              r.productName?.toLowerCase().includes(productName.toLowerCase()) ||
              r.name?.toLowerCase().includes(productName.toLowerCase())
          );
          setRecipes(filtered);
        } catch {
          setRecipes([]);
        } finally {
          setLoading(false);
        }
      };
      fetchRecipe();
    }
  }, [isOpen, productName]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Công thức pha chế: ${productName}`}>
      <div className="space-y-4">
        {/* Header summary */}
        <div className="p-3.5 bg-[#FAF6F0] rounded-xl border border-[#EBE3D5] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#6F4E37] text-white flex items-center justify-center font-bold shrink-0">
            <Coffee className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Đồ uống đang kiểm tra</p>
            <p className="font-bold text-gray-900 text-sm">{productName}</p>
          </div>
        </div>

        {/* Recipes breakdown */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-[#6F4E37]" />
            <span>Định mức nguyên liệu (BOM)</span>
          </h4>

          {loading ? (
            <div className="py-8 text-center text-xs text-gray-400">Đang tải định mức nguyên liệu...</div>
          ) : recipes.length > 0 ? (
            <div className="space-y-2">
              {recipes.map((rc, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white rounded-xl border border-gray-100 flex items-center justify-between text-xs hover:border-[#6F4E37]/30 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-gray-900">{rc.ingredientName || rc.name}</span>
                    {(rc.productSize || rc.sizeSnapshot) && (
                      <span className="text-[10px] font-bold text-[#6F4E37] bg-[#F5EBE6] px-2 py-0.5 rounded-md border border-[#EBE3D5]">
                        Size {rc.productSize || rc.sizeSnapshot}
                      </span>
                    )}
                  </div>
                  <span className="font-bold text-[#6F4E37] text-sm">
                    {rc.consumedQuantity || rc.quantity} {rc.unit || rc.ingredientUnit || 'đơn vị'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-xs text-gray-500 space-y-1">
              <p className="font-semibold text-gray-700">Công thức chuẩn tham khảo:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-600 pt-1">
                <li>25g Cà phê phin/espresso nguyên chất</li>
                <li>30ml Sữa đặc Ngôi Sao Phương Nam</li>
                <li>15ml Sữa tươi Vinamilk không đường</li>
                <li>150g Đá viên sạch</li>
              </ul>
            </div>
          )}
        </div>

        {/* Standard notes */}
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/70 text-xs text-amber-900 space-y-1">
          <p className="font-bold text-amber-900">💡 Lưu ý pha chế tại quầy:</p>
          <p className="text-amber-800">
            Khuấy đều hỗn hợp trước khi thêm đá. Kiểm tra chính xác các ghi chú tùy chỉnh (Đường, Đá, Topping) trên vé đơn trước khi bấm hoàn tất.
          </p>
        </div>

        <div className="pt-2 flex justify-end">
          <Button type="button" onClick={onClose}>
            Đã hiểu
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default QuickRecipeModal;
