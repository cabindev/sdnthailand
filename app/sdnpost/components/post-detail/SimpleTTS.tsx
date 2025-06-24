// app/sdnpost/components/post-detail/SimpleTTS.tsx
'use client'

import { useState, useRef } from 'react'
import { FaPlay, FaPause } from 'react-icons/fa'

interface SimpleTTSProps {
  text: string
}

export default function SimpleTTS({ text }: SimpleTTSProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Clean text for TTS with byte limit
  const cleanText = (rawText: string): string => {
    let cleaned = rawText
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')
      .trim()

    // Check byte length (Google TTS limit is 5000 bytes)
    const MAX_BYTES = 4500 // Leave buffer for safety
    while (new TextEncoder().encode(cleaned).length > MAX_BYTES) {
      cleaned = cleaned.slice(0, -1)
    }

    return cleaned
  }

  const handleToggle = async () => {
    if (isPlaying) {
      // หยุดเล่น
      if (audioRef.current) {
        audioRef.current.pause()
        setIsPlaying(false)
      }
      return
    }

    // เริ่มเล่น
    const cleanedText = cleanText(text)
    if (!cleanedText.trim()) return

    setIsLoading(true)

    try {
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: cleanedText,
          languageCode: 'th-TH',
          voiceName: 'th-TH-Standard-A',
          ssmlGender: 'FEMALE'
        })
      })

      if (!response.ok) throw new Error('TTS failed')

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)

      if (audioRef.current) {
        audioRef.current.pause()
      }

      const audio = new Audio(audioUrl)
      audioRef.current = audio

      audio.onended = () => setIsPlaying(false)
      audio.onerror = () => setIsPlaying(false)

      await audio.play()
      setIsPlaying(true)

    } catch (error) {
      console.error('TTS Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const cleanedText = cleanText(text)
  if (!cleanedText.trim()) return null

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className="p-1.5 hover:bg-gray-50 rounded-full transition-colors disabled:opacity-50"
      title={isPlaying ? 'หยุดฟัง' : 'ฟังบทความ'}
    >
      {isLoading ? (
        <div className="w-3.5 h-3.5 border border-gray-400 border-t-transparent rounded-full animate-spin" />
      ) : isPlaying ? (
        <FaPause className="w-3.5 h-3.5 text-gray-600" style={{ fontWeight: 300 }} />
      ) : (
        <FaPlay className="w-3.5 h-3.5 text-gray-600" style={{ fontWeight: 300 }} />
      )}
    </button>
  )
}