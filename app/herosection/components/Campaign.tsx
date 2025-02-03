'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Campaign() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const campaigns = [
    {
      id: '1',
      desktopImage: '/campaign/4-2-2558.webp',
      mobileImage: '/campaign/4-2-2558.webp',
      title: '4 February 2025 Campaign'
    },
    {
      id: '2',
      desktopImage: '/campaign/22.svg',
      mobileImage: '/campaign/22.svg',
      title: 'Campaign 22'
    }
  ];

  useEffect(() => {
    setIsLoaded(true);

    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % campaigns.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full">
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex gap-2">
        {campaigns.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300
              ${currentImage === index ? 'bg-orange-500 scale-110' : 'bg-gray-300 hover:bg-gray-400'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Large Screen Images */}
      <div className="hidden md:block relative w-full h-[630px]">
        {campaigns.map((campaign, index) => (
          <div
            key={campaign.id}
            className={`absolute inset-0 transition-all duration-1000 ease-out transform
              ${currentImage === index ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
          >
            <div 
              className={`w-full h-full transition-all duration-1000 ease-out transform
                ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
            >
              <Image
                src={campaign.desktopImage}
                alt={campaign.title}
                fill
                priority
                className="object-cover object-center"
                sizes="100vw"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Screen Images */}
      <div className="block md:hidden relative w-full h-[400px]">
        {campaigns.map((campaign, index) => (
          <div
            key={campaign.id}
            className={`absolute inset-0 transition-all duration-1000 ease-out transform
              ${currentImage === index ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
          >
            <div 
              className={`w-full h-full transition-all duration-1000 ease-out transform
                ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
            >
              <Image
                src={campaign.mobileImage}
                alt={campaign.title}
                fill
                priority
                className="object-cover object-center"
                sizes="100vw"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => setCurrentImage((prev) => (prev - 1 + campaigns.length) % campaigns.length)}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      
      <button
        onClick={() => setCurrentImage((prev) => (prev + 1) % campaigns.length)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </section>
  );
}