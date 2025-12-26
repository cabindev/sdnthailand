// app/contact/page.tsx
'use client'

import { FaMapMarkerAlt, FaPhone, FaFax, FaWarehouse, FaEnvelope, FaUser, FaPaperPlane } from 'react-icons/fa';
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({ type: 'success', message: data.message });
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        setSubmitStatus({ type: 'error', message: data.error || 'เกิดข้อผิดพลาด' });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'ไม่สามารถส่งข้อความได้ โปรดลองอีกครั้ง' });
    } finally {
      setIsSubmitting(false);
    }
  };

 return (
   <div className="min-h-screen bg-white pt-24 py-6">
     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
       <div className="text-center mb-16">
         <h1 className="text-3xl font-bold text-gray-900">ติดต่อเรา</h1>
         <div className="mt-4 h-0.5 w-16 bg-orange-500 mx-auto"></div>
       </div>

       {/* Contact Form Section */}
       <div className="max-w-4xl mx-auto mb-16">
         <div className="bg-gradient-to-br from-orange-50 to-white p-8 rounded-xl shadow-lg border border-orange-100">
           <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
             <FaEnvelope className="text-orange-500 mr-3" />
             ส่งข้อความถึงเรา
           </h2>

           {submitStatus && (
             <div className={`mb-6 p-4 rounded-lg ${
               submitStatus.type === 'success'
                 ? 'bg-green-100 text-green-800 border border-green-300'
                 : 'bg-red-100 text-red-800 border border-red-300'
             }`}>
               {submitStatus.message}
             </div>
           )}

           <form onSubmit={handleSubmit} className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                 <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                   ชื่อ-นามสกุล <span className="text-red-500">*</span>
                 </label>
                 <div className="relative">
                   <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                   <input
                     type="text"
                     id="name"
                     name="name"
                     value={formData.name}
                     onChange={handleChange}
                     required
                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                     placeholder="กรอกชื่อของคุณ"
                   />
                 </div>
               </div>

               <div>
                 <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                   อีเมล <span className="text-red-500">*</span>
                 </label>
                 <div className="relative">
                   <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                   <input
                     type="email"
                     id="email"
                     name="email"
                     value={formData.email}
                     onChange={handleChange}
                     required
                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                     placeholder="example@email.com"
                   />
                 </div>
               </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                 <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                   เบอร์โทรศัพท์
                 </label>
                 <div className="relative">
                   <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                   <input
                     type="tel"
                     id="phone"
                     name="phone"
                     value={formData.phone}
                     onChange={handleChange}
                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                     placeholder="08x-xxx-xxxx"
                   />
                 </div>
               </div>

               <div>
                 <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                   หัวข้อ <span className="text-red-500">*</span>
                 </label>
                 <input
                   type="text"
                   id="subject"
                   name="subject"
                   value={formData.subject}
                   onChange={handleChange}
                   required
                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                   placeholder="เรื่องที่ต้องการติดต่อ"
                 />
               </div>
             </div>

             <div>
               <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                 ข้อความ <span className="text-red-500">*</span>
               </label>
               <textarea
                 id="message"
                 name="message"
                 value={formData.message}
                 onChange={handleChange}
                 required
                 rows={6}
                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                 placeholder="กรุณาระบุรายละเอียดที่ต้องการติดต่อ"
               />
             </div>

             <div className="flex justify-end">
               <button
                 type="submit"
                 disabled={isSubmitting}
                 className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white font-medium px-8 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 <FaPaperPlane />
                 <span>{isSubmitting ? 'กำลังส่ง...' : 'ส่งข้อความ'}</span>
               </button>
             </div>
           </form>
         </div>
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