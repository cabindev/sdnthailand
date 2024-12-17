// components/herosection/Campaign.tsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Campaign() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative w-full">
      {/* Large Screen Image */}
      <div 
        className={`hidden md:block w-full h-[630px] transition-all duration-1000 ease-out transform
          ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
      >
        <Image
          src="/campaign/Gif.svg"
          alt="New Year Campaign Desktop"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      {/* Mobile Screen Image */}
      <div 
        className={`md:hidden w-full h-[400px] transition-all duration-1000 ease-out transform
          ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
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
    </section>
  );
}