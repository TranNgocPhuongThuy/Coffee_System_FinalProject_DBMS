// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/context/ToastContext';

export const metadata: Metadata = {
  title: 'MePhaPhin - Quản lý quán cà phê',
  description: 'Hệ thống quản lý chuỗi cà phê MePhaPhin - POS & Inventory',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="antialiased text-gray-900 bg-white">
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}