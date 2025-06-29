'use client'

import React, { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import { Users, Award, Heart, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react'

const IntegratedHeroSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)
  
  // Campaign carousel states
  const [currentImage, setCurrentImage] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  const campaigns = [
    {
      id: '1',
      desktopImage: '/campaign/publictv.jpeg',
      mobileImage: '/campaign/type public.jpg',
      title: 'Campaign',
      link: 'https://sdnthailand.com/sdnblog/36837'
    },
    {
      id: '2',
      desktopImage: '/campaign/durain+drinker_TV.jpeg',
      mobileImage: '/campaign/durain+drinker.jpg',
      title: 'ทุเรียนกับแอลกอฮอล์ อันตรายถึงชีวิต',
      link: 'https://sdnthailand.com/sdnblog/36832'
    },
    {
      id: '3',
      desktopImage: '/campaign/rip1.png',
      mobileImage: '/campaign/rip1.jpg',
      title: 'ค่าใช้จ่ายในงานศพ',
      link: 'https://sdnthailand.com/sdnblog/36644'
    },
    {
      id: '4',
      desktopImage: '/campaign/register.png',
      mobileImage: '/campaign/regist-mobile.png',
      title: 'ลงทะเบียนเลิกแอลกอฮอล์',
      link: 'https://noalcohol.ddc.moph.go.th/'
    },
  ]

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Campaign carousel auto-slide
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % campaigns.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [campaigns.length, isPlaying])

  // Navigation functions
  const goToSlide = useCallback((index: number) => {
    setCurrentImage(index)
  }, [])

  const goToPrevious = useCallback(() => {
    setCurrentImage((prev) => (prev - 1 + campaigns.length) % campaigns.length)
  }, [campaigns.length])

  const goToNext = useCallback(() => {
    setCurrentImage((prev) => (prev + 1) % campaigns.length)
  }, [campaigns.length])

  const togglePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev)
  }, [])

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-orange-50/20 relative overflow-hidden">
      
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-amber-100/40 to-orange-100/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-l from-stone-100/40 to-amber-100/40 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-10 right-20 opacity-20">
        <Sparkles className="w-8 h-8 text-amber-400 animate-bounce" />
      </div>
      <div className="absolute bottom-40 left-20 opacity-20">
        <Sparkles className="w-6 h-6 text-orange-400 animate-bounce delay-500" />
      </div>

      {/* Main Content Grid */}
      <section className="relative z-10 min-h-screen py-12">
        <div className="container mx-auto px-8 lg:px-12 max-w-7xl h-full">
          
          {/* Center Logo */}
          <div className={`flex justify-center mb-8 lg:mb-12 transition-all duration-1000 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <div className="relative w-28 h-28 lg:w-36 lg:h-36">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-200 to-orange-200 rounded-full blur-xl opacity-30 animate-pulse"></div>
              <div className="relative w-full h-full">
                <Image
                  src="/Buddhist-lent.png"
                  alt="Buddhist Lent Project Logo"
                  fill
                  className="object-contain drop-shadow-lg"
                  priority
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column - Main Content */}
            <div className={`space-y-6 transition-all duration-1000 delay-200 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              
              {/* Project Title */}
              <div>
                <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-stone-800 via-stone-700 to-amber-700 bg-clip-text text-transparent mb-4 leading-tight">
                  โครงการฤดูกาลฝึกสติและรณรงค์งดเหล้าเข้าพรรษา
                </h1>
                <p className="text-lg lg:text-xl text-orange-600 font-medium mb-6 relative">
                  ภายใต้แนวคิด "มีสติ มีสุข ทุกโอกาส"
                  <span className="absolute -bottom-2 left-0 w-20 h-0.5 bg-gradient-to-r from-orange-400 to-transparent"></span>
                </p>
              </div>
              
              {/* Inspirational Quote */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <p className="text-lg lg:text-xl leading-relaxed text-stone-700 mb-3 font-light italic">
                  "เสียงระฆังแห่งการเตือนตัวเอง ได้เวลาฝึกสติ และงดเหล้าเข้าพรรษาแล้ว!"
                </p>
                <p className="text-sm text-stone-600 font-light">
                  ร่วมเป็นส่วนหนึ่งของการสร้างสังคมที่มีสุขภาพดี และค่านิยมที่ดีงาม
                </p>
              </div>



              {/* Call to Action */}
              <div className={`space-y-4 transition-all duration-1000 delay-500 transform ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}>
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Primary Button */}
                  <div className="relative inline-block group">
                    <a
                      href="https://noalcohol.ddc.moph.go.th/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative inline-flex items-center bg-gradient-to-r from-amber-500 to-orange-500 hover:from-orange-400 hover:to-amber-400 text-white font-semibold py-2 px-5 rounded-xl transition-all duration-300 hover:scale-105 group text-sm"
                    >
                      เข้าร่วมโครงการ
                    </a>
                  </div>

                  {/* Secondary Button */}
                  <div className="relative inline-block group">
                    <a
                      href="https://healthy-sobriety.sdnthailand.com/Buddhist-Lent"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center bg-white hover:bg-stone-50 text-stone-700 hover:text-stone-900 font-medium py-2 px-5 rounded-xl border border-stone-200 hover:border-stone-300 transition-all duration-300 hover:scale-105 group shadow-sm text-sm"
                    >
                      <Award className="w-4 h-4 mr-2 text-amber-500" />
                      เรียนรู้เพิ่มเติม
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Campaign Carousel */}
            <div className={`transition-all duration-1000 delay-400 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              
              {/* Campaign Images */}
              <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 mb-3 rounded-lg overflow-hidden">
                {campaigns.map((campaign, index) => {
                  const isActive = currentImage === index;
                  return (
                    <div
                      key={`campaign-${campaign.id}-${index}`}
                      className={`absolute inset-0 transition-opacity duration-500 ease-in-out
                        ${isActive ? 'opacity-100' : 'opacity-0'}`}
                      style={{ zIndex: isActive ? 10 : 1 }}
                    >
                      <a 
                        href={campaign.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="block w-full h-full cursor-pointer"
                        onClick={(e) => {
                          console.log(`Clicking campaign ${index + 1}: ${campaign.title} -> ${campaign.link}`);
                        }}
                      >
                        {/* Desktop Image */}
                        <div className="hidden md:block w-full h-full">
                          <Image
                            src={campaign.desktopImage}
                            alt={campaign.title}
                            fill
                            priority={index === 0}
                            quality={100}
                            unoptimized={true}
                            className="object-cover object-center hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 1024px) 50vw, 40vw"
                          />
                        </div>
                        {/* Mobile Image */}
                        <div className="block md:hidden w-full h-full">
                          <Image
                            src={campaign.mobileImage}
                            alt={campaign.title}
                            fill
                            priority={index === 0}
                            quality={100}
                            unoptimized={true}
                            className="object-cover object-center hover:scale-105 transition-transform duration-300"
                            sizes="100vw"
                          />
                        </div>
                      </a>
                    </div>
                  );
                })}
              </div>

              {/* Campaign Navigation */}
              <div className="flex items-center justify-center py-2 px-2">
                
                {/* Pause/Play Button */}
                <button
                  onClick={togglePlayPause}
                  className="w-7 h-7 flex items-center justify-center text-stone-600 hover:text-stone-800 
                    hover:bg-stone-100 rounded-full transition-all duration-200 mr-2"
                  aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
                >
                  {isPlaying ? (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <rect x="6" y="4" width="4" height="16" />
                      <rect x="14" y="4" width="4" height="16" />
                    </svg>
                  ) : (
                    <svg className="w-3 h-3 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <polygon points="5,3 19,12 5,21" />
                    </svg>
                  )}
                </button>

                {/* Previous Button */}
                <button
                  onClick={goToPrevious}
                  className="w-7 h-7 flex items-center justify-center text-stone-600 hover:text-stone-800 
                    hover:bg-stone-100 rounded-full transition-all duration-200 mr-2"
                  aria-label="Previous slide"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Dots Navigation */}
                <div className="flex items-center space-x-1.5 mx-3">
                  {campaigns.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`transition-all duration-300 rounded-full
                        ${currentImage === index 
                          ? 'w-4 h-4 bg-stone-900' 
                          : 'w-2.5 h-2.5 bg-stone-400 hover:bg-stone-600'
                        }`}
                      aria-label={`Go to slide ${index + 1}`}
                    >
                      <span className="sr-only">Slide {index + 1}</span>
                    </button>
                  ))}
                </div>

                {/* Next Button */}
                <button
                  onClick={goToNext}
                  className="w-7 h-7 flex items-center justify-center text-stone-600 hover:text-stone-800 
                    hover:bg-stone-100 rounded-full transition-all duration-200 ml-2"
                  aria-label="Next slide"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default IntegratedHeroSection