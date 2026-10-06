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
