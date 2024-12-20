// app/sdnblog/components/ViewCounter.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { FaEye } from 'react-icons/fa'

interface ViewCounterProps {
  postId: string
  initialCount: number
}

export default function ViewCounter({ postId, initialCount }: ViewCounterProps) {
  const [viewCount, setViewCount] = useState(initialCount)
  const hasIncrementedRef = useRef(false)
  const timerRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const incrementViewCount = async () => {
      if (hasIncrementedRef.current) return
      
      try {
        const response = await fetch(`/api/sdnblog/views/${postId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        })
        
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setViewCount(data.count)
            hasIncrementedRef.current = true
          }
        }
      } catch (error) {
        console.error('Error incrementing view count:', error)
      }
    }

    const timeout = setTimeout(incrementViewCount, 2000)
    return () => clearTimeout(timeout)
  }, [postId])

  useEffect(() => {
    const updateViewCount = async () => {
      try {
        const response = await fetch(`/api/sdnblog/views/${postId}`)
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setViewCount(data.count)
          }
        }
      } catch (error) {
        console.error('Error fetching view count:', error)
      }
    }

    timerRef.current = setInterval(updateViewCount, 30000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [postId])

  return (
    <div className="flex items-center gap-2 text-gray-500">
      <FaEye className="w-4 h-4 md:w-5 md:h-5" />
      <span className="font-ibm text-sm md:text-base">
        {Number(viewCount).toLocaleString()} ครั้ง
      </span>
    </div>
  )
}