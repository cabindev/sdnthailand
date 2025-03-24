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

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 perspective-1000">
      <div className="relative flex flex-col items-center">
        {/* พาร์ติเคิลรอบๆ */}
        <div className="absolute inset-0 particles-container overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div 
              key={i} 
              className="absolute w-2 h-2 rounded-full bg-blue-400 particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 10}s`
              }}
            ></div>
          ))}
        </div>
        
        {/* โลโก้ที่ไม่มีวงกลมล้อมรอบ */}
        <div className="w-64 h-64 md:w-80 md:h-80 flex-shrink-0 z-10 relative">
          <div className="absolute inset-0 logo-flare"></div>
          <img 
            src="/campaign/Logo Futsal.png" 
            alt="SDN Futsal No-L Cup" 
            className="w-full h-full object-contain logo-3d"
          />
        </div>
        
        {/* ข้อความด้านล่าง */}
        <div className="text-center mt-6 z-10">
        <p className="text-white text-xl font-medium mb-2 cyberpunk-text">
            ติดตามได้ที่ 
            <a href="https://web.facebook.com/sdnfutsalNoL" className="text-blue-300 font-bold mx-1 glitch-text" data-text="sdnfutsalNoL">sdnfutsalNoL</a> 
            และ 
            <a href="https://web.facebook.com/ThaiPBS" className="text-blue-300 font-bold mx-1 glitch-text" data-text="Thai PBS">Thai PBS</a>
        </p>
        </div>
        
        {/* ปุ่มปิด */}
        <button 
          onClick={closePopup}
          className="absolute top-3 right-3 text-white opacity-70 hover:opacity-100 hover:scale-110 transition-all duration-300 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full p-1.5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
          </svg>
        </button>
      </div>
      
      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .logo-3d {
          animation: modern-float 6s ease-in-out infinite;
          filter: drop-shadow(0 0 15px rgba(59, 130, 246, 0.7));
          transform-style: preserve-3d;
          position: relative;
          z-index: 20;
        }
        
        .logo-flare {
        
          background-size: 200% 200%;
          animation: logo-flare-animation 4s ease-in-out infinite;
          mix-blend-mode: overlay;
          z-index: 15;
        }
        
        .particle {
          opacity: 0.6;
          animation: particle-float infinite linear;
        }
        
        .cyberpunk-text {
          text-shadow: 0 0 5px #fff, 0 0 10px rgba(59, 130, 246, 0.8);
          letter-spacing: 0.5px;
        }
        
        .glitch-text {
          position: relative;
          display: inline-block;
          animation: glitch-animation 5s infinite;
        }
        
        .glitch-text::before,
        .glitch-text::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0.8;
        }
        
        .glitch-text::before {
          animation: glitch-left 1.5s infinite;
          clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
          transform: translate(-2px, -2px);
          text-shadow: -1px 0 #ff00c1;
        }
        
        .glitch-text::after {
          animation: glitch-right 2s infinite;
          clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
          transform: translate(2px, 2px);
          text-shadow: 1px 0 #00fff9;
        }
        
        @keyframes modern-float {
          0%, 100% {
            transform: translateY(0) scale(1) rotateY(0deg);
          }
          25% {
            transform: translateY(-10px) scale(1.02) rotateY(5deg);
          }
          50% {
            transform: translateY(0) scale(1.05) rotateY(0deg);
          }
          75% {
            transform: translateY(10px) scale(1.02) rotateY(-5deg);
          }
        }
        
        @keyframes logo-flare-animation {
          0%, 100% {
            background-position: 200% 100%;
            opacity: 0;
          }
          50% {
            background-position: 0% 100%;
            opacity: 1;
          }
        }
        
        @keyframes particle-float {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          50% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-100px) translateX(30px);
            opacity: 0;
          }
        }
        
        @keyframes glitch-animation {
          0%, 90%, 100% {
            opacity: 1;
            transform: translateZ(0);
            text-shadow: 0 0 8px rgba(59, 130, 246, 0.8);
          }
          91% {
            opacity: 1;
            transform: translate3d(0, -2px, 0) scale(1.01);
            text-shadow: 0 0 8px rgba(59, 130, 246, 0.8), -2px 0 rgba(255, 0, 193, 0.7);
          }
          92% {
            opacity: 1;
            transform: translate3d(0, 2px, 0) scale(0.99);
            text-shadow: 0 0 8px rgba(59, 130, 246, 0.8), 2px 0 rgba(0, 255, 249, 0.7);
          }
          93% {
            opacity: 1;
            transform: translate3d(-2px, 0, 0);
            text-shadow: 0 0 8px rgba(59, 130, 246, 0.8), 2px 2px rgba(255, 0, 193, 0.7);
          }
          94% {
            opacity: 1;
            transform: translate3d(2px, 0, 0);
            text-shadow: 0 0 8px rgba(59, 130, 246, 0.8), -2px -2px rgba(0, 255, 249, 0.7);
          }
        }
        
        @keyframes glitch-left {
          0%, 87%, 100% {
            transform: translate(0);
          }
          88% {
            transform: translate(-2px, 0);
          }
          90% {
            transform: translate(-2px, -2px);
          }
          92% {
            transform: translate(0, -1px);
          }
        }
        
        @keyframes glitch-right {
          0%, 87%, 100% {
            transform: translate(0);
          }
          88% {
            transform: translate(2px, 0);
          }
          90% {
            transform: translate(2px, 2px);
          }
          92% {
            transform: translate(0, 1px);
          }
        }
      `}</style>
    </div>
  );
}