// app/sdnpost/components/ShareButtons.tsx
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
  quote?: string
  imageUrl?: string
}

export default function ShareButtons({ url, title, quote, imageUrl }: ShareButtonsProps) {
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      toast.success('คัดลอกลิงก์แล้ว')
    } catch (err) {
      toast.error('ไม่สามารถคัดลอกลิงก์ได้')
    }
  }

  const shareData = {
    url,
    title,
    quote: quote || title,
    hashtag: '#SDNThailand',
    description: quote || title,
    media: imageUrl // เพิ่ม media property
  }

  return (
    <div className="flex flex-col gap-4 sticky top-24">
      <FacebookShareButton 
        {...shareData}
        windowWidth={660}
        windowHeight={460}
      >
        <FacebookIcon size={40} round />
      </FacebookShareButton>

      <TwitterShareButton 
        {...shareData}
        via="SDNThailand"
      >
        <TwitterIcon size={40} round />
      </TwitterShareButton>

      <LineShareButton {...shareData}>
        <LineIcon size={40} round />
      </LineShareButton>

      <button
        onClick={handleCopyLink}
        className="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"
      >
        <FaLink className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  )
}