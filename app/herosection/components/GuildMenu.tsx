'use client';

import React from 'react';
import { 
  AcademicCapIcon, 
  TrophyIcon, 
  ChartBarIcon, 
  UserGroupIcon, 
  HeartIcon, 
  MapIcon 
} from '@heroicons/react/24/solid';

const GuildMenu: React.FC = () => {
  const externalLinks = [
    {
      id: 1,
      title: "ที่โรงเรียนคำพ่อสอน", 
      url: "https://xn--42cf1cjb3azgb8e6ab5d9ad8o5a1il1h.com/หน้าแรก/",
      icon: AcademicCapIcon
    },
    {
      id: 2,
      title: "SDN Futsal",
      url: "https://sdnfutsal.com/",
      icon: TrophyIcon
    },
    {
      id: 3,
      title: "AVS+",
      url: "https://avs2.sdnthailand.com/index.php",
      icon: ChartBarIcon
    },
    {
      id: 4,
      title: "โครงการบวช",
      url: "https://ordain-chi.vercel.app/",
      icon: UserGroupIcon
    },
    {
      id: 5,
      title: "Child Plus EST",
      url: "https://childplusest.com/",
      icon: HeartIcon
    },
    {
      id: 6,
      title: "SDN Map Portal",
      url: "https://sdnmapportal.sdnthailand.com/",
      icon: MapIcon
    }
  ];

  return (
    <section className="bg-white pt-2 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid Layout - Microsoft Style */}
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {externalLinks.map((link) => {
            const IconComponent = link.icon;
            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center text-center space-y-3 p-4 rounded-lg hover:bg-gray-50 transition-all duration-200"
              >
              
                <div className="flex items-center justify-center">
                  <IconComponent className="w-8 h-8 text-orange-500 group-hover:text-orange-800 transition-colors duration-200" />
                </div>
                
               
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-200 leading-tight">
                  {link.title}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default GuildMenu;