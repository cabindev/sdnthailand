// components/herosection/Vision.tsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Vision() {
 const [isLoaded, setIsLoaded] = useState(false);

 useEffect(() => {
   setIsLoaded(true);
 }, []);

 return (
  <section className="relative w-full h-[600px] bg-gradient-to-br from-orange-50 to-amber-50 overflow-hidden">
  <div className="absolute inset-0">
       {/* Background Pattern */}
       <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,rgba(251,146,60,0.15)_1px,transparent_0)]" style={{ backgroundSize: '40px 40px' }} />
     </div>

     <div className="relative h-full max-w-full mx-auto px-4 sm:px-6 lg:px-8">
       <div className="flex flex-col items-center justify-center h-full space-y-6">
         {/* Logo */}
         <div 
           className={`transition-all duration-1000 ease-out transform
             ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-32'}`}
         >
           <Image
             src="/images/sdn.png"
             alt="SDN Logo"
             width={120}
             height={120}
             priority
             className="object-contain"
           />
         </div>

         {/* Text Content */}
         <div className="text-center">
           <h1 
             className={`text-4xl sm:text-5xl font-bold text-gray-900 mb-4 transition-all duration-1000 delay-300 ease-out transform
               ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-32'}`}
           >
             พลังเครือข่าย
           </h1>
           
           <div 
             className={`text-2xl sm:text-3xl text-orange-500 font-medium transition-all duration-1000 delay-500 ease-out transform
               ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-32'}`}
           >
             สานสุขทั่วไทย ปลอดภัยปลอดเหล้า
           </div>
         </div>
       </div>
     </div>
   </section>
 );
}