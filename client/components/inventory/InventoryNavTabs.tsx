'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, FlaskConical, PackagePlus, Scale } from 'lucide-react';

export default function InventoryNavTabs() {
  const pathname = usePathname();

  const tabs = [
    {
      name: 'Kho nguyên liệu',
      href: '/dashboard/inventory/ingredients',
      icon: Package,
      isActive: pathname.startsWith('/dashboard/inventory/ingredients'),
    },
    {
      name: 'Định lượng BOM',
      href: '/dashboard/inventory/boms',
      icon: FlaskConical,
      isActive: pathname.startsWith('/dashboard/inventory/boms'),
    },
    {
      name: 'Lịch sử Nhập kho',
      href: '/dashboard/inventory/imports',
      icon: PackagePlus,
      isActive: pathname.startsWith('/dashboard/inventory/imports'),
    },
    {
      name: 'Cân kho Hao hụt',
      href: '/dashboard/inventory/adjustments',
      icon: Scale,
      isActive: pathname.startsWith('/dashboard/inventory/adjustments'),
    },
  ];

  return (
    <div className="flex items-center gap-1 sm:gap-2 border-b border-gray-200 overflow-x-auto no-scrollbar scrollbar-none mb-6">
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