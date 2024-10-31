'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUsers, FaFileAlt, FaChartLine } from 'react-icons/fa';

export default function Stats() {
 const [stats, setStats] = useState({ userCount: 0, mediaRequestsThisYear: 0 });

 useEffect(() => {
   axios.get('/api/stats')
     .then(response => setStats(response.data))
     .catch(error => console.error('Error fetching stats:', error));
 }, []);

 return (
   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
     {/* Users Card */}
     <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-xl p-6 transform hover:scale-105 transition-all duration-300">
       <div className="flex items-center justify-between">
         <div>
           <p className="text-white text-sm font-light mb-1">จำนวนผู้ใช้ทั้งหมด</p>
           <h3 className="text-white text-3xl font-bold">
             {stats.userCount.toLocaleString()}
           </h3>
         </div>
         <div className="bg-blue-400 bg-opacity-30 rounded-full p-3">
           <FaUsers className="h-8 w-8 text-white" />
         </div>
       </div>
       <div className="mt-4 flex items-center text-white text-sm">
         <FaChartLine className="h-4 w-4 mr-1" />
         <span className="font-light">เพิ่มขึ้น 12% จากเดือนที่แล้ว</span>
       </div>
     </div>

     {/* Media Requests Card */}
     <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-xl p-6 transform hover:scale-105 transition-all duration-300">
       <div className="flex items-center justify-between">
         <div>
           <p className="text-white text-sm font-light mb-1">จำนวนคำขอสื่อในปีนี้</p>
           <h3 className="text-white text-3xl font-bold">
             {stats.mediaRequestsThisYear.toLocaleString()}
           </h3>
         </div>
         <div className="bg-orange-400 bg-opacity-30 rounded-full p-3">
           <FaFileAlt className="h-8 w-8 text-white" />
         </div>
       </div>
       <div className="mt-4 flex items-center text-white text-sm">
         <FaChartLine className="h-4 w-4 mr-1" />
         <span className="font-light">เพิ่มขึ้น 8% จากเดือนที่แล้ว</span>
       </div>
     </div>
   </div>
 );
}