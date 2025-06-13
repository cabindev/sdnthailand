'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaRegNewspaper, FaVideo, FaHandsHelping, FaUsers, FaBars } from 'react-icons/fa';

const externalLinks = [
  {
    id: 1,
    title: "ที่โรงเรียนคำพ่อสอน", 
    url: "https://xn--42cf1cjb3azgb8e6ab5d9ad8o5a1il1h.com/หน้าแรก/",
    image: "/Link/School.png"
  },
  {
    id: 2,
    title: "SDN Futsal",
    url: "https://sdnfutsal.com/",
    image: "/Link/futsal.jpg"
  },
  {
    id: 3,
    title: "AVS+",
    url: "https://avs2.sdnthailand.com/index.php",
    image: "/Link/AVS+.jpg"
  },
  {
    id: 4,
    title: "โครงการบวช",
    url: "https://ordain-chi.vercel.app/",
    image: "/Link/songkha.png"
  },
  {
    id: 5,
    title: "Child Plus EST",
    url: "https://childplusest.com/",
    image: "/Link/childplusest.png"
  },
  {
    id: 6,
    title: "SDN Map Portal",
    url: "https://sdnmapportal.sdnthailand.com/",
    image: "/Link/Map-portal.jpg"
  }
];

interface NavigationMenuProps {
  activeSection: string;
}

const NavigationMenu = ({ activeSection }: NavigationMenuProps) => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  // Auto-slide functionality
  useEffect(() => {
    if (isHamburgerOpen) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % Math.ceil(externalLinks.length / 6));
      }, 4000); // เปลี่ยนทุก 4 วินาที

      return () => clearInterval(interval);
    }
  }, [isHamburgerOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsHamburgerOpen(false);
        setCurrentSlide(0); // รีเซ็ต slide เมื่อปิดเมนู
      }
    };

    if (isHamburgerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isHamburgerOpen]);

  const handleSectionClick = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setIsHamburgerOpen(false);
  };

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  // คำนวณจำนวน slides
  const totalSlides = Math.ceil(externalLinks.length / 6);

  return (
    <div className="sticky top-0 z-30 backdrop-blur-xl bg-white/95 shadow-md border-b border-[var(--accent)]/10">
      <div className="max-w-7xl mx-auto px-4">
        <nav className="flex items-center justify-between py-3">
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4 overflow-x-auto hide-scrollbar py-2">
            {[
              { id: "news", icon: <FaRegNewspaper />, label: "ข่าวสาร" },
              { id: "blogs", icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                ), label: "บทความ" },
              { id: "ordain", icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ), label: "โครงการบวชสร้างสุข" },
              { id: "about", icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ), label: "เกี่ยวกับเรา" },
              { id: "networks", icon: <FaUsers />, label: "เครือข่าย" },
              { id: "videos", icon: <FaVideo />, label: "วิดีโอ" },
              { id: "support", icon: <FaHandsHelping />, label: "สนับสนุน" },
            ].map(({ id, icon, label }) => (
              <Link
                key={id}
                href={`#${id}`}
                className={`group flex items-center whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeSection === id
                    ? "bg-[var(--accent)] text-[var(--accent-foreground)] shadow-lg shadow-[var(--accent)]/20"
                    : "text-[var(--foreground)] hover:bg-[var(--hover-bg)] hover:scale-105"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleSectionClick(id);
                }}
              >
                <span className="mr-2 transition-transform group-hover:scale-110">{icon}</span>
                {label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu */}
          <div className="flex md:hidden items-center space-x-2 overflow-x-auto hide-scrollbar py-2 flex-1">
            {[
              { id: "news", icon: <FaRegNewspaper />, label: "ข่าวสาร" },
              { id: "blogs", icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                ), label: "บทความ" },
              { id: "about", icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ), label: "เกี่ยวกับ" },
              { id: "videos", icon: <FaVideo />, label: "วิดีโอ" },
            ].map(({ id, icon, label }) => (
              <Link
                key={id}
                href={`#${id}`}
                className={`group flex items-center whitespace-nowrap px-3 py-2 rounded-full text-xs font-medium transition-all ${
                  activeSection === id
                    ? "bg-[var(--accent)] text-[var(--accent-foreground)] shadow-lg"
                    : "text-[var(--foreground)] hover:bg-[var(--hover-bg)]"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleSectionClick(id);
                }}
              >
                <span className="mr-1">{icon}</span>
                {label}
              </Link>
            ))}
          </div>

          {/* Hamburger Menu Button */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setIsHamburgerOpen(!isHamburgerOpen)}
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                isHamburgerOpen
                  ? "bg-[#FF6633] text-white"
                  : "bg-[#FF6633] text-white hover:bg-[#FF5522]"
              } transition-colors flex-shrink-0`}
              aria-label={isHamburgerOpen ? "ปิดเมนู" : "เปิดเมนู"}
            >
              <FaBars className="w-4 h-4" />
            </button>

            {/* Dropdown Menu with Carousel */}
            {isHamburgerOpen && (
              <div className="absolute top-12 right-0 p-4 bg-white rounded-lg shadow-xl border border-gray-100 z-50 min-w-[320px] sm:min-w-[420px]">
                {/* Carousel Container */}
                <div className="relative overflow-hidden">
                  <div 
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {Array.from({ length: totalSlides }, (_, slideIndex) => (
                      <div key={slideIndex} className="w-full flex-shrink-0">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {externalLinks
                            .slice(slideIndex * 6, (slideIndex + 1) * 6)
                            .map((link) => (
                              
                              <a
                                key={link.id}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block hover:shadow-md transition-all duration-300 rounded-md overflow-hidden text-center group hover:scale-105"
                                onClick={() => setIsHamburgerOpen(false)}
                              >
                                <div className="w-full h-[70px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-md overflow-hidden flex items-center justify-center group-hover:from-orange-50 group-hover:to-orange-100 transition-all duration-300 p-2">
                                  <Image
                                    src={link.image}
                                    alt={link.title}
                                    width={120}
                                    height={60}
                                    loading="lazy"
                                    className="object-contain max-w-full max-h-full filter drop-shadow-sm group-hover:drop-shadow-md transition-all duration-300"
                                    onError={(e) => {
                                      // Fallback สำหรับรูปที่โหลดไม่ได้
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                      const parent = target.parentElement;
                                      if (parent) {
                                        parent.innerHTML = `
                                          <div class="flex items-center justify-center w-full h-full text-gray-400">
                                            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                            </svg>
                                          </div>
                                        `;
                                      }
                                    }}
                                  />
                                </div>
                                <div className="text-xs mt-2 text-gray-700 font-medium truncate px-1 group-hover:text-orange-600 transition-colors duration-300">
                                  {link.title}
                                </div>
                              </a>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dot Controls */}
                {totalSlides > 1 && (
                  <div className="flex justify-center mt-4 space-x-2">
                    {Array.from({ length: totalSlides }, (_, index) => (
                      <button
                        key={index}
                        onClick={() => handleDotClick(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          currentSlide === index
                            ? 'bg-[#FF6633] scale-110 shadow-md'
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                        aria-label={`ไปยังหน้า ${index + 1}`}
                      />
                    ))}
                  </div>
                )}

                {/* Progress Bar (optional) */}
                <div className="mt-3 w-full bg-gray-200 rounded-full h-1">
                  <div 
                    className="bg-[#FF6633] h-1 rounded-full transition-all duration-300 ease-in-out"
                    style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default NavigationMenu;