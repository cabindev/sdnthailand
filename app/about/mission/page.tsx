"use client";

import Image from "next/image";

export default function Mission() {
 return (
   <div className="min-h-screen bg-white pt-24">
     {/* Hero Section */}
     <div className="relative overflow-hidden bg-gradient-to-r from-orange-50 to-orange-100 py-16">
       <div className="container mx-auto px-4">
         <div className="flex flex-col items-center text-center">
           <Image
             src="/images/logoสคล.png"
             alt="Logo"
             width={120}
             height={120}
             className="mb-8"
           />
           <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
             เราเกิดมาเพื่ออะไร และอะไรคือเป้าหมายของเรา
           </h1>
           <div className="h-1 w-24 bg-orange-500 mx-auto"></div>
         </div>
       </div>
     </div>

     {/* Main Content */}
     <div className="container mx-auto px-4 py-16">
       <div className="max-w-3xl mx-auto space-y-12">
         {/* Mission Section */}
         <section className="space-y-4">
           <h2 className="text-2xl font-medium text-orange-500">Mission</h2>
           <p className="text-gray-600 leading-relaxed">
             ขององค์กร สคล.(เราเกิดมาเพื่อสิ่งนี้) : มุ่งมั่นในการริเริ่ม พัฒนา
             พาทํา สนับสนุน เอื้ออํานวย การทํางานของสมาชิก (Member centric)
           </p>
         </section>

         {/* Vision Section */}
         <section className="space-y-4">
           <h2 className="text-2xl font-medium text-orange-500">Vision</h2>
           <p className="text-gray-600 leading-relaxed">
             เป็นองค์กรภาคประชาสังคม ที่มีฐานเครือข่ายเข้มแข็ง
             สมาชิกเครือข่ายเป็นเสาหลักแก้ปัญหาในพื้นที่ เป็นที่ยอมรับ
             และมุ่งมั่นทําประโยชน์เพื่อส่วนรวมอย่างจริงจัง ไม่ย่อท้อ
             และมีความสุข
           </p>
         </section>

         {/* Slogan Section */}
         <section className="space-y-4">
           <h2 className="text-2xl font-medium text-orange-500">Slogan</h2>
           <div className="bg-orange-50 p-6 rounded-lg border border-orange-100">
             <p className="text-lg text-orange-700 font-medium text-center italic">
               "พลังเครือข่าย สานสุขทั่วไทย ปลอดภัยปลอดเหล้า"
             </p>
           </div>
           <div className="mt-6 text-gray-600 leading-relaxed space-y-4">
             <p>
               "พลังเครือข่าย คือ สมาชิกเครือข่ายงดเหล้าทั่วประเทศทุกระดับ
               ทุกประเภท ทุกเพศ ทุกวัย ที่มีความเข้มแข็ง
               มีความเป็นเจ้าของปัญหามุ่งมั่นที่จะแก้ปัญหาในพื้นที่ของตนเอง"
             </p>
             <p>
               "และขยายสมาชิกและพื้นที่งานออกไปอย่างกว้างขวาง
               ประสานความร่วมมือกับหน่วยงาน องค์กรต่างๆ จนเกิดมีความสําเร็จเล็กๆ
               สะสมจนขยับเป็นความสําเร็จที่ใหญ่ขึ้น ทั้งด้าน ลดปัจจัยเสี่ยง
               เพิ่มปัจจัยสร้าง ในหลากหลายบริบท"
             </p>
             <p>
               "สานสุขทั่วไทยปลอดภัยปลอดเหล้า คือ ผลความสําเร็จของการทํางานของ
               พลังเครือข่าย ซึ่งเป็นผลรวมจากความพยายามร่วมกันของสมาชิกเครือข่าย
               หน่วยงาน และองค์กรต่างๆ ที่มีเจตนารมย์การทํางานร่วมกัน"
             </p>
           </div>
         </section>
       </div>
     </div>
   </div>
 );
}