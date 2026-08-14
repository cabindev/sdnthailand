// app/library/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import { books } from './data/books';
import SearchBar from './components/SearchBar';
import BookCard from './components/BookCard';

export default function Library() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  const filteredBooks = books.filter(book => {
    return book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           book.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[
#FFF5F7]">
        <div className="text-center">
          <div className="animate-bounce mb-4">
            <span className="text-6xl">📚</span>
          </div>
          <p className="text-2xl text-pink-500 font-bold animate-pulse">
            กำลังโหลดหนังสือนิทาน...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[
#FFF5F7] pt-24">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <header className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-pink-500 mb-4">
            📚 นิทานปลูกพลังบวก
          </h1>
          <p className="text-2xl text-pink-400 mb-8">
            มาผจญภัยไปกับเรื่องราวมหัศจรรย์กันเถอะ!
          </p>
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </header>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredBooks.map((book, index) => (
            <BookCard key={index} book={book} />
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">ไม่พบนิทานที่คุณค้นหา</p>
          </div>
        )}

        <section className="mt-16 bg-white rounded-2xl shadow-xl p-8 md:p-10 text-center bg-linear-to-b from-white to-pink-50">
          <h2 className="text-2xl md:text-3xl font-bold text-pink-500 mb-3">
            🌈 เรียนรู้เพิ่มเติม
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
            กิจกรรมปลูกพลังบวกเด็กปฐมวัย สร้างจิตสำนึกและภูมิคุ้มกันลดปัจจัยเสี่ยง
            พร้อมเกม นิทาน และสื่อการเรียนรู้สำหรับเด็กวัย 2–6 ปี
          </p>
          <a
            href="https://childplusest.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-linear-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-lg font-medium px-8 py-3 rounded-full transform transition-all duration-300 hover:-translate-y-1"
          >
            ไปที่ childplusest.com
            <ExternalLink className="w-5 h-5" aria-hidden="true" />
          </a>
        </section>
      </div>
    </main>
  );
}