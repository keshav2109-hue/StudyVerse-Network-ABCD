
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/generatesecurekey');
  }, [router]);

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-pulse">
        <Image
          src="https://i.ibb.co/LdY729c/image.png"
          alt="Eduverse Logo"
          width={150}
          height={150}
          className="object-contain"
        />
      </div>
    </main>
  );
}
