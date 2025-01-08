// components/herosection/Campaign.tsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Campaign() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative w-full">
      {/* Large Screen Image */}
      <Link href="/sdnblog/35961" className="block cursor-pointer">
        <div 
          className={`hidden md:block w-full h-[630px] transition-all duration-1000 ease-out transform
            ${isLoaded ? 'opacity-100 scale-100 hover:scale-[1.02]' : 'opacity-0 scale-95'}`}
        >
          <Image
            src="/campaign/Dryjan.jpg"
            alt="New Year Campaign Desktop"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
      </Link>

      {/* Mobile Screen Image */}
      <Link href="/sdnblog/35961" className="block md:hidden cursor-pointer">
        <div 
          className={`md:hidden w-full h-[400px] transition-all duration-1000 ease-out transform
            ${isLoaded ? 'opacity-100 scale-100 hover:scale-[1.02]' : 'opacity-0 scale-95'}`}
        >
          <Image
            src="/campaign/Chrismas.svg"
            alt="New Year Campaign Mobile"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
      </Link>
    </section>
  );
}