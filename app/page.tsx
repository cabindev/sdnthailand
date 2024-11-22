// app/page.tsx
import Link from "next/link";
import Image from "next/image";
import { FaNewspaper, FaFileInvoice, FaProjectDiagram } from "react-icons/fa";
import HomeProject2020 from "./project2020/page";
import PopularNews from "./sdnpost/components/PopularNews";
import Footer from "./components/Footer";
import Maintenance from "./maintenance/page";

export default function Home() {
return (
  <div className="min-h-screen bg-white pt-4">
    <main className="pt-16 sm:pt-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-24">
          <Maintenance />
        </div>
      {/* <PopularNews/> */}
      {/* Hero Section */}
      <div className="relative pb-16 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <Image
              src="/images/sdn.png"
              alt="SDN Thailand Logo"
              width={120}
              height={120}
              className="mx-auto"
              priority
            />
            <div>
              <h3 className="text-2xl sm:text-4xl font-bold text-gray-900">
                สำนักงานเครือข่ายองค์กรงดเหล้า
              </h3>
              <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              SDN Thailand
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <Link
            href="/support"
            className="group bg-white border border-gray-200 rounded-xl p-6 sm:p-8 hover:border-orange-500 hover:shadow-md transition-all duration-200"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 bg-orange-50 rounded-full group-hover:bg-orange-100 transition-colors">
                <FaNewspaper className="text-2xl sm:text-3xl text-orange-500" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                ขอสื่อรณรงค์
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                ต้องการสื่อเพื่อสนับสนุนโครงการรณรงค์
              </p>
            </div>
          </Link>

          <Link
            href="/procurement"
            className="group bg-white border border-gray-200 rounded-xl p-6 sm:p-8 hover:border-orange-500 hover:shadow-md transition-all duration-200"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 bg-orange-50 rounded-full group-hover:bg-orange-100 transition-colors">
                <FaFileInvoice className="text-2xl sm:text-3xl text-orange-500" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                ประกาศจัดซื้อจัดจ้าง
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                ดูรายการประกาศจัดซื้อจัดจ้างล่าสุด
              </p>
            </div>
          </Link>

          <Link
            href="/project2020"
            className="group bg-white border border-gray-200 rounded-xl p-6 sm:p-8 hover:border-orange-500 hover:shadow-md transition-all duration-200"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 bg-orange-50 rounded-full group-hover:bg-orange-100 transition-colors">
                <FaProjectDiagram className="text-2xl sm:text-3xl text-orange-500" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                สรุปผลโครงการปี 2563
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                ดูรายละเอียดสรุปผลโครงการประจำปี 2563
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Project2020 Preview Section */}
      <div className="bg-gray-50 py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <HomeProject2020 />
          </div> */}
        </div>
      </div>

   
    </main>
    <Footer/>
  </div>
);
}