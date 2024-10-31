'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from 'next/navigation';
import { HiMenuAlt3 } from "react-icons/hi";
import { IoIosArrowDown } from "react-icons/io";

const Navbar: React.FC = () => {
 const { data: session } = useSession();
 const router = useRouter();
 const pathname = usePathname();
 const [isMenuOpen, setIsMenuOpen] = useState(false);
 const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
 const [isVisible, setIsVisible] = useState(true);
 const [lastScrollY, setLastScrollY] = useState(0);
 const menuRef = useRef<HTMLDivElement>(null);

 const handleSignOut = async () => {
   await signOut({ redirect: false });
   router.push('/');
 };

 const isAdmin = session?.user?.role === 'ADMIN';

 const navItems = [
   { href: '/', label: 'หน้าหลัก' },
   { 
     href: '/about', 
     label: 'องค์กร',
     subItems: [
       { href: '/about/mission', label: 'ปณิธาน' },
       { href: '/about/principle', label: 'หลักการ' },
       { href: '/about/chart', label: 'โครงสร้างองค์กร' },
       { href: '/about/project2567', label: 'โครงการปี 2567' },
     ]
   },
   { href: '/support', label: 'ขอสื่อ' },
   ...(isAdmin ? [{ href: '/dashboard', label: 'จัดการระบบ' }] : []),
 ];

 // Effect สำหรับ Scroll
 useEffect(() => {
   let lastScroll = window.scrollY;
   let ticking = false;

   const controlNavbar = () => {
     if (window.scrollY > lastScroll && window.scrollY > 50) {
       setIsVisible(false);
       setIsMenuOpen(false);
       setOpenSubmenu(null);
     } else {
       setIsVisible(true);
     }
     lastScroll = window.scrollY;
     ticking = false;
   };

   const onScroll = () => {
     if (!ticking) {
       window.requestAnimationFrame(() => {
         controlNavbar();
       });
       ticking = true;
     }
   };

   window.addEventListener('scroll', onScroll);
   return () => window.removeEventListener('scroll', onScroll);
 }, []);

 // Effect สำหรับ Click Outside
 useEffect(() => {
   const handleClickOutside = (event: MouseEvent) => {
     if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
       setIsMenuOpen(false);
       setOpenSubmenu(null);
     }
   };

   document.addEventListener('mousedown', handleClickOutside);
   return () => document.removeEventListener('mousedown', handleClickOutside);
 }, []);

 const toggleSubmenu = (href: string) => {
   setOpenSubmenu(openSubmenu === href ? null : href);
 };

 return (
   <nav 
     className={`fixed w-full z-50 border-b transition-all duration-300 bg-white/80 backdrop-blur-md ${
       isVisible ? 'translate-y-0' : '-translate-y-full'
     }`}
   >
     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
       <div className="flex justify-between h-16">
         {/* Logo and Title */}
        <div className="flex-shrink-0 flex items-center space-x-3">
          <Link href="/">
            <Image src="/logo.png" alt="Logo" width={50} height={50} priority />
          </Link>
          
          <Link 
            href="https://sdnthailand.com" 
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:block text-center leading-tight hover:text-orange-500 transition-colors"
          >
            <span className="block text-base font-medium text-gray-900">SDN THAILAND</span>
          </Link>
        </div>

         {/* Desktop Navigation */}
         <div className="hidden md:flex items-center space-x-8">
           {navItems.map((item) => (
             <div key={item.href} className="relative group">
               {item.subItems ? (
                 <button
                   onClick={() => toggleSubmenu(item.href)}
                   className={`${
                     pathname.startsWith(item.href)
                       ? "text-orange-500"
                       : "text-gray-500 hover:text-gray-900"
                   } inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200`}
                 >
                   {item.label}
                   <IoIosArrowDown className={`ml-1 w-4 h-4 transition-transform duration-200 ${
                     openSubmenu === item.href ? 'rotate-180' : ''
                   }`} />
                 </button>
               ) : (
                 <Link
                   href={item.href}
                   className={`${
                     pathname === item.href
                       ? "text-orange-500"
                       : "text-gray-500 hover:text-gray-900"
                   } px-1 pt-1 text-sm font-medium transition-colors duration-200`}
                 >
                   {item.label}
                 </Link>
               )}
               
               {item.subItems && (
                 <div 
                   className={`absolute left-0 mt-1 w-56 bg-white rounded-md shadow-lg py-1 transition-all duration-200 border ${
                     openSubmenu === item.href ? 'opacity-100 visible' : 'opacity-0 invisible'
                   }`}
                 >
                   {item.subItems.map((subItem) => (
                     <Link
                       key={subItem.href}
                       href={subItem.href}
                       className={`block px-4 py-2 text-sm ${
                         pathname === subItem.href
                           ? "text-orange-500 bg-gray-50"
                           : "text-gray-700 hover:bg-gray-50 hover:text-orange-500"
                       }`}
                       onClick={() => setOpenSubmenu(null)}
                     >
                       {subItem.label}
                     </Link>
                   ))}
                 </div>
               )}
             </div>
           ))}
         </div>

         {/* Profile & Mobile Menu */}
         <div className="flex items-center space-x-4" ref={menuRef}>
           {/* Desktop Profile */}
           {session && (
             <div className="hidden md:block relative">
               <button
                 onClick={() => setIsMenuOpen(!isMenuOpen)}
                 className="flex items-center space-x-2 text-sm focus:outline-none"
               >
                 <img
                   className="h-8 w-8 rounded-full object-cover border border-gray-200"
                   src={session.user?.image || "/images/default-avatar.png"}
                   alt="Profile"
                 />
                 <span className="text-gray-700">{session.user?.firstName}</span>
                 <IoIosArrowDown className={`w-4 h-4 transition-transform duration-200 ${
                   isMenuOpen ? 'rotate-180' : ''
                 }`} />
               </button>

               {isMenuOpen && (
                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                   <Link
                     href="/profile"
                     className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-500"
                     onClick={() => setIsMenuOpen(false)}
                   >
                     โปรไฟล์
                   </Link>
                   <button
                     onClick={() => {
                       setIsMenuOpen(false);
                       handleSignOut();
                     }}
                     className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-500"
                   >
                     ออกจากระบบ
                   </button>
                 </div>
               )}
             </div>
           )}

           {/* Sign In Button */}
           {!session && (
             <Link
               href="/auth/signin"
               className="hidden md:inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-orange-500"
             >
               เข้าสู่ระบบ
             </Link>
           )}

           {/* Mobile Menu Button */}
           <button
             onClick={() => setIsMenuOpen(!isMenuOpen)}
             className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500"
             aria-label="Toggle menu"
           >
             <HiMenuAlt3 className="h-6 w-6" />
           </button>
         </div>
       </div>
     </div>

     {/* Mobile Menu */}
     {isMenuOpen && (
       <div className="md:hidden border-t">
         <div className="pt-2 pb-3 space-y-1">
           {navItems.map((item) => (
             <div key={item.href}>
               <button
                 onClick={() => item.subItems ? toggleSubmenu(item.href) : router.push(item.href)}
                 className={`${
                   pathname === item.href 
                     ? "text-orange-500" 
                     : "text-gray-500 hover:text-gray-900"
                 } w-full flex items-center justify-between px-4 py-2 text-base font-medium`}
               >
                 {item.label}
                 {item.subItems && (
                   <IoIosArrowDown className={`w-4 h-4 transition-transform duration-200 ${
                     openSubmenu === item.href ? 'rotate-180' : ''
                   }`} />
                 )}
               </button>

               {item.subItems && openSubmenu === item.href && (
                 <div className="pl-4 space-y-1 bg-gray-50">
                   {item.subItems.map((subItem) => (
                     <Link
                       key={subItem.href}
                       href={subItem.href}
                       className={`block px-4 py-2 text-sm ${
                         pathname === subItem.href
                           ? "text-orange-500"
                           : "text-gray-500 hover:text-orange-500"
                       }`}
                       onClick={() => {
                         setIsMenuOpen(false);
                         setOpenSubmenu(null);
                       }}
                     >
                       {subItem.label}
                     </Link>
                   ))}
                 </div>
               )}
             </div>
           ))}

           {/* Mobile Profile Links */}
           {session ? (
             <div className="border-t pt-4">
               <Link
                 href="/profile"
                 className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-orange-500"
                 onClick={() => setIsMenuOpen(false)}
               >
                 โปรไฟล์
               </Link>
               <button
                 onClick={() => {
                   setIsMenuOpen(false);
                   handleSignOut();
                 }}
                 className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-orange-500"
               >
                 ออกจากระบบ
               </button>
             </div>
           ) : (
             <div className="border-t pt-4">
               <Link
                 href="/auth/signin"
                 className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-orange-500"
                 onClick={() => setIsMenuOpen(false)}
               >
                 เข้าสู่ระบบ
               </Link>
             </div>
           )}
         </div>
       </div>
     )}
   </nav>
 );
};

export default Navbar;