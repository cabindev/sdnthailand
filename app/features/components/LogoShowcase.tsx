// app/features/components/LogoShowcase.tsx
'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

interface Logo {
 id: number;
 image: string;
 alt: string;
 url?: string;
}

const logos: Logo[] = [
 {
   id: 1,
   image: "/allLogo/All logo-01.png", 
   alt: "สสส",
   url: "https://raipoong.com"
 },
 {
   id: 2,
   image: "/allLogo/All logo-02.png",
   alt: "healthy organization", 
   url: "https://healthy.com"
 },
 {
   id: 3,
   image: "/allLogo/All logo-03.png",
   alt: "สำนักงานกองทุนสนับสนุนการสร้างเสริมสุขภาพ",
   url: "https://www.thaihealth.or.th"
 },
 {
   id: 4,
   image: "/allLogo/All logo-04.png", 
   alt: "แพทยสภา",
   url: "https://tmc.or.th"
 },
 {
   id: 5,
   image: "/allLogo/All logo-05.png",
   alt: "Less Salt",
   url: "https://lowsalt.org"
 },
 {
   id: 6,
   image: "/allLogo/All logo-06.png",
   alt: "กรมสุขภาพจิต",
   url: "https://www.dmh.go.th"
 },
 {
   id: 7,
   image: "/allLogo/All logo-07.png",
   alt: "สมาคมโรคไตแห่งประเทศไทย",
   url: "https://www.nephrothai.org"
 },
 {
   id: 8,
   image: "/allLogo/All logo-08.png",
   alt: "สมาคมความดันโลหิตสูงแห่งประเทศไทย",
   url: "https://thaihypertension.org"
 },
 {
   id: 9,
   image: "/allLogo/All logo-09.png",
   alt: "สมาคมโรคหัวใจแห่งประเทศไทย",
   url: "https://thaiheart.org"
 },
 {
   id: 10,
   image: "/allLogo/All logo-10.png",
   alt: "สมาคมเบาหวานแห่งประเทศไทย",
   url: "https://www.diabassocthai.org"
 },
 {
   id: 11,
   image: "/allLogo/All logo-11.png", 
   alt: "สมาคมโภชนาการแห่งประเทศไทย",
   url: "https://www.nutritionthailand.org"
 },
 {
   id: 12, 
   image: "/allLogo/All logo-12.png",
   alt: "สมาคมนักกำหนดอาหารแห่งประเทศไทย",
   url: "https://thaidietetics.org"
 }
];

export default function LogoShowcase() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'center', 
      skipSnaps: false,
      startIndex: 1,
      slidesToScroll: 1
    },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  );

 const scrollPrev = useCallback(() => {
   if (emblaApi) emblaApi.scrollPrev();
 }, [emblaApi]);

 const scrollNext = useCallback(() => {
   if (emblaApi) emblaApi.scrollNext();
 }, [emblaApi]);

 const onSelect = useCallback(() => {
   if (!emblaApi) return;
   setSelectedIndex(emblaApi.selectedScrollSnap());
 }, [emblaApi]);

 useEffect(() => {
   if (!emblaApi) return;
   
   emblaApi.on('select', onSelect);
   onSelect();

   return () => {
     emblaApi.off('select', onSelect);
   };
 }, [emblaApi, onSelect]);

 return (
  <section className="relative bg-[##d4d4d4] py-8"> 
    <div className="max-w-5xl mx-auto px-8"> 
      <div className="relative">
       
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[##d4d4d4] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[##d4d4d4] to-transparent z-10" />
        <div className="overflow-hidden px-8" ref={emblaRef}>
          <div className="flex gap-8"> 
          {logos.map((logo) => (
          <div 
            key={logo.id}
            className="flex-[0_0_160px] min-w-0 mx-2" 
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="relative aspect-[4/3]"> 
                <Image
                  src={logo.image}
                  alt={logo.alt}
                  fill
                  className="object-contain" 
                  sizes="160px"
                  quality={100} 
                  priority={logo.id <= 4} 
                />
              </div>
            </motion.div>
          </div>
        ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={scrollPrev}
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-orange-500 text-white shadow-sm flex items-center justify-center hover:bg-orange-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={scrollNext}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-orange-500 text-white shadow-sm flex items-center justify-center hover:bg-orange-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Dots Navigation */}
      <div className="flex justify-center gap-1 mt-4"> 
        {logos.map((_, idx) => (
          <button
            key={idx}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              idx === selectedIndex ? 'bg-orange-500 w-3' : 'bg-gray-300'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  </section>
);
}