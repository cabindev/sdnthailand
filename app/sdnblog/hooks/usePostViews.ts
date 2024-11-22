'use client'

import { useState, useCallback } from 'react'

interface UsePostViewsResult {
  viewCount: number
  incrementViewCount: () => Promise<void>
}

export function usePostViews(postId: string): UsePostViewsResult {
  const [viewCount, setViewCount] = useState<number>(0)

  const incrementViewCount = useCallback(async () => {
    try {
      const response = await fetch(`/api/sdnpost/views/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) throw new Error('Failed to increment view count')

      const data = await response.json()
      if (data.success) {
        setViewCount(data.count || 0)
      }
    } catch (err) {
      console.error('Error incrementing view count:', err)
    }
  }, [postId])

  return { viewCount, incrementViewCount }
}