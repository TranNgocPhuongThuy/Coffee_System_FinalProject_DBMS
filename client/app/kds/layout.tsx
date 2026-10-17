import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

export default function KDSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FAF6F0]">
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="min-h-screen flex flex-col">
        <Header title="Màn hình Bếp / Quầy Bar (KDS)" />
        <main className="flex-1 ml-64 pt-20 sm:pt-22 px-6 sm:px-8 pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}
