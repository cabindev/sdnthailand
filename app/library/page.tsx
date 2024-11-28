'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { books } from './data/books';

export default function Library() {
 const [isLoading, setIsLoading] = useState(true);

 useEffect(() => {
   setTimeout(() => setIsLoading(false), 2000);
 }, []);

 if (isLoading) {
   return (
     <div className="min-h-screen flex items-center justify-center bg-[#FFF5F7]">
       <div className="text-center">
         <div className="animate-bounce mb-4">
           <span className="text-6xl">📚</span>
         </div>
         <p className="text-2xl text-pink-500 font-bold animate-pulse">กำลังโหลดหนังสือนิทาน...</p>
       </div>
     </div>
   );
 }

 return (
   <main className="min-h-screen bg-[#FFF5F7] pt-24">
     <div className="max-w-7xl mx-auto px-4 py-12">
       <header className="text-center mb-16">
         <h1 className="text-5xl md:text-6xl font-bold text-pink-500 mb-4 animate-fade-in">
           📚 นิทานแสนสนุก
         </h1>
         <p className="text-2xl text-pink-400">
           มาผจญภัยไปกับเรื่องราวมหัศจรรย์กันเถอะ!
         </p>
       </header>

       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
         {books.map((book, index) => (
           <article 
             key={index}
             className="bg-white rounded-2xl shadow-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 group"
             style={{
               animation: `fadeIn 0.5s ease-out ${index * 0.1}s`,
             }}
           >
             <div className="relative aspect-[4/5]">
               <Image
                 src={book.img}
                 alt={book.title}
                 fill
                 className="object-cover group-hover:brightness-105 transition-all"
                 sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
               />
             </div>
             <div className="p-6 bg-gradient-to-b from-white to-pink-50">
               <h2 className="text-xl font-bold text-gray-800 mb-4 min-h-[56px] text-center">
                 {book.title}
               </h2>
               <a
                 href={book.url}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="block w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-lg font-medium text-center py-3 rounded-full transform transition-all duration-300 hover:-translate-y-1"
               >
                 อ่านนิทาน ✨
               </a>
             </div>
           </article>
         ))}
       </div>
     </div>
   </main>
 );
}

