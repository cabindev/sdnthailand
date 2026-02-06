'use client';

import React from 'react';
import { 
  AcademicCapIcon, 
  TrophyIcon, 
  ChartBarIcon, 
  UserGroupIcon, 
  HeartIcon, 
  MapIcon,
  ServerIcon,
  CircleStackIcon,
  GlobeAltIcon
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
    },
    {
      id: 7,
      title: "SSN Thailand",
      url: "https://ssnthailand.com/",
      icon: ServerIcon
    },
    {
      id: 8,
      title: "SDN DB System",
      url: "https://post.sdnthailand.com/sdn/admin/",
      icon: CircleStackIcon
    },
    {
      id: 9,
      title: "Healthy Public Spaces",
      url: "https://healthypublicspaces.com/",
      icon: GlobeAltIcon
    }
  ];

  return (
    <section className="bg-white py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-5 sm:grid-cols-9 gap-2">
          {externalLinks.map((link) => {
            const IconComponent = link.icon;
            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center text-center gap-2 py-3 px-2 rounded-xl hover:bg-gray-50 transition-all duration-200"
              >
                <IconComponent className="w-6 h-6 text-orange-500 group-hover:text-orange-600 transition-colors duration-200" />
                <span className="text-xs font-medium text-gray-600 group-hover:text-gray-900 transition-colors duration-200 leading-tight line-clamp-1">
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