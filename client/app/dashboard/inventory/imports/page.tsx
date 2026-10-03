"use client";

import { useState } from "react";
import {
  FileDown,
  Plus,
  Search,
  Eye,
  Calendar,
  X,
  Trash2,
  CheckCircle2,
  PackagePlus,
  Printer,
  FileText,
  DollarSign,
  TrendingUp,
  Building2,
} from "lucide-react";

// Types
interface ImportTicketItem {
  id: string;
  ingredientId: string;
  ingredientName: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  expiryDate?: string;
}

interface ImportTicket {
  id: string;
  ticketCode: string;
  supplierName: string;
  supplierPhone?: string;
  createdByName: string;
  importDate: string;
  totalAmount: number;
  note: string;
  status: "COMPLETED" | "DRAFT" | "CANCELLED";
  items: ImportTicketItem[];
}

interface MasterIngredient {
  id: string;
  name: string;
  unit: string;
  defaultPrice: number;
}

const MASTER_INGREDIENTS: MasterIngredient[] = [
  { id: "ING-01", name: "Hạt Robusta xay sẵn", unit: "kg", defaultPrice: 160000 },
  { id: "ING-02", name: "Hạt Arabica Cầu Đất", unit: "kg", defaultPrice: 280000 },
  { id: "ING-03", name: "Sữa đặc Ông Thọ", unit: "lon", defaultPrice: 24000 },
  { id: "ING-04", name: "Sữa tươi tiệt trùng Barista", unit: "lít", defaultPrice: 32000 },
  { id: "ING-05", name: "Kem béo thực vật Rich's", unit: "hộp", defaultPrice: 38000 },
  { id: "ING-06", name: "Whipping Cream Anchor", unit: "lít", defaultPrice: 145000 },
  { id: "ING-07", name: "Syrup Caramel Davinci", unit: "chai", defaultPrice: 210000 },
  { id: "ING-08", name: "Trà sen Bảo Lộc thượng hạng", unit: "kg", defaultPrice: 220000 },
  { id: "ING-09", name: "Hạt sen ngâm đường", unit: "hộp", defaultPrice: 65000 },
  { id: "ING-10", name: "Bột Phô mai béo nguyên chất", unit: "kg", defaultPrice: 190000 },
  { id: "ING-11", name: "Trân châu sống Gia Uy", unit: "kg", defaultPrice: 42000 },
  { id: "ING-12", name: "Đường đen Nữ Hoàng", unit: "kg", defaultPrice: 38000 },
  { id: "ING-15", name: "Ly giấy nắp cầu 360ml", unit: "cái", defaultPrice: 950 },
  { id: "ING-16", name: "Ly nhựa PP nắp tim 500ml", unit: "cái", defaultPrice: 1100 },
  { id: "ING-17", name: "Ly nhựa PP nắp tim 700ml", unit: "cái", defaultPrice: 1350 },
];

