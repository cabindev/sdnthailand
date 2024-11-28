// app/sdnpost/components/ShareButtons.tsx
'use client'

import React from 'react'
import { FaFacebook, FaXTwitter, FaLine, FaLink } from 'react-icons/fa6'
import { toast } from 'react-hot-toast'

interface ShareButtonsProps {
  url: string
  title: string
  imageUrl: string
  description?: string
}

export default function ShareButtons({ 
  url, 
  title, 
  imageUrl,
  description 
}: ShareButtonsProps) {
  // ทำความสะอาด text สำหรับแชร์
  const cleanTitle = title.replace(/&[^;]+;/g, '')
  const shareText = description 
    ? `${cleanTitle}\n\n${description}` 
    : cleanTitle

  const handleFacebookShare = () => {
    const fbUrl = new URL('https://www.facebook.com/sharer/sharer.php')
    fbUrl.searchParams.set('u', url)
    window.open(fbUrl.toString(), '_blank', 'width=600,height=400')
  }

  const handleTwitterShare = () => {
    const twitterUrl = new URL('https://twitter.com/intent/tweet')
    twitterUrl.searchParams.set('url', url)
    twitterUrl.searchParams.set('text', shareText)
    window.open(twitterUrl.toString(), '_blank', 'width=600,height=400')
  }

  const handleLineShare = () => {
    const lineUrl = new URL('https://line.me/R/msg/text/')
    lineUrl.searchParams.set('text', `${shareText}\n${url}`)
    window.open(lineUrl.toString(), '_blank')
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      toast.success('คัดลอกลิงก์แล้ว')
    } catch (err) {
      toast.error('ไม่สามารถคัดลอกลิงก์ได้')
    }
  }

  return (
    <div className="flex flex-col gap-4 sticky top-24">
      {/* Facebook */}
      <button
        onClick={handleFacebookShare}
        className="w-10 h-10 flex items-center justify-center bg-[#1877f2] hover:bg-[#166fe5] text-white rounded-full transition-colors"
        aria-label="แชร์ไปยัง Facebook"
      >
        <FaFacebook className="w-5 h-5" />
      </button>

      {/* Twitter */}
      <button
        onClick={handleTwitterShare}
        className="w-10 h-10 flex items-center justify-center bg-black hover:bg-gray-900 text-white rounded-full transition-colors"
        aria-label="แชร์ไปยัง Twitter"
      >
        <FaXTwitter className="w-4 h-4" />
      </button>

      {/* Line */}
      <button
        onClick={handleLineShare}
        className="w-10 h-10 flex items-center justify-center bg-[#00B900] hover:bg-[#009900] text-white rounded-full transition-colors"
        aria-label="แชร์ไปยัง Line"
      >
        <FaLine className="w-5 h-5" />
      </button>

      {/* Copy Link */}
      <button
        onClick={handleCopyLink}
        className="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-full transition-colors"
        aria-label="คัดลอกลิงก์"
      >
        <FaLink className="w-5 h-5" />
      </button>
    </div>
  )
}