// app/sdnpost/components/post-detail/VoicePlayer.tsx
'use client'

import { useState, useRef, useCallback } from 'react'
import { FaPlay, FaPause, FaSpinner } from 'react-icons/fa'

interface VoicePlayerProps {
  text: string
}

export default function VoicePlayer({ text }: VoicePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // ทำความสะอาดข้อความสำหรับ TTS
  const cleanTextForTTS = useCallback((rawText: string): string => {
    if (!rawText || typeof rawText !== 'string') {
      return ''
    }
    
    return rawText
      .replace(/<[^>]*>/g, '') // ลบ HTML tags
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ') // ลบ whitespace ส่วนเกิน
      .trim()
      .slice(0, 2000) // จำกัด 2000 ตัวอักษร
  }, [])

  // หยุดเสียงที่เล่นอยู่
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setIsPlaying(false)
  }, [])

  // เล่นเสียง
  const playAudio = useCallback(async (cleanedText: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: cleanedText,
          languageCode: 'th-TH',
          voiceName: 'th-TH-NiwatNeural'
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
          error: `HTTP ${response.status}: ${response.statusText}` 
        }))
        throw new Error(errorData.error || 'ไม่สามารถสร้างเสียงได้')
      }

      const audioBlob = await response.blob()
      
      if (audioBlob.size === 0) {
        throw new Error('ไม่ได้รับข้อมูลเสียง')
      }

      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)

      // จัดการ events
      audio.onloadeddata = () => {
        setIsLoading(false)
        setIsPlaying(true)
      }

      audio.onended = () => {
        setIsPlaying(false)
        URL.revokeObjectURL(audioUrl)
      }

      audio.onerror = () => {
        setIsPlaying(false)
        setError('ไม่สามารถเล่นเสียงได้')
        URL.revokeObjectURL(audioUrl)
      }

      // หยุดเสียงเดิมก่อนเล่นใหม่
      stopAudio()
      audioRef.current = audio

      await audio.play()

    } catch (err) {
      setIsLoading(false)
      const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาด'
      setError(errorMessage)
      console.error('VoicePlayer Error:', err)
    }
  }, [stopAudio])

  // จัดการการคลิกปุ่ม
  const handleToggle = useCallback(async () => {
    const cleanedText = cleanTextForTTS(text)
    
    if (!cleanedText) {
      setError('ไม่มีข้อความที่จะอ่าน')
      return
    }

    if (isPlaying) {
      stopAudio()
    } else {
      await playAudio(cleanedText)
    }
  }, [text, isPlaying, cleanTextForTTS, stopAudio, playAudio])

  // ซ่อน component ถ้าไม่มีข้อความ
  const cleanedText = cleanTextForTTS(text)
  if (!cleanedText) {
    return null
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={`
          p-2 rounded-full transition-all duration-200 
          ${isLoading 
            ? 'bg-gray-100 cursor-not-allowed opacity-50' 
            : 'bg-white hover:bg-orange-50 hover:shadow-md active:scale-95'
          }
          ${isPlaying ? 'bg-orange-100 text-orange-600' : 'text-gray-600'}
          border border-gray-200 shadow-sm
        `}
        title={
          isLoading 
            ? 'กำลังโหลด...' 
            : isPlaying 
              ? 'หยุดฟัง' 
              : 'ฟังข่าว'
        }
        type="button"
        aria-label="เครื่องเล่นเสียงข่าว"
      >
        {isLoading ? (
          <FaSpinner className="w-4 h-4 animate-spin" />
        ) : isPlaying ? (
          <FaPause className="w-4 h-4" />
        ) : (
          <FaPlay className="w-4 h-4 ml-0.5" />
        )}
      </button>

      {/* แสดง error ถ้ามี */}
      {error && (
        <div className="text-xs text-red-500 text-center max-w-32 leading-tight">
          {error}
        </div>
      )}

      {/* แสดงสถานะ */}
      {!error && (
        <div className="text-xs text-gray-400 text-center">
          {isLoading 
            ? 'กำลังโหลด...' 
            : isPlaying 
              ? 'กำลังเล่น' 
              : 'ฟังข่าว'
          }
        </div>
      )}
    </div>
  )
}