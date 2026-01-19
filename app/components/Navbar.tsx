'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from "next-auth/react";
import { usePathname } from 'next/navigation';
import { HiMenuAlt3, HiDatabase } from "react-icons/hi";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";

interface SubMenuItem {
  name: string;
  href: string;
}

interface NestedMenuItem {
  name: string;
  items: SubMenuItem[];
}

interface MenuItem {
  name: string;
  href?: string;
  submenu?: SubMenuItem[];
  nestedSubmenu?: NestedMenuItem[];
}

interface ExternalLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

interface InternalLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Navbar: React.FC = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState<boolean>(false);
  const [openSubmenu, setOpenSubmenu] = useState<string>('');
  const [openNestedSubmenu, setOpenNestedSubmenu] = useState<string>('');
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsProfileMenuOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  const menuItems: MenuItem[] = [
    { name: 'Home', href: '/' },
    {
      name: 'Artwork',
      submenu: [
        { name: 'SDN Artwork', href: 'https://sdn-workspaces.sdnthailand.com/' },
        { name: 'คู่มือการใช้ logo SDN Thailand', href: 'https://blog.sdnthailand.com/sdnthailand-logo-2023' },
      ]
    },
    { name: 'Video', href: '/video' },
    { name: 'Ebook', href: '/library' },
    { name: 'Library', href: 'https://ebook.sdnthailand.com/' },
    { name: 'SDN Knowledges', href: 'https://knowledges.sdnthailand.com/' },
    {
      name: 'Support',
      submenu: [
        { name: 'ขอสื่อรณรงค์', href: 'https://support.sdnthailand.com/support' },
        { name: 'จัดซื้อ', href: 'https://support.sdnthailand.com/procurement' },
        { name: 'Store', href: 'https://support.sdnthailand.com/products' },
      ]
    },
    {
      name: 'About',
      submenu: [
        { name: 'เกี่ยวกับเรา', href: '/about/mission' },
        { name: 'หลักการทำงาน', href: '/about/principle' },
      ]
    },
    { name: 'Contact', href: '/about/contact' }
  ];

  const dataCenterItems: NestedMenuItem[] = [

    {
      name: 'DB Systems',
      items: [
        { name: 'SDN DB Systems', href: 'https://post.sdnthailand.com/sdn/admin/' },
        { name: 'AVS+', href: 'https://avs2.sdnthailand.com/index.php' },
        { name: 'SDN Map-portal', href: 'https://sdnmapportal.sdnthailand.com/' },
        { name: 'SSN Thailand', href: 'https://database.ssnthailand.com/' },
      ]
    },
    {
      name: 'Data Sources',
      items: [
        { name: 'Lanna Document', href: 'https://lanna.sdnthailand.com/pages/login.php' },
        { name: 'ร้อยคนหัวใจเพชร', href: 'https://soberheartteam.sdnthailand.com/' },
      ]
    },
  ];

  // Handle submenu hover - show immediately on enter
  const handleMouseEnter = (menuName: string) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setOpenSubmenu(menuName);
  };

  // Small delay on leave to allow moving to submenu
  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setOpenSubmenu('');
      setOpenNestedSubmenu('');
    }, 150); // Reduced from 300ms to 150ms for faster response
    setHoverTimeout(timeout);
  };

  // Handle nested submenu hover - show immediately
  const handleNestedMouseEnter = (nestedName: string) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setOpenNestedSubmenu(nestedName);
  };

  // Handle mobile submenu toggle
  const toggleMobileSubmenu = (menuName: string) => {
    setOpenSubmenu(openSubmenu === menuName ? '' : menuName);
    setOpenNestedSubmenu('');
  };

  // Handle mobile nested submenu toggle
  const toggleMobileNestedSubmenu = (nestedName: string) => {
    setOpenNestedSubmenu(openNestedSubmenu === nestedName ? '' : nestedName);
  };

  // Close mobile menu
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setOpenSubmenu('');
    setOpenNestedSubmenu('');
  };

  // External link component
  const ExternalLink: React.FC<ExternalLinkProps> = ({ href, children, className, onClick }) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      window.open(href, '_blank', 'noopener,noreferrer');
      if (onClick) onClick();
    };

    return (
      <button onClick={handleClick} className={className} type="button">
        {children}
      </button>
    );
  };

  // Internal link component
  const InternalLink: React.FC<InternalLinkProps> = ({ href, children, className, onClick }) => (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );

  // Render menu item
  const renderMenuItem = (item: MenuItem, isMobile: boolean = false) => {
    const isActive = pathname === item.href;
    const hasSubmenu = Boolean(item.submenu);
    const hasNestedSubmenu = Boolean(item.nestedSubmenu);
    const isSubmenuOpen = openSubmenu === item.name;

    // Handle nested submenu (Data Center)
    if (hasNestedSubmenu && item.nestedSubmenu) {
      return (
        <div
          key={item.name}
          className="relative"
          onMouseEnter={() => !isMobile && handleMouseEnter(item.name)}
          onMouseLeave={() => !isMobile && handleMouseLeave()}
        >
          <button
            onClick={() => isMobile && toggleMobileSubmenu(item.name)}
            className={`flex items-center px-3 py-2 text-sm font-light transition-colors duration-200 ${
              isActive ? 'text-orange-600' : 'text-gray-700 hover:text-orange-600'
            } ${isMobile ? 'w-full justify-between text-base' : ''}`}
            type="button"
          >
            <span className="flex items-center">
              {item.name === 'Data Center' && <HiDatabase className="mr-2 w-4 h-4" />}
              {item.name}
            </span>
            <IoIosArrowDown
              className={`ml-1 w-3 h-3 transition-transform ${
                isSubmenuOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Desktop Nested Submenu */}
          {!isMobile && isSubmenuOpen && (
            <div
              className="absolute top-full right-0 w-72 bg-white shadow-lg border border-gray-100 py-1 z-50 rounded-sm"
              onMouseEnter={() => handleMouseEnter(item.name)}
              onMouseLeave={handleMouseLeave}
            >
              {item.nestedSubmenu.map((nestedItem) => (
                <div
                  key={nestedItem.name}
                  className="relative"
                  onMouseEnter={() => handleNestedMouseEnter(nestedItem.name)}
                >
                  <div className="flex items-center justify-between px-4 py-2.5 text-sm font-medium text-gray-800 bg-gray-50 border-b border-gray-100">
                    <IoIosArrowForward className="w-3 h-3 text-gray-500 rotate-180" />
                    <span>{nestedItem.name}</span>
                  </div>
                  
                  {/* Nested items */}
                  {openNestedSubmenu === nestedItem.name && (
                    <div className="absolute right-full top-0 w-64 bg-white shadow-lg border border-gray-100 py-1 z-50 rounded-sm">
                      {nestedItem.items.map((subItem) => (
                        <ExternalLink
                          key={subItem.name}
                          href={subItem.href}
                          className="block w-full text-left px-4 py-2.5 text-sm font-light text-gray-700 hover:bg-gray-50 hover:text-orange-600 transition-colors"
                          onClick={() => {
                            setOpenSubmenu('');
                            setOpenNestedSubmenu('');
                          }}
                        >
                          {subItem.name}
                        </ExternalLink>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Mobile Nested Submenu */}
          {isMobile && isSubmenuOpen && (
            <div className="bg-gray-50 py-2 rounded mt-1">
              {item.nestedSubmenu.map((nestedItem) => (
                <div key={nestedItem.name}>
                  <button
                    onClick={() => toggleMobileNestedSubmenu(nestedItem.name)}
                    className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100 transition-colors"
                    type="button"
                  >
                    <span>{nestedItem.name}</span>
                    <IoIosArrowDown
                      className={`w-3 h-3 transition-transform ${
                        openNestedSubmenu === nestedItem.name ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  
                  {openNestedSubmenu === nestedItem.name && (
                    <div className="bg-gray-100 py-1 ml-4 rounded">
                      {nestedItem.items.map((subItem) => (
                        <ExternalLink
                          key={subItem.name}
                          href={subItem.href}
                          className="block w-full text-left pl-4 pr-4 py-2 text-sm font-light text-gray-600 hover:text-orange-600 hover:bg-gray-200 transition-colors"
                          onClick={closeMobileMenu}
                        >
                          {subItem.name}
                        </ExternalLink>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    // Handle regular submenu
    if (hasSubmenu && item.submenu) {
      return (
        <div
          key={item.name}
          className="relative"
          onMouseEnter={() => !isMobile && handleMouseEnter(item.name)}
          onMouseLeave={() => !isMobile && handleMouseLeave()}
        >
          <button
            onClick={() => isMobile && toggleMobileSubmenu(item.name)}
            className={`flex items-center px-3 py-2 text-sm font-light transition-colors duration-200 ${
              isActive ? 'text-orange-600' : 'text-gray-700 hover:text-orange-600'
            } ${isMobile ? 'w-full justify-between text-base' : ''}`}
            type="button"
          >
            <span className="flex items-center">
              {item.name}
            </span>
            <IoIosArrowDown
              className={`ml-1 w-3 h-3 transition-transform ${
                isSubmenuOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Desktop Submenu */}
          {!isMobile && isSubmenuOpen && (
            <div
              className="absolute top-full left-0 w-64 bg-white shadow-lg border border-gray-100 py-1 z-50 rounded-sm"
              onMouseEnter={() => handleMouseEnter(item.name)}
              onMouseLeave={handleMouseLeave}
            >
              {item.submenu.map((subItem) => {
                const isExternal = subItem.href.startsWith('http');
                const linkClassName = "block w-full text-left px-4 py-2.5 text-sm font-light text-gray-700 hover:bg-gray-50 hover:text-orange-600 transition-colors";

                return isExternal ? (
                  <ExternalLink
                    key={subItem.name}
                    href={subItem.href}
                    className={linkClassName}
                    onClick={() => setOpenSubmenu('')}
                  >
                    {subItem.name}
                  </ExternalLink>
                ) : (
                  <InternalLink
                    key={subItem.name}
                    href={subItem.href}
                    className={linkClassName}
                    onClick={() => setOpenSubmenu('')}
                  >
                    {subItem.name}
                  </InternalLink>
                );
              })}
            </div>
          )}

          {/* Mobile Submenu */}
          {isMobile && isSubmenuOpen && (
            <div className="bg-gray-50 py-2 rounded mt-1">
              {item.submenu.map((subItem) => {
                const isExternal = subItem.href.startsWith('http');
                const linkClassName = "block w-full text-left pl-6 pr-4 py-3 text-sm font-light text-gray-600 hover:text-orange-600 hover:bg-gray-100 transition-colors";

                return isExternal ? (
                  <ExternalLink
                    key={subItem.name}
                    href={subItem.href}
                    className={linkClassName}
                    onClick={closeMobileMenu}
                  >
                    {subItem.name}
                  </ExternalLink>
                ) : (
                  <InternalLink
                    key={subItem.name}
                    href={subItem.href}
                    className={linkClassName}
                    onClick={closeMobileMenu}
                  >
                    {subItem.name}
                  </InternalLink>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    // Regular menu item
    if (!item.href) return null;
    
    const isExternal = item.href.startsWith('http');
    const linkProps = {
      href: item.href,
      className: `block px-3 py-2 text-sm font-light transition-colors duration-200 ${
        isActive ? 'text-orange-600' : 'text-gray-700 hover:text-orange-600'
      } ${isMobile ? 'text-base' : ''}`,
      onClick: isMobile ? closeMobileMenu : undefined,
    };

    return isExternal ? (
      <ExternalLink key={item.name} {...linkProps}>
        {item.name}
      </ExternalLink>
    ) : (
      <InternalLink key={item.name} {...linkProps}>
        {item.name}
      </InternalLink>
    );
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <Image src="/logo.png" alt="Logo" width={40} height={40} priority />
              <span className="hidden sm:block font-light text-gray-900 text-base tracking-tight">
                SDN THAILAND
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center ml-8">
              {menuItems.map((item) => renderMenuItem(item, false))}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            {/* Data Center Menu - Desktop */}
            <div className="hidden lg:block">
              {renderMenuItem({
                name: 'Data Center',
                nestedSubmenu: dataCenterItems,
              }, false)}
            </div>

            {/* Profile Menu */}
            {session && (
              <div className="relative hidden md:block">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsProfileMenuOpen(!isProfileMenuOpen);
                  }}
                  className="flex items-center space-x-2 text-sm focus:outline-none px-3 py-2 rounded hover:bg-gray-50"
                  type="button"
                >
                  <img
                    src={session.user?.image || "/default-avatar.png"}
                    alt="Profile"
                    className="h-7 w-7 rounded-full"
                  />
                  <span className="text-gray-700 font-light">{session.user?.firstName}</span>
                  <IoIosArrowDown
                    className={`w-3 h-3 text-gray-500 transition-transform ${
                      isProfileMenuOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-sm border border-gray-100 shadow-lg py-1 z-50">
                    <Link
                      href="/profile"
                      className="block px-4 py-2.5 text-sm font-light text-gray-700 hover:bg-gray-50 hover:text-orange-600 transition-colors"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      โปรไฟล์
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="block w-full text-left px-4 py-2.5 text-sm font-light text-gray-700 hover:bg-gray-50 hover:text-orange-600 transition-colors"
                      type="button"
                    >
                      ออกจากระบบ
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded hover:bg-gray-100 transition-colors"
              type="button"
              aria-label="Toggle mobile menu"
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
            {/* Regular menu items */}
            {menuItems.map((item) => renderMenuItem(item, true))}
            
            {/* Data Center menu for mobile */}
            {renderMenuItem({
              name: 'Data Center',
              nestedSubmenu: dataCenterItems,
            }, true)}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;