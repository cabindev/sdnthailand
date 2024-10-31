'use client'

import { Suspense } from 'react'
import ProjectList from "./components/ProjectList"
import Image from "next/image"

export default function HomeProject2020() {
 return (
   <div className="min-h-screen bg-white">
     <div className="max-w-7xl mx-auto">
       {/* Hero Section */}
       <div className="relative pt-16 sm:pt-20 pb-12 sm:pb-16">
         <div className="px-4 sm:px-6 lg:px-8">
           {/* Background Decorative */}
           <div className="absolute inset-0 overflow-hidden -z-10">
             <div className="absolute -top-10 -right-10 w-72 h-72 bg-orange-100 rounded-full opacity-30 blur-3xl" />
             <div className="absolute top-48 -left-10 w-72 h-72 bg-yellow-100 rounded-full opacity-30 blur-3xl" />
             <div className="absolute bottom-10 right-16 w-72 h-72 bg-orange-200 rounded-full opacity-30 blur-3xl" />
           </div>

           <div className="relative">
             <div className="text-center space-y-8">
               <div>
                 <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                   สรุปผลการดำเนินงาน
                 </h1>
                 <h2 className="text-xl sm:text-2xl text-gray-600 font-light">
                   โครงการประจำปี 2563
                 </h2>
               </div>
               <div className="h-1 w-24 bg-orange-500 mx-auto rounded-full" />
             </div>
           </div>
         </div>
       </div>

       {/* Main Content Section */}
       <div className="px-4 sm:px-6 lg:px-8 pb-16">
         <div className="bg-white rounded-2xl shadow-md">
           <Suspense
             fallback={
               <div className="flex flex-col items-center justify-center h-64 p-4">
                 <div className="relative">
                   <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
                 </div>
                 <p className="mt-4 text-gray-600 text-sm sm:text-base">
                   กำลังโหลดข้อมูล...
                 </p>
               </div>
             }
           >
             <div className="p-4 sm:p-6">
               <ProjectList />
             </div>
           </Suspense>
         </div>
       </div>
     </div>
   </div>
 )
}