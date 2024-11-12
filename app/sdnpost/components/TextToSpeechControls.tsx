// components/TextToSpeechControls.tsx
'use client'

import { useState, useEffect } from 'react'
import { FaPlay, FaPause, FaStop } from 'react-icons/fa'

interface TextToSpeechControlsProps {
  text: string;
}

export default function TextToSpeechControls({ text }: TextToSpeechControlsProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    const speech = new SpeechSynthesisUtterance(text)
    speech.lang = 'th-TH'
    
    speech.onend = () => {
      setIsPlaying(false)
      setIsPaused(false)
    }

    setUtterance(speech)

    return () => {
      window.speechSynthesis.cancel()
    }
  }, [text])

  const handlePlay = () => {
    if (!utterance) return

    if (isPaused) {
      window.speechSynthesis.resume()
    } else {
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(utterance)
    }
    
    setIsPlaying(true)
    setIsPaused(false)
  }

  const handlePause = () => {
    window.speechSynthesis.pause()
    setIsPlaying(true)
    setIsPaused(true)
  }

  const handleStop = () => {
    window.speechSynthesis.cancel()
    setIsPlaying(false)
    setIsPaused(false)
  }

  return (
    <div className="flex items-center gap-2 mb-4 justify-end">
    {!isPlaying || isPaused ? (
      <button
        onClick={handlePlay}
        className="flex items-center gap-1.5 bg-orange-500 text-white px-3 py-1.5 rounded-full hover:bg-orange-600 transition-colors text-sm"
      >
        <FaPlay className="w-3 h-3" />
        {isPaused ? 'เล่นต่อ' : 'ฟัง'}
      </button>
    ) : (
      <button
        onClick={handlePause}
        className="flex items-center gap-1.5 bg-orange-500 text-white px-3 py-1.5 rounded-full hover:bg-orange-600 transition-colors text-sm"
      >
        <FaPause className="w-3 h-3" />
        พัก
      </button>
    )}
    
    {(isPlaying || isPaused) && (
      <button
        onClick={handleStop}
        className="flex items-center gap-1.5 bg-gray-500 text-white px-3 py-1.5 rounded-full hover:bg-gray-600 transition-colors text-sm"
      >
        <FaStop className="w-3 h-3" />
        หยุด
      </button>
    )}
  </div>
)
}