'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Campaign() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const campaigns = [
    {
      id: '1',
      desktopImage: '/campaign/Champions1.jpg',
      mobileImage: '/campaign/Champions1.jpg',
      title: 'Campaign SDN Futsal No L CUP',
      link: 'https://web.facebook.com/sdnfutsalNoL'
    },
    {
      id: '2',
      desktopImage: '/campaign/songkran3.svg',
      mobileImage: '/campaign/songkran3.svg',
      title: 'สุขสันต์วันสงกรานต์',
      link: 'https://www.facebook.com/profile.php?id=100077226455080'
    },
    {
      id: '3',
      desktopImage: '/campaign/cancer.jpg',
      mobileImage: '/campaign/cancermobile.jpg',
      title: 'Campaign Artboard 1',
      link: 'https://sdnthailand.com/sdnblog/36054'
    },
    {
      id: '4',
      desktopImage: '/campaign/PM 2.5.jpg',
      mobileImage: '/campaign/pm2.5.jpg',
      title: 'ฝุ่น PM 2.5 ภัยเงียบที่คร่าชีวิตคนไทย',
      link: 'https://sdnthailand.com/sdnblog/36084'
    },
    {
      id: '5',
      desktopImage: '/campaign/muhamud-ruesao.jpg',
      mobileImage: '/campaign/muhamud-ruesao.jpg',
      title: 'Muhamud Ruesao',
      link: 'https://sdnthailand.com/sdnblog/36330'
    },
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
            <a href={campaign.link} className="block w-full h-full">
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
            </a>
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
            <a href={campaign.link} className="block w-full h-full">
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
            </a>
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