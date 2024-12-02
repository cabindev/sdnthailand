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
 const [visible, setVisible] = useState<boolean>(true);
 const [prevScrollPos, setPrevScrollPos] = useState<number>(0);
 const menuRef = useRef<HTMLDivElement>(null);
 const submenuRef = useRef<HTMLDivElement>(null);

 const handleScroll = () => {
   const currentScrollPos = window.scrollY;
   setVisible(!!(prevScrollPos > currentScrollPos || currentScrollPos < 10 || isMobileMenuOpen));
   setPrevScrollPos(currentScrollPos);
 };

 useEffect(() => {
   window.addEventListener('scroll', handleScroll);
   return () => window.removeEventListener('scroll', handleScroll);
 }, [prevScrollPos, isMobileMenuOpen]);

 useEffect(() => {
   const handleClickOutside = (e: MouseEvent) => {
     if (
       submenuRef.current && 
       !submenuRef.current.contains(e.target as Node) && 
       menuRef.current && 
       !menuRef.current.contains(e.target as Node)
     ) {
       setActiveSubmenu(null);
     }
   };
   document.addEventListener('mousedown', handleClickOutside);
   return () => document.removeEventListener('mousedown', handleClickOutside);
 }, []);

 const navItems: MenuItem[] = [
   { href: '/', label: 'Home' },
   { href: 'https://healthy-sobriety.sdnthailand.com/', label: 'SoberSheres' },
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
     ]
   },
   { 
     label: 'Database',
     subItems: [
       { href: 'https://lanna.sdnthailand.com/pages/login.php', label: 'Lanna Document' },
       { href: 'https://soberheartteam.sdnthailand.com/', label: 'ร้อยคนหัวใจเพชร' },
       { href: 'https://post.sdnthailand.com/sdn/admin/', label: 'SDN DB Systems' },
       { href: 'https://avs.sdnthailand.com/avs/index.php', label: 'AVS' },
     ]
   },
   { href: 'https://support.sdnthailand.com/about/contact', label: 'Contact' }
 ];

 const renderMenuItem = (item: MenuItem) => {
   if (item.subItems) {
     return (
       <div ref={submenuRef} className="relative">
         <button
           onClick={() => setActiveSubmenu(activeSubmenu === item.label ? null : item.label)}
           className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200 
             ${pathname === item.href ? "text-orange-500" : "text-gray-500 hover:text-gray-900"}`}
         >
           {item.label}
           <IoIosArrowDown className={`ml-1 w-4 h-4 transition-transform ${activeSubmenu === item.label ? 'rotate-180' : ''}`} />
         </button>
         {activeSubmenu === item.label && (
           <div className="absolute left-0 mt-1 w-56 bg-white rounded-md shadow-lg py-1 z-50">
             {item.subItems.map((subItem) => (
               <ExternalLink
                 key={subItem.href}
                 href={subItem.href}
                 className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500"
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
       href={item.href}
       className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200
         ${pathname === item.href ? "text-orange-500" : "text-gray-500 hover:text-gray-900"}`}
     >
       {item.label}
     </ExternalLink>
   ) : (
     <Link
       href={item.href || '/'}
       className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200
         ${pathname === item.href ? "text-orange-500" : "text-gray-500 hover:text-gray-900"}`}
     >
       {item.label}
     </Link>
   );
 };

 return (
   <nav className={`fixed w-full z-50 transition-all duration-300 ${visible ? 'translate-y-0' : '-translate-y-full'}
     ${prevScrollPos > 0 ? 'bg-white/80 shadow-sm backdrop-blur-md' : 'bg-transparent'}`}>
     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
       <div className="flex justify-between h-16">
         <div className="flex-shrink-0 flex items-center space-x-3">
           <Link href="/">
             <Image src="/logo.png" alt="Logo" width={50} height={50} priority />
           </Link>
           <ExternalLink href="https://sdnthailand.com" className="hidden sm:block hover:text-orange-500">
             <span className="font-medium text-gray-900">SDN THAILAND</span>
           </ExternalLink>
         </div>

         <div className="hidden md:flex items-center space-x-8">
           {navItems.map((item) => (
             <div key={item.label} className="relative">
               {renderMenuItem(item)}
             </div>
           ))}
         </div>

         {session && (
           <div ref={menuRef} className="relative hidden md:block">
             <button onClick={() => setIsMenuOpen(!isMenuOpen)} 
               className="flex items-center space-x-2 text-sm focus:outline-none">
               <img src={session.user?.image || "/default-avatar.png"} 
                 alt="Profile" className="h-8 w-8 rounded-full" />
               <span>{session.user?.firstName}</span>
               <IoIosArrowDown className={`w-4 h-4 ${isMenuOpen ? 'rotate-180' : ''}`} />
             </button>
             
             {isMenuOpen && (
               <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                 <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50" 
                   onClick={() => setIsMenuOpen(false)}>โปรไฟล์</Link>
                 <button onClick={() => signOut()} 
                   className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50">
                   ออกจากระบบ
                 </button>
               </div>
             )}
           </div>
         )}

         <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden">
           <HiMenuAlt3 className="h-6 w-6" />
         </button>
       </div>
     </div>

     {isMobileMenuOpen && (
       <div className="md:hidden bg-white border-t">
         <div className="px-2 pt-2 pb-3 space-y-1">
           {navItems.map((item) => (
             <div key={item.label}>
               {item.subItems ? (
                 <>
                   <button
                     onClick={() => setActiveSubmenu(activeSubmenu === item.label ? null : item.label)}
                     className="w-full flex justify-between items-center px-3 py-2 text-base font-medium text-gray-600"
                   >
                     {item.label}
                     <IoIosArrowDown className={`w-4 h-4 ${activeSubmenu === item.label ? 'rotate-180' : ''}`} />
                   </button>
                   {activeSubmenu === item.label && (
                     <div className="bg-gray-50 py-2">
                       {item.subItems.map((subItem) => (
                         <ExternalLink
                           key={subItem.href}
                           href={subItem.href}
                           className="block pl-6 pr-4 py-2 text-sm text-gray-500 hover:text-orange-500"
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
                     className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-orange-500"
                     onClick={() => setIsMobileMenuOpen(false)}
                   >
                     {item.label}
                   </ExternalLink>
                 ) : (
                   <Link
                     href={item.href || '/'}
                     className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-orange-500"
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