import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FaNewspaper, FaFileInvoice, FaProjectDiagram } from 'react-icons/fa'
import type { IconType } from 'react-icons'

interface ServiceItem {
  href: string
  icon: IconType
  title: string
  description: string
}

const services: ServiceItem[] = [
  {
    href: 'https://support.sdnthailand.com/support',
    icon: FaNewspaper,
    title: 'ขอสื่อรณรงค์',
    description: 'ต้องการสื่อเพื่อสนับสนุนโครงการรณรงค์',
  },
  {
    href: 'https://support.sdnthailand.com/procurement',
    icon: FaFileInvoice,
    title: 'ประกาศจัดซื้อจัดจ้าง',
    description: 'ดูรายการประกาศจัดซื้อจัดจ้างล่าสุด',
  },
  {
    href: '/project2020',
    icon: FaProjectDiagram,
    title: 'สรุปผลโครงการปี 2563',
    description: 'ดูรายละเอียดสรุปผลโครงการประจำปี 2563',
  },
]

export default function Support() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <Image
          src="/images/sdn.png"
          alt="โลโก้ สำนักงานเครือข่ายองค์กรงดเหล้า"
          width={120}
          height={120}
          className="mx-auto"
          priority
        />
        <h2 className="mt-6 text-2xl font-bold text-gray-900 mb-2">
          สำนักงานเครือข่ายองค์กรงดเหล้า
        </h2>
        <p className="text-gray-600">StopDrink Network Thailand</p>
      </div>

      {/* Services */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map(({ href, icon: Icon, title, description }) => (
          <Link
            key={href}
            href={href}
            className="group flex flex-col items-center rounded-xl border border-gray-100 bg-white p-6 text-center shadow-sm ring-1 ring-black/[0.03] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#ff7834]/30 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7834]/50 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#ff7834]/10 transition-colors duration-300 group-hover:bg-[#ff7834]/15">
              <Icon className="text-3xl text-[#ff7834]" />
            </span>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
