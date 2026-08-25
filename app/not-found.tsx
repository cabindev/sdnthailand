// app/not-found.tsx
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ไม่พบหน้าที่ต้องการ | SDN Thailand',
  robots: { index: false, follow: true },
}

const links = [
  { href: '/', label: 'หน้าแรก' },
  { href: '/sdnpost', label: 'ข่าวสาร' },
  { href: '/sdnblog', label: 'บทความ' },
  { href: '/video', label: 'วิดีโอ' },
]

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-lg mx-auto text-center">
        <p className="text-6xl font-bold text-[#ff7834]">404</p>

        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          ไม่พบหน้าที่ต้องการ
        </h1>

        <p className="mt-3 text-gray-600">
          หน้านี้อาจถูกย้าย ลบไปแล้ว หรือลิงก์ที่ใช้ไม่ถูกต้อง
        </p>

        <nav className="mt-8 flex flex-wrap justify-center gap-3">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-full border border-gray-200 px-5 py-2 text-[#c2410c] transition-colors hover:bg-[#ff7834] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff7834]"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
