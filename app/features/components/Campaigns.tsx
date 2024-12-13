// app/campaign/components/Campaigns.tsx
'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

interface Campaign {
 id: number;
 title: string;
 description: string;
 image: string;
 size: 'wide' | 'tall' | 'normal';
}

const campaigns: Campaign[] = [

 {
   id: 2,
   title: "", 
   description: "",
   image: "/campaign/campaign2.jpg",
   size: "normal",
 },

 {
   id: 5,
   title: "",
   description: "",
   image: "/campaign/campaign5.jpg",
   size: "wide",
 }
];

// Modal Component for Image Preview
const ImageModal = ({ image, onClose }: { image: string; onClose: () => void }) => (
 <motion.div
   initial={{ opacity: 0 }}
   animate={{ opacity: 1 }}
   exit={{ opacity: 0 }}
   className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
   onClick={onClose}
 >
   <motion.div
     initial={{ scale: 0.9 }}
     animate={{ scale: 1 }}
     exit={{ scale: 0.9 }}
     className="relative max-w-7xl w-full aspect-[16/9]"
     onClick={(e) => e.stopPropagation()}
   >
     <Image
       src={image}
       alt="Campaign Image"
       fill
       className="object-contain"
       sizes="100vw"
       quality={100}
     />
     <button
       onClick={onClose}
       className="absolute top-4 right-4 text-white hover:text-gray-300"
     >
       <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
       </svg>
     </button>
   </motion.div>
 </motion.div>
);

export default function Campaigns() {
 const [selectedIndex, setSelectedIndex] = useState(0);
 const [selectedImage, setSelectedImage] = useState<number | null>(null);
 
 const [emblaRef, emblaApi] = useEmblaCarousel({ 
   loop: true,
   align: 'center',
   skipSnaps: false,
   startIndex: 1,
 }, [Autoplay({ delay: 4000, stopOnInteraction: false })]);

 const scrollPrev = useCallback(() => {
   if (emblaApi) emblaApi.scrollPrev();
 }, [emblaApi]);

 const scrollNext = useCallback(() => {
   if (emblaApi) emblaApi.scrollNext();
 }, [emblaApi]);

 const scrollTo = useCallback(
   (index: number) => emblaApi && emblaApi.scrollTo(index),
   [emblaApi]
 );

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
   <section className="relative py-12 bg-gradient-to-b from-gray-50 to-white">
     {/* Decorative Background */}
     <div className="absolute inset-0 pointer-events-none">
       <div className="absolute inset-0 bg-[radial-gradient(#fb923c_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.03]"></div>
     </div>

     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
       {/* Section Header */}
       <div className="text-center mb-10">
         <h2 className="text-3xl font-bold text-gray-900 mb-4">แคมเปญรณรงค์</h2>
         <div className="w-20 h-1 bg-orange-500 mx-auto"></div>
       </div>

       {/* Main Carousel */}
       <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg p-2 sm:p-4" ref={emblaRef}>
         <div className="flex -mx-2 sm:-mx-4">
           {campaigns.map((item, index) => (
             <div 
               key={item.id}
               className="flex-[0_0_100%] min-w-0 px-2 sm:px-4 md:flex-[0_0_50%] lg:flex-[0_0_33.333%] cursor-pointer"
               onClick={() => setSelectedImage(index)}
             >
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: index * 0.1 }}
                 className="group relative rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300"
               >
                 <div className="relative aspect-[16/9]">
                   <Image
                     src={item.image}
                     alt={item.title || item.description}
                     fill
                     className="object-contain transition-transform duration-500 group-hover:scale-105"
                     sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                     priority={index === 0}
                   />
                   {/* Gradient Overlay */}
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                   
                   {/* Title and Description Overlay */}
                   <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                     {item.title && (
                       <h3 className="text-white text-xl font-bold mb-2">
                         {item.title}
                       </h3>
                     )}
                     <p className="text-white/90 text-base">
                       {item.description}
                     </p>
                   </div>
                 </div>
               </motion.div>
             </div>
           ))}
         </div>

         {/* Navigation Arrows */}
         <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between pointer-events-none">
           <button
             onClick={scrollPrev}
             className="w-12 h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center pointer-events-auto hover:bg-white transition-all duration-300 hover:scale-110 ml-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
           >
             <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
             </svg>
           </button>
           <button
             onClick={scrollNext}
             className="w-12 h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center pointer-events-auto hover:bg-white transition-all duration-300 hover:scale-110 mr-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
           >
             <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
             </svg>
           </button>
         </div>
       </div>

       {/* Navigation Dots */}
       <div className="flex justify-center gap-2 mt-8">
         {campaigns.map((_, idx) => (
           <button
             key={idx}
             onClick={() => scrollTo(idx)}
             className={`h-2 rounded-full transition-all duration-300 ${
               idx === selectedIndex 
                 ? 'bg-orange-500 w-6' 
                 : 'bg-gray-300 w-2 hover:bg-gray-400'
             }`}
             aria-label={`Go to slide ${idx + 1}`}
           />
         ))}
       </div>
     </div>

     {/* Image Modal */}
     <AnimatePresence>
       {selectedImage !== null && (
         <ImageModal 
           image={campaigns[selectedImage].image}
           onClose={() => setSelectedImage(null)}
         />
       )}
     </AnimatePresence>
   </section>
 );
}