'use client'

import React from 'react'
import { FaFacebook, FaXTwitter, FaLine, FaLink } from 'react-icons/fa6'
import { toast } from 'react-hot-toast'

interface ShareButtonsProps {
  url: string
  title: string
  imageUrl?: string
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      toast.success('คัดลอกลิงก์แล้ว')
    } catch (err) {
      toast.error('ไม่สามารถคัดลอกลิงก์ได้')
    }
  }

  const handleFacebookShare = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`,
      '_blank',
      'width=600,height=400'
    )
  }

  const handleTwitterShare = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      '_blank',
      'width=600,height=400'
    )
  }

  const handleLineShare = () => {
    window.open(
      `https://line.me/R/msg/text/?${encodeURIComponent(`${title} ${url}`)}`,
      '_blank'
    )
  }

  return (
    <div className="flex flex-col gap-4 sticky top-24">
      <button
        onClick={handleFacebookShare}
        className="w-10 h-10 flex items-center justify-center bg-[#1877f2] hover:bg-[#166fe5] text-white rounded-full transition-colors"
      >
        <FaFacebook className="w-5 h-5" />
      </button>

      <button
        onClick={handleTwitterShare}
        className="w-10 h-10 flex items-center justify-center bg-black hover:bg-gray-900 text-white rounded-full transition-colors"
      >
        <FaXTwitter className="w-4 h-4" />
      </button>

      <button
        onClick={handleCopyLink}
        className="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-full transition-colors"
      >
        <FaLink className="w-5 h-5" />
      </button>
    </div>
  )
}