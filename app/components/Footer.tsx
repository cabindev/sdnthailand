import Link from 'next/link'
import Image from 'next/image'

const quickLinks = [
  { label: 'บทความ', href: '/sdnblog' },
  { label: 'ข่าวสาร', href: '/sdnpost' },
  { label: 'วิดีโอ', href: '/video' },
  { label: 'เว็บไซต์หลัก', href: 'https://sdnthailand.com', external: true },
  { label: 'ติดต่อเรา', href: '/about/contact' },
]

const socials = [
  {
    label: 'Facebook',
    href: 'https://web.facebook.com/StopdrinkOfficial',
    path: 'M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z',
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@stopdrinkofficial5134',
    path: 'M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z',
  },
]

export default function Footer() {
  return (
    <footer className="mt-auto bg-[#1a1a1a] text-white/70">
      {/* Brand accent rule */}
      <div className="h-1 w-full bg-gradient-to-r from-[#ff7834] via-[#ff7834] to-[#ff7834]/30" />

      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-12">
          {/* Brand */}
          <div className="space-y-5 sm:col-span-2 lg:col-span-5">
            <div className="flex items-start gap-4">
              <Image
                src="/logo.png"
                alt="โลโก้ SDN Thailand"
                width={56}
                height={56}
                className="h-14 w-14 flex-shrink-0 rounded-full"
              />
              <div>
                <h3 className="text-xl font-semibold leading-snug text-white">
                  สำนักงานเครือข่ายองค์กรงดเหล้า
                </h3>
                <p className="mt-0.5 text-sm font-medium text-[#ff7834]">SDN Thailand</p>
              </div>
            </div>
            <p className="max-w-md text-[15px] leading-relaxed text-white/65">
              ขับเคลื่อนสังคมปลอดเครื่องดื่มแอลกอฮอล์ด้วยข้อมูล ความรู้
              และกิจกรรมสร้างสรรค์ ดำเนินการภายใต้มูลนิธิวิถีสุข
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-4">
            <h4 className="text-base font-semibold text-white">ติดต่อสำนักงาน</h4>
            <div className="flex items-start gap-3">
              <svg
                className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#ff7834]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <address className="text-[15px] not-italic leading-relaxed text-white/70">
                110/287-288 ม.6 ซอยโพธิ์แก้ว แยก 4<br />
                ถ.โพธิ์แก้ว แขวงคลองกุ่ม เขตบึงกุ่ม<br />
                กรุงเทพมหานคร 10240
              </address>
            </div>
            <a
              href="tel:+6629483300"
              className="group flex items-center gap-3 text-[15px] text-white/70 transition-colors hover:text-[#ff7834] focus-visible:text-[#ff7834] focus-visible:outline-none"
            >
              <svg
                className="h-5 w-5 flex-shrink-0 text-[#ff7834]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              02-948-3300
            </a>
          </div>

          {/* Quick links */}
          <div className="space-y-4 lg:col-span-3">
            <h4 className="text-base font-semibold text-white">ลิงก์ด่วน</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="group inline-flex items-center gap-2 text-[15px] text-white/70 transition-colors hover:text-[#ff7834] focus-visible:text-[#ff7834] focus-visible:outline-none"
                  >
                    <span className="h-px w-3 bg-[#ff7834]/50 transition-all duration-300 group-hover:w-5 group-hover:bg-[#ff7834] motion-reduce:transition-none" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="pt-2">
              <p className="mb-3 text-base font-semibold text-white">ติดตามเรา</p>
              <div className="flex gap-3">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/80 ring-1 ring-white/10 transition-colors hover:bg-[#ff7834] hover:text-white hover:ring-[#ff7834] focus-visible:bg-[#ff7834] focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7834] motion-reduce:transition-none"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d={social.path} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-8 text-sm text-white/50 sm:flex-row">
          <p>
            © {new Date().getFullYear()} สำนักงานเครือข่ายองค์กรงดเหล้า (SDN Thailand)
          </p>
          <p>สงวนลิขสิทธิ์ทุกประการ</p>
        </div>
      </div>
    </footer>
  )
}
