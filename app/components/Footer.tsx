import Link from 'next/link'

export default function Footer() {
 return (
   <footer className="bg-gray-700 mt-auto">
     <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
       <div className="text-center space-y-8">
         
         {/* Organization Info */}
         <div className="space-y-4">
           <h3 className="text-2xl font-semibold text-gray-50">
             สำนักงานเครือข่ายองค์กรงดเหล้า
           </h3>
           <p className="text-base  text-gray-100 max-w-xl mx-auto leading-relaxed">
             110/287-288 ม.6 ซอยโพธิ์แก้ว แยก 4<br />
             ถ.โพธิ์แก้ว แขวงคลองกุ่ม เขตบึงกุ่ม<br />
             กรุงเทพมหานคร 10240
           </p>
         </div>

         {/* Social Links */}
         <div className="flex justify-center space-x-6">
           <Link
             href="https://blog.sdnthailand.com"
             target="_blank" 
             rel="noopener noreferrer"
             className=" text-gray-200 hover:text-orange-500 transition-colors"
           >
             Blog
           </Link>
           <Link
             href="https://sdnthailand.com"
             target="_blank"
             rel="noopener noreferrer" 
             className=" text-gray-200 hover:text-orange-500 transition-colors"
           >
             Website
           </Link>
         </div>

         {/* Copyright */}
         <div className="text-sm text-gray-500">
           © {new Date().getFullYear()} SDN Thailand. All rights reserved.
         </div>

       </div>
     </div>
   </footer>
 )
}