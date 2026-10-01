import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
            <h2 className="text-2xl font-bold">404 - Không tìm thấy trang</h2>
            <Link href="/" className="mt-4 text-blue-600 hover:underline">
                Về trang chủ
            </Link>
        </div>
    );
}