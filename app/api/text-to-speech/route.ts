// app/api/text-to-speech/route.ts
import { NextRequest, NextResponse } from 'next/server'

// Rate limiting configuration
interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitMap = new Map<string, RateLimitEntry>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10 // 10 requests per minute per IP
const MAX_TEXT_LENGTH = 3000

// Rate limiting function
function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return false
  }

  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true
  }

  entry.count++
  return false
}

// Get client IP
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) return forwarded.split(',')[0].trim()
  if (realIP) return realIP
  return 'unknown'
}

// Validate and sanitize text
function validateText(text: string): { isValid: boolean; sanitized: string; error?: string } {
  if (!text || typeof text !== 'string') {
    return { isValid: false, sanitized: '', error: 'Text is required' }
  }

  // Remove potentially harmful content
  const sanitized = text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()

  if (sanitized.length === 0) {
    return { isValid: false, sanitized: '', error: 'No valid text content found' }
  }

  if (sanitized.length > MAX_TEXT_LENGTH) {
    return { 
      isValid: true, 
      sanitized: sanitized.substring(0, MAX_TEXT_LENGTH),
      error: `Text truncated to ${MAX_TEXT_LENGTH} characters`
    }
  }

  return { isValid: true, sanitized }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Rate limiting
    const clientIP = getClientIP(request)
    if (isRateLimited(clientIP)) {
      console.warn(`Rate limit exceeded for IP: ${clientIP}`)
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // Parse and validate request body
    let body
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    const { 
      text, 
      languageCode = 'th-TH', 
      voiceName = 'th-TH-Standard-A', 
      ssmlGender = 'FEMALE',
      speakingRate = 1.0,
      pitch = 0.0,
      volumeGainDb = 0.0
    } = body

    // Validate text
    const textValidation = validateText(text)
    if (!textValidation.isValid) {
      return NextResponse.json(
        { error: textValidation.error },
        { status: 400 }
      )
    }

    // Validate parameters
    if (speakingRate < 0.25 || speakingRate > 4.0) {
      return NextResponse.json(
        { error: 'Speaking rate must be between 0.25 and 4.0' },
        { status: 400 }
      )
    }

    if (pitch < -20.0 || pitch > 20.0) {
      return NextResponse.json(
        { error: 'Pitch must be between -20.0 and 20.0' },
        { status: 400 }
      )
    }

    // Check Google API key
    const googleApiKey = process.env.GOOGLE_CLOUD_API_KEY
    if (!googleApiKey) {
      console.error('Google Cloud API key not configured')
      return NextResponse.json(
        { error: 'Text-to-Speech service not available' },
        { status: 503 }
      )
    }

    const googleApiUrl = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${googleApiKey}`

    const requestBody = {
      input: { text: textValidation.sanitized },
      voice: {
        languageCode: languageCode,
        name: voiceName,
        ssmlGender: ssmlGender
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: Math.max(0.25, Math.min(4.0, speakingRate)), // Clamp values
        pitch: Math.max(-20.0, Math.min(20.0, pitch)),
        volumeGainDb: volumeGainDb
      }
    }

    console.log(`Google TTS Request from ${clientIP}:`, {
      textLength: textValidation.sanitized.length,
      voice: voiceName,
      speakingRate,
      pitch,
      truncated: textValidation.error ? true : false
    })

    // Call Google TTS API with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

    const response = await fetch(googleApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'SDNThailand-TTS/1.0'
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Google TTS API Error (${response.status}):`, errorText)
      
      // Log for monitoring
      console.error(`TTS API Error for IP ${clientIP}:`, {
        status: response.status,
        textLength: textValidation.sanitized.length,
        voice: voiceName
      })
      
      let errorData = {}
      try {
        errorData = JSON.parse(errorText)
      } catch (e) {
        // Response is not JSON
      }
      
      // Return user-friendly error messages
      if (response.status === 403) {
        return NextResponse.json(
          { error: 'API access denied. Please check API key configuration.' },
          { status: 403 }
        )
      } else if (response.status === 400) {
        return NextResponse.json(
          { error: 'Invalid voice or parameters selected.' },
          { status: 400 }
        )
      } else if (response.status === 429) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        )
      } else {
        return NextResponse.json(
          { error: 'Text-to-Speech service temporarily unavailable.' },
          { status: 503 }
        )
      }
    }

    const data = await response.json()
    
    if (!data.audioContent) {
      console.error('No audio content received from Google API')
      return NextResponse.json(
        { error: 'Failed to generate audio content.' },
        { status: 500 }
      )
    }

    // Convert base64 to buffer
    const audioBuffer = Buffer.from(data.audioContent, 'base64')
    const processingTime = Date.now() - startTime

    // Log successful request for monitoring
    console.log(`Google TTS Success for ${clientIP}:`, {
      textLength: textValidation.sanitized.length,
      audioSize: audioBuffer.length,
      processingTime: `${processingTime}ms`,
      voice: voiceName
    })

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length.toString(),
        'Content-Disposition': `inline; filename="speech-${voiceName}.mp3"`,
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
        'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' ? 'https://sdnthailand.com' : '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
        'X-Processing-Time': `${processingTime}ms`,
        'X-Text-Length': textValidation.sanitized.length.toString(),
        'X-Provider': 'Google-Cloud-TTS',
      },
    })

  } catch (error) {
    const processingTime = Date.now() - startTime
    
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('TTS request timeout:', error)
      return NextResponse.json(
        { error: 'Request timeout. Please try with shorter text.' },
        { status: 408 }
      )
    }

    console.error('TTS API Internal Error:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error occurred.',
        processingTime: `${processingTime}ms`
      },
      { status: 500 }
    )
  }
}

// Handle preflight requests for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' ? 'https://sdnthailand.com' : '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  })
}

// Clean up rate limit map periodically
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    rateLimitMap.forEach((entry, ip) => {
      if (now > entry.resetTime) {
        rateLimitMap.delete(ip)
      }
    })
  }, RATE_LIMIT_WINDOW)
}