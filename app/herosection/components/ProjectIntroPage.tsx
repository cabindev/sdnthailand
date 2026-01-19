'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'

const IntegratedHeroSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="w-full min-h-screen bg-white">

      {/* Main Content */}
      <section className="relative min-h-screen flex items-center justify-center py-20">
        <div className="container mx-auto px-6 md:px-12 lg:px-20 max-w-7xl">

          {/* Logo - Center */}
          <div className={`flex justify-center mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="relative w-24 h-24">
              <Image
                src="/civicspace.png"
                alt="CivicSpace Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

            {/* Left Column - Content */}
            <div className={`space-y-12 transition-all duration-1000 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}>

              {/* Title */}
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                  CivicSpace
                </h1>

                <div className="space-y-4">
                  <p className="text-2xl text-gray-700 leading-relaxed">
                    แหล่งรวมข้อมูล บทความ และงานวิจัย<br />
                    เพื่อสนับสนุนการทำงานของเจ้าหน้าที่
                  </p>

                  <p className="text-xl text-gray-600 leading-relaxed">
                    พื้นที่พลเมืองร่วมหาทางออกปัญหาแอลกอฮอล์
                  </p>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2 text-gray-600">
                <p>บทความ & งานวิจัย · ความรู้เชิงลึกและข้อมูลอ้างอิง</p>
                <p>ชุมชนออนไลน์ · แลกเปลี่ยนความคิดเห็นและประสบการณ์</p>
              </div>

              {/* Links */}
              <div className="flex gap-8 text-lg">
                <a
                  href="https://civicspace.sdnthailand.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-600 hover:text-orange-700 underline underline-offset-4 transition-colors"
                >
                 CivicSpace
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=61579556311842"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-gray-900 underline underline-offset-4 transition-colors"
                >
                  Facebook
                </a>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className={`transition-all duration-1000 delay-200 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}>
              <a
                href="https://civicspace.sdnthailand.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
                aria-label="เข้าสู่ CivicSpace"
              >
                <div className="relative w-full rounded-lg overflow-hidden border border-gray-200">
                  <Image
                  src="/campaign/life.jpg"
                  alt="CivicSpace - พื้นที่พลเมือง"
                  width={2048}
                  height={2024}
                  priority
                  quality={90}
                  className="w-full h-auto object-cover hover:opacity-95 transition-opacity"
                  />
                </div>
              </a>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}

export default IntegratedHeroSection
