// app/sdnblog/components/blog-detail/AudioReader.tsx
'use client'

import ArticleAudioPlayer from '@/app/components/ArticleAudioPlayer'

interface AudioReaderProps {
  text: string
}

export default function AudioReader({ text }: AudioReaderProps) {
  return (
    <ArticleAudioPlayer
      text={text}
      idleLabel="ฟังบทความ"
      ariaLabel="เครื่องอ่านบทความ"
    />
  )
}
