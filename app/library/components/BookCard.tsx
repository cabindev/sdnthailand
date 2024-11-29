// app/library/components/BookCard.tsx
import Image from 'next/image';
import { Book } from '../types';

export default function BookCard({ book }: { book: Book }) {
  return (
    <article className="bg-white rounded-2xl shadow-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 group">
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
  );
}