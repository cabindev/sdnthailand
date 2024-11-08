// app/sdnpost/components/ShareButtons.tsx
'use client'

import toast from 'react-hot-toast'
import { FaFacebook, FaTwitter, FaLink } from 'react-icons/fa'
import { FacebookShareButton, TwitterShareButton } from 'react-share'

interface ShareButtonsProps {
  url: string
  title: string
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      toast.success('คัดลอกลิงก์แล้ว')
    } catch (err) {
      toast.error('ไม่สามารถคัดลอกลิงก์ได้')
    }
  }

  return (
    <div className="flex flex-col gap-4 sticky top-24">
      <div className="text-gray-600 font-ibm">แชร์บทความ</div>
      <div className="flex flex-col gap-3">
        <FacebookShareButton url={url} quote={title}>
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1877F2] text-white hover:opacity-90 transition-opacity">
            <FaFacebook size={20} />
          </div>
        </FacebookShareButton>

        <TwitterShareButton url={url} title={title}>
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-black text-white hover:opacity-90 transition-opacity">
            <FaTwitter size={20} />
          </div>
        </TwitterShareButton>

        <button
          onClick={copyToClipboard}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-orange-500 text-white hover:opacity-90 transition-opacity"
          aria-label="Copy link"
        >
          <FaLink size={18} />
        </button>
      </div>
    </div>
  )
}