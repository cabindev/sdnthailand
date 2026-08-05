// app/components/ArticleAudioPlayer.tsx
'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { FaPlay, FaPause, FaSpinner } from 'react-icons/fa'

const VOICE_NAME = 'th-TH-Krit:MAI-Voice-2'
const MAX_TEXT_LENGTH = 2000

interface ArticleAudioPlayerProps {
  text: string
  /** ป้ายกำกับใต้ปุ่มตอนยังไม่เล่น เช่น "ฟังบทความ" / "ฟังข่าว" */
  idleLabel: string
  ariaLabel: string
}

/**
 * ปุ่มอ่านออกเสียงบทความ
 *
 * เสียง HD ของ Azure ใช้เวลาสังเคราะห์ ~5-9 วินาทีต่อ 350 ตัวอักษร และรับข้อความได้ไม่เกิน
 * ~380 ตัวอักษรต่อ request บทความยาวจึงถูกตัดเป็นหลายท่อนที่ฝั่ง API
 *
 * แทนที่จะรอให้ครบทุกท่อนก่อนเริ่มเล่น (บทความ 2000 ตัวอักษรต้องรอ ~7 วินาที) คอมโพเนนต์นี้
 * ขอท่อนแรกก่อนแล้วเริ่มเล่นทันที จากนั้นขอท่อนที่เหลือพร้อมกันทั้งหมดระหว่างที่ท่อนแรกกำลังเล่น
 * ท่อนหนึ่งมีความยาวเสียงราว 25 วินาที ซึ่งนานพอให้ท่อนที่เหลือโหลดเสร็จก่อนถึงคิว
 */
