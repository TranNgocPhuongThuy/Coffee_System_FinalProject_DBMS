import Image from 'next/image';
import boCuteImg from '@/constants/bocute.webp';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-50">
      <h1 className="text-4xl font-bold text-gray-800">
        Chào các bạn
      </h1>
      <Image
        src={boCuteImg}
        alt="Bo cute"
        className="w-48 h-48 rounded-full border-4 border-white shadow-lg object-cover"
        priority
      />
    </main>
  );
}