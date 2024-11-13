'use client'

import {
  FacebookShareButton,
  TwitterShareButton,
  LineShareButton,
  FacebookIcon,
  TwitterIcon,
  LineIcon
} from 'react-share'
import { FaLink } from 'react-icons/fa'
import { toast } from 'react-hot-toast'

interface ShareButtonsProps {
  url: string
  title: string
  imageUrl?: string
}

export default function ShareButtons({ url, title, imageUrl }: ShareButtonsProps) {
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      toast.success('คัดลอกลิงก์แล้ว')
    } catch (err) {
      toast.error('ไม่สามารถคัดลอกลิงก์ได้')
    }
  }

  const shareProps = {
    url,
    title,
    hashtag: '#SDNThailand',
  }

  return (
    <div className="flex flex-col gap-4 sticky top-24">
      <FacebookShareButton {...shareProps}>
        <FacebookIcon size={40} round />
      </FacebookShareButton>

      <TwitterShareButton {...shareProps}>
        <TwitterIcon size={40} round />
      </TwitterShareButton>



      <button
        onClick={handleCopyLink}
        className="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"
      >
        <FaLink className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  )
}