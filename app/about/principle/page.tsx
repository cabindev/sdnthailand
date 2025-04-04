"use client";
import Image from "next/image";

export default function Principle() {
 const principles = [
   `คนดื่มแอลกอฮอล์ไม่ได้เป็นการตัดสินว่าเป็น "คนดี-คนไม่ดี" แต่พฤติกรรมการดื่มมีความเสี่ยงต่อตัวเขาเองและคนอื่น ทั้งนี้เราสามารถทํางานร่วมได้กับทุกคนและเชื่อมั่นว่าทุกคนที่มาทํางานร่วมกับเราแล้วเขาจะค่อยๆ ลดการดื่มลง`,
   "ธุรกิจที่ขายอย่างไม่รับผิดชอบ คือตัวแพร่กระจายต้นเหตุของปัญหา เป็นธุรกิจที่ไร้จริยธรรม ได้กําไรบนความทุกข์ของคน",
   "หน้าที่เราคือทําให้สังคมยอมรับว่า แอลกอฮอล์เป็นสินค้าที่สร้างปัญหา ต้องควบคุมไม่ใช่ปล่อยเสรี ไม่ใช่การห้ามขาย",
   "มีเหตุผลที่หนักแน่น คือ เพื่อประโยชน์ทางสาธารณสุข ความปลอดภัย วัฒนธรรม ประเพณีที่เหมาะสม และการคุ้มครองผู้บริโภค",
   "เชื่อมงานสุขภาพทุกมิติ ออกกําลังกาย อ้วน เบาหวาน ความดัน ไขมัน สิ่งแวดล้อม เศรษฐกิจ สังคม จากระดับชุมชนสู่ระดับโลก หรือ Alcohol in all policy โดยมีหลัก SDGs NCD Target และ Ottawa charter เป็นพื้นฐาน",
   "ใช้กระบวนการ 3 เหลี่ยมเขยื้อนภูเขา ประสานพลังภาคีเครือข่ายทุกภาคส่วน ใช้หลักปัญหาการดื่มโดยรวม ต้องแก้ไขไปพร้อมกันไม่ใช่แยกย่อยปัญหาแล้วแก้ไปทีละอย่าง",
   "ใช้งานความรู้ งานข้อมูลวิชาการ สถิติปัญหา หรือสถิติเปรียบเทียบเพื่อขยายผลเชิงนโยบาย โดยทํากิจกรรมเพื่อสรุปยกระดับ นําเสนอคืนข้อมูลแก่ฝ่ายนโยบายระดับ อําเภอ จังหวัด ภาค ประเทศ",
   `เข็มพิษที่จะทิ่มแทงหัวใจของธุรกิจแอลกอฮอล์และการตลาดของเขา คือ ปัญหาต่อคนรอบข้าง และต่อเด็กเยาวชน (ความรุนแรงในครอบครัว/ทะเลาะวิวาท/อุบัติเหตุ/ท้องไม่พร้อม/โรคเอดส์) โดยมีกองทุนช่วยเหลือผู้ได้รับผลกระทบจากน้ําเมาและเครือข่ายผู้ได้รับผลกระทบเป็นหนึ่งกลไก`,
   "ใช้ Key message เพื่อสร้างกระแสสาธารณะ ได้แก่ งานปลอดเหล้า สนุกได้ไร้แอลกอฮอล์ ของขวัญปลอดเหล้า สนุกได้ มันส์ได้ไร้แอลกอฮอล์ และเพื่อนกันมันส์โนเอล เป็นต้น",
   "มาตรการกฎหมาย เป็น Hard power (พลังแข็ง) ที่ต้องทําอย่างฉลาด ทําเป็นระบบ ใช้โอกาส จังหวะที่เหมาะสม เช่นเดียวกันกับมาตราการรณรงค์ ซึ่งเป็น Soft power (พลังอ่อน) ที่ทําเพื่อปรับเปลี่ยนทัศนคติและพฤติกรรมของผู้คนซึ่งต้องทําควบคู่กันได้",
   "กําลังนักรณรงค์คนเล็กคนน้อย กระจายอยู่ทุกหมู่บ้าน ทุกชุมชน ทุกหน่วยงาน องค์กร ทั่วประเทศ ดังนั้น ต้องสร้างนักรณรงค์เยาวชน ชมรมเยาวชน นักรณรงค์ชมรมคนหัวใจเพชร หรือจะเรียกชื่ออย่างไรก็แล้วแต่ เพราะนี่คือผู้นําการเปลี่ยนแปลงที่แท้จริง",
   "ชุมชนมีศักยภาพในการช่วยเหลือผู้ป่วยจากการดื่มสุรา เรียกว่า ชุมชนช่วยเลิก โดยประสานกับ รพ.สต. รพ.ชุมชน หรือ รพ.จังหวัด/ศูนย์ ได้"
 ];

 return (
   <div className="min-h-screen bg-white pt-24">
     {/* Hero Section */}
     <div className="relative bg-gradient-to-r from-orange-50 to-orange-100 py-16">
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
           <h1 className="text-3xl font-bold text-gray-900 mb-4 max-w-2xl mx-auto">
             12 แนวคิดหลักของเครือข่ายงดเหล้า
           </h1>
           <p className="text-gray-600 mb-4">(basic principles)</p>
           <div className="h-1 w-24 bg-orange-500 mx-auto"></div>
         </div>
       </div>
     </div>

     {/* Main Content */}
     <div className="container mx-auto px-4 py-16">
       <div className="max-w-4xl mx-auto">
         <div className="bg-white rounded-xl shadow-sm border border-gray-100">
           <div className="divide-y divide-gray-100">
             {principles.map((principle, index) => (
               <div 
                 key={index} 
                 className="p-6 hover:bg-orange-50 transition-colors duration-200"
               >
                 <div className="flex items-start space-x-4">
                   <span className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-medium text-sm">
                     {index + 1}
                   </span>
                   <p className="text-gray-600 leading-relaxed text-base">
                     {principle}
                   </p>
                 </div>
               </div>
             ))}
           </div>
         </div>
         
         {/* Footer */}
         <div className="mt-12 text-center">
           <p className="text-sm text-gray-500">
             © สำนักงานเครือข่ายองค์กรงดเหล้า
           </p>
         </div>
       </div>
     </div>
   </div>
 );
}