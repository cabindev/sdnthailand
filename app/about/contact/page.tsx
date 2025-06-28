// app/contact/page.tsx
'use client'

import { FaMapMarkerAlt, FaPhone, FaFax, FaWarehouse } from 'react-icons/fa';

export default function Contact() {
 return (
   <div className="min-h-screen bg-white pt-24 py-6">
     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
       <div className="text-center mb-16">
         <h1 className="text-3xl font-bold text-gray-900">ติดต่อเรา</h1>
         <div className="mt-4 h-0.5 w-16 bg-orange-500 mx-auto"></div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
         {/* Office Location */}
         <div className="space-y-4">
           <div className="flex items-center space-x-2 text-gray-900">
             <FaMapMarkerAlt className="text-orange-500" />
             <h2 className="text-xl font-medium">สำนักงานโพธิ์แก้ว</h2>
           </div>
           <div className="aspect-video rounded-lg overflow-hidden shadow-sm border border-gray-200">
             <iframe
               width="100%"
               height="100%"
               style={{ border: 0 }}
               src="https://maps.google.com/maps?q=%E0%B8%AA%E0%B8%84%E0%B8%A5.%20%E0%B8%AA%E0%B8%B3%E0%B8%99%E0%B8%B1%E0%B8%81%E0%B8%87%E0%B8%B2%E0%B8%99%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B8%AD%E0%B8%82%E0%B9%88%E0%B8%B2%E0%B8%A2%E0%B8%AD%E0%B8%87%E0%B8%84%E0%B9%8C%E0%B8%81%E0%B8%A3%E0%B8%87%E0%B8%94%E0%B9%80%E0%B8%AB%E0%B8%A5%E0%B9%89%E0%B8%B2%20StopDrink%20Network&amp;t=m&amp;z=10&amp;output=embed&amp;iwloc=near"
               aria-label="สคล. สำนักงานเครือข่ายองค์กรงดเหล้า"
               allowFullScreen
             ></iframe>
           </div>
         </div>

         {/* Warehouse Location */}
         <div className="space-y-4">
           <div className="flex items-center space-x-2 text-gray-900">
             <FaWarehouse className="text-orange-500" />
             <h2 className="text-xl font-medium">คลังสื่อ</h2>
           </div>
           <div className="aspect-video rounded-lg overflow-hidden shadow-sm border border-gray-200">
             <iframe
               width="100%"
               height="100%"
               style={{ border: 0 }}
               src="https://maps.google.com/maps?q=SDN.Warehouse%2C%20Pho%20Kaeo%203%20Alley%2C%20Lane%2013%2C%20Khlong%20Chan%2C%20Bang%20Kapi%20District%2C%20Bangkok%2010240&amp;t=m&amp;z=10&amp;output=embed&amp;iwloc=near"
               aria-label="SDN.Warehouse"
               allowFullScreen
             ></iframe>
           </div>
         </div>
       </div>

       {/* Contact Details */}
       <div className="max-w-3xl mx-auto">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {/* Office Contact */}
           <div className="bg-white p-6 rounded-lg border border-gray-200">
             <h3 className="text-lg font-medium text-gray-900 mb-4">สำนักงานโพธิ์แก้ว</h3>
             <address className="not-italic space-y-3 text-sm text-gray-600">
               <p>
                 สำนักงานเครือข่ายองค์กรงดเหล้า<br />
                 110/287-288 ม.6 ซอยโพธิ์แก้ว แยก 4<br />
                 ถ.โพธิ์แก้ว แขวงคลองกุ่ม เขตบึงกุ่ม<br />
                 กทม. 10240
               </p>
               <div className="flex items-center space-x-2">
                 <FaPhone className="text-orange-500" />
                 <span>02 948 3300</span>
               </div>
               <div className="flex items-center space-x-2">
                 <FaFax className="text-orange-500" />
                 <span>02 948 3930</span>
               </div>
             </address>
           </div>

           {/* Warehouse Contact */}
           <div className="bg-white p-6 rounded-lg border border-gray-200">
             <h3 className="text-lg font-medium text-gray-900 mb-4">คลังสื่อ</h3>
             <address className="not-italic space-y-3 text-sm text-gray-600">
               <p>
                 คลังสื่อเครือข่ายองค์กรงดเหล้า<br />
                 36 ซอยโพธิ์แก้ว 3 แยก 13<br />
                 ถ.โพธิ์แก้ว แขวงคลองจั่น เขตบางกะปิ<br />
                 กทม. 10240
               </p>
               <div className="flex items-center space-x-2">
                 <FaPhone className="text-orange-500" />
                 <span>
                   รองผู้อำนวยการชัยณรงค์ คำแดง<br />
                   081-208-1899
                 </span>
               </div>
             </address>
           </div>
         </div>
       </div>
     </div>
   </div>
 );
}