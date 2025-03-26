"use client";

import React, { useEffect, useState } from 'react';

export default function LivePopup() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // แสดงป๊อปอัพหลังจากโหลดหน้าเว็บ 1 วินาที
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const closePopup = () => {
    setIsVisible(false);
  };

  // ฟังก์ชันเพื่อป้องกันการปิดป๊อปอัพเมื่อคลิกที่เนื้อหาภายใน
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (!isVisible) return null;

  return (
    // เพิ่ม onClick ที่ backdrop เพื่อให้คลิกพื้นที่ว่างแล้วปิดป๊อปอัพได้
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 perspective-1000" 
      onClick={closePopup}
    >
      {/* เพิ่ม onClick={handleContentClick} เพื่อป้องกันการปิดเมื่อคลิกที่เนื้อหา */}
      <div className="relative flex flex-col items-center popup-container" onClick={handleContentClick}>
        {/* พาร์ติเคิลรอบๆ แบบเรียบง่ายขึ้น */}
        <div className="absolute inset-0 particles-container overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div 
              key={i} 
              className="absolute w-2 h-2 rounded-full bg-blue-400 particle-simple"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            ></div>
          ))}
        </div>
        
        {/* โลโก้ที่ไม่มีวงกลมล้อมรอบ */}
        <div className="w-64 h-64 md:w-80 md:h-80 flex-shrink-0 z-10 relative">
          <div className="absolute inset-0 logo-flare-simple"></div>
          <img 
            src="/campaign/songkran.png" 
            alt="Songkran" 
            className="w-full h-full object-contain logo-simple"
          />
        </div>
        
        {/* ข้อความด้านล่าง */}
        <div className="text-center mt-6 z-10 fade-in">
          <p className="text-white text-xl font-medium mb-2">
            ติดตามได้ที่ 
            <a href="https://www.facebook.com/profile.php?id=100077226455080" 
               className="text-blue-300 font-bold mx-1 hover:text-blue-200 transition-colors duration-300">
              Facebook
            </a>
          </p>
        </div>
        
        {/* ปุ่มปิด */}
        <button 
          onClick={closePopup}
          className="absolute top-3 right-3 text-white rounded-full p-3 shadow-lg z-50 transform hover:scale-110 transition-all duration-300"
          aria-label="Close popup"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
          </svg>
        </button>
      </div>
      
      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .popup-container {
          animation: fade-in-scale 0.5s ease forwards;
        }
        
        .logo-simple {
          animation: smooth-float 5s ease-in-out infinite;
          filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.5));
        }
        
        .logo-flare-simple {
          background-size: 200% 200%;
          animation: simple-flare 8s ease-in-out infinite;
          mix-blend-mode: overlay;
          z-index: 15;
        }
        
        .particle-simple {
          opacity: 0.5;
          animation: simple-float 6s infinite ease-in-out;
        }
        
        .fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        
        @keyframes fade-in-scale {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        
        @keyframes smooth-float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes simple-flare {
          0%, 100% {
            background-position: 0% 50%;
            opacity: 0.1;
          }
          50% {
            background-position: 100% 50%;
            opacity: 0.5;
          }
        }
        
        @keyframes simple-float {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          20% {
            opacity: 0.5;
          }
          80% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(-50px) translateX(20px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}