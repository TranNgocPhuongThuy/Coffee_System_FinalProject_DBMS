'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="vi">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
          <h2 className="text-xl font-bold">Lỗi hệ thống!</h2>
          <button
            onClick={() => reset()}
            className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </body>
    </html>
  );
}
