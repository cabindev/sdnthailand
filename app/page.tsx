import Image from "next/image";
import Link from "next/link";
import { FaNewspaper, FaHandshake, FaUser } from "react-icons/fa";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 font-[family-name:var(--font-geist-sans)]">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center">
           
            <nav className="ml-6">
              <Link href="/" className="text-gray-800 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium transition duration-300">Home</Link>
              <Link href="/support" className="text-gray-800 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium transition duration-300">Support</Link>
              <Link href="/dashboard" className="text-gray-800 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium transition duration-300">Dashboard</Link>
            </nav>
          </div>
          <div className="flex items-center">
            <FaUser className="text-gray-600 mr-2" />
            <span className="text-sm text-gray-600">John Doe</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <h1 className="text-5xl font-bold text-center text-gray-800 mb-12">Welcome to SDN Thailand</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Link href="/support" className="group">
            <div className="bg-white rounded-xl shadow-lg p-8 transition duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
              <div className="flex items-center justify-center mb-6">
                <FaNewspaper className="text-6xl text-orange-500 group-hover:text-orange-600 transition-colors duration-300" />
              </div>
              <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800 group-hover:text-orange-600 transition-colors duration-300">ขอสื่อรณรงค์</h2>
              <p className="text-gray-600 text-center">
                ต้องการสื่อเพื่อสนับสนุนโครงการรณรงค์
              </p>
            </div>
          </Link>

          <Link href="/procurement" className="group">
            <div className="bg-white rounded-xl shadow-lg p-8 transition duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
              <div className="flex items-center justify-center mb-6">
                <FaHandshake className="text-6xl text-blue-500 group-hover:text-blue-600 transition-colors duration-300" />
              </div>
              <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800 group-hover:text-blue-600 transition-colors duration-300">ประกาศจัดซื้อจัดจ้าง</h2>
              <p className="text-gray-600 text-center">
                ดูรายการประกาศจัดซื้อจัดจ้างล่าสุดและข้อมูลที่เกี่ยวข้อง
              </p>
            </div>
          </Link>
        </div>

        <div className="text-center mt-12">
          <Link
            href="https://sdnthailand.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-3 rounded-full hover:from-orange-600 hover:to-pink-600 transition duration-300 transform hover:scale-105 shadow-lg text-lg font-semibold"
          >
            SDN Thailand
          </Link>
        </div>
      </main>
    </div>
  );
}