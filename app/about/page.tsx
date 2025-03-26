// app/sdninfo/page.tsx
'use client';

import Link from "next/link";
import { FaUsers, FaBullseye, FaFileAlt, FaProjectDiagram, FaPhone } from "react-icons/fa";
import { motion } from "framer-motion";

export default function SDNInfo() {
  const aboutLinks = [
    {
      title: "โครงสร้างองค์กร",
      description: "โครงสร้างสำนักงานเครือข่ายองค์กรงดเหล้า",
      icon: <FaUsers className="text-orange-500 text-2xl" />,
      href: "/about/chart",
      color: "bg-blue-50"
    },
    {
      title: "พันธกิจและวิสัยทัศน์",
      description: "เราเกิดมาเพื่ออะไร และอะไรคือเป้าหมายของเรา",
      icon: <FaBullseye className="text-orange-500 text-2xl" />,
      href: "/about/mission",
      color: "bg-green-50"
    },
    {
      title: "แนวคิดหลัก",
      description: "12 แนวคิดหลักของเครือข่ายงดเหล้า",
      icon: <FaFileAlt className="text-orange-500 text-2xl" />,
      href: "/about/principle",
      color: "bg-yellow-50"
    },
    {
      title: "โครงการที่ดำเนินงาน",
      description: "โครงการที่ดำเนินงานประจำปี 2567",
      icon: <FaProjectDiagram className="text-orange-500 text-2xl" />,
      href: "/about/project2567",
      color: "bg-purple-50"
    },
    {
      title: "ติดต่อเรา",
      description: "ข้อมูลการติดต่อและที่ตั้งสำนักงาน",
      icon: <FaPhone className="text-orange-500 text-2xl" />,
      href: "/about/contact",
      color: "bg-pink-50"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">เกี่ยวกับเรา</h2>
          <div className="h-1 w-24 bg-orange-500 mx-auto mt-4"></div>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            เรียนรู้เพิ่มเติมเกี่ยวกับสำนักงานเครือข่ายองค์กรงดเหล้า วิสัยทัศน์ พันธกิจ และการทำงานของเรา
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {aboutLinks.map((link, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link 
                href={link.href}
                className={`${link.color} rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md hover:scale-105 block h-full`}
              >
                <div className="flex flex-col items-center text-center h-full">
                  <div className="mb-4 p-3 rounded-full bg-white shadow-sm">{link.icon}</div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{link.title}</h3>
                  <p className="text-gray-600 text-sm">{link.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}