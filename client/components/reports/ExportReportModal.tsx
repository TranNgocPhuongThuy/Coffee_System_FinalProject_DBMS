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
