// app/sdnpost/components/ShareButtons.tsx
'use client'

import { useState } from 'react'
import Head from 'next/head'
import toast from 'react-hot-toast'
import { FaFacebook, FaTwitter, FaLink } from 'react-icons/fa'
import { FacebookShareButton, TwitterShareButton } from 'react-share'

interface ShareButtonsProps {
 url: string
 title: string
 imageUrl?: string
 quote?: string 
}

export default function ShareButtons({ url, title, imageUrl, quote }: ShareButtonsProps) {
 const [isSharing, setIsSharing] = useState(false)
 
 const sanitizedTitle = title.replace(/&[^;]+;/g, '').trim()
 const shareText = quote?.replace(/&[^;]+;/g, '').trim() || sanitizedTitle

 // แยก options สำหรับ facebook share
 const facebookShare = {
   url: url,
   quote: shareText,
   hashtag: "#SDNThailand"
 }
 
 // แยก options สำหรับ twitter share
 const twitterShare = {
   url: url,
   title: `${shareText} #SDNThailand`
 }
 
 const copyToClipboard = async () => {
   if (isSharing) return
   
   setIsSharing(true)
   try {
     await navigator.clipboard.writeText(`${shareText}\n${url}`)
     toast.success('คัดลอกลิงก์แล้ว')
   } catch (err) {
     console.error('Copy failed:', err)
     toast.error('ไม่สามารถคัดลอกลิงก์ได้')
   } finally {
     setIsSharing(false)
   }
 }

 return (
   <>
     <Head>
       <meta property="og:url" content={url} />
       <meta property="og:type" content="article" />
       <meta property="og:title" content={sanitizedTitle} />
       <meta property="og:description" content={shareText} />
       {imageUrl && <meta property="og:image" content={imageUrl} />}
       <meta property="og:site_name" content="SDN Thailand" />
       
       <meta name="twitter:card" content="summary_large_image" />
       <meta name="twitter:title" content={sanitizedTitle} />
       <meta name="twitter:description" content={shareText} />
       {imageUrl && <meta name="twitter:image" content={imageUrl} />}
     </Head>

     <div className="flex flex-col gap-4 sticky top-24">
       <div className="text-gray-600 font-ibm">แชร์</div>
       <div className="flex flex-col gap-3">
         <FacebookShareButton 
           {...facebookShare}
           className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1877F2] text-white hover:opacity-90 transition-opacity disabled:opacity-50"
           disabled={isSharing}
         >
           <FaFacebook size={20} />
         </FacebookShareButton>

         <TwitterShareButton 
           {...twitterShare}
           className="w-10 h-10 flex items-center justify-center rounded-full bg-black text-white hover:opacity-90 transition-opacity disabled:opacity-50"
           disabled={isSharing}
         >
           <FaTwitter size={20} />
         </TwitterShareButton>

         <button
           onClick={copyToClipboard}
           disabled={isSharing}
           className="w-10 h-10 flex items-center justify-center rounded-full bg-orange-500 text-white hover:opacity-90 transition-opacity disabled:opacity-50"
           aria-label="Copy link"
         >
           <FaLink size={18} />
         </button>
       </div>
     </div>
   </>
 )
}