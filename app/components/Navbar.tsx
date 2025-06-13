'use client'
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from 'next/navigation';
import { HiMenuAlt3 } from "react-icons/hi";
import { IoIosArrowDown } from "react-icons/io";

interface MenuItem {
  href?: string;
  label: string;
  subItems?: Array<{
    href: string;
    label: string;
  }>;
}

interface ExternalLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const ExternalLink: React.FC<ExternalLinkProps> = ({ 
  href, 
  children, 
  className,
  onClick 
}) => (
  <a 
    href={href}
    target="_blank"
    rel="noopener noreferrer" 
    className={className}
    onClick={onClick}
  >
    {children}
  </a>
);

const Navbar: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const submenuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      let clickedInsideAnySubmenu = false;
      
      Object.values(submenuRefs.current).forEach(ref => {
        if (ref && ref.contains(target)) {
          clickedInsideAnySubmenu = true;
        }
      });

      const clickedInsideMainMenu = menuRef.current && menuRef.current.contains(target);

      if (!clickedInsideAnySubmenu && !clickedInsideMainMenu) {
        setActiveSubmenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const leftNavItems: MenuItem[] = [
    { href: '/', label: 'Home' },
    { 
      label: 'Artwork',
      subItems: [
        { href: 'https://sdn-workspaces.sdnthailand.com/', label: 'SDN Artwork' },
        { href: 'https://blog.sdnthailand.com/sdnthailand-logo-2023', label: 'คู่มือการใช้ logo SDN Thailand' },
      ]
    },
    { href: '/library', label: 'Ebook' },
    { href: 'https://ebook.sdnthailand.com/', label: 'Library' },
    { href: 'https://knowledges.sdnthailand.com/', label: 'SDN Knowledges' },
    { 
      label: 'Support',
      subItems: [
        { href: 'https://support.sdnthailand.com/support', label: 'ขอสื่อรณรงค์' },
        { href: 'https://support.sdnthailand.com/procurement', label: 'จัดซื้อ' },
        { href: 'https://support.sdnthailand.com/products', label: 'Store' },
      ]
    },
    { href: 'https://support.sdnthailand.com/about/contact', label: 'Contact' }
  ];

  const dataCenterMenu: MenuItem = { 
    label: 'Data Center',
    subItems: [
      { href: 'https://lanna.sdnthailand.com/pages/login.php', label: 'Lanna Document' },
      { href: 'https://soberheartteam.sdnthailand.com/', label: 'ร้อยคนหัวใจเพชร' },
      { href: 'https://post.sdnthailand.com/sdn/admin/', label: 'SDN DB Systems' },
      { href: 'https://avs2.sdnthailand.com/index.php', label: 'AVS+' },
      { href: 'https://sdnmapportal.sdnthailand.com/', label: 'SDN Map-portal' },
      { href: 'https://database.ssnthailand.com/', label: 'SSN Thailand' },
      { href: 'https://sdnfutsal.com/', label: 'SDN Futsal NO L CUP' },
      { href: 'https://ordain-chi.vercel.app/ordain/stats/', label: 'Sangha Foundation' },
    ]
  };

  // ปรับปรุง hover logic ให้ดีขึ้น
  const handleMenuEnter = (menuLabel: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setActiveSubmenu(menuLabel);
  };

  const handleMenuLeave = (menuLabel: string) => {
    hoverTimeoutRef.current = setTimeout(() => {
      if (activeSubmenu === menuLabel) {
        setActiveSubmenu(null);
      }
    }, 300); // เพิ่มเวลาให้เพียงพอในการเลื่อนเมาส์
  };

  const handleSubmenuEnter = (menuLabel: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setActiveSubmenu(menuLabel);
  };

  const handleSubmenuLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveSubmenu(null);
    }, 200);
  };

  const renderMenuItem = (item: MenuItem, index: number) => {
    if (item.subItems) {
      return (
        <div 
          key={`${item.label}-${index}`}
          className="relative group"
          ref={(el) => { submenuRefs.current[item.label] = el; }}
        >
          <button
            onMouseEnter={() => handleMenuEnter(item.label)}
            onMouseLeave={() => handleMenuLeave(item.label)}
            className={`inline-flex items-center px-3 py-2 text-sm font-light transition-colors duration-200 
              ${pathname === item.href ? "text-orange-600" : "text-gray-700 hover:text-orange-600"}`}
          >
            {item.label}
            <IoIosArrowDown className="ml-1 w-3 h-3 transition-transform" />
          </button>
          {activeSubmenu === item.label && (
            <div 
              className={`absolute top-full w-64 bg-white shadow-lg border border-gray-100 py-1 z-50 rounded-sm
                ${item.label === 'Data Center' ? 'right-0' : 'left-0'}`}
              onMouseEnter={() => handleSubmenuEnter(item.label)}
              onMouseLeave={handleSubmenuLeave}
            >
              {item.subItems.map((subItem, subIndex) => (
                <ExternalLink
                  key={`${subItem.href}-${subIndex}`}
                  href={subItem.href}
                  className="block px-4 py-2.5 text-sm font-light text-gray-700 hover:bg-gray-50 hover:text-orange-600 transition-colors"
                  onClick={() => setActiveSubmenu(null)}
                >
                  {subItem.label}
                </ExternalLink>
              ))}
            </div>
          )}
        </div>
      );
    }

    return item.href?.startsWith('http') ? (
      <ExternalLink
        key={`${item.label}-${index}`}
        href={item.href}
        className={`inline-flex items-center px-3 py-2 text-sm font-light transition-colors duration-200
          ${pathname === item.href ? "text-orange-600" : "text-gray-700 hover:text-orange-600"}`}
      >
        {item.label}
      </ExternalLink>
    ) : (
      <Link
        key={`${item.label}-${index}`}
        href={item.href || '/'}
        className={`inline-flex items-center px-3 py-2 text-sm font-light transition-colors duration-200
          ${pathname === item.href ? "text-orange-600" : "text-gray-700 hover:text-orange-600"}`}
      >
        {item.label}
      </Link>
    );
  };

  // ทำความสะอาด timeout เมื่อ component unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center space-x-3">
                <Image src="/logo.png" alt="Logo" width={40} height={40} priority />
                <span className="hidden sm:block font-light text-gray-900 text-base tracking-tight">SDN THAILAND</span>
              </Link>
            </div>

            <div ref={menuRef} className="hidden lg:flex items-center ml-8">
              {leftNavItems.map((item, index) => renderMenuItem(item, index))}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden lg:block">
              {renderMenuItem(dataCenterMenu, 999)}
            </div>

            {session && (
              <div className="relative hidden md:block">
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)} 
                  className="flex items-center space-x-2 text-sm focus:outline-none px-3 py-2 rounded hover:bg-gray-50"
                >
                  <img 
                    src={session.user?.image || "/default-avatar.png"} 
                    alt="Profile" 
                    className="h-7 w-7 rounded-full" 
                  />
                  <span className="text-gray-700 font-light">{session.user?.firstName}</span>
                  <IoIosArrowDown className={`w-3 h-3 text-gray-500 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isMenuOpen && (
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-sm border border-gray-100 shadow-lg py-1 z-50">
                    <Link 
                      href="/profile" 
                      className="block px-4 py-2.5 text-sm font-light text-gray-700 hover:bg-gray-50 hover:text-orange-600 transition-colors" 
                      onClick={() => setIsMenuOpen(false)}
                    >
                      โปรไฟล์
                    </Link>
                    <button 
                      onClick={() => signOut()} 
                      className="block w-full text-left px-4 py-2.5 text-sm font-light text-gray-700 hover:bg-gray-50 hover:text-orange-600 transition-colors"
                    >
                      ออกจากระบบ
                    </button>
                  </div>
                )}
              </div>
            )}

            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="lg:hidden p-2 rounded hover:bg-gray-100 transition-colors"
            >
              <HiMenuAlt3 className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {[...leftNavItems, dataCenterMenu].map((item, index) => (
              <div key={`mobile-${item.label}-${index}`}>
                {item.subItems ? (
                  <>
                    <button
                      onClick={() => setActiveSubmenu(activeSubmenu === item.label ? null : item.label)}
                      className="w-full flex justify-between items-center px-3 py-2.5 text-base font-light text-gray-700 hover:bg-gray-50 hover:text-orange-600 rounded transition-colors"
                    >
                      {item.label}
                      <IoIosArrowDown className={`w-4 h-4 transition-transform ${activeSubmenu === item.label ? 'rotate-180' : ''}`} />
                    </button>
                    {activeSubmenu === item.label && (
                      <div className="bg-gray-50 py-2 rounded mt-1">
                        {item.subItems.map((subItem, subIndex) => (
                          <ExternalLink
                            key={`mobile-sub-${subItem.href}-${subIndex}`}
                            href={subItem.href}
                            className="block pl-6 pr-4 py-2.5 text-sm font-light text-gray-600 hover:text-orange-600 transition-colors"
                            onClick={() => {
                              setActiveSubmenu(null);
                              setIsMobileMenuOpen(false);
                            }}
                          >
                            {subItem.label}
                          </ExternalLink>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  item.href?.startsWith('http') ? (
                    <ExternalLink
                      href={item.href}
                      className="block px-3 py-2.5 text-base font-light text-gray-700 hover:bg-gray-50 hover:text-orange-600 rounded transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </ExternalLink>
                  ) : (
                    <Link
                      href={item.href || '/'}
                      className="block px-3 py-2.5 text-base font-light text-gray-700 hover:bg-gray-50 hover:text-orange-600 rounded transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;