// components/TextToSpeechControls.tsx
'use client'

import { useState, useRef } from 'react'
import { FaPlay, FaPause, FaStop } from 'react-icons/fa'
import * as speechsdk from 'microsoft-cognitiveservices-speech-sdk'

interface TextToSpeechControlsProps {
  text: string;
}

export default function TextToSpeechControls({ text }: TextToSpeechControlsProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const synthesizer = useRef<speechsdk.SpeechSynthesizer | null>(null)
  
  const initSynthesizer = () => {
    const speechConfig = speechsdk.SpeechConfig.fromSubscription(
      process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY!,
      process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION!
    )
    
    // ใช้เสียงภาษาไทยแบบ Neural
    speechConfig.speechSynthesisVoiceName = "th-TH-PremwadeeNeural"
    
    const audioConfig = speechsdk.AudioConfig.fromDefaultSpeakerOutput()
    return new speechsdk.SpeechSynthesizer(speechConfig, audioConfig)
  }

  const handlePlay = async () => {
    if (!synthesizer.current) {
      synthesizer.current = initSynthesizer()
    }

    try {
      setIsPlaying(true)
      setIsPaused(false)
      
      synthesizer.current.speakTextAsync(
        text,
        result => {
          if (result.reason === speechsdk.ResultReason.SynthesizingAudioCompleted) {
            setIsPlaying(false)
          } else {
            console.error(`Speech synthesis canceled, ${result.errorDetails}`)
            setIsPlaying(false)
          }
          synthesizer.current?.close()
          synthesizer.current = null
        },
        error => {
          console.error(error)
          setIsPlaying(false)
          synthesizer.current?.close()
          synthesizer.current = null
        }
      )
    } catch (error) {
      console.error('Error synthesizing speech:', error)
      setIsPlaying(false)
    }
  }

  const handleStop = () => {
    if (synthesizer.current) {
      synthesizer.current.close()
      synthesizer.current = null
    }
    setIsPlaying(false)
    setIsPaused(false)
  }

  return (
    <div className="flex items-center gap-2 mb-4 justify-end">
      {!isPlaying ? (
        <button
          onClick={handlePlay}
          className="flex items-center gap-1.5 bg-orange-500 text-white px-3 py-1.5 rounded-full hover:bg-orange-600 transition-colors text-sm"
        >
          <FaPlay className="w-3 h-3" />
          ฟัง
        </button>
      ) : (
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