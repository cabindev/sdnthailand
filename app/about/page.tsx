// app/sdninfo/page.tsx
"use client";

import Image from "next/image";
import Link from 'next/link';
import { FaInfoCircle, FaChartLine, FaUsers, FaBullseye } from 'react-icons/fa';

export default function SdnInfo() {
 return (
   <div className="min-h-screen bg-white">
     {/* Hero Section */}
     <div className="relative bg-gradient-to-r from-orange-50 to-orange-100 pt-28 pb-16">
       <div className="container mx-auto px-4">
         <div className="flex flex-col items-center text-center">
           <Image
             src="/images/logoสคล.png"
             alt="Logo"
             width={120} 
             height={120}
             className="mb-8"
             priority
           />
           <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 max-w-3xl mx-auto">
             เราคือสำนักงานเครือข่ายองค์กรงดเหล้า (สคล.)
           </h1>
           <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
             องค์กรที่มุ่งมั่นสร้างสังคมปลอดภัย ปลอดเหล้า เพื่อคุณภาพชีวิตที่ดีของคนไทย
           </p>
           <div className="h-1 w-24 bg-orange-500 mx-auto"></div>
         </div>
       </div>
     </div>

     {/* Navigation Cards */}
     <div className="container mx-auto px-4 py-16">
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
         <Link href="/sdninfo/mission" 
           className="group bg-white rounded-xl border border-gray-200 p-6 hover:border-orange-500 hover:shadow-lg transition-all duration-200">
           <FaInfoCircle className="text-3xl text-orange-500 mb-4" />
           <h3 className="text-xl font-semibold mb-2 text-gray-900">ปณิธาน</h3>
           <p className="text-gray-600 text-sm">
             เรียนรู้เกี่ยวกับวิสัยทัศน์และพันธกิจของเรา
           </p>
         </Link>

         <Link href="/sdninfo/principle"
           className="group bg-white rounded-xl border border-gray-200 p-6 hover:border-orange-500 hover:shadow-lg transition-all duration-200">
           <FaBullseye className="text-3xl text-orange-500 mb-4" />
           <h3 className="text-xl font-semibold mb-2 text-gray-900">หลักการ</h3>
           <p className="text-gray-600 text-sm">
             12 แนวคิดหลักของเครือข่ายงดเหล้า
           </p>
         </Link>

         <Link href="/sdninfo/chart"
           className="group bg-white rounded-xl border border-gray-200 p-6 hover:border-orange-500 hover:shadow-lg transition-all duration-200">
           <FaUsers className="text-3xl text-orange-500 mb-4" />
           <h3 className="text-xl font-semibold mb-2 text-gray-900">โครงสร้างองค์กร</h3>
           <p className="text-gray-600 text-sm">
             ทำความรู้จักทีมงานและโครงสร้างการทำงาน
           </p>
         </Link>

         <Link href="/sdninfo/17project"
           className="group bg-white rounded-xl border border-gray-200 p-6 hover:border-orange-500 hover:shadow-lg transition-all duration-200">
           <FaChartLine className="text-3xl text-orange-500 mb-4" />
           <h3 className="text-xl font-semibold mb-2 text-gray-900">โครงการ</h3>
           <p className="text-gray-600 text-sm">
             โครงการที่ดำเนินงานประจำปี 2567
           </p>
         </Link>
       </div>
     </div>

     {/* Contact Info */}
     <div className="bg-gray-50 py-16">
       <div className="container mx-auto px-4">
         <div className="max-w-3xl mx-auto text-center">
           <h2 className="text-2xl font-bold text-gray-900 mb-8">ติดต่อเรา</h2>
           <p className="text-gray-600 mb-8">
             สำนักงานเครือข่ายองค์กรงดเหล้า<br />
             110/287-288 ม.6 ซอยโพธิ์แก้ว แยก 4<br />
             ถ.โพธิ์แก้ว แขวงคลองกุ่ม เขตบึงกุ่ม กทม. 10240
           </p>
           <Link href="/sdninfo/contact" 
             className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 transition-colors">
             ดูข้อมูลการติดต่อทั้งหมด
           </Link>
         </div>
       </div>
     </div>
   </div>
 );
}