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
  const menuRef = useRef<HTMLDivElement>(null);

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
      <div className="max-w-7xl mx-auto px-4">
        <nav className="flex items-center justify-between py-4">
          <div className="flex space-x-2 md:space-x-4 overflow-x-auto hide-scrollbar py-2">
            {/* เมนู Link ต่าง ๆ */}
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

            {/* Hamburger Menu */}
            <div className="relative" ref={menuRef}>
              <button
                type="button"
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

              {isHamburgerOpen && (
                <div className="fixed top-20 right-4 p-4 bg-white rounded-lg shadow-xl border border-gray-100 z-[9999]">
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
                            alt={link.title}
                            width={140}
                            height={60}
                            loading="lazy"
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
  );
};

export default NavigationMenu;
