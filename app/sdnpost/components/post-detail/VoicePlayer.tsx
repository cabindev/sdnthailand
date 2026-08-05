// app/sdnpost/components/post-detail/VoicePlayer.tsx
'use client'

import ArticleAudioPlayer from '@/app/components/ArticleAudioPlayer'

interface VoicePlayerProps {
  text: string
}

export default function VoicePlayer({ text }: VoicePlayerProps) {
  return (
    <ArticleAudioPlayer
      text={text}
      idleLabel="ฟังข่าว"
      ariaLabel="เครื่องเล่นเสียงข่าว"
    />
  )
}
