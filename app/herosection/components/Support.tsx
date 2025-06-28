import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FaNewspaper, FaFileInvoice, FaProjectDiagram } from 'react-icons/fa'


export default function Support() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12"> {/* ลดขนาดพื้นที่โดยรวม */}
      {/* Header Section */}
      <div className="text-center mb-12"> {/* ลด margin */}
        <div className="relative inline-block">
          <Image
            src="/images/sdn.png"
            alt="SDN Thailand Logo"
            width={120} 
            height={120}
            className="mx-auto"
            priority
          />
        </div>
        <h2 className="mt-6 text-2xl font-bold text-gray-900 mb-2"> {/* ลดขนาดหัวข้อ */}
          สำนักงานเครือข่ายองค์กรงดเหล้า
        </h2>
        <p className="text-gray-600">
          StopDrink Network Thailand
        </p>
      </div>
 
      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="https://support.sdnthailand.com/support"
          className="group bg-white rounded-xl p-6 hover:shadow-md transition-all duration-300"
        >
          <div className="flex flex-col items-center text-center">
            <div className="mb-4">
              <FaNewspaper className="text-4xl text-orange-500" /> {/* ไอคอนใหญ่ขึ้น */}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              ขอสื่อรณรงค์
            </h3>
            <p className="text-sm text-gray-600">
              ต้องการสื่อเพื่อสนับสนุนโครงการรณรงค์
            </p>
          </div>
        </Link>
 
        <Link
          href="https://support.sdnthailand.com/procurement"
          className="group bg-white rounded-xl p-6 hover:shadow-md transition-all duration-300"
        >
          <div className="flex flex-col items-center text-center">
            <div className="mb-4">
              <FaFileInvoice className="text-4xl text-orange-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              ประกาศจัดซื้อจัดจ้าง
            </h3>
            <p className="text-sm text-gray-600">
              ดูรายการประกาศจัดซื้อจัดจ้างล่าสุด
            </p>
          </div>
        </Link>
 
        <Link
          href="/project2020"
          className="group bg-white rounded-xl p-6 hover:shadow-md transition-all duration-300"
        >
          <div className="flex flex-col items-center text-center">
            <div className="mb-4">
              <FaProjectDiagram className="text-4xl text-orange-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              สรุปผลโครงการปี 2563
            </h3>
            <p className="text-sm text-gray-600">
              ดูรายละเอียดสรุปผลโครงการประจำปี 2563
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
 }