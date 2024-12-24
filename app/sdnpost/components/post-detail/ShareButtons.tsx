// app/sdnpost/components/ShareButtons.tsx
'use client'

import { FaFacebook, FaXTwitter, FaLine, FaLink } from 'react-icons/fa6'

interface ShareButtonsProps {
 url: string
 title: string
 isMobile?: boolean
}

export default function ShareButtons({ url, title, isMobile = false }: ShareButtonsProps) {
 const shareOnFacebook = () => {
   window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
 }

 const shareOnTwitter = () => {
   window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank')
 }

 const shareOnLine = () => {
   window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`, '_blank')
 }

 const copyLink = () => {
   navigator.clipboard.writeText(url)
     .then(() => {
       alert('ลิงก์ถูกคัดลอกเรียบร้อยแล้ว!')
     })
     .catch(() => {
       alert('ไม่สามารถคัดลอกลิงก์ได้ กรุณาลองอีกครั้ง')
     })
 }

 const containerClassName = isMobile
   ? "flex flex-row justify-center gap-4 mt-6 px-4"
   : "flex flex-col gap-4 sticky top-4"

 return (
   <div className={containerClassName}>
     <button 
       onClick={shareOnFacebook}
       className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
       aria-label="Share on Facebook"
     >
       <FaFacebook className="w-5 h-5" />
     </button>

     <button 
       onClick={shareOnTwitter}
       className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-900 transition-colors"
       aria-label="Share on X (Twitter)"
     >
       <FaXTwitter className="w-4 h-4" />
     </button>

     <button 
       onClick={shareOnLine}
       className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition-colors"
       aria-label="Share on Line"
     >
       <FaLine className="w-5 h-5" />
     </button>

     <button 
       onClick={copyLink}
       className="w-10 h-10 rounded-full bg-gray-500 text-white flex items-center justify-center hover:bg-gray-600 transition-colors"
       aria-label="Copy Link"
     >
       <FaLink className="w-5 h-5" />
     </button>
   </div>
 )
}