const MOCK_IMPORT_TICKETS: ImportTicket[] = [
  {
    id: "imp-1",
    ticketCode: "PNK-2026-001",
    supplierName: "Công ty Cà phê Hạt Việt (Đắk Lắk)",
    supplierPhone: "028 3822 9999",
    createdByName: "Lê Văn Kho (Thủ kho)",
    importDate: "02/10/2026 09:30",
    totalAmount: 14800000,
    note: "Nhập định kỳ đầu tháng 10 - Hạt rang mộc đạt chuẩn",
    status: "COMPLETED",
    items: [
      {
        id: "item-1",
        ingredientId: "ING-01",
        ingredientName: "Hạt Robusta xay sẵn",
        unit: "kg",
        quantity: 50,
        unitPrice: 160000,
        subtotal: 8000000,
        expiryDate: "02/10/2027",
      },
      {
        id: "item-2",
        ingredientId: "ING-02",
        ingredientName: "Hạt Arabica Cầu Đất",
        unit: "kg",
        quantity: 20,
        unitPrice: 280000,
        subtotal: 5600000,
        expiryDate: "02/10/2027",
      },
      {
        id: "item-3",
        ingredientId: "ING-03",
        ingredientName: "Sữa đặc Ông Thọ",
        unit: "lon",
        quantity: 50,
        unitPrice: 24000,
        subtotal: 1200000,
        expiryDate: "15/08/2027",
      },
    ],
  },
  {
    id: "imp-2",
    ticketCode: "PNK-2026-002",
    supplierName: "Đại lý Sữa & Kem Béo Miền Nam",
    supplierPhone: "0908 123 456",
    createdByName: "Lê Văn Kho (Thủ kho)",
    importDate: "01/10/2026 14:15",
    totalAmount: 6450000,
    note: "Giao bổ sung sữa tươi và whipping cream bảo quản mát",
    status: "COMPLETED",
    items: [
      {
        id: "item-4",
        ingredientId: "ING-04",
        ingredientName: "Sữa tươi tiệt trùng Barista",
        unit: "lít",
        quantity: 80,
        unitPrice: 32000,
        subtotal: 2560000,
        expiryDate: "01/04/2027",
      },
      {
        id: "item-5",
        ingredientId: "ING-06",
        ingredientName: "Whipping Cream Anchor",
        unit: "lít",
        quantity: 20,
        unitPrice: 145000,
        subtotal: 2900000,
        expiryDate: "15/12/2026",
      },
      {
        id: "item-6",
        ingredientId: "ING-05",
        ingredientName: "Kem béo thực vật Rich's",
        unit: "hộp",
        quantity: 26,
        unitPrice: 38000,
        subtotal: 990000,
        expiryDate: "20/06/2027",
      },
    ],
  },
  {
    id: "imp-3",
    ticketCode: "PNK-2026-003",
    supplierName: "Xưởng Bao Bì & Ly Nhựa EcoPack",
    supplierPhone: "0934 888 777",
    createdByName: "Trần Thị Mai (Quản lý)",
    importDate: "29/09/2026 16:45",
    totalAmount: 7600000,
    note: "Nhập 5000 ly nhựa và nắp in logo DineDesk",
    status: "COMPLETED",
    items: [
      {
        id: "item-7",
        ingredientId: "ING-15",
        ingredientName: "Ly giấy nắp cầu 360ml",
        unit: "cái",
        quantity: 2000,
        unitPrice: 950,
        subtotal: 1900000,
      },
      {
        id: "item-8",
        ingredientId: "ING-16",
        ingredientName: "Ly nhựa PP nắp tim 500ml",
        unit: "cái",
        quantity: 3000,
        unitPrice: 1100,
        subtotal: 3300000,
      },
      {
        id: "item-9",
        ingredientId: "ING-17",
        ingredientName: "Ly nhựa PP nắp tim 700ml",
        unit: "cái",
        quantity: 1778,
        unitPrice: 1350,
        subtotal: 2400300,
      },
    ],
  },
  {
    id: "imp-4",
    ticketCode: "PNK-2026-004",
    supplierName: "Trà & Nguyên liệu Pha chế Bảo Lộc",
    supplierPhone: "0263 386 1111",
    createdByName: "Lê Văn Kho (Thủ kho)",
    importDate: "25/09/2026 10:00",
    totalAmount: 5840000,
    note: "Trà sen Bảo Lộc loại 1 thơm ngát, hạt sen hộp",
    status: "COMPLETED",
    items: [
      {
        id: "item-10",
        ingredientId: "ING-08",
        ingredientName: "Trà sen Bảo Lộc thượng hạng",
        unit: "kg",
        quantity: 16,
        unitPrice: 220000,
        subtotal: 3520000,
      },
      {
        id: "item-11",
        ingredientId: "ING-09",
        ingredientName: "Hạt sen ngâm đường",
        unit: "hộp",
        quantity: 32,
        unitPrice: 65000,
        subtotal: 2080000,
      },
      {
        id: "item-12",
        ingredientId: "ING-12",
        ingredientName: "Đường đen Nữ Hoàng",
        unit: "kg",
        quantity: 6.3,
        unitPrice: 38000,
        subtotal: 240000,
      },
    ],
  },
];

interface FormLineItem {
  id: string;
  ingredientId: string;
  ingredientName: string;
  unit: string;
  quantity: number;
  unitPrice: number;
}

