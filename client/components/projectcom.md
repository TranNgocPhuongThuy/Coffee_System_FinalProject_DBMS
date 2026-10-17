# Project Dump

**Root:** `C:\Programing\hqtcsdl\Coffee_System_FinalProject_DBMS\client\components`

**Generated:** 2026-10-17 21:38:44.599971

**Files:** 41 | **Total size:** 163,683 bytes

---

# common\Badge.tsx

| Property | Value |
|----------|-------|
| Path | `common\Badge.tsx` |
| Size | 700 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:54.963540 |

```tsx
import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default' }) => {
  const styles: Record<string, string> = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    default: 'bg-gray-100 text-gray-800',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[variant]}`}>
      {children}
    </span>
  );
};

export default Badge;

```

# common\Button.tsx

| Property | Value |
|----------|-------|
| Path | `common\Button.tsx` |
| Size | 1,681 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:54.963540 |

```tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  isLoading,
  variant = 'primary',
  fullWidth = true,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'py-3 px-4 rounded-xl font-semibold text-sm shadow-sm transition-all duration-200 cursor-pointer active:scale-[0.99] flex items-center justify-center gap-2';

  const variants = {
    primary: 'bg-[#6F4E37] hover:bg-[#5A3F2C] text-white disabled:bg-[#A89485]',
    secondary: 'bg-[#F5EBE6] hover:bg-[#EBDCD3] text-[#6F4E37] disabled:opacity-50',
    outline: 'border border-[#6F4E37] text-[#6F4E37] hover:bg-[#F5EBE6] disabled:opacity-50',
  };

  return (
    <button
      disabled={isLoading || disabled}
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Đang xử lý...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;


```

# common\ConfirmModal.tsx

| Property | Value |
|----------|-------|
| Path | `common\ConfirmModal.tsx` |
| Size | 954 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:54.963540 |

```tsx
import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Hủy</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded">Xác nhận</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

```

# common\Drawer.tsx

| Property | Value |
|----------|-------|
| Path | `common\Drawer.tsx` |
| Size | 2,097 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:54.974106 |

```tsx
import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  width?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  width = 'w-full sm:w-[450px]',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className={`bg-white h-full ${width} shadow-2xl flex flex-col animate-in slide-in-from-right duration-300`}>
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
            {title && <h3 className="text-base font-bold text-gray-900 tracking-tight">{title}</h3>}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all cursor-pointer ml-auto"
              title="Đóng (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Drawer;

```

# common\EmptyState.tsx

| Property | Value |
|----------|-------|
| Path | `common\EmptyState.tsx` |
| Size | 0 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:54.974106 |

```tsx

```

# common\ErrorState.tsx

| Property | Value |
|----------|-------|
| Path | `common\ErrorState.tsx` |
| Size | 0 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:54.974106 |

```tsx

```

# common\Input.tsx

| Property | Value |
|----------|-------|
| Path | `common\Input.tsx` |
| Size | 1,906 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:54.974106 |

```tsx
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  isPassword?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  isPassword,
  type = 'text',
  className = '',
  id,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
  const inputId = id || props.name;

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          type={inputType}
          className={`w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 text-sm transition-colors focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20 ${
            isPassword ? 'pr-11' : ''
          } ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''} ${className}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#6F4E37] transition-colors p-1 cursor-pointer"
            aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default Input;


```

# common\Loading.tsx

| Property | Value |
|----------|-------|
| Path | `common\Loading.tsx` |
| Size | 0 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:54.974106 |

```tsx

```

# common\Modal.tsx

| Property | Value |
|----------|-------|
| Path | `common\Modal.tsx` |
| Size | 684 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:54.974106 |

```tsx
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
        {children}
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-200 rounded">Đóng</button>
      </div>
    </div>
  );
};

export default Modal;

```

# common\Table.tsx

| Property | Value |
|----------|-------|
| Path | `common\Table.tsx` |
| Size | 749 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:54.974106 |

```tsx
import React from 'react';

interface TableProps {
  headers: string[];
  children: React.ReactNode;
}

export const Table: React.FC<TableProps> = ({ headers, children }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">{children}</tbody>
      </table>
    </div>
  );
};

export default Table;

```

# inventory\AddBOMIngredientModal.tsx

| Property | Value |
|----------|-------|
| Path | `inventory\AddBOMIngredientModal.tsx` |
| Size | 185 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:54.974106 |

```tsx
import React from 'react';

export const AddBOMIngredientModal: React.FC = () => {
  return <div>AddBOMIngredientModal Component</div>;
};

export default AddBOMIngredientModal;

```

# inventory\CreateImportTicketModal.tsx

| Property | Value |
|----------|-------|
| Path | `inventory\CreateImportTicketModal.tsx` |
| Size | 191 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:54.984116 |

```tsx
import React from 'react';

export const CreateImportTicketModal: React.FC = () => {
  return <div>CreateImportTicketModal Component</div>;
};

export default CreateImportTicketModal;

```

# inventory\ImportDetailDrawer.tsx

| Property | Value |
|----------|-------|
| Path | `inventory\ImportDetailDrawer.tsx` |
| Size | 176 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:54.984177 |

```tsx
import React from 'react';

export const ImportDetailDrawer: React.FC = () => {
  return <div>ImportDetailDrawer Component</div>;
};

export default ImportDetailDrawer;

```

# inventory\IngredientFormModal.tsx

| Property | Value |
|----------|-------|
| Path | `inventory\IngredientFormModal.tsx` |
| Size | 179 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:54.984177 |

```tsx
import React from 'react';

export const IngredientFormModal: React.FC = () => {
  return <div>IngredientFormModal Component</div>;
};

export default IngredientFormModal;

```

# inventory\InventoryAdjustmentModal.tsx

| Property | Value |
|----------|-------|
| Path | `inventory\InventoryAdjustmentModal.tsx` |
| Size | 194 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:54.984177 |

```tsx
import React from 'react';

export const InventoryAdjustmentModal: React.FC = () => {
  return <div>InventoryAdjustmentModal Component</div>;
};

export default InventoryAdjustmentModal;

```

# kds\KDSTicketCard.tsx

| Property | Value |
|----------|-------|
| Path | `kds\KDSTicketCard.tsx` |
| Size | 8,151 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:54.984177 |

```tsx
import React from 'react';
import { Clock, Utensils, ShoppingBag, BellRing, CheckCheck, Play, BookOpen } from 'lucide-react';
import { KdsQueueItem } from '@/types/kds';

interface KDSTicketCardProps {
  item: KdsQueueItem;
  onUpdateStatus: (orderDetailId: number, status: 'PREPARING' | 'DONE' | 'CANCELLED') => Promise<void>;
  onNotifyReady?: (orderId: number) => Promise<void>;
  onViewRecipe?: (productName: string) => void;
  loadingId?: number | null;
}

export const KDSTicketCard: React.FC<KDSTicketCardProps> = ({
  item,
  onUpdateStatus,
  onNotifyReady,
  onViewRecipe,
  loadingId,
}) => {
  const isLoading = loadingId === item.orderDetailId;
  const isUrgent = item.waitingMinutes >= 10 && item.itemStatus !== 'DONE';

  return (
    <div
      className={`bg-white rounded-2xl border flex flex-col justify-between overflow-hidden shadow-sm transition-all duration-200 ${
        item.itemStatus === 'PREPARING'
          ? 'border-blue-400 ring-2 ring-blue-400/20'
          : item.itemStatus === 'DONE'
          ? 'border-emerald-300 opacity-80'
          : isUrgent
          ? 'border-rose-400 ring-2 ring-rose-400/20'
          : 'border-[#F0E6DD]'
      }`}
    >
      {/* Ticket Header */}
      <div className="p-4 border-b border-gray-100 bg-[#FAF6F0]/40 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-base text-gray-900 tracking-tight font-mono">
              #{item.orderCode || item.orderId}
            </span>
            {item.pagerCode && (
              <span className="text-xs font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-200">
                Thẻ rung #{item.pagerCode}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <span>{item.itemCreatedAt ? new Date(item.itemCreatedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : ''}</span>
            <span>•</span>
            <span className={`font-semibold ${isUrgent ? 'text-rose-600' : 'text-gray-600'}`}>
              {item.waitingMinutes} phút trước
            </span>
          </div>
        </div>

        {/* Order Channel */}
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${
            item.orderChannel === 'ONLINE'
              ? 'bg-blue-50 text-blue-700 border border-blue-200'
              : 'bg-[#F5EBE6] text-[#6F4E37]'
          }`}
        >
          {item.orderChannel === 'ONLINE' ? (
            <>
              <ShoppingBag className="w-3 h-3" />
              Online
            </>
          ) : (
            <>
              <Utensils className="w-3 h-3" />
              Tại quầy
            </>
          )}
        </span>
      </div>

      {/* Ticket Body: Item Info */}
      <div className="p-4 space-y-3 flex-1 bg-white">
        <div className="p-3.5 rounded-xl bg-[#FAF6F0]/60 border border-gray-100 flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5 flex-1">
            <span className="w-7 h-7 rounded-xl bg-[#6F4E37] text-white text-sm font-bold flex items-center justify-center shrink-0 shadow-xs">
              {item.quantity}x
            </span>
            <div>
              <p className="font-bold text-base text-gray-900 leading-snug">
                {item.itemSnapshotName}{' '}
                {item.sizeSnapshot && (
                  <span className="text-xs text-gray-500 font-normal">({item.sizeSnapshot})</span>
                )}
              </p>

              {/* Toppings list */}
              {item.toppings && item.toppings.length > 0 && (
                <div className="mt-1.5 space-y-0.5">
                  {item.toppings.map((tp, idx) => (
                    <span
                      key={idx}
                      className="inline-block text-[11px] font-medium text-amber-900 bg-amber-50 border border-amber-200/70 rounded-md px-2 py-0.5 mr-1"
                    >
                      + {tp.name} (x{tp.quantity})
                    </span>
                  ))}
                </div>
              )}

              {/* Note */}
              {item.note && (
                <p className="text-xs font-medium text-amber-900 bg-amber-50 border border-amber-200/80 rounded-md px-2 py-1 mt-2 inline-block">
                  ⭐ Ghi chú: {item.note}
                </p>
              )}
            </div>
          </div>

          {/* Quick Recipe Button */}
          {onViewRecipe && (
            <button
              type="button"
              onClick={() => onViewRecipe(item.itemSnapshotName)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-[#6F4E37] hover:bg-[#F5EBE6] transition-colors cursor-pointer shrink-0"
              title="Xem công thức pha chế"
            >
              <BookOpen className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Ticket Footer Actions */}
      <div className="p-4 border-t border-gray-100 bg-white space-y-2">
        {item.itemStatus === 'PENDING' && (
          <button
            type="button"
            disabled={isLoading}
            onClick={() => onUpdateStatus(item.orderDetailId, 'PREPARING')}
            className="w-full py-3 px-4 rounded-xl bg-[#6F4E37] hover:bg-[#5A3F2C] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-[0.98] disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Bắt đầu pha chế</span>
          </button>
        )}

        {item.itemStatus === 'PREPARING' && (
          <div className="flex gap-2">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => onUpdateStatus(item.orderDetailId, 'DONE')}
              className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-[0.98] disabled:opacity-50"
            >
              <CheckCheck className="w-5 h-5" />
              <span>Hoàn tất món</span>
            </button>

            {item.pagerCode && onNotifyReady && (
              <button
                type="button"
                onClick={() => onNotifyReady(item.orderId)}
                className="py-3 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                title="Báo rung chuông Pager"
              >
                <BellRing className="w-4 h-4 text-amber-600 animate-bounce" />
                <span>Rung chuông</span>
              </button>
            )}
          </div>
        )}

        {item.itemStatus === 'DONE' && (
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <span className="flex items-center gap-1.5">
              <CheckCheck className="w-4 h-4 text-emerald-600" />
              Đã hoàn thành pha chế
            </span>
            {item.pagerCode && onNotifyReady && (
              <button
                type="button"
                onClick={() => onNotifyReady(item.orderId)}
                className="text-[11px] font-bold text-amber-800 bg-white px-2 py-1 rounded border border-amber-200 hover:bg-amber-50 cursor-pointer"
              >
                Rung Pager #{item.pagerCode}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default KDSTicketCard;

```

# kds\QuickRecipeModal.tsx

| Property | Value |
|----------|-------|
| Path | `kds\QuickRecipeModal.tsx` |
| Size | 4,946 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:54.984177 |

```tsx
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
                    {rc.sizeSnapshot && (
                      <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                        Size {rc.sizeSnapshot}
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

```

# layout\Header.tsx

| Property | Value |
|----------|-------|
| Path | `layout\Header.tsx` |
| Size | 5,194 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:54.984177 |

```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, ChevronDown, KeyRound, LogOut, User as UserIcon } from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';

interface HeaderProps {
  title?: string;
}

export default function Header({ title }: HeaderProps) {
  const pathname = usePathname();
  const { user, logout } = useAuthContext();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getPageTitle = () => {
    if (title) return title;
    if (pathname.startsWith('/dashboard/menu')) return 'Quản lý Thực đơn';
    if (pathname.startsWith('/dashboard/inventory')) return 'Quản lý Kho & Định lượng';
    if (pathname.startsWith('/dashboard/customers')) return 'Khách hàng & Hội viên';
    if (pathname.startsWith('/dashboard/reports')) return 'Báo cáo & Thống kê';
    if (pathname.startsWith('/dashboard/employees')) return 'Quản lý Nhân viên';
    if (pathname.startsWith('/pos')) return 'Bán hàng POS';
    if (pathname.startsWith('/kds')) return 'Màn hình Bếp / Quầy Bar (KDS)';
    if (pathname === '/dashboard') return 'Tổng quan';
    return 'Tổng quan';
  };

  const currentTitle = getPageTitle();
  const isKds = pathname.startsWith('/kds');
  const displayName = user?.fullName || (isKds ? 'Hồ Công Phong' : 'Người dùng');
  const displayRole = user?.role || user?.userType || (isKds ? 'BARISTA' : 'GUEST');
  const initial = displayName ? displayName.charAt(0).toUpperCase() : 'U';

  return (
    <header className="h-16 fixed top-0 right-0 left-64 bg-white border-b border-gray-100 flex items-center justify-between px-6 z-50">
      {/* Left: Page Title */}
      <div>
        <h1 className="text-xl font-semibold text-gray-800 tracking-tight">{currentTitle}</h1>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button
          type="button"
          aria-label="Thông báo"
          className="relative w-10 h-10 rounded-full flex items-center justify-center text-gray-600 hover:text-[#6F4E37] hover:bg-[#F5EBE6] transition-colors cursor-pointer"
        >
          <Bell className="w-5 h-5" strokeWidth={1.9} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
        </button>

        <div className="h-6 w-px bg-gray-200" />

        {/* User Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-[#F5EBE6] flex items-center justify-center text-[#6F4E37] font-semibold text-sm shrink-0">
              {initial}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm font-medium text-gray-700 leading-tight">
                {displayName}
              </span>
              <span className="text-[11px] text-gray-400 font-medium">
                {displayRole}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 shrink-0 ml-1" />
          </button>

          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-50"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-2.5 border-b border-gray-100">
                  <p className="text-xs font-semibold text-gray-800">{displayName}</p>
                  <p className="text-[11px] text-gray-400">{user?.phoneNumber || user?.username || (isKds ? 'barista01' : '')}</p>
                </div>

                <Link
                  href="/change-password"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <KeyRound className="w-4 h-4 text-gray-500" />
                  <span>Đổi mật khẩu</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

```

# layout\KdsHeader.tsx

| Property | Value |
|----------|-------|
| Path | `layout\KdsHeader.tsx` |
| Size | 208 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:54.994206 |

```tsx
import React from 'react';

export const KdsHeader: React.FC = () => {
  return <header className="h-16 bg-gray-900 text-white flex items-center px-6">KdsHeader</header>;
};

export default KdsHeader;

```

# layout\PosHeader.tsx

| Property | Value |
|----------|-------|
| Path | `layout\PosHeader.tsx` |
| Size | 203 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:54.995155 |

```tsx
import React from 'react';

export const PosHeader: React.FC = () => {
  return <header className="h-16 bg-white border-b flex items-center px-6">PosHeader</header>;
};

export default PosHeader;

```

# layout\Sidebar.tsx

| Property | Value |
|----------|-------|
| Path | `layout\Sidebar.tsx` |
| Size | 3,849 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:54.995155 |

```tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Coffee,
  LayoutDashboard,
  MonitorSmartphone,
  CupSoda,
  Package,
  Users,
  PieChart,
  LogOut,
  CookingPot,
} from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';
import { isRouteAllowed } from '@/constants/roles';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthContext();

  const allMenuItems = [
    {
      name: 'Tổng quan',
      path: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Bán hàng POS',
      path: '/pos/terminal',
      icon: MonitorSmartphone,
    },
    {
      name: 'Bếp / Pha chế',
      path: '/kds/queue',
      icon: CookingPot,
    },
    {
      name: 'Thực đơn',
      path: '/dashboard/menu/products',
      icon: CupSoda,
    },
    {
      name: 'Kho nguyên liệu',
      path: '/dashboard/inventory/ingredients',
      icon: Package,
    },
    {
      name: 'Khách hàng',
      path: '/dashboard/customers',
      icon: Users,
    },
    {
      name: 'Báo cáo',
      path: '/dashboard/reports',
      icon: PieChart,
    },
  ];

  // Lọc menu theo quyền của Role hiện tại
  const allowedMenuItems = user?.role
    ? allMenuItems.filter((item) => isRouteAllowed(item.path, user.role))
    : allMenuItems;

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-white border-r border-gray-100 flex flex-col z-40">
      {/* Header / Brand Logo */}
      <div className="h-20 flex items-center gap-3 px-6 border-b border-gray-100">
        <div className="w-10 h-10 rounded-full bg-[#F5EBE6] flex items-center justify-center text-[#6F4E37] shrink-0">
          <Coffee className="w-5 h-5" strokeWidth={2.2} />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold text-gray-900 tracking-tight leading-none">
            MePhaPhin
          </span>
          <span className="text-[11px] text-gray-400 font-medium mt-1">
            Coffee & Operations Management
          </span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-5 px-3 space-y-1.5 overflow-y-auto">
        {allowedMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.path === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-[#6F4E37] text-white shadow-sm'
                  : 'text-gray-600 hover:bg-[#F5EBE6] hover:text-[#6F4E37]'
              }`}
            >
              <Icon
                className={`w-5 h-5 shrink-0 ${
                  isActive ? 'text-white' : 'text-gray-500 group-hover:text-[#6F4E37]'
                }`}
                strokeWidth={isActive ? 2.2 : 1.8}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions: Logout */}
      <div className="p-3 border-t border-gray-100 mt-auto">
        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
        >
          <LogOut className="w-5 h-5 shrink-0" strokeWidth={1.8} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}
```

# loyalty\AdjustPointsModal.tsx

| Property | Value |
|----------|-------|
| Path | `loyalty\AdjustPointsModal.tsx` |
| Size | 8,911 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:54.995155 |

```tsx
import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { loyaltyService, CustomerItem, AdjustPointsPayload } from '@/api/loyalty.service';
import { PlusCircle, MinusCircle } from 'lucide-react';

interface AdjustPointsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  customer?: CustomerItem | null;
  customersList?: CustomerItem[];
}

export const AdjustPointsModal: React.FC<AdjustPointsModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  customer,
  customersList = [],
}) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | ''>('');
  const [transactionType, setTransactionType] = useState<'EARN' | 'REDEEM'>('EARN');
  const [points, setPoints] = useState<number | ''>('');
  const [orderId, setOrderId] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (customer) {
      setSelectedCustomerId(customer.id);
    } else if (customersList.length > 0) {
      setSelectedCustomerId(customersList[0].id);
    } else {
      setSelectedCustomerId('');
    }
    setTransactionType('EARN');
    setPoints('');
    setOrderId('');
    setDescription('');
    setError(null);
  }, [customer, customersList, isOpen]);

  const activeCustomer = customer || customersList.find((c) => c.id === Number(selectedCustomerId));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId) {
      setError('Vui lòng chọn khách hàng');
      return;
    }
    const numPoints = Number(points);
    if (!numPoints || numPoints <= 0) {
      setError('Số điểm điều chỉnh phải lớn hơn 0');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload: AdjustPointsPayload = {
        customerId: Number(selectedCustomerId),
        transactionType,
        points: numPoints,
        orderId: orderId ? Number(orderId) : null,
        description: description.trim() || undefined,
      };

      await loyaltyService.adjustPoints(payload);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Điều chỉnh điểm thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Điều chỉnh điểm thưởng thủ công">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-medium animate-in fade-in">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Customer Selection or Info Display */}
        {customer ? (
          <div className="p-3 bg-[#FAF6F0] rounded-xl border border-[#EBE3D5] flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">Khách hàng áp dụng</p>
              <p className="font-bold text-gray-900 text-sm">{customer.fullName}</p>
              <p className="text-xs text-gray-500 font-mono">{customer.phoneNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Điểm hiện tại</p>
              <p className="text-base font-bold text-[#6F4E37]">
                {(customer.rewardPoints || 0).toLocaleString('vi-VN')} pts
              </p>
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Chọn khách hàng <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20 transition-all"
              required
            >
              <option value="">-- Chọn khách hàng --</option>
              {customersList.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.fullName} - {c.phoneNumber} ({c.rewardPoints || 0} pts)
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Transaction Type Selector */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Loại điều chỉnh</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setTransactionType('EARN')}
              className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                transactionType === 'EARN'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-sm'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-emerald-600" />
              <span>Cộng điểm (+)</span>
            </button>
            <button
              type="button"
              onClick={() => setTransactionType('REDEEM')}
              className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                transactionType === 'REDEEM'
                  ? 'bg-red-50 border-red-300 text-red-800 shadow-sm'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <MinusCircle className="w-4 h-4 text-red-600" />
              <span>Trừ điểm (-)</span>
            </button>
          </div>
        </div>

        {/* Points input */}
        <Input
          label="Số điểm điều chỉnh"
          type="number"
          min="1"
          placeholder="Nhập số điểm..."
          value={points}
          onChange={(e) => setPoints(e.target.value ? Number(e.target.value) : '')}
          required
        />

        {/* Order ID (Optional) */}
        <Input
          label="Mã đơn hàng liên quan (Tùy chọn)"
          type="number"
          placeholder="Nhập Order ID nếu có (ví dụ: 102)"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
        />

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Lý do / Ghi chú <span className="text-gray-400 font-normal">(không bắt buộc)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Ví dụ: Thưởng sinh nhật khách hàng, Đổi quà tại quầy, Sửa sai sót..."
            className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20 transition-all resize-none"
          />
        </div>

        {/* Summary preview */}
        {activeCustomer && points && Number(points) > 0 && (
          <div className="p-3 bg-gray-50 rounded-xl text-xs space-y-1">
            <div className="flex justify-between text-gray-600">
              <span>Điểm hiện tại:</span>
              <span className="font-semibold">{activeCustomer.rewardPoints || 0} pts</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900">
              <span>Điểm dự kiến sau thay đổi:</span>
              <span className={transactionType === 'EARN' ? 'text-emerald-600' : 'text-red-600'}>
                {transactionType === 'EARN'
                  ? (activeCustomer.rewardPoints || 0) + Number(points)
                  : Math.max(0, (activeCustomer.rewardPoints || 0) - Number(points))}{' '}
                pts
              </span>
            </div>
          </div>
        )}

        <div className="pt-2 flex gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" isLoading={loading}>
            Xác nhận điều chỉnh
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AdjustPointsModal;

```

# loyalty\AssignRoleModal.tsx

| Property | Value |
|----------|-------|
| Path | `loyalty\AssignRoleModal.tsx` |
| Size | 3,981 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:54.995155 |

```tsx
import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { CustomerItem } from '@/api/loyalty.service';

interface AssignRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    fullName: string;
    username: string;
    password: string;
    role: 'CASHIER' | 'BARISTA' | 'STOREKEEPER';
    phoneNumber?: string;
  }) => Promise<void>;
  customer?: CustomerItem | null;
}

export const AssignRoleModal: React.FC<AssignRoleModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  customer,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'CASHIER' | 'BARISTA' | 'STOREKEEPER'>('CASHIER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (customer) {
      setUsername(customer.phoneNumber ? `emp_${customer.phoneNumber}` : '');
      setPassword('');
      setRole('CASHIER');
    }
    setError(null);
  }, [customer, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) return;
    setLoading(true);
    setError(null);
    try {
      await onSubmit({
        fullName: customer.fullName,
        username,
        password,
        role,
        phoneNumber: customer.phoneNumber,
      });
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Cấp quyền thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Cấp quyền Nhân viên: ${customer?.fullName || ''}`}>
      <div className="mb-4 text-xs text-gray-500">
        Tạo tài khoản Nhân viên nội bộ dựa trên thông tin khách hàng.
      </div>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-medium">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Tên đăng nhập (Username)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Nhập tên đăng nhập..."
          required
        />
        <Input
          label="Mật khẩu khởi tạo"
          isPassword
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Nhập mật khẩu..."
          required
        />
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Vai trò Nhân viên</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20"
          >
            <option value="CASHIER">Thu ngân (CASHIER)</option>
            <option value="BARISTA">Pha chế (BARISTA)</option>
            <option value="STOREKEEPER">Thủ kho (STOREKEEPER)</option>
          </select>
          <p className="text-[11px] text-amber-600 font-medium">
            ⚠️ Lưu ý: Không được phép chọn quyền Manager cho tài khoản này.
          </p>
        </div>
        <div className="pt-2 flex gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" isLoading={loading}>
            Xác nhận cấp quyền
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AssignRoleModal;

```

# loyalty\CustomerFormModal.tsx

| Property | Value |
|----------|-------|
| Path | `loyalty\CustomerFormModal.tsx` |
| Size | 3,162 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:54.995155 |

```tsx
import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { CustomerItem } from '@/api/loyalty.service';

interface CustomerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { fullName: string; phoneNumber: string; password?: string }) => Promise<void>;
  customer?: CustomerItem | null;
}

export const CustomerFormModal: React.FC<CustomerFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  customer,
}) => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (customer) {
      setFullName(customer.fullName || '');
      setPhoneNumber(customer.phoneNumber || '');
      setPassword('');
    } else {
      setFullName('');
      setPhoneNumber('');
      setPassword('');
    }
    setError(null);
  }, [customer, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSubmit({ fullName, phoneNumber, password: password || undefined });
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Thao tác thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={customer ? 'Chỉnh sửa thông tin khách hàng' : 'Thêm khách hàng mới'}
    >
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-medium">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Họ và tên"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Nhập họ tên..."
          required
        />
        <Input
          label="Số điện thoại"
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Nhập số điện thoại..."
          required
        />
        {!customer && (
          <Input
            label="Mật khẩu (Tùy chọn)"
            isPassword
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Để trống nếu tạo tại quầy"
          />
        )}
        <div className="pt-2 flex gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" isLoading={loading}>
            {customer ? 'Lưu thay đổi' : 'Tạo khách hàng'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CustomerFormModal;

```

# loyalty\CustomerProfileDrawer.tsx

| Property | Value |
|----------|-------|
| Path | `loyalty\CustomerProfileDrawer.tsx` |
| Size | 10,754 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:55.005812 |

```tsx
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Drawer } from '@/components/common/Drawer';
import { CustomerItem, loyaltyService } from '@/api/loyalty.service';
import { Sparkles, Crown, Shield, Medal, Clock, ArrowUpRight, ArrowDownLeft, Edit, PlusCircle, ExternalLink } from 'lucide-react';
import { LoyaltyTransaction } from '@/types/customer';

interface CustomerProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  customer: CustomerItem | null;
  onEdit?: (customer: CustomerItem) => void;
  onAdjustPoints?: (customer: CustomerItem) => void;
  isManager?: boolean;
}

export const CustomerProfileDrawer: React.FC<CustomerProfileDrawerProps> = ({
  isOpen,
  onClose,
  customer,
  onEdit,
  onAdjustPoints,
  isManager = false,
}) => {
  const [history, setHistory] = useState<LoyaltyTransaction[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (isOpen && customer) {
      const fetchHistory = async () => {
        setLoadingHistory(true);
        try {
          const res = await loyaltyService.getLoyaltyHistory({
            customerId: customer.id,
            limit: 5,
          });
          setHistory(res.items || res.data || []);
        } catch {
          setHistory([]);
        } finally {
          setLoadingHistory(false);
        }
      };
      fetchHistory();
    }
  }, [isOpen, customer]);

  if (!customer) return null;

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'DIAMOND':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            Kim Cương
          </span>
        );
      case 'GOLD':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
            <Crown className="w-3.5 h-3.5 text-amber-600" />
            Hạng Vàng
          </span>
        );
      case 'SILVER':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-200 text-slate-800">
            <Shield className="w-3.5 h-3.5 text-slate-600" />
            Hạng Bạc
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
            <Medal className="w-3.5 h-3.5 text-orange-600" />
            Hạng Chuẩn
          </span>
        );
    }
  };

  const initial = customer.fullName ? customer.fullName.charAt(0).toUpperCase() : 'K';

  // Calculate tier progress
  let nextTierName = 'SILVER';
  let targetPoints = 200;
  if (customer.membershipTier === 'SILVER') {
    nextTierName = 'GOLD';
    targetPoints = 500;
  } else if (customer.membershipTier === 'GOLD') {
    nextTierName = 'DIAMOND';
    targetPoints = 1000;
  }
  const currentEarned = customer.totalPointsEarned || customer.rewardPoints || 0;
  const isMaxTier = customer.membershipTier === 'DIAMOND';
  const progressPercent = isMaxTier
    ? 100
    : Math.min(100, Math.round((currentEarned / targetPoints) * 100));

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Hồ sơ chi tiết khách hàng">
      <div className="space-y-6">
        {/* Profile Card Header */}
        <div className="p-4 bg-gradient-to-br from-[#FAF6F0] to-[#F5EBE6] rounded-2xl border border-[#EBE3D5] flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#6F4E37] text-white font-bold text-xl flex items-center justify-center shrink-0 shadow-sm">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-lg truncate">{customer.fullName}</h3>
            <p className="text-xs text-gray-500 font-mono mt-0.5">{customer.phoneNumber}</p>
            <div className="mt-2">{getTierBadge(customer.membershipTier)}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(customer)}
              className="flex-1 py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Chỉnh sửa</span>
            </button>
          )}

          {isManager && onAdjustPoints && (
            <button
              type="button"
              onClick={() => onAdjustPoints(customer)}
              className="flex-1 py-2 px-3 bg-[#6F4E37] hover:bg-[#5A3F2C] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Thêm/Trừ điểm</span>
            </button>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm text-center">
            <p className="text-[11px] text-gray-400 font-medium">Điểm hiện có</p>
            <p className="text-base font-bold text-[#6F4E37] mt-0.5">
              {(customer.rewardPoints || 0).toLocaleString('vi-VN')}
            </p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm text-center">
            <p className="text-[11px] text-gray-400 font-medium">Tổng tích lũy</p>
            <p className="text-base font-bold text-emerald-600 mt-0.5">
              {(customer.totalPointsEarned || customer.rewardPoints || 0).toLocaleString('vi-VN')}
            </p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm text-center">
            <p className="text-[11px] text-gray-400 font-medium">Đã sử dụng</p>
            <p className="text-base font-bold text-amber-600 mt-0.5">
              {(customer.totalPointsRedeemed || 0).toLocaleString('vi-VN')}
            </p>
          </div>
        </div>

        {/* Tier Progress */}
        <div className="p-3.5 bg-white rounded-xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-gray-600">Tiến trình thăng hạng</span>
            <span className="text-gray-900 font-semibold">
              {isMaxTier ? 'Hạng cao nhất' : `${currentEarned} / ${targetPoints} pts (${nextTierName})`}
            </span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#8B5E3C] to-[#6F4E37] rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Recent Transactions List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Lịch sử giao dịch gần đây
            </h4>
            <Link
              href={`/dashboard/customers/transactions?customerId=${customer.id}`}
              onClick={onClose}
              className="text-xs font-semibold text-[#6F4E37] hover:underline inline-flex items-center gap-1"
            >
              <span>Xem tất cả</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          {loadingHistory ? (
            <div className="py-6 text-center text-xs text-gray-400">Đang tải lịch sử...</div>
          ) : history.length > 0 ? (
            <div className="space-y-2">
              {history.map((tx) => (
                <div
                  key={tx.id}
                  className="p-3 bg-white rounded-xl border border-gray-100 flex items-center justify-between text-xs hover:border-gray-200 transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        tx.transactionType === 'EARN'
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-red-50 text-red-600'
                      }`}
                    >
                      {tx.transactionType === 'EARN' ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {tx.transactionType === 'EARN' ? 'Cộng điểm thưởng' : 'Đổi / Trừ điểm'}
                      </p>
                      <p className="text-[11px] text-gray-400">
                        {tx.description || (tx.orderId ? `Đơn hàng #${tx.orderId}` : 'Hệ thống')}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p
                      className={`font-bold ${
                        tx.transactionType === 'EARN' ? 'text-emerald-600' : 'text-red-600'
                      }`}
                    >
                      {tx.transactionType === 'EARN' ? `+${tx.points}` : `-${tx.points}`} pts
                    </p>
                    <p className="text-[10px] text-gray-400 flex items-center justify-end gap-1">
                      <Clock className="w-3 h-3" />
                      {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString('vi-VN') : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center text-xs text-gray-400 bg-gray-50 rounded-xl">
              Chưa có lịch sử tích / tiêu điểm.
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default CustomerProfileDrawer;

```

# menu\CategoryFormModal.tsx

| Property | Value |
|----------|-------|
| Path | `menu\CategoryFormModal.tsx` |
| Size | 173 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:55.005812 |

```tsx
import React from 'react';

export const CategoryFormModal: React.FC = () => {
  return <div>CategoryFormModal Component</div>;
};

export default CategoryFormModal;

```

# menu\MenuNavTabs.tsx

| Property | Value |
|----------|-------|
| Path | `menu\MenuNavTabs.tsx` |
| Size | 1,760 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:55.005812 |

```tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CupSoda, Layers, Sparkles } from 'lucide-react';

export default function MenuNavTabs() {
  const pathname = usePathname();

  const tabs = [
    {
      name: 'Món ăn & Đồ uống',
      href: '/dashboard/menu/products',
      icon: CupSoda,
      isActive: pathname.startsWith('/dashboard/menu/products'),
    },
    {
      name: 'Danh mục thực đơn',
      href: '/dashboard/menu/categories',
      icon: Layers,
      isActive: pathname.startsWith('/dashboard/menu/categories'),
    },
    {
      name: 'Quản lý Topping',
      href: '/dashboard/menu/toppings',
      icon: Sparkles,
      isActive: pathname.startsWith('/dashboard/menu/toppings'),
    },
  ];

  return (
    <div className="flex items-center gap-1 sm:gap-2 border-b border-gray-200 overflow-x-auto no-scrollbar scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold transition-all whitespace-nowrap relative cursor-pointer ${
              tab.isActive
                ? 'text-[#6F4E37] border-b-2 border-[#6F4E37] -mb-[1px] bg-[#FAF6F0]/60 rounded-t-xl'
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-xl'
            }`}
          >
            <Icon className={`w-4 h-4 ${tab.isActive ? 'text-[#6F4E37]' : 'text-gray-400'}`} />
            <span>{tab.name}</span>
          </Link>
        );
      })}
    </div>
  );
}

```

# menu\ProductFormModal.tsx

| Property | Value |
|----------|-------|
| Path | `menu\ProductFormModal.tsx` |
| Size | 170 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:55.005812 |

```tsx
import React from 'react';

export const ProductFormModal: React.FC = () => {
  return <div>ProductFormModal Component</div>;
};

export default ProductFormModal;

```

# menu\ToppingFormModal.tsx

| Property | Value |
|----------|-------|
| Path | `menu\ToppingFormModal.tsx` |
| Size | 170 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:55.005812 |

```tsx
import React from 'react';

export const ToppingFormModal: React.FC = () => {
  return <div>ToppingFormModal Component</div>;
};

export default ToppingFormModal;

```

# pos\ApplyLoyaltyModal.tsx

| Property | Value |
|----------|-------|
| Path | `pos\ApplyLoyaltyModal.tsx` |
| Size | 7,453 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:55.005812 |

```tsx
// components/pos/ApplyLoyaltyModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { X, Award, CheckCircle2 } from 'lucide-react';
import { SelectedCustomer } from '@/hooks/usePosCart';

interface ApplyLoyaltyModalProps {
  isOpen: boolean;
  customer: SelectedCustomer | null;
  subTotal: number;
  currentPointsToRedeem: number;
  conversionRate?: number;
  onClose: () => void;
  onApply: (points: number) => void;
}

export const ApplyLoyaltyModal: React.FC<ApplyLoyaltyModalProps> = ({
  isOpen,
  customer,
  subTotal,
  currentPointsToRedeem,
  conversionRate = 1000,
  onClose,
  onApply,
}) => {
  const [points, setPoints] = useState<number>(currentPointsToRedeem);

  useEffect(() => {
    setPoints(currentPointsToRedeem);
  }, [currentPointsToRedeem, isOpen]);

  if (!isOpen || !customer) return null;

  const maxPointsBySubtotal = Math.floor(subTotal / conversionRate);
  const maxUsablePoints = Math.min(customer.rewardPoints, maxPointsBySubtotal);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const validPoints = Math.min(Math.max(0, points), maxUsablePoints);
    onApply(validPoints);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5EBE6] text-[#6F4E37] dark:bg-[#6F4E37]/20 dark:text-[#D4A373]">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">Đổi điểm thưởng hội viên</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Quy đổi: 1 điểm = {formatCurrency(conversionRate)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Thông tin hội viên */}
        <div className="p-6 space-y-5">
          <div className="rounded-2xl border border-[#EBE3D5] bg-[#FAF6F0] p-4 dark:border-[#6F4E37]/30 dark:bg-zinc-850 flex items-center justify-between">
            <div>
              <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{customer.fullName}</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{customer.phoneNumber}</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-semibold text-[#6F4E37] dark:text-[#D4A373] uppercase tracking-wider">
                Hạng {customer.membershipTier}
              </div>
              <div className="text-base font-black text-[#6F4E37] dark:text-[#D4A373]">
                {customer.rewardPoints} <span className="text-xs font-medium">điểm</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleApply} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
                Số điểm muốn đổi (Tối đa: {maxUsablePoints} điểm)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  max={maxUsablePoints}
                  value={points}
                  onChange={(e) => setPoints(Number(e.target.value) || 0)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-lg font-bold text-zinc-900 focus:border-[#6F4E37] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6F4E37]/20 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-100"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-zinc-400">
                  điểm
                </span>
              </div>
            </div>

            {/* Phím bấm chọn nhanh */}
            <div className="flex gap-2">
              {[10, 20, 50].map((pt) => {
                if (pt > maxUsablePoints) return null;
                return (
                  <button
                    key={pt}
                    type="button"
                    onClick={() => setPoints(pt)}
                    className="flex-1 rounded-lg border border-zinc-200 bg-zinc-50 py-1.5 text-xs font-bold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 cursor-pointer"
                  >
                    +{pt} điểm
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setPoints(maxUsablePoints)}
                className="flex-1 rounded-lg border border-[#EBE3D5] bg-[#F5EBE6] py-1.5 text-xs font-bold text-[#6F4E37] hover:bg-[#F5EBE6]/80 dark:border-[#6F4E37]/40 dark:bg-[#6F4E37]/20 dark:text-[#D4A373] cursor-pointer"
              >
                Dùng hết ({maxUsablePoints})
              </button>
            </div>

            {/* Preview giảm giá */}
            <div className="rounded-xl bg-zinc-100 p-3.5 dark:bg-zinc-800/60 flex items-center justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400 font-medium">Số tiền giảm trừ:</span>
              <span className="font-extrabold text-[#6F4E37] dark:text-[#D4A373] text-base">
                -{formatCurrency(points * conversionRate)}
              </span>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  onApply(0);
                  onClose();
                }}
                className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
              >
                Bỏ áp dụng
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-[#6F4E37] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-[#6F4E37]/30 hover:bg-[#5A3F2C] active:scale-[0.98] cursor-pointer"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Xác nhận đổi điểm</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyLoyaltyModal;

```

# pos\CancelOrderModal.tsx

| Property | Value |
|----------|-------|
| Path | `pos\CancelOrderModal.tsx` |
| Size | 6,119 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:55.015873 |

```tsx
// components/pos/CancelOrderModal.tsx
'use client';

import React, { useState } from 'react';
import { X, AlertTriangle, Loader2 } from 'lucide-react';
import { posService } from '@/api/pos.service';

interface CancelOrderModalProps {
  isOpen: boolean;
  orderId: number | null;
  orderCode?: string;
  employeeId?: number;
  onClose: () => void;
  onSuccess: () => void;
}

const QUICK_REASONS = [
  'Khách đổi ý muốn hủy đơn',
  'Pha chế nhầm món/kích cỡ',
  'Hết nguyên liệu phục vụ',
  'Khách chờ lâu và rời quán',
  'Lỗi nhập liệu thu ngân',
];

export const CancelOrderModal: React.FC<CancelOrderModalProps> = ({
  isOpen,
  orderId,
  orderCode,
  employeeId = 1,
  onClose,
  onSuccess,
}) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !orderId) return null;

  const handleCancel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setErrorMsg('Vui lòng nhập lý do hủy đơn hàng');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      await posService.cancelOrder(orderId, reason.trim(), employeeId);
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Không thể hủy đơn hàng này.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">Xác nhận hủy đơn hàng</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Mã đơn: <span className="font-bold">{orderCode || `#${orderId}`}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleCancel} className="p-6 space-y-4">
          {errorMsg && (
            <div className="rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-600 border border-red-200 dark:bg-red-950/40 dark:border-red-800 dark:text-red-300">
              {errorMsg}
            </div>
          )}

          <div className="rounded-xl bg-[#FAF6F0] p-3 text-xs text-[#6F4E37] dark:bg-amber-950/30 dark:text-amber-300 border border-[#EBE3D5] dark:border-amber-800">
            ⚠️ <strong>Lưu ý:</strong> Khi hủy đơn, thiết bị thẻ rung liên kết sẽ tự động được giải phóng về trạng thái <strong>AVAILABLE</strong>.
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
              Lý do hủy đơn <span className="text-red-500">*</span>
            </label>

            {/* Gợi ý lý do */}
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {QUICK_REASONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setReason(r)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-medium border transition-all ${
                    reason === r
                      ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold dark:bg-rose-950/40 dark:text-rose-300'
                      : 'border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-400'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              placeholder="Nhập lý do cụ thể..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-900 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-100"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Không hủy
            </button>
            <button
              type="submit"
              disabled={loading || !reason.trim()}
              className="flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-rose-600/30 hover:bg-rose-700 active:scale-[0.98] disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>Xác nhận HỦY ĐƠN</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CancelOrderModal;

```

# pos\CartSidebar.tsx

| Property | Value |
|----------|-------|
| Path | `pos\CartSidebar.tsx` |
| Size | 19,793 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:55.018130 |

```tsx
// components/pos/CartSidebar.tsx
'use client';

import React, { useState } from 'react';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  User,
  Radio,
  CreditCard,
  Banknote,
  QrCode,
  Award,
  UserPlus,
  X,
  Loader2,
  ReceiptText,
} from 'lucide-react';
import { CartItem, SelectedCustomer, SelectedPager } from '@/hooks/usePosCart';
import { PagerDevice } from '@/types/pager';
import { CustomerItem } from '@/api/loyalty.service';
import { OrderChannel, PaymentMethod } from '@/types/enums';

interface CartSidebarProps {
  items: CartItem[];
  subTotal: number;
  discountAmount: number;
  totalAmount: number;
  totalItemCount: number;
  orderChannel: OrderChannel;
  paymentMethod: PaymentMethod;
  selectedCustomer: SelectedCustomer | null;
  selectedPager: SelectedPager | null;
  availablePagers: PagerDevice[];
  allCustomers: CustomerItem[];
  isSubmitting?: boolean;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onSetOrderChannel: (channel: OrderChannel) => void;
  onSetPaymentMethod: (method: PaymentMethod) => void;
  onSelectCustomer: (customer: SelectedCustomer | null) => void;
  onSelectPager: (pager: SelectedPager | null) => void;
  onOpenQuickCreateCustomer: () => void;
  onOpenApplyLoyalty: () => void;
  onSubmitOrder: () => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({
  items,
  subTotal,
  discountAmount,
  totalAmount,
  totalItemCount,
  orderChannel,
  paymentMethod,
  selectedCustomer,
  selectedPager,
  availablePagers,
  allCustomers,
  isSubmitting = false,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onSetOrderChannel,
  onSetPaymentMethod,
  onSelectCustomer,
  onSelectPager,
  onOpenQuickCreateCustomer,
  onOpenApplyLoyalty,
  onSubmitOrder,
}) => {
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Lọc khách hàng khi tìm kiếm
  const matchedCustomers = allCustomers.filter((c) => {
    if (!customerSearchQuery.trim()) return false;
    const q = customerSearchQuery.toLowerCase();
    return c.fullName.toLowerCase().includes(q) || c.phoneNumber.includes(q);
  });

  return (
    <div className="flex h-full w-full flex-col border-l border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-xl">
      {/* 1. Header Giỏ hàng */}
      <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-3.5 dark:border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F5EBE6] text-[#6F4E37] dark:bg-[#6F4E37]/20 dark:text-[#D4A373]">
            <ShoppingBag className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">Đơn hàng</h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
              {totalItemCount} món trong giỏ
            </p>
          </div>
        </div>

        {items.length > 0 && (
          <button
            type="button"
            onClick={onClearCart}
            className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Xóa hết</span>
          </button>
        )}
      </div>

      {/* 2. Cài đặt đơn: Kênh bán & Thẻ rung & Hội viên */}
      <div className="border-b border-zinc-200 bg-zinc-50/70 p-3.5 space-y-3 dark:border-zinc-800 dark:bg-zinc-950/40 text-xs">
        {/* Kênh bán (Tabs) */}
        <div className="grid grid-cols-3 gap-1 rounded-xl bg-zinc-200/70 p-1 dark:bg-zinc-800">
          {(
            [
              { key: 'ORDER_AT_COUNTER', label: 'Tại quầy' },
              { key: 'POS', label: 'Mang đi (POS)' },
              { key: 'DELIVERY', label: 'Giao hàng' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                onSetOrderChannel(tab.key);
                if (tab.key === 'DELIVERY') {
                  onSelectPager(null);
                }
              }}
              className={`rounded-lg py-1.5 text-center font-bold transition-all cursor-pointer ${
                orderChannel === tab.key
                  ? 'bg-white text-[#6F4E37] shadow-xs dark:bg-zinc-900 dark:text-[#D4A373]'
                  : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Cấp Thẻ rung (Pager) */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-bold text-zinc-700 dark:text-zinc-300">
            <Radio className="h-3.5 w-3.5 text-[#6F4E37] dark:text-[#D4A373]" />
            <span>Thẻ rung:</span>
          </div>

          <select
            value={orderChannel === 'DELIVERY' ? '' : (selectedPager?.id || '')}
            disabled={orderChannel === 'DELIVERY'}
            onChange={(e) => {
              const val = e.target.value;
              if (!val) {
                onSelectPager(null);
              } else {
                const p = availablePagers.find((x) => x.id === Number(val));
                if (p) onSelectPager({ id: p.id, pagerCode: p.pagerCode, batteryLevel: p.batteryLevel });
              }
            }}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 font-bold text-zinc-900 focus:border-[#6F4E37] focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 disabled:opacity-60 disabled:bg-zinc-100 dark:disabled:bg-zinc-800 disabled:cursor-not-allowed"
          >
            <option value="">{orderChannel === 'DELIVERY' ? '-- Không cấp thẻ (Giao đi) --' : '-- Không cấp thẻ --'}</option>
            {orderChannel !== 'DELIVERY' &&
              availablePagers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.pagerCode} (Pin {p.batteryLevel}%)
                </option>
              ))}
          </select>
        </div>

        {/* Khách hàng hội viên */}
        <div>
          {selectedCustomer ? (
            <div className="flex items-center justify-between rounded-xl border border-[#EBE3D5] bg-[#FAF6F0] p-2.5 dark:border-[#6F4E37]/30 dark:bg-zinc-850">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#6F4E37] text-white font-bold text-[10px]">
                  {selectedCustomer.fullName.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">
                    {selectedCustomer.fullName}
                  </div>
                  <div className="text-[10px] text-[#6F4E37] dark:text-[#D4A373] font-semibold">
                    {selectedCustomer.phoneNumber} • {selectedCustomer.rewardPoints} điểm
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={onOpenApplyLoyalty}
                  className="rounded-lg bg-[#6F4E37] px-2 py-1 text-[11px] font-bold text-white hover:bg-[#5A3F2C] cursor-pointer"
                >
                  <Award className="inline h-3 w-3 mr-0.5" />
                  Đổi điểm
                </button>
                <button
                  type="button"
                  onClick={() => onSelectCustomer(null)}
                  className="rounded-lg p-1 text-zinc-400 hover:text-red-600 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className="flex items-center gap-1.5">
                <div className="relative flex-1">
                  <User className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Tìm SĐT hoặc Tên khách..."
                    value={customerSearchQuery}
                    onChange={(e) => {
                      setCustomerSearchQuery(e.target.value);
                      setShowCustomerDropdown(true);
                    }}
                    onFocus={() => setShowCustomerDropdown(true)}
                    className="w-full rounded-xl border border-zinc-200 bg-white pl-8 pr-2 py-1.5 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-[#6F4E37] focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <button
                  type="button"
                  onClick={onOpenQuickCreateCustomer}
                  title="Đăng ký thành viên nhanh"
                  className="rounded-xl border border-dashed border-[#6F4E37]/40 bg-[#F5EBE6]/60 p-1.5 text-[#6F4E37] hover:bg-[#F5EBE6] dark:border-[#6F4E37]/60 dark:bg-[#6F4E37]/20 dark:text-[#D4A373] transition-colors cursor-pointer"
                >
                  <UserPlus className="h-4 w-4" />
                </button>
              </div>

              {/* Dropdown tìm kiếm khách */}
              {showCustomerDropdown && matchedCustomers.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-40 overflow-y-auto rounded-xl border border-zinc-200 bg-white p-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
                  {matchedCustomers.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        onSelectCustomer({
                          id: c.id,
                          fullName: c.fullName,
                          phoneNumber: c.phoneNumber,
                          rewardPoints: c.rewardPoints || 0,
                          membershipTier: c.membershipTier || 'STANDARD',
                        });
                        setShowCustomerDropdown(false);
                        setCustomerSearchQuery('');
                      }}
                      className="w-full rounded-lg px-3 py-1.5 text-left text-xs hover:bg-[#F5EBE6] dark:hover:bg-zinc-700/60 flex items-center justify-between cursor-pointer"
                    >
                      <div>
                        <div className="font-bold text-zinc-800 dark:text-zinc-200">{c.fullName}</div>
                        <div className="text-[10px] text-zinc-400">{c.phoneNumber}</div>
                      </div>
                      <span className="font-semibold text-[#6F4E37] dark:text-[#D4A373]">{c.rewardPoints} đ</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 3. Danh sách các món trong giỏ (Cuộn) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-zinc-400 py-12">
            <ShoppingBag className="h-10 w-10 stroke-[1.5] mb-2 opacity-40" />
            <p className="font-medium text-xs">Chưa có món nào trong đơn</p>
            <p className="text-[11px] text-zinc-400 mt-0.5">Vui lòng chọn món từ menu bên trái</p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col rounded-xl border border-zinc-200/90 bg-white p-3 shadow-2xs dark:border-zinc-800 dark:bg-zinc-850/60 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                    {item.productName}{' '}
                    <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-extrabold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                      {item.size}
                    </span>
                  </div>

                  {/* Topping list */}
                  {item.toppings && item.toppings.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {item.toppings.map((t, idx) => (
                        <span
                          key={idx}
                          className="rounded-md bg-[#F5EBE6] px-1.5 py-0.5 text-[10px] font-medium text-[#6F4E37] dark:bg-[#6F4E37]/20 dark:text-[#D4A373]"
                        >
                          +{t.toppingSnapshotName} {t.quantity > 1 ? `x${t.quantity}` : ''}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Note */}
                  {item.note && (
                    <p className="mt-1 text-[10px] italic text-zinc-500 dark:text-zinc-400">
                      * {item.note}
                    </p>
                  )}
                </div>

                {/* Xóa món */}
                <button
                  type="button"
                  onClick={() => onRemoveItem(item.id)}
                  className="text-zinc-400 hover:text-red-500 transition-colors p-0.5 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Stepper & Line Price */}
              <div className="mt-2.5 flex items-center justify-between border-t border-zinc-100 pt-2 dark:border-zinc-800">
                <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 dark:border-zinc-700 dark:bg-zinc-800">
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.id, -1)}
                    className="p-0.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-5 text-center text-xs font-bold text-zinc-800 dark:text-zinc-200">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.id, 1)}
                    className="p-0.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>

                <span className="text-xs font-extrabold text-[#6F4E37] dark:text-[#D4A373]">
                  {formatCurrency(item.totalPrice)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 4. Phương thức thanh toán & Tổng tiền & Nút Chốt đơn */}
      <div className="border-t border-zinc-200 bg-zinc-50 p-4 space-y-3 dark:border-zinc-800 dark:bg-zinc-950/80">
        {/* Chọn Phương thức thanh toán */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
            <span>Phương thức thanh toán:</span>
          </div>
          <div className="grid grid-cols-5 gap-1">
            {[
              { key: 'CASH', label: 'Tiền mặt', icon: Banknote },
              { key: 'BANK_TRANSFER', label: 'Ngân hàng', icon: QrCode },
              { key: 'CARD', label: 'Quẹt thẻ', icon: CreditCard },
              { key: 'MOMO', label: 'MoMo', icon: CreditCard },
              { key: 'VNPAY', label: 'VNPay', icon: QrCode },
            ].map((pm) => {
              const Icon = pm.icon;
              const isSelected = paymentMethod === pm.key;
              return (
                <button
                  key={pm.key}
                  type="button"
                  onClick={() => onSetPaymentMethod(pm.key as PaymentMethod)}
                  className={`flex flex-col items-center justify-center rounded-xl border py-2 px-1 text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#6F4E37] bg-[#F5EBE6] text-[#6F4E37] ring-2 ring-[#6F4E37]/20 dark:border-[#D4A373] dark:bg-[#6F4E37]/30 dark:text-[#D4A373] shadow-xs'
                      : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 mb-1 text-[#6F4E37] dark:text-[#D4A373]" />
                  <span className="text-[10px] font-bold leading-tight">{pm.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bảng chi tiết tiền */}
        <div className="space-y-1 text-xs pt-1 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
            <span>Tạm tính:</span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">{formatCurrency(subTotal)}</span>
          </div>

          {discountAmount > 0 && (
            <div className="flex justify-between text-[#6F4E37] dark:text-[#D4A373] font-semibold">
              <span>Chiết khấu / Đổi điểm:</span>
              <span>-{formatCurrency(discountAmount)}</span>
            </div>
          )}

          <div className="flex justify-between text-sm font-black text-zinc-900 dark:text-zinc-100 pt-1">
            <span>TỔNG CỘNG:</span>
            <span className="text-base text-[#6F4E37] dark:text-[#D4A373]">{formatCurrency(totalAmount)}</span>
          </div>
        </div>

        {/* Nút Chốt đơn */}
        <button
          type="button"
          disabled={items.length === 0 || isSubmitting}
          onClick={onSubmitOrder}
          className="w-full rounded-xl bg-[#6F4E37] py-3.5 text-sm font-extrabold text-white shadow-lg shadow-[#6F4E37]/30 hover:bg-[#5A3F2C] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Đang xử lý đơn...</span>
            </>
          ) : (
            <>
              <ReceiptText className="h-4 w-4" />
              <span>TẠO ĐƠN & THANH TOÁN ({formatCurrency(totalAmount)})</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CartSidebar;

```

# pos\OrderDetailDrawer.tsx

| Property | Value |
|----------|-------|
| Path | `pos\OrderDetailDrawer.tsx` |
| Size | 12,786 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:55.019127 |

```tsx
// components/pos/OrderDetailDrawer.tsx
'use client';

import React from 'react';
import {
  X,
  Printer,
  Ban,
  CheckCircle2,
  Clock,
  User,
  Radio,
  CreditCard,
  Coffee,
} from 'lucide-react';
import { OrderItemResponse } from '@/types/pos';
import { OrderStatus } from '@/types/enums';

interface OrderDetailDrawerProps {
  isOpen: boolean;
  order: OrderItemResponse | null;
  onClose: () => void;
  onPrintInvoice: (orderId: number) => void;
  onPayOrder?: (orderId: number) => void;
  onCancelOrder?: (orderId: number) => void;
}

export const OrderDetailDrawer: React.FC<OrderDetailDrawerProps> = ({
  isOpen,
  order,
  onClose,
  onPrintInvoice,
  onPayOrder,
  onCancelOrder,
}) => {
  if (!isOpen || !order) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING_PREP':
        return <span className="rounded-md bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300">Chờ pha chế</span>;
      case 'PREPARING':
        return <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-300">Đang pha chế</span>;
      case 'READY_FOR_PICKUP':
        return <span className="rounded-md bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-700 border border-purple-200 dark:bg-purple-950/40 dark:border-purple-800 dark:text-purple-300">Sẵn sàng lấy món</span>;
      case 'COMPLETED':
        return <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300">Hoàn tất</span>;
      case 'CANCELLED':
        return <span className="rounded-md bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300">Đã hủy</span>;
      default:
        return <span className="rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-bold text-zinc-700">{status}</span>;
    }
  };

  const isCompletedOrCancelled = order.status === 'COMPLETED' || order.status === 'CANCELLED';

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="flex h-full w-full max-w-lg flex-col bg-white shadow-2xl dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {/* Header Drawer */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-lg text-zinc-900 dark:text-zinc-100">
                #{order.orderCode}
              </h3>
              {getStatusBadge(order.status)}
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Tạo lúc: {new Date(order.createdAt).toLocaleString('vi-VN')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nội dung chi tiết */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Thông tin đối tượng liên quan (Thu ngân, Khách hàng, Thẻ rung) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-850/60">
              <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1">
                <User className="h-3.5 w-3.5" />
                <span>Thu ngân:</span>
              </div>
              <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                {order.employeeName || 'Quầy thu ngân'}
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-850/60">
              <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1">
                <Radio className="h-3.5 w-3.5" />
                <span>Thẻ rung:</span>
              </div>
              <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                {order.pagerCode ? (
                  <span className="text-[#6F4E37] dark:text-[#D4A373] font-extrabold">{order.pagerCode}</span>
                ) : (
                  <span className="text-zinc-400">Không dùng</span>
                )}
              </div>
            </div>
          </div>

          {/* Thông tin Khách hàng hội viên */}
          {order.customerName && (
            <div className="rounded-xl border border-[#EBE3D5] bg-[#FAF6F0] p-3.5 dark:border-[#6F4E37]/30 dark:bg-zinc-850">
              <div className="text-xs font-bold text-[#6F4E37] dark:text-[#D4A373] uppercase tracking-wider mb-1">
                Khách hàng hội viên
              </div>
              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">{order.customerName}</span>
                  <span className="text-zinc-500 dark:text-zinc-400 ml-2">({order.customerPhone})</span>
                </div>
                {order.customerTier && (
                  <span className="rounded-md bg-[#F5EBE6] px-2 py-0.5 text-xs font-black text-[#6F4E37] dark:bg-[#6F4E37]/20 dark:text-[#D4A373]">
                    Hạng {order.customerTier}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Danh sách món trong đơn */}
          <div>
            <h4 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
              Danh sách món ({order.items?.length || 0} món)
            </h4>
            <div className="space-y-2.5">
              {order.items?.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-zinc-200/90 bg-white p-3.5 dark:border-zinc-800 dark:bg-zinc-850/50"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                        {item.itemSnapshotName}{' '}
                        <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs font-extrabold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                          {item.sizeSnapshot}
                        </span>
                      </div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                        Số lượng: <strong className="text-zinc-900 dark:text-zinc-100">x{item.quantity}</strong> • Đơn giá:{' '}
                        {formatCurrency(item.unitPrice)}
                      </div>

                      {/* Toppings */}
                      {item.toppings && item.toppings.length > 0 && (
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {item.toppings.map((t) => (
                            <span
                              key={t.id}
                              className="rounded-md bg-[#F5EBE6] px-2 py-0.5 text-[11px] font-medium text-[#6F4E37] dark:bg-[#6F4E37]/20 dark:text-[#D4A373]"
                            >
                              +{t.toppingSnapshotName} ({formatCurrency(t.toppingPrice)})
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Note */}
                      {item.note && (
                        <p className="mt-1 text-xs italic text-zinc-500 dark:text-zinc-400">* {item.note}</p>
                      )}
                    </div>

                    <div className="text-right font-extrabold text-sm text-zinc-900 dark:text-zinc-100">
                      {formatCurrency(item.totalPrice)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lý do hủy nếu có */}
          {order.cancelReason && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-300">
              <span className="font-bold">Lý do hủy đơn:</span> {order.cancelReason}
            </div>
          )}

          {/* Tổng quan thanh toán */}
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 space-y-2 dark:border-zinc-800 dark:bg-zinc-850/60 text-sm">
            <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
              <span>Tạm tính:</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">{formatCurrency(order.subTotal)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-[#6F4E37] dark:text-[#D4A373] font-semibold">
                <span>Chiết khấu / Đổi điểm:</span>
                <span>-{formatCurrency(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between font-extrabold text-base text-zinc-900 dark:text-zinc-100 pt-2 border-t border-zinc-200 dark:border-zinc-800">
              <span>Tổng thanh toán:</span>
              <span className="text-[#6F4E37] dark:text-[#D4A373]">{formatCurrency(order.totalAmount)}</span>
            </div>
            <div className="flex justify-between text-xs text-zinc-500 pt-1">
              <span>Phương thức:</span>
              <span className="font-bold text-zinc-800 dark:text-zinc-200">{order.paymentMethod || 'Tiền mặt'}</span>
            </div>
            {order.paidAt && (
              <div className="flex justify-between text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                <span>Thanh toán lúc:</span>
                <span>{new Date(order.paidAt).toLocaleString('vi-VN')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onPrintInvoice(order.id)}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-white py-2.5 text-sm font-bold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 shadow-xs"
          >
            <Printer className="h-4 w-4" />
            <span>In hóa đơn</span>
          </button>

          {!isCompletedOrCancelled && (
            <>
              {onCancelOrder && (
                <button
                  type="button"
                  onClick={() => onCancelOrder(order.id)}
                  className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-2.5 text-sm font-bold text-rose-700 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300"
                >
                  <Ban className="h-4 w-4" />
                </button>
              )}

              {onPayOrder && (
                <button
                  type="button"
                  onClick={() => onPayOrder(order.id)}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-600/30 hover:bg-emerald-700"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Thanh toán</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailDrawer;

```

# pos\PosUserDropdown.tsx

| Property | Value |
|----------|-------|
| Path | `pos\PosUserDropdown.tsx` |
| Size | 3,146 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:55.021129 |

```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, KeyRound, LogOut } from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';

export function PosUserDropdown() {
  const { user, logout } = useAuthContext();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const initial = user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U';

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setDropdownOpen((prev) => !prev)}
        className="flex items-center gap-2.5 p-1.5 pr-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
      >
        <div className="w-8 h-8 rounded-full bg-[#F5EBE6] dark:bg-amber-950/50 flex items-center justify-center text-[#6F4E37] dark:text-amber-300 font-bold text-xs shrink-0">
          {initial}
        </div>
        <div className="hidden sm:flex flex-col text-left">
          <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 leading-tight">
            {user?.fullName || 'Người dùng'}
          </span>
          <span className="text-[10px] text-zinc-400 font-semibold">
            {user?.role || user?.userType || 'CASHIER'}
          </span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0 ml-0.5" />
      </button>

      {dropdownOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setDropdownOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-100 dark:border-zinc-800 py-1.5 z-50 animate-in fade-in">
            <div className="px-4 py-2.5 border-b border-zinc-100 dark:border-zinc-800">
              <p className="text-xs font-bold text-zinc-800 dark:text-zinc-100 truncate">{user?.fullName || 'Người dùng'}</p>
              <p className="text-[11px] text-zinc-400 truncate">{user?.phoneNumber || user?.username || '—'}</p>
            </div>

            <Link
              href="/change-password"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <KeyRound className="w-3.5 h-3.5 text-zinc-500" />
              <span>Đổi mật khẩu</span>
            </Link>

            <button
              type="button"
              onClick={() => {
                setDropdownOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-left cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-500" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

```

# pos\PrintReceiptModal.tsx

| Property | Value |
|----------|-------|
| Path | `pos\PrintReceiptModal.tsx` |
| Size | 10,583 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:55.022133 |

```tsx
// components/pos/PrintReceiptModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { X, Printer, Loader2, CheckCircle2 } from 'lucide-react';
import { posService } from '@/api/pos.service';
import { InvoiceData, printReceipt } from '@/utils/printReceipt';

interface PrintReceiptModalProps {
  isOpen: boolean;
  orderId: number | null;
  onClose: () => void;
}

export const PrintReceiptModal: React.FC<PrintReceiptModalProps> = ({
  isOpen,
  orderId,
  onClose,
}) => {
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && orderId) {
      setLoading(true);
      setErrorMsg(null);
      posService
        .getInvoice(orderId)
        .then((res: any) => {
          const data = res?.data || res;
          setInvoice(data);
        })
        .catch((err: any) => {
          setErrorMsg(err.message || 'Không thể tải thông tin hóa đơn');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, orderId]);

  if (!isOpen || !orderId) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handlePrint = () => {
    if (invoice) {
      printReceipt(invoice);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="relative flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5EBE6] text-[#6F4E37] dark:bg-[#6F4E37]/20 dark:text-[#D4A373]">
              <Printer className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">Xem trước Hóa đơn in</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Mẫu in nhiệt chuẩn 80mm</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nội dung hóa đơn cuộn được */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
              <Loader2 className="h-8 w-8 animate-spin text-[#6F4E37] mb-2" />
              <p className="text-xs font-medium">Đang trích xuất snapshot hóa đơn...</p>
            </div>
          ) : errorMsg ? (
            <div className="rounded-xl bg-red-50 p-4 text-center text-xs font-semibold text-red-600 border border-red-200 dark:bg-red-950/40 dark:border-red-800 dark:text-red-300">
              {errorMsg}
            </div>
          ) : invoice ? (
            <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-5 font-mono text-xs dark:border-zinc-700 dark:bg-zinc-950/80 shadow-inner">
              {/* Receipt Header */}
              <div className="text-center font-bold text-sm uppercase">HỆ THỐNG CÀ PHÊ MEPHAPHIN</div>
              <div className="text-center text-[10px] text-zinc-500">Số 01 Võ Văn Ngân, TP. Thủ Đức, TP. HCM</div>
              <div className="my-2 border-t border-dashed border-zinc-400" />

              <div className="text-center font-bold text-xs">PHIẾU THANH TOÁN</div>
              <div className="text-center font-bold text-[#6F4E37] dark:text-[#D4A373]">{invoice.orderCode}</div>
              <div className="my-2 border-t border-dashed border-zinc-400" />

              <div className="space-y-0.5 text-[11px]">
                <div>
                  <strong>Thời gian:</strong>{' '}
                  {new Date(invoice.paidAt || invoice.orderCreatedAt || Date.now()).toLocaleString('vi-VN')}
                </div>
                <div>
                  <strong>Thu ngân:</strong> {invoice.employeeName || 'Quầy POS'}
                </div>
                {invoice.customerName && (
                  <div>
                    <strong>Khách hàng:</strong> {invoice.customerName} ({invoice.customerPhone})
                  </div>
                )}
                <div>
                  <strong>Phương thức thanh toán:</strong>{' '}
                  <span className="font-bold text-[#6F4E37] dark:text-[#D4A373]">
                    {invoice.paymentMethod === 'BANK_TRANSFER' || invoice.paymentMethod === 'BANKING'
                      ? 'Chuyển khoản (VietQR)'
                      : invoice.paymentMethod === 'CARD' || invoice.paymentMethod === 'CREDIT_CARD'
                        ? 'Thẻ ngân hàng (POS)'
                        : invoice.paymentMethod === 'MOMO'
                          ? 'Ví MoMo'
                          : invoice.paymentMethod === 'VNPAY'
                            ? 'Cổng VNPay-QR'
                            : invoice.paymentMethod === 'POINT_EXCHANGE'
                              ? 'Đổi điểm hội viên'
                              : 'Tiền mặt'}
                  </span>
                </div>
              </div>
              <div className="my-2 border-t border-dashed border-zinc-400" />

              {/* Items */}
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="border-b border-zinc-300">
                    <th className="py-1">Món</th>
                    <th className="text-right py-1">T.Tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {invoice.items?.map((item, idx) => (
                    <tr key={idx} className="align-top">
                      <td className="py-1 pr-2">
                        <div className="font-bold">
                          {idx + 1}. {item.itemSnapshotName} ({item.sizeSnapshot})
                        </div>
                        {item.itemNote && <div className="italic text-zinc-500">* {item.itemNote}</div>}
                        <div className="text-zinc-500 text-[10px]">
                          {item.quantity} x {formatCurrency(item.unitPrice + (item.totalToppingPriceSnapshot || 0))}
                        </div>
                      </td>
                      <td className="text-right font-bold py-1">{formatCurrency(item.lineTotalPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="my-2 border-t border-dashed border-zinc-400" />

              {/* Totals */}
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span>Tạm tính:</span>
                  <span className="font-bold">{formatCurrency(invoice.subTotal)}</span>
                </div>
                {invoice.discountAmount > 0 && (
                  <div className="flex justify-between text-[#6F4E37] dark:text-[#D4A373] font-bold">
                    <span>Chiết khấu:</span>
                    <span>-{formatCurrency(invoice.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black pt-1 border-t border-zinc-300">
                  <span>TỔNG CỘNG:</span>
                  <span>{formatCurrency(invoice.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-zinc-600 dark:text-zinc-400 pt-0.5">
                  <span>Thanh toán:</span>
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">
                    {invoice.paymentMethod === 'BANK_TRANSFER' || invoice.paymentMethod === 'BANKING'
                      ? 'Chuyển khoản (VietQR)'
                      : invoice.paymentMethod === 'CARD' || invoice.paymentMethod === 'CREDIT_CARD'
                        ? 'Thẻ ngân hàng (POS)'
                        : invoice.paymentMethod === 'MOMO'
                          ? 'Ví MoMo'
                          : invoice.paymentMethod === 'VNPAY'
                            ? 'Cổng VNPay-QR'
                            : invoice.paymentMethod === 'POINT_EXCHANGE'
                              ? 'Đổi điểm hội viên'
                              : 'Tiền mặt'}
                  </span>
                </div>
              </div>

              <div className="my-3 border-t-2 border-zinc-400" />
              <div className="text-center text-[10px] text-zinc-500">* Cảm ơn Quý khách và Hẹn gặp lại! *</div>
            </div>
          ) : null}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
          >
            Đóng
          </button>
          <button
            type="button"
            disabled={!invoice || loading}
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-xl bg-[#6F4E37] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-[#6F4E37]/30 hover:bg-[#5A3F2C] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>In Hóa Đơn Ngay</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintReceiptModal;

```

# pos\ProductGrid.tsx

| Property | Value |
|----------|-------|
| Path | `pos\ProductGrid.tsx` |
| Size | 8,483 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:55.023129 |

```tsx
// components/pos/ProductGrid.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { Search, Coffee, Sparkles } from 'lucide-react';
import { Category, Product } from '@/types/menu';

interface ProductGridProps {
  categories: Category[];
  products: Product[];
  isLoading?: boolean;
  onSelectProduct: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  categories,
  products,
  isLoading = false,
  onSelectProduct,
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Lọc sản phẩm theo Category và từ khóa tìm kiếm
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (p.status !== 'ACTIVE') return false;

      const matchesCategory =
        selectedCategoryId === null || p.categoryId === selectedCategoryId;
      const matchesSearch =
        searchQuery.trim() === '' ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase().trim());

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategoryId, searchQuery]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-zinc-50/50 dark:bg-zinc-950/40 p-4 space-y-4">
      {/* 1. Thanh tìm kiếm & Lọc Category */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Ô tìm kiếm */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Tìm kiếm món nhanh (Tên sản phẩm)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#6F4E37] focus:outline-none focus:ring-2 focus:ring-[#6F4E37]/20 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
          />
        </div>

        {/* Thống kê số lượng */}
        <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 self-center">
          Hiển thị <span className="text-[#6F4E37] dark:text-[#D4A373] font-bold">{filteredProducts.length}</span> món
        </div>
      </div>

      {/* 2. Danh sách Danh mục (Pills cuộn ngang) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          type="button"
          onClick={() => setSelectedCategoryId(null)}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            selectedCategoryId === null
              ? 'bg-[#6F4E37] text-white shadow-md shadow-[#6F4E37]/20'
              : 'bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>Tất cả</span>
        </button>

        {categories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategoryId(cat.id)}
              className={`rounded-xl px-4 py-2 text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#6F4E37] text-white shadow-md shadow-[#6F4E37]/20'
                  : 'bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* 3. Lưới sản phẩm (Grid) */}
      <div className="flex-1 overflow-y-auto pr-1">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-44 rounded-2xl bg-zinc-200 dark:bg-zinc-800/60" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center text-zinc-400">
            <Coffee className="h-12 w-12 stroke-[1.5] mb-2 opacity-50" />
            <p className="font-medium text-sm">Không tìm thấy món nào phù hợp</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3.5">
            {filteredProducts.map((product) => {
              const lowestPrice = product.variants?.length
                ? Math.min(...product.variants.map((v) => v.price))
                : 0;

              return (
                <div
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-3.5 shadow-xs hover:border-[#6F4E37]/80 hover:shadow-lg hover:shadow-[#6F4E37]/10 cursor-pointer active:scale-[0.98] transition-all dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-[#6F4E37]/50"
                >
                  {/* Ảnh hoặc Placeholder Thumbnail */}
                  <div className="relative mb-3 aspect-4/3 w-full overflow-hidden rounded-xl bg-gradient-to-br from-[#F5EBE6] to-[#FAF6F0] dark:from-zinc-800 dark:to-zinc-850 flex items-center justify-center">
                    <Coffee className="h-8 w-8 text-[#6F4E37]/60 dark:text-[#D4A373]/60 absolute" />
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        decoding="async"
                        className="relative h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLElement;
                          target.style.display = 'none';
                        }}
                      />
                    )}

                    {/* Tag size đếm */}
                    {product.variants && product.variants.length > 0 && (
                      <span className="absolute bottom-2 right-2 rounded-md bg-black/60 backdrop-blur-xs px-1.5 py-0.5 text-[10px] font-bold text-white">
                        {product.variants.length} sizes
                      </span>
                    )}
                  </div>

                  {/* Thông tin sản phẩm */}
                  <div>
                    <h4 className="font-bold text-sm text-zinc-900 line-clamp-1 dark:text-zinc-100 group-hover:text-[#6F4E37] dark:group-hover:text-[#D4A373] transition-colors">
                      {product.name}
                    </h4>
                    <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                      {product.categoryName || 'Cà phê & Đồ uống'}
                    </p>
                  </div>

                  {/* Giá tiền */}
                  <div className="mt-3 flex items-center justify-between border-t border-zinc-100 pt-2 dark:border-zinc-800/80">
                    <span className="text-xs font-bold text-[#6F4E37] dark:text-[#D4A373]">
                      {formatCurrency(lowestPrice)}
                    </span>
                    <span className="rounded-lg bg-[#F5EBE6] px-2 py-1 text-[11px] font-bold text-[#6F4E37] dark:bg-[#6F4E37]/20 dark:text-[#D4A373] group-hover:bg-[#6F4E37] group-hover:text-white transition-colors">
                      + Chọn
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductGrid;

```

# pos\ProductOptionModal.tsx

| Property | Value |
|----------|-------|
| Path | `pos\ProductOptionModal.tsx` |
| Size | 12,875 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:55.025129 |

```tsx
// components/pos/ProductOptionModal.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { X, Plus, Minus, Check, Coffee } from 'lucide-react';
import { Product, ProductVariant, Topping } from '@/types/menu';
import { CartToppingItem } from '@/hooks/usePosCart';

interface ProductOptionModalProps {
  isOpen: boolean;
  product: Product | null;
  toppings: Topping[];
  onClose: () => void;
  onConfirm: (item: {
    productId: number;
    productName: string;
    variantId: number;
    size: string;
    unitPrice: number;
    quantity: number;
    note?: string;
    toppings?: CartToppingItem[];
  }) => void;
}

export const ProductOptionModal: React.FC<ProductOptionModalProps> = ({
  isOpen,
  product,
  toppings,
  onClose,
  onConfirm,
}) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedToppings, setSelectedToppings] = useState<Record<number, { topping: Topping; quantity: number }>>({});
  const [note, setNote] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  // Khởi tạo variant mặc định khi mở modal
  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
      setSelectedToppings({});
      setNote('');
      setQuantity(1);
    }
  }, [product, isOpen]);

  const toggleTopping = (topping: Topping) => {
    setSelectedToppings((prev) => {
      const next = { ...prev };
      if (next[topping.id]) {
        delete next[topping.id];
      } else {
        next[topping.id] = { topping, quantity: 1 };
      }
      return next;
    });
  };

  const updateToppingQuantity = (toppingId: number, delta: number) => {
    setSelectedToppings((prev) => {
      const current = prev[toppingId];
      if (!current) return prev;
      const newQty = current.quantity + delta;
      if (newQty <= 0) {
        const next = { ...prev };
        delete next[toppingId];
        return next;
      }
      return {
        ...prev,
        [toppingId]: { ...current, quantity: newQty },
      };
    });
  };

  // Tính tổng giá món đang cấu hình
  const toppingTotal = useMemo(() => {
    return Object.values(selectedToppings).reduce(
      (sum, item) => sum + item.topping.price * item.quantity,
      0
    );
  }, [selectedToppings]);

  const unitPrice = selectedVariant?.price || 0;
  const lineTotalPrice = (unitPrice + toppingTotal) * quantity;

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    const toppingPayload: CartToppingItem[] = Object.values(selectedToppings).map((item) => ({
      toppingId: item.topping.id,
      toppingSnapshotName: item.topping.name,
      toppingPrice: item.topping.price,
      quantity: item.quantity,
    }));

    onConfirm({
      productId: product.id,
      productName: product.name,
      variantId: selectedVariant.id,
      size: selectedVariant.size,
      unitPrice: selectedVariant.price,
      quantity,
      note: note.trim() || undefined,
      toppings: toppingPayload,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5EBE6] text-[#6F4E37] dark:bg-[#6F4E37]/20 dark:text-[#D4A373]">
              <Coffee className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">{product.name}</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {product.categoryName || 'Tùy chọn kích cỡ & Topping'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nội dung tùy chọn cuộn được */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 1. Chọn Kích cỡ (Size) */}
          <div>
            <label className="block text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-3">
              1. Chọn kích cỡ <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {product.variants?.map((v) => {
                const isSelected = selectedVariant?.id === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVariant(v)}
                    className={`flex flex-col items-center justify-center rounded-xl border p-3.5 transition-all text-center cursor-pointer ${
                      isSelected
                        ? 'border-[#6F4E37] bg-[#F5EBE6] text-[#6F4E37] ring-2 ring-[#6F4E37]/20 dark:border-[#D4A373] dark:bg-[#6F4E37]/30 dark:text-[#D4A373]'
                        : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800/60 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <span className="text-base font-bold">Size {v.size}</span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-medium">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v.price)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Chọn Topping */}
          {toppings && toppings.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-3">
                2. Thêm Topping
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {toppings
                  .filter((t) => t.status === 'ACTIVE')
                  .map((t) => {
                    const toppingSelected = selectedToppings[t.id];
                    const isChecked = Boolean(toppingSelected);

                    return (
                      <div
                        key={t.id}
                        className={`flex items-center justify-between rounded-xl border p-3 transition-all ${
                          isChecked
                            ? 'border-[#6F4E37]/80 bg-[#F5EBE6]/60 dark:border-[#6F4E37]/60 dark:bg-[#6F4E37]/20'
                            : 'border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-850'
                        }`}
                      >
                        <div
                          className="flex items-center gap-3 cursor-pointer flex-1"
                          onClick={() => toggleTopping(t)}
                        >
                          <div
                            className={`flex h-5 w-5 items-center justify-center rounded-md border transition-all ${
                              isChecked
                                ? 'border-[#6F4E37] bg-[#6F4E37] text-white'
                                : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800'
                            }`}
                          >
                            {isChecked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{t.name}</div>
                            <div className="text-xs text-[#6F4E37] dark:text-[#D4A373] font-semibold">
                              +{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(t.price)}
                            </div>
                          </div>
                        </div>

                        {isChecked && (
                          <div className="flex items-center gap-2 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 px-2 py-1">
                            <button
                              type="button"
                              onClick={() => updateToppingQuantity(t.id, -1)}
                              className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-xs font-bold w-4 text-center">{toppingSelected.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateToppingQuantity(t.id, 1)}
                              className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* 3. Ghi chú món */}
          <div>
            <label className="block text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-2">
              3. Ghi chú món (Đá, Đường, Yêu cầu khác)
            </label>
            <input
              type="text"
              placeholder="VD: Ít đá, 50% đường, để đá riêng..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#6F4E37] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6F4E37]/20 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:bg-zinc-900"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Số lượng:</span>
            <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-2 py-1 dark:border-zinc-700 dark:bg-zinc-800">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="rounded p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-700 dark:hover:text-zinc-100 cursor-pointer"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center text-sm font-bold text-zinc-900 dark:text-zinc-100">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="rounded p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-700 dark:hover:text-zinc-100 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="flex-1 rounded-xl bg-[#6F4E37] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#6F4E37]/30 hover:bg-[#5A3F2C] active:scale-[0.98] transition-all flex items-center justify-between cursor-pointer"
          >
            <span>Thêm vào đơn</span>
            <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(lineTotalPrice)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductOptionModal;

```

# pos\QuickCreateCustomerModal.tsx

| Property | Value |
|----------|-------|
| Path | `pos\QuickCreateCustomerModal.tsx` |
| Size | 6,380 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:55.027129 |

```tsx
// components/pos/QuickCreateCustomerModal.tsx
'use client';

import React, { useState } from 'react';
import { X, UserPlus, Phone, User, Loader2 } from 'lucide-react';
import { loyaltyService } from '@/api/loyalty.service';
import { SelectedCustomer } from '@/hooks/usePosCart';

interface QuickCreateCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCustomerCreated: (customer: SelectedCustomer) => void;
}

export const QuickCreateCustomerModal: React.FC<QuickCreateCustomerModalProps> = ({
  isOpen,
  onClose,
  onCustomerCreated,
}) => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phoneNumber.trim()) {
      setErrorMsg('Vui lòng nhập đầy đủ họ tên và số điện thoại');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await loyaltyService.createCustomer({
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
      });

      const customerData = res.data || res;
      onCustomerCreated({
        id: customerData.id,
        fullName: customerData.fullName,
        phoneNumber: customerData.phoneNumber,
        rewardPoints: customerData.rewardPoints || 0,
        membershipTier: customerData.membershipTier || 'STANDARD',
      });

      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Không thể tạo khách hàng. Số điện thoại có thể đã tồn tại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5EBE6] text-[#6F4E37] dark:bg-[#6F4E37]/20 dark:text-[#D4A373]">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">Đăng ký thành viên nhanh</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Tạo thông tin khách hàng để tích điểm tại quầy</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-600 border border-red-200 dark:bg-red-950/40 dark:border-red-800 dark:text-red-300">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="tel"
                placeholder="VD: 0988123456"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-4 py-2.5 text-sm text-zinc-900 focus:border-[#6F4E37] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6F4E37]/20 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Họ và tên khách hàng <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                placeholder="VD: Nguyễn Văn A"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-4 py-2.5 text-sm text-zinc-900 focus:border-[#6F4E37] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6F4E37]/20 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-100"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-[#6F4E37] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-[#6F4E37]/30 hover:bg-[#5A3F2C] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>Đăng ký & Chọn ngay</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuickCreateCustomerModal;

```

# reports\ExportReportModal.tsx

| Property | Value |
|----------|-------|
| Path | `reports\ExportReportModal.tsx` |
| Size | 4,729 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:55.028131 |

```tsx
import React, { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { Download, FileText, CheckSquare, Square } from 'lucide-react';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: 'csv' | 'json', options: { includeTopProducts: boolean; includeLowStock: boolean }) => void;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  onExport,
}) => {
  const [format, setFormat] = useState<'csv' | 'json'>('csv');
  const [includeTopProducts, setIncludeTopProducts] = useState(true);
  const [includeLowStock, setIncludeLowStock] = useState(true);
  const [exporting, setExporting] = useState(false);

  const handleConfirm = () => {
    setExporting(true);
    setTimeout(() => {
      onExport(format, { includeTopProducts, includeLowStock });
      setExporting(false);
      onClose();
    }, 600);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Xuất báo cáo báo cáo doanh thu & kho">
      <div className="space-y-5">
        {/* Format Selection */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">Định dạng File xuất</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormat('csv')}
              className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                format === 'csv'
                  ? 'bg-[#F5EBE6] border-[#6F4E37] text-[#6F4E37] shadow-xs'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>CSV / Excel (.csv)</span>
            </button>

            <button
              type="button"
              onClick={() => setFormat('json')}
              className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                format === 'json'
                  ? 'bg-[#F5EBE6] border-[#6F4E37] text-[#6F4E37] shadow-xs'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Dữ liệu thô (.json)</span>
            </button>
          </div>
        </div>

        {/* Contents Checklist */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">Nội dung bao gồm trong báo cáo</label>
          <div className="space-y-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 text-xs text-gray-700 font-medium">
              <CheckSquare className="w-4 h-4 text-[#6F4E37]" />
              <span>Tổng quan Doanh thu (Đơn hàng, Thực nhận, Chiết khấu)</span>
            </div>

            <button
              type="button"
              onClick={() => setIncludeTopProducts(!includeTopProducts)}
              className="flex items-center gap-2 text-xs text-gray-700 font-medium w-full text-left cursor-pointer"
            >
              {includeTopProducts ? (
                <CheckSquare className="w-4 h-4 text-[#6F4E37]" />
              ) : (
                <Square className="w-4 h-4 text-gray-400" />
              )}
              <span>Báo cáo Top sản phẩm bán chạy nhất</span>
            </button>

            <button
              type="button"
              onClick={() => setIncludeLowStock(!includeLowStock)}
              className="flex items-center gap-2 text-xs text-gray-700 font-medium w-full text-left cursor-pointer"
            >
              {includeLowStock ? (
                <CheckSquare className="w-4 h-4 text-[#6F4E37]" />
              ) : (
                <Square className="w-4 h-4 text-gray-400" />
              )}
              <span>Báo cáo Cảnh báo kho nguyên liệu sắp hết</span>
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-2 flex gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button type="button" isLoading={exporting} onClick={handleConfirm}>
            <Download className="w-4 h-4 mr-1.5" />
            <span>Tải xuống báo cáo</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ExportReportModal;

```

# reports\RevenueBarChart.tsx

| Property | Value |
|----------|-------|
| Path | `reports\RevenueBarChart.tsx` |
| Size | 5,042 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:55.030133 |

```tsx
import React from 'react';
import { Sparkles, Trophy } from 'lucide-react';
import { TopProductReport } from '@/types/report';

interface RevenueBarChartProps {
  topProducts: TopProductReport[];
  loading?: boolean;
  timeFilterLabel?: string;
}

export const RevenueBarChart: React.FC<RevenueBarChartProps> = ({
  topProducts,
  loading = false,
  timeFilterLabel = 'Tuần này',
}) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(val || 0);
  };

  const maxQty = Math.max(...topProducts.map((p) => p.totalQuantitySold || 1), 1);
  const totalQtyAll = topProducts.reduce((sum, p) => sum + (p.totalQuantitySold || 0), 0);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <div className="h-5 bg-gray-200 rounded w-48 animate-pulse" />
        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
      <div className="flex items-center justify-between gap-2 mb-6">
        <div>
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Top sản phẩm bán chạy ({timeFilterLabel})</span>
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Xếp hạng sản phẩm theo số lượng bán ra & doanh thu thu được
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6F4E37] bg-[#F5EBE6] px-3 py-1.5 rounded-full shrink-0">
          <Sparkles className="w-3.5 h-3.5" />
          Tổng bán: {totalQtyAll.toLocaleString('vi-VN')} ly
        </span>
      </div>

      {topProducts.length > 0 ? (
        <div className="space-y-4">
          {topProducts.map((prod, idx) => {
            const name = prod.productName || `Sản phẩm #${idx + 1}`;
            const qty = prod.totalQuantitySold || 0;
            const rev = prod.totalRevenue || 0;
            const percent = Math.round((qty / maxQty) * 100);

            return (
              <div key={idx} className="space-y-1.5 group">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                        idx === 0
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : idx === 1
                          ? 'bg-slate-200 text-slate-700 border border-slate-300'
                          : idx === 2
                          ? 'bg-orange-100 text-orange-800 border border-orange-300'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      #{idx + 1}
                    </span>
                    <span className="font-bold text-gray-800 group-hover:text-[#6F4E37] transition-colors">
                      {name}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-[#6F4E37] text-sm">
                      {qty.toLocaleString('vi-VN')}
                    </span>
                    <span className="text-xs text-gray-400 ml-1">ly</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${Math.max(percent, 4)}%` }}
                    className={`h-full rounded-full transition-all duration-500 ${
                      idx === 0
                        ? 'bg-gradient-to-r from-amber-500 to-[#6F4E37]'
                        : 'bg-[#6F4E37] group-hover:bg-[#5A3F2C]'
                    }`}
                  />
                </div>

                <div className="flex justify-between items-center text-[11px] text-gray-400 font-mono">
                  <span>Doanh thu tạo ra:</span>
                  <span className="font-semibold text-gray-700">{formatCurrency(rev)}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-12 text-center text-gray-400 text-sm">
          Chưa có dữ liệu sản phẩm bán chạy trong khoảng thời gian này.
        </div>
      )}
    </div>
  );
};

export default RevenueBarChart;

```

# reports\RevenueSummaryCards.tsx

| Property | Value |
|----------|-------|
| Path | `reports\RevenueSummaryCards.tsx` |
| Size | 4,966 bytes |
| Extension | `.tsx` |
| Modified | 2026-10-17 21:23:55.032128 |

```tsx
import React from 'react';
import { TrendingUp, Receipt, Coffee, AlertTriangle } from 'lucide-react';
import { RevenueOverviewReport } from '@/types/report';

interface RevenueSummaryCardsProps {
  overview: RevenueOverviewReport | null;
  lowStockCount: number;
  topProductName?: string;
  topProductQty?: number;
  loading?: boolean;
}

export const RevenueSummaryCards: React.FC<RevenueSummaryCardsProps> = ({
  overview,
  lowStockCount,
  topProductName = '—',
  topProductQty = 0,
  loading = false,
}) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(val || 0);
  };

  const netRevenue = overview?.netRevenue || 0;
  const totalOrders = overview?.totalOrders || 0;
  const totalDiscount = overview?.totalDiscount || 0;

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-pulse h-28 flex items-center justify-between">
            <div className="space-y-2 flex-1">
              <div className="h-3 bg-gray-200 rounded w-24" />
              <div className="h-6 bg-gray-200 rounded w-32" />
              <div className="h-3 bg-gray-100 rounded w-20" />
            </div>
            <div className="w-11 h-11 bg-gray-200 rounded-xl shrink-0" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Tổng doanh thu thực nhận */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-400 font-medium">
            Doanh thu thực nhận
          </p>
          <h3 className="text-xl font-bold text-[#6F4E37] mt-0.5">
            {formatCurrency(netRevenue)}
          </h3>
          <p className="text-xs text-gray-400 font-medium mt-1">
            Đã giảm giá: <span className="text-amber-600 font-semibold">{formatCurrency(totalDiscount)}</span>
          </p>
        </div>
        <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <TrendingUp className="w-5 h-5" />
        </div>
      </div>

      {/* Card 2: Tổng số đơn hàng */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-400 font-medium">
            Tổng đơn hàng
          </p>
          <h3 className="text-xl font-bold text-gray-900 mt-0.5">
            {totalOrders.toLocaleString('vi-VN')} <span className="text-sm font-normal text-gray-500">đơn</span>
          </h3>
          <p className="text-xs text-gray-400 mt-1">Ghi nhận từ POS & Online</p>
        </div>
        <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
          <Receipt className="w-5 h-5" />
        </div>
      </div>

      {/* Card 3: Món bán chạy nhất */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-start justify-between">
        <div className="min-w-0 pr-2">
          <p className="text-xs text-gray-400 font-medium">
            Món bán chạy nhất
          </p>
          <h3 className="text-xl font-bold text-gray-900 mt-0.5 truncate">
            {topProductName}
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Đã bán: <span className="font-semibold text-gray-700">{topProductQty.toLocaleString('vi-VN')} ly</span>
          </p>
        </div>
        <div className="w-11 h-11 rounded-xl bg-[#F5EBE6] text-[#6F4E37] flex items-center justify-center shrink-0">
          <Coffee className="w-5 h-5" />
        </div>
      </div>

      {/* Card 4: Cảnh báo kho nguyên liệu */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-400 font-medium">
            Cảnh báo kho
          </p>
          <h3 className="text-xl font-bold text-rose-600 mt-0.5">
            {lowStockCount} <span className="text-sm font-normal text-rose-500">mặt hàng</span>
          </h3>
          <p className="text-xs text-rose-500/80 font-medium mt-1">Sắp hết hoặc chạm ngưỡng</p>
        </div>
        <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export default RevenueSummaryCards;

```