export default function ArticleAudioPlayer({ text, idleLabel, ariaLabel }: ArticleAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const objectUrlsRef = useRef<string[]>([])
  const abortRef = useRef<AbortController | null>(null)
  // นับรอบการเล่น เพื่อให้รอบเก่าที่ถูกยกเลิกไม่ไปแก้ state หรือเล่นเสียงทับรอบใหม่
  const sessionRef = useRef(0)

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
      .slice(0, MAX_TEXT_LENGTH)
  }, [])

  // หยุดเสียง ยกเลิก request ที่ค้าง และคืนหน่วยความจำของ blob ทั้งหมด
  const stopAudio = useCallback(() => {
    sessionRef.current++

    abortRef.current?.abort()
    abortRef.current = null

    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
      audioRef.current = null
    }

    objectUrlsRef.current.forEach(url => URL.revokeObjectURL(url))
    objectUrlsRef.current = []

    setIsPlaying(false)
    setIsLoading(false)
  }, [])

  useEffect(() => stopAudio, [stopAudio])

  // ขอเสียงหนึ่งท่อนจาก API
  const fetchChunk = useCallback(async (
    cleanedText: string,
    chunkIndex: number,
    signal: AbortSignal
  ): Promise<Response> => {
    const response = await fetch('/api/text-to-speech', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: cleanedText,
        languageCode: 'th-TH',
        voiceName: VOICE_NAME,
        chunkIndex
      }),
      signal
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: `HTTP ${response.status}: ${response.statusText}`
      }))
      throw new Error(errorData.error || 'ไม่สามารถสร้างเสียงได้')
    }

    return response
  }, [])

  // เล่น object URL หนึ่งท่อนจนจบ
  const playUrl = useCallback((url: string, session: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (session !== sessionRef.current) {
        resolve()
        return
      }

      const audio = new Audio(url)
      audio.preload = 'auto'
      audioRef.current = audio

      audio.onended = () => resolve()
      audio.onerror = () => reject(new Error('ไม่สามารถเล่นเสียงได้'))
      // ถูกกดหยุดกลางคัน - ต้องคืน promise ไม่งั้นลูปเล่นเสียงจะค้างรออยู่ตลอด
      audio.onpause = () => {
        if (session !== sessionRef.current) resolve()
      }

      audio.play().catch(reject)
    })
  }, [])

  const playAudio = useCallback(async (cleanedText: string) => {
    stopAudio() // ล้างรอบก่อนหน้าให้หมดก่อน แล้วค่อยเปิดรอบใหม่
    const session = sessionRef.current

    setIsLoading(true)
    setError(null)

    const controller = new AbortController()
    abortRef.current = controller

    const toObjectUrl = async (response: Response): Promise<string> => {
      const blob = await response.blob()
      if (blob.size === 0) {
        throw new Error('ไม่ได้รับข้อมูลเสียง')
      }
      const url = URL.createObjectURL(blob)
      objectUrlsRef.current.push(url)
      return url
    }

    try {
      // ท่อนแรก - response บอกจำนวนท่อนทั้งหมดมาด้วย
      const firstResponse = await fetchChunk(cleanedText, 0, controller.signal)
      const chunkCount = Math.max(1, Number(firstResponse.headers.get('X-Chunk-Count')) || 1)

      const isReady: boolean[] = new Array(chunkCount).fill(false)
      const markReady = (i: number) => (url: string) => {
        isReady[i] = true
        return url
      }

      const chunkUrls: Promise<string>[] = [toObjectUrl(firstResponse).then(markReady(0))]

      // ท่อนที่เหลือยิงพร้อมกันทั้งหมด แล้วปล่อยให้โหลดอยู่เบื้องหลังระหว่างท่อนแรกเล่น
      for (let i = 1; i < chunkCount; i++) {
        chunkUrls.push(
          fetchChunk(cleanedText, i, controller.signal).then(toObjectUrl).then(markReady(i))
        )
      }
      // กัน unhandled rejection ระหว่างรอคิว - error จริงจะถูกจับตอน await ในลูปด้านล่าง
      chunkUrls.forEach(p => p.catch(() => {}))

      if (session !== sessionRef.current) return

      for (let i = 0; i < chunkCount; i++) {
        // แสดงสถานะกำลังโหลดเฉพาะตอนที่ท่อนถัดไปยังมาไม่ทันจริง ๆ
        // ถ้าโหลดเสร็จรออยู่แล้วต้องไม่กะพริบเป็น spinner คั่นระหว่างท่อน
        if (i > 0 && !isReady[i]) setIsLoading(true)

        const url = await chunkUrls[i]
        if (session !== sessionRef.current) return

        setIsLoading(false)
        setIsPlaying(true)

        await playUrl(url, session)
        if (session !== sessionRef.current) return
      }

      setIsPlaying(false)
      setIsLoading(false)
      objectUrlsRef.current.forEach(url => URL.revokeObjectURL(url))
      objectUrlsRef.current = []
    } catch (err) {
      if (session !== sessionRef.current) return // ผู้ใช้กดหยุดเอง ไม่ใช่ error
      if (err instanceof DOMException && err.name === 'AbortError') return

      setIsLoading(false)
      setIsPlaying(false)
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด')
      console.error('ArticleAudioPlayer Error:', err)
    }
  }, [fetchChunk, playUrl, stopAudio])

  // จัดการการคลิกปุ่ม
  const handleToggle = useCallback(async () => {
    const cleanedText = cleanTextForTTS(text)

    if (!cleanedText) {
      setError('ไม่มีข้อความที่จะอ่าน')
      return
    }

    if (isPlaying || isLoading) {
      stopAudio()
    } else {
      await playAudio(cleanedText)
    }
  }, [text, isPlaying, isLoading, cleanTextForTTS, stopAudio, playAudio])

  // ซ่อน component ถ้าไม่มีข้อความ
  const cleanedText = cleanTextForTTS(text)
  if (!cleanedText) {
    return null
  }

  const statusLabel = isLoading ? 'กำลังโหลด...' : isPlaying ? 'กำลังเล่น' : idleLabel

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={handleToggle}
        className={`
          p-2 rounded-full transition-all duration-200
          bg-white hover:bg-orange-50 hover:shadow-md active:scale-95
          ${isPlaying ? 'bg-[#ff7834]/15 text-[#e86b2a]' : 'text-gray-600'}
          border border-gray-200 shadow-xs
        `}
        title={isLoading ? 'ยกเลิก' : isPlaying ? 'หยุดฟัง' : idleLabel}
        type="button"
        aria-label={ariaLabel}
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
          {statusLabel}
        </div>
      )}
    </div>
  )
}
