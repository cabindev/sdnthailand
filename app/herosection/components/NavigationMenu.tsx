// app/herosection/components/NavigationMenu.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FaRegNewspaper, 
  FaVideo, 
  FaHandsHelping, 
  FaUsers,
  FaBars
} from 'react-icons/fa';

// กำหนดข้อมูลลิงก์สำหรับเมนู Hamburger
const externalLinks = [
  {
    id: 1,
    title: "ทีวีออนไลน์", 
    url: "https://xn--42cf1cjb3azgb8e6ab5d9ad8o5a1il1h.com/%e0%b8%ab%e0%b8%99%e0%b9%89%e0%b8%b2%e0%b9%81%e0%b8%a3%e0%b8%81/",
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

export default function NavigationMenu({ activeSection }: NavigationMenuProps) {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // ปิดเมนูเมื่อคลิกนอกเมนู
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsHamburgerOpen(false);
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
  };

  return (
    <div className="sticky top-0 z-40 backdrop-blur-xl bg-white shadow-md border-b border-[var(--accent)]/10">
      <div className="max-w-7xl mx-auto">
        <div className="overflow-x-auto hide-scrollbar">
          <nav className="flex items-center justify-between py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-2 md:space-x-4 overflow-x-auto hide-scrollbar py-2">
              {/* เมนูหลักเหมือนเดิม */}
              <Link 
                href="#news"
                className={`group flex items-center whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeSection === "news" 
                  ? "bg-[var(--accent)] text-[var(--accent-foreground)] shadow-lg shadow-[var(--accent)]/20" 
                  : "text-[var(--foreground)] hover:bg-[var(--hover-bg)] hover:scale-105"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleSectionClick("news");
                }}
              >
                <span className="mr-2"><FaRegNewspaper className="transition-transform group-hover:scale-110" /></span>
                ข่าวสาร
              </Link>
              
              <Link 
                href="#blogs"
                className={`group flex items-center whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeSection === "blogs" 
                  ? "bg-[var(--accent)] text-[var(--accent-foreground)] shadow-lg shadow-[var(--accent)]/20" 
                  : "text-[var(--foreground)] hover:bg-[var(--hover-bg)] hover:scale-105"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleSectionClick("blogs");
                }}
              >
                <span className="mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </span>
                บทความ
              </Link>
              
              <Link 
                href="#ordain"
                className={`group flex items-center whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeSection === "ordain" 
                  ? "bg-[var(--accent)] text-[var(--accent-foreground)] shadow-lg shadow-[var(--accent)]/20" 
                  : "text-[var(--foreground)] hover:bg-[var(--hover-bg)] hover:scale-105"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleSectionClick("ordain");
                }}
              >
                <span className="mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </span>
                โครงการบวชสร้างสุข
              </Link>
              
              <Link 
                href="#about"
                className={`group flex items-center whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeSection === "about" 
                  ? "bg-[var(--accent)] text-[var(--accent-foreground)] shadow-lg shadow-[var(--accent)]/20" 
                  : "text-[var(--foreground)] hover:bg-[var(--hover-bg)] hover:scale-105"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleSectionClick("about");
                }}
              >
                <span className="mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                เกี่ยวกับเรา
              </Link>
              
              <Link 
                href="#networks"
                className={`group flex items-center whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeSection === "networks" 
                  ? "bg-[var(--accent)] text-[var(--accent-foreground)] shadow-lg shadow-[var(--accent)]/20" 
                  : "text-[var(--foreground)] hover:bg-[var(--hover-bg)] hover:scale-105"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleSectionClick("networks");
                }}
              >
                <span className="mr-2"><FaUsers className="transition-transform group-hover:scale-110" /></span>
                เครือข่าย
              </Link>
              
              <Link 
                href="#videos"
                className={`group flex items-center whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeSection === "videos" 
                  ? "bg-[var(--accent)] text-[var(--accent-foreground)] shadow-lg shadow-[var(--accent)]/20" 
                  : "text-[var(--foreground)] hover:bg-[var(--hover-bg)] hover:scale-105"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleSectionClick("videos");
                }}
              >
                <span className="mr-2"><FaVideo className="transition-transform group-hover:scale-110" /></span>
                วิดีโอ
              </Link>
              
              <Link 
                href="#support"
                className={`group flex items-center whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeSection === "support" 
                  ? "bg-[var(--accent)] text-[var(--accent-foreground)] shadow-lg shadow-[var(--accent)]/20" 
                  : "text-[var(--foreground)] hover:bg-[var(--hover-bg)] hover:scale-105"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleSectionClick("support");
                }}
              >
                <span className="mr-2"><FaHandsHelping className="transition-transform group-hover:scale-110" /></span>
                สนับสนุน
              </Link>
              
              {/* ปุ่ม Hamburger */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsHamburgerOpen(!isHamburgerOpen)}
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    isHamburgerOpen
                    ? "bg-[#FF6633] text-white"
                    : "bg-[#FF6633] text-white hover:bg-[#FF5522]"
                  } transition-colors ml-2`}
                  aria-label={isHamburgerOpen ? "ปิดเมนู" : "เปิดเมนู"}
                >
                  <FaBars className="w-4 h-4" />
                </button>
                
                {/* Dropdown Menu */}
                {isHamburgerOpen && (
                  <div
                    className="fixed top-20 right-4 p-4 bg-white rounded-lg shadow-xl border border-gray-100"
                    style={{ zIndex: 9999 }}
                  >
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {externalLinks.map((link) => (
                        <Link
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block hover:shadow-md transition-all rounded-md overflow-hidden"
                        >
                          <div className="w-[150px] h-[70px] bg-white rounded-md overflow-hidden flex items-center justify-center">
                            <Image
                              src={link.image}
                              alt={link.title || "External link"}
                              width={140}
                              height={60}
                              style={{ objectFit: 'contain' }}
                            />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}