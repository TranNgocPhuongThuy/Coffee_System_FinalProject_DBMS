// utils/printReceipt.ts

export interface InvoiceItem {
  orderDetailId: number;
  itemSnapshotName: string;
  sizeSnapshot: string;
  quantity: number;
  unitPrice: number;
  totalToppingPriceSnapshot?: number;
  lineTotalPrice: number;
  itemNote?: string | null;
}

export interface InvoiceData {
  orderId: number;
  orderCode: string;
  orderChannel?: string;
  orderStatus?: string;
  paymentMethod?: string;
  subTotal: number;
  discountAmount: number;
  totalAmount: number;
  paidAt?: string | null;
  orderCreatedAt?: string;
  employeeName?: string | null;
  customerName?: string | null;
  customerPhone?: string | null;
  items: InvoiceItem[];
}

export function printReceipt(invoice: InvoiceData) {
  if (typeof window === 'undefined') return;

  const printWindow = window.open('', '_blank', 'width=450,height=700');
  if (!printWindow) {
    alert('Vui lòng cho phép mở cửa sổ popup để in hóa đơn!');
    return;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return new Date().toLocaleString('vi-VN');
    return new Date(dateStr).toLocaleString('vi-VN');
  };

  const itemsHtml = invoice.items
    .map(
      (item, idx) => `
      <tr>
        <td style="padding: 4px 0; vertical-align: top;">
          <div style="font-weight: bold;">${idx + 1}. ${item.itemSnapshotName} (${item.sizeSnapshot})</div>
          ${item.itemNote ? `<div style="font-size: 11px; color: #555; font-style: italic;">* ${item.itemNote}</div>` : ''}
          <div style="font-size: 11px; color: #666;">${item.quantity} x ${formatCurrency(item.unitPrice + (item.totalToppingPriceSnapshot || 0))}</div>
        </td>
        <td style="padding: 4px 0; text-align: right; vertical-align: top; font-weight: bold;">
          ${formatCurrency(item.lineTotalPrice)}
        </td>
      </tr>
    `
    )
    .join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Hóa đơn #${invoice.orderCode}</title>
        <style>
          @page { margin: 0; }
          body {
            font-family: 'Courier New', Courier, monospace, sans-serif;
            font-size: 13px;
            color: #000;
            width: 80mm;
            margin: 0 auto;
            padding: 10px;
            box-sizing: border-box;
          }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .font-bold { font-weight: bold; }
          .divider {
            border-top: 1px dashed #000;
            margin: 8px 0;
          }
          .double-divider {
            border-top: 2px solid #000;
            margin: 8px 0;
          }
          table { width: 100%; border-collapse: collapse; }
          .footer { margin-top: 15px; font-size: 11px; text-align: center; }
          @media print {
            body { width: 100%; }
          }
        </style>
      </head>
      <body>
        <div class="text-center font-bold" style="font-size: 17px; text-transform: uppercase;">
          COFFEE SHOP SYSTEM
        </div>
        <div class="text-center" style="font-size: 11px; margin-top: 2px;">
          Số 01 Võ Văn Ngân, TP. Thủ Đức, TP. HCM<br />
          Hotline: 1900 1234
        </div>
        
        <div class="divider"></div>
        <div class="text-center font-bold" style="font-size: 15px;">PHIẾU THANH TOÁN</div>
        <div class="text-center" style="font-size: 12px; margin-top: 2px;">
          Mã đơn: <span class="font-bold">${invoice.orderCode}</span>
        </div>
        <div class="divider"></div>

        <div>
          <div><strong>Thời gian:</strong> ${formatDate(invoice.paidAt || invoice.orderCreatedAt)}</div>
          <div><strong>Thu ngân:</strong> ${invoice.employeeName || 'Quầy POS 01'}</div>
          ${invoice.customerName ? `<div><strong>Khách hàng:</strong> ${invoice.customerName} (${invoice.customerPhone || ''})</div>` : ''}
          <div><strong>Kênh bán:</strong> ${invoice.orderChannel === 'TAKE_AWAY' ? 'Mang đi' : invoice.orderChannel === 'DINE_IN' ? 'Tại bàn' : 'Tại quầy'}</div>
        </div>

        <div class="divider"></div>

        <table>
          <thead>
            <tr style="border-bottom: 1px solid #000;">
              <th style="text-align: left; padding-bottom: 4px;">Món</th>
              <th style="text-align: right; padding-bottom: 4px;">T.Tiền</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div class="divider"></div>

        <table>
          <tr>
            <td>Tạm tính:</td>
            <td class="text-right font-bold">${formatCurrency(invoice.subTotal)}</td>
          </tr>
          ${
            invoice.discountAmount > 0
              ? `
          <tr>
            <td>Chiết khấu / Đổi điểm:</td>
            <td class="text-right font-bold">-${formatCurrency(invoice.discountAmount)}</td>
          </tr>
          `
              : ''
          }
          <tr style="font-size: 15px;">
            <td class="font-bold">TỔNG CỘNG:</td>
            <td class="text-right font-bold">${formatCurrency(invoice.totalAmount)}</td>
          </tr>
          <tr>
            <td>Thanh toán (${invoice.paymentMethod || 'Tiền mặt'}):</td>
            <td class="text-right font-bold">${formatCurrency(invoice.totalAmount)}</td>
          </tr>
        </table>

        <div class="double-divider"></div>

        <div class="footer">
          <div>* Cảm ơn Quý khách và Hẹn gặp lại! *</div>
          <div style="margin-top: 4px;">Wifi: CoffeeShop_Free / Pass: 88888888</div>
        </div>

        <script>
          window.onload = function() {
            window.focus();
            window.print();
            setTimeout(function() { window.close(); }, 500);
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}

export default printReceipt;
