import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
    title: 'Coffee Management System',
    description: 'Hệ thống quản lý chuỗi cà phê POS & Inventory',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="vi">
            <body className="antialiased text-gray-900 bg-white">
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}