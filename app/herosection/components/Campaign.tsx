'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';

export default function Campaign() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

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

  ];

  // Handle auto-slide functionality
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % campaigns.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [campaigns.length, isPlaying]);

  // Set loading state
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Navigation functions
  const goToSlide = useCallback((index: number) => {
    setCurrentImage(index);
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentImage((prev) => (prev - 1 + campaigns.length) % campaigns.length);
  }, [campaigns.length]);

  const goToNext = useCallback(() => {
    setCurrentImage((prev) => (prev + 1) % campaigns.length);
  }, [campaigns.length]);

  const togglePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === ' ') {
        e.preventDefault();
        togglePlayPause();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrevious, goToNext, togglePlayPause]);

  return (
    <section className="relative w-full">
      {/* Desktop Images - 1920x630px */}
      <div className="hidden md:block relative w-full h-[630px]">
        {campaigns.map((campaign, index) => (
          <div
            key={campaign.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out
              ${currentImage === index ? 'opacity-100' : 'opacity-0'}`}
          >
            <a href={campaign.link} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
              <Image
                src={campaign.desktopImage}
                alt={campaign.title}
                fill
                priority={index === 0}
                className="object-cover object-center"
                sizes="100vw"
              />
            </a>
          </div>
        ))}
      </div>

      {/* Mobile Images */}
      <div className="block md:hidden relative w-full h-[400px]">
        {campaigns.map((campaign, index) => (
          <div
            key={campaign.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out
              ${currentImage === index ? 'opacity-100' : 'opacity-0'}`}
          >
            <a href={campaign.link} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
              <Image
                src={campaign.mobileImage}
                alt={campaign.title}
                fill
                priority={index === 0}
                className="object-cover object-center"
                sizes="100vw"
              />
            </a>
          </div>
        ))}
      </div>

      {/* Microsoft-style Navigation - Desktop (ลดขนาดและ padding) */}
      <div className="hidden md:flex items-center justify-center bg-white py-3 px-8 border-t border-gray-100/50">
        
        {/* Pause/Play Button - เล็กลง */}
        <button
          onClick={togglePlayPause}
          className="w-7 h-7 flex items-center justify-center text-gray-700 hover:text-gray-900 
            hover:bg-gray-100 rounded-full transition-all duration-200 mr-3"
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

        {/* Previous Button - เล็กลง */}
        <button
          onClick={goToPrevious}
          className="w-7 h-7 flex items-center justify-center text-gray-700 hover:text-gray-900 
            hover:bg-gray-100 rounded-full transition-all duration-200 mr-3"
          aria-label="Previous slide"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Dots Navigation - Microsoft Style (เล็กมาก) */}
        <div className="flex items-center space-x-1.5 mx-4">
          {campaigns.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full
                ${currentImage === index 
                  ? 'w-4 h-4 bg-gray-900' 
                  : 'w-2.5 h-2.5 bg-gray-400 hover:bg-gray-600'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            >
              <span className="sr-only">Slide {index + 1}</span>
            </button>
          ))}
        </div>

        {/* Next Button - เล็กลง */}
        <button
          onClick={goToNext}
          className="w-7 h-7 flex items-center justify-center text-gray-700 hover:text-gray-900 
            hover:bg-gray-100 rounded-full transition-all duration-200 ml-3"
          aria-label="Next slide"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Mobile Navigation - เล็กลงและลด padding */}
      <div className="block md:hidden bg-white py-2 border-t border-gray-100/50">
        <div className="flex items-center justify-center space-x-2">
          
          {/* Previous Button - เล็กลง */}
          <button
            onClick={goToPrevious}
            className="w-6 h-6 flex items-center justify-center text-gray-700 hover:text-gray-900 
              hover:bg-gray-100 rounded-full transition-all duration-200"
            aria-label="Previous slide"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Play/Pause Button - เล็กลง */}
          <button
            onClick={togglePlayPause}
            className="w-8 h-8 flex items-center justify-center text-gray-700 hover:text-gray-900 
              hover:bg-gray-100 rounded-full transition-all duration-200 border border-gray-200"
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

          {/* Dots Navigation - เล็กมาก */}
          <div className="flex items-center space-x-1 mx-2">
            {campaigns.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full
                  ${currentImage === index 
                    ? 'w-3 h-3 bg-gray-900' 
                    : 'w-2 h-2 bg-gray-400 hover:bg-gray-600'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              >
                <span className="sr-only">Slide {index + 1}</span>
              </button>
            ))}
          </div>

          {/* Next Button - เล็กลง */}
          <button
            onClick={goToNext}
            className="w-6 h-6 flex items-center justify-center text-gray-700 hover:text-gray-900 
              hover:bg-gray-100 rounded-full transition-all duration-200"
            aria-label="Next slide"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}