export default function InventoryImportsPage() {
  const [tickets, setTickets] = useState<ImportTicket[]>(MOCK_IMPORT_TICKETS);
  const [searchSupplier, setSearchSupplier] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Drawer Detail State
  const [selectedTicket, setSelectedTicket] = useState<ImportTicket | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Modal Create Ticket State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formSupplier, setFormSupplier] = useState("");
  const [formNote, setFormNote] = useState("");
  const [formLines, setFormLines] = useState<FormLineItem[]>([
    {
      id: "line-1",
      ingredientId: MASTER_INGREDIENTS[0].id,
      ingredientName: MASTER_INGREDIENTS[0].name,
      unit: MASTER_INGREDIENTS[0].unit,
      quantity: 10,
      unitPrice: MASTER_INGREDIENTS[0].defaultPrice,
    },
  ]);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Filtered Tickets
  const filteredTickets = tickets.filter((t) => {
    const matchSupplier =
      !searchSupplier ||
      t.supplierName.toLowerCase().includes(searchSupplier.toLowerCase()) ||
      t.ticketCode.toLowerCase().includes(searchSupplier.toLowerCase());

    return matchSupplier;
  });

  // Calculate Metrics
  const totalImportValue = tickets.reduce((sum, t) => sum + t.totalAmount, 0);
  const totalTicketsCount = tickets.length;
  const thisMonthTickets = tickets.filter((t) => t.importDate.includes("10/2026")).length;

  // View Detail in Drawer
  const handleOpenDrawer = (ticket: ImportTicket) => {
    setSelectedTicket(ticket);
    setIsDrawerOpen(true);
  };

  // Add line in Modal
  const handleAddLine = () => {
    const defaultIng = MASTER_INGREDIENTS[0];
    const newLine: FormLineItem = {
      id: `line-${formLines.length + 1}-${Math.random().toString(36).substring(2, 7)}`,
      ingredientId: defaultIng.id,
      ingredientName: defaultIng.name,
      unit: defaultIng.unit,
      quantity: 1,
      unitPrice: defaultIng.defaultPrice,
    };
    setFormLines([...formLines, newLine]);
  };

  // Remove line
  const handleRemoveLine = (id: string) => {
    if (formLines.length === 1) {
      alert("Phiếu nhập cần ít nhất một mặt hàng!");
      return;
    }
    setFormLines(formLines.filter((l) => l.id !== id));
  };

  // Update line field
  const handleUpdateLine = (id: string, field: keyof FormLineItem, value: string | number) => {
    setFormLines((prev) =>
      prev.map((l) => {
        if (l.id !== id) return l;

        if (field === "ingredientId") {
          const ing = MASTER_INGREDIENTS.find((i) => i.id === value);
          if (ing) {
            return {
              ...l,
              ingredientId: ing.id,
              ingredientName: ing.name,
              unit: ing.unit,
              unitPrice: ing.defaultPrice,
            };
          }
        }

        return { ...l, [field]: value };
      })
    );
  };

  // Calculate modal total
  const modalTotalAmount = formLines.reduce(
    (sum, line) => sum + (Number(line.quantity) || 0) * (Number(line.unitPrice) || 0),
    0
  );

  // Submit Create Ticket
  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSupplier.trim()) {
      alert("Vui lòng nhập tên nhà cung cấp!");
      return;
    }

    const ticketNumber = tickets.length + 1;
    const paddedNum = ticketNumber.toString().padStart(3, "0");
    const todayStr = "02/10/2026 22:15";

    const newTicket: ImportTicket = {
      id: `imp-${paddedNum}`,
      ticketCode: `PNK-2026-${paddedNum}`,
      supplierName: formSupplier,
      createdByName: "Nguyễn Thu Ngân (Thủ kho)",
      importDate: todayStr,
      totalAmount: modalTotalAmount,
      note: formNote || "Phiếu nhập kho nguyên liệu mới",
      status: "COMPLETED",
      items: formLines.map((l, index) => ({
        id: `item-${paddedNum}-${index + 1}`,
        ingredientId: l.ingredientId,
        ingredientName: l.ingredientName,
        unit: l.unit,
        quantity: Number(l.quantity),
        unitPrice: Number(l.unitPrice),
        subtotal: Number(l.quantity) * Number(l.unitPrice),
      })),
    };

    setTickets([newTicket, ...tickets]);
    setIsCreateModalOpen(false);
    setFormSupplier("");
    setFormNote("");
    setFormLines([
      {
        id: "line-1",
        ingredientId: MASTER_INGREDIENTS[0].id,
        ingredientName: MASTER_INGREDIENTS[0].name,
        unit: MASTER_INGREDIENTS[0].unit,
        quantity: 10,
        unitPrice: MASTER_INGREDIENTS[0].defaultPrice,
      },
    ]);
    showToast(`Đã lập thành công phiếu nhập kho ${newTicket.ticketCode}!`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
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
              <PackagePlus className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Lịch sử & Quản lý Nhập kho
            </h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Theo dõi danh sách các phiếu nhập hàng từ nhà cung cấp, cập nhật giá vốn và tồn kho tự động
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#6F4E37] hover:bg-[#5A3F2C] text-white rounded-xl font-semibold text-sm transition-all shadow-sm shadow-[#6F4E37]/20"
        >
          <Plus className="w-4 h-4" />
          <span>+ Lập phiếu nhập kho mới</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#F5EBE6] text-[#6F4E37] flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Tổng giá trị nhập kho</p>
            <p className="text-xl font-bold text-gray-900">
              {totalImportValue.toLocaleString()} <span className="text-sm font-normal text-gray-500">VNĐ</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Tổng số phiếu nhập</p>
            <p className="text-xl font-bold text-gray-900">
              {totalTicketsCount} <span className="text-sm font-normal text-gray-500">phiếu</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Phiếu nhập tháng này</p>
            <p className="text-xl font-bold text-amber-700">
              {thisMonthTickets} <span className="text-sm font-normal text-gray-500">phiếu hoàn tất</span>
            </p>
          </div>
        </div>
      </div>

      {/* Toolbar: Search by Supplier & Date Filter */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên nhà cung cấp hoặc mã phiếu (PNK-...)"
            value={searchSupplier}
            onChange={(e) => setSearchSupplier(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6F4E37] focus:bg-white"
          />
        </div>

        {/* Date Range Filter */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
          <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-medium text-gray-500">Từ:</span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="bg-transparent text-xs font-semibold focus:outline-none text-gray-800"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200">
            <span className="text-xs font-medium text-gray-500">Đến:</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="bg-transparent text-xs font-semibold focus:outline-none text-gray-800"
            />
          </div>

          {(searchSupplier || fromDate || toDate) && (
            <button
              onClick={() => {
                setSearchSupplier("");
                setFromDate("");
                setToDate("");
              }}
              className="px-3 py-1.5 text-xs text-[#6F4E37] hover:bg-[#F5EBE6] rounded-lg font-medium transition-colors"
            >
              Đặt lại
            </button>
          )}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF6F0] text-gray-600 text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
                <th className="py-3.5 px-5">Mã phiếu</th>
                <th className="py-3.5 px-5">Nhà cung cấp</th>
                <th className="py-3.5 px-5">Thủ kho lập phiếu</th>
                <th className="py-3.5 px-5">Ngày giờ nhập</th>
                <th className="py-3.5 px-5">Tổng tiền phiếu</th>
                <th className="py-3.5 px-5">Ghi chú</th>
                <th className="py-3.5 px-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-5">
                      <span className="font-mono font-bold text-[#6F4E37] bg-[#F5EBE6] px-2.5 py-1 rounded-lg text-xs">
                        #{ticket.ticketCode}
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-gray-400" />
                        <span>{ticket.supplierName}</span>
                      </div>
                      {ticket.supplierPhone && (
                        <span className="text-xs text-gray-400 font-mono">{ticket.supplierPhone}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-5 text-gray-700">
                      <div className="font-medium text-xs text-gray-800">{ticket.createdByName}</div>
                    </td>
                    <td className="py-3.5 px-5 text-gray-600 text-xs">
                      {ticket.importDate}
                    </td>
                    <td className="py-3.5 px-5 font-bold text-gray-900">
                      {ticket.totalAmount.toLocaleString()}{" "}
                      <span className="text-xs text-gray-400 font-normal">đ</span>
                    </td>
                    <td className="py-3.5 px-5 text-xs text-gray-500 max-w-xs truncate">
                      {ticket.note}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => handleOpenDrawer(ticket)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF6F0] hover:bg-[#F5EBE6] text-[#6F4E37] font-semibold text-xs rounded-lg transition-colors border border-[#6F4E37]/15"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Xem chi tiết</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    Không tìm thấy phiếu nhập kho nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Lập Phiếu Nhập Kho Mới (CreateImportTicketModal) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-5 bg-[#FAF6F0] border-b border-gray-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white rounded-xl text-[#6F4E37] shadow-xs">
                  <PackagePlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Lập phiếu nhập kho nguyên liệu mới</h3>
                  <p className="text-xs text-gray-500">
                    Cập nhật số lượng tồn kho và điều chỉnh giá vốn nguyên vật liệu
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200/50 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleCreateTicket} className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                    Tên Nhà Cung Cấp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Cty TNHH Cà phê Việt, Đại lý Sữa Miền Nam..."
                    value={formSupplier}
                    onChange={(e) => setFormSupplier(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                    Ghi chú / Diễn giải
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Nhập lô hàng tuần 1 tháng 10, Hàng đạt kiểm định..."
                    value={formNote}
                    onChange={(e) => setFormNote(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
                  />
                </div>
              </div>

              {/* Dynamic Lines Table */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Danh sách mặt hàng nhập ({formLines.length})
                  </label>
                  <button
                    type="button"
                    onClick={handleAddLine}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF6F0] hover:bg-[#F5EBE6] text-[#6F4E37] text-xs font-semibold rounded-lg transition-colors border border-[#6F4E37]/20"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Thêm dòng mặt hàng</span>
                  </button>
                </div>

                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#FAF6F0] text-gray-600 font-semibold uppercase tracking-wider border-b border-gray-200">
                        <th className="py-2.5 px-3">Tên Nguyên liệu</th>
                        <th className="py-2.5 px-2 w-20 text-center">ĐVT</th>
                        <th className="py-2.5 px-3 w-28 text-center">Số lượng</th>
                        <th className="py-2.5 px-3 w-36 text-right">Đơn giá nhập</th>
                        <th className="py-2.5 px-3 w-36 text-right">Thành tiền</th>
                        <th className="py-2.5 px-2 w-10 text-center"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {formLines.map((line) => {
                        const subtotal = (Number(line.quantity) || 0) * (Number(line.unitPrice) || 0);
                        return (
                          <tr key={line.id} className="hover:bg-gray-50">
                            <td className="py-2.5 px-3">
                              <select
                                value={line.ingredientId}
                                onChange={(e) => handleUpdateLine(line.id, "ingredientId", e.target.value)}
                                className="w-full py-1.5 px-2 bg-white border border-gray-300 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#6F4E37]"
                              >
                                {MASTER_INGREDIENTS.map((ing) => (
                                  <option key={ing.id} value={ing.id}>
                                    {ing.name} ({ing.unit})
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="py-2.5 px-2 text-center font-medium text-gray-600">
                              {line.unit}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <input
                                type="number"
                                step="0.01"
                                min="0.01"
                                required
                                value={line.quantity}
                                onChange={(e) =>
                                  handleUpdateLine(line.id, "quantity", parseFloat(e.target.value) || 0)
                                }
                                className="w-full py-1.5 px-2 text-center font-bold bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6F4E37]"
                              />
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <input
                                type="number"
                                step="1000"
                                min="0"
                                required
                                value={line.unitPrice}
                                onChange={(e) =>
                                  handleUpdateLine(line.id, "unitPrice", parseFloat(e.target.value) || 0)
                                }
                                className="w-full py-1.5 px-2 text-right font-medium bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6F4E37]"
                              />
                            </td>
                            <td className="py-2.5 px-3 text-right font-bold text-gray-900">
                              {Math.round(subtotal).toLocaleString()} đ
                            </td>
                            <td className="py-2.5 px-2 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveLine(line.id)}
                                className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                                title="Xóa dòng"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total Calculation Card */}
              <div className="p-4 bg-[#FAF6F0] rounded-xl border border-gray-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-gray-600 uppercase">Tổng tiền thanh toán phiếu nhập:</span>
                  <p className="text-xs text-gray-400">Đã bao gồm tất cả các dòng chi tiết nguyên liệu</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-[#6F4E37]">
                    {modalTotalAmount.toLocaleString()}{" "}
                    <span className="text-sm font-normal text-gray-600">VNĐ</span>
                  </span>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#6F4E37] hover:bg-[#5A3F2C] text-white rounded-xl text-sm font-semibold transition-colors shadow-sm shadow-[#6F4E37]/20"
                >
                  Hoàn tất & Nhập kho
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DRAWER: Xem Chi Tiết Phiếu Nhập (ImportDetailDrawer) */}
      {isDrawerOpen && selectedTicket && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setIsDrawerOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xl bg-white shadow-2xl border-l border-gray-100 flex flex-col animate-in slide-in-from-right duration-300">
              {/* Drawer Header */}
              <div className="p-6 bg-[#FAF6F0] border-b border-gray-200 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">
                      Phiếu nhập #{selectedTicket.ticketCode}
                    </span>
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
                      Đã hoàn tất
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">Ngày nhập: {selectedTicket.importDate}</p>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200/50 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Meta Info */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-xs">Nhà cung cấp:</span>
                    <span className="font-bold text-gray-900">{selectedTicket.supplierName}</span>
                  </div>
                  {selectedTicket.supplierPhone && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-xs">Số điện thoại:</span>
                      <span className="font-mono text-gray-700">{selectedTicket.supplierPhone}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-xs">Thủ kho lập phiếu:</span>
                    <span className="font-medium text-gray-800">{selectedTicket.createdByName}</span>
                  </div>
                  <div className="flex items-start justify-between">
                    <span className="text-gray-500 text-xs">Ghi chú:</span>
                    <span className="text-gray-700 text-xs text-right max-w-xs">{selectedTicket.note}</span>
                  </div>
                </div>

                {/* Items Table */}
                <div>
                  <h4 className="font-bold text-gray-900 text-sm mb-3">
                    Chi tiết danh sách hàng nhập ({selectedTicket.items.length} mặt hàng)
                  </h4>
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#FAF6F0] text-gray-600 font-semibold uppercase tracking-wider border-b border-gray-200">
                          <th className="py-2.5 px-3">Nguyên liệu</th>
                          <th className="py-2.5 px-2 text-center">ĐVT</th>
                          <th className="py-2.5 px-3 text-center">Số lượng</th>
                          <th className="py-2.5 px-3 text-right">Đơn giá</th>
                          <th className="py-2.5 px-3 text-right">Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {selectedTicket.items.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="py-3 px-3">
                              <div className="font-semibold text-gray-900">{item.ingredientName}</div>
                              <span className="text-[10px] text-gray-400 font-mono">{item.ingredientId}</span>
                            </td>
                            <td className="py-3 px-2 text-center text-gray-600 font-medium">
                              {item.unit}
                            </td>
                            <td className="py-3 px-3 text-center font-bold text-gray-900">
                              {item.quantity}
                            </td>
                            <td className="py-3 px-3 text-right text-gray-600">
                              {item.unitPrice.toLocaleString()} đ
                            </td>
                            <td className="py-3 px-3 text-right font-bold text-[#6F4E37]">
                              {item.subtotal.toLocaleString()} đ
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Total Summary */}
                <div className="bg-[#FAF6F0] p-4 rounded-xl border border-gray-200 flex items-center justify-between">
                  <span className="font-semibold text-gray-800 text-sm">Tổng cộng thanh toán:</span>
                  <span className="text-xl font-bold text-[#6F4E37]">
                    {selectedTicket.totalAmount.toLocaleString()} VNĐ
                  </span>
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-3">
                <button
                  onClick={() => alert(`Đang gửi lệnh in phiếu nhập kho #${selectedTicket.ticketCode}...`)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-xl text-sm font-semibold transition-colors"
                >
                  <Printer className="w-4 h-4 text-gray-500" />
                  <span>In phiếu nhập</span>
                </button>

                <button
                  onClick={() => alert(`Đã xuất file Excel phiếu #${selectedTicket.ticketCode}`)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#6F4E37] hover:bg-[#5A3F2C] text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
                >
                  <FileDown className="w-4 h-4" />
                  <span>Xuất Excel</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
