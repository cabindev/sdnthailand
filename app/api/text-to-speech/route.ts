// app/api/text-to-speech/route.ts - แก้ไขให้ใช้ Azure แทน Google
import { NextRequest, NextResponse } from 'next/server'

// Rate limiting configuration
interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitMap = new Map<string, RateLimitEntry>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10 // 10 requests per minute per IP
const MAX_TEXT_LENGTH = 2000 // ลดลงเป็น 2000 characters

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

// Generate SSML for Azure - ต้องมี voice tag เสมอ
function generateSSML(text: string, voiceName?: string): string {
  // Escape text for XML
  const escapedText = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u0084\u0086-\u009F]/g, '')

  // Azure requires voice tag - ใช้ voice ที่ทำงานได้
  const voice = voiceName || 'th-TH-NiwatNeural'
  
  return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="th-TH">
<voice name="${voice}">
${escapedText}
</voice>
</speak>`
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
      voiceName = 'th-TH-NiwatNeural', // ใช้ voice ที่ทำงานได้!
      ssmlGender = 'Male', // NiwatNeural เป็นเสียงผู้ชาย
      speakingRate = 0.9,
      pitch = '0st',
      volume = 'default'
    } = body

    // Validate text
    const textValidation = validateText(text)
    if (!textValidation.isValid) {
      return NextResponse.json(
        { error: textValidation.error },
        { status: 400 }
      )
    }

    // Check Azure credentials
    const azureSpeechKey = process.env.AZURE_SPEECH_KEY
    const azureSpeechRegion = process.env.AZURE_SPEECH_REGION
    
    if (!azureSpeechKey || !azureSpeechRegion) {
      console.error('Azure Speech credentials not configured')
      return NextResponse.json(
        { error: 'Text-to-Speech service not available' },
        { status: 503 }
      )
    }

    // Generate SSML แบบง่าย
    const ssml = generateSSML(textValidation.sanitized, voiceName)

    console.log(`Azure TTS Request from ${clientIP}:`, {
      textLength: textValidation.sanitized.length,
      voice: voiceName || 'auto',
      ssml: ssml.substring(0, 200) + '...', // แสดง SSML ตัวอย่าง
      truncated: textValidation.error ? true : false
    })

    // Call Azure Speech API with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

    const azureUrl = `https://${azureSpeechRegion}.tts.speech.microsoft.com/cognitiveservices/v1`

    const response = await fetch(azureUrl, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': azureSpeechKey,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
        'User-Agent': 'SDNThailand-TTS/1.0'
      },
      body: ssml,
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Azure TTS API Error (${response.status}):`, errorText)
      
      // Log for monitoring
      console.error(`TTS API Error for IP ${clientIP}:`, {
        status: response.status,
        textLength: textValidation.sanitized.length,
        voice: voiceName
      })
      
      // Return user-friendly error messages
      if (response.status === 403) {
        return NextResponse.json(
          { error: 'API access denied. Please check Azure API key configuration.' },
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

    // Azure returns binary audio data directly
    const audioBuffer = await response.arrayBuffer()
    const processingTime = Date.now() - startTime

    if (!audioBuffer || audioBuffer.byteLength === 0) {
      console.error('No audio content received from Azure API')
      return NextResponse.json(
        { error: 'Failed to generate audio content.' },
        { status: 500 }
      )
    }

    // Log successful request for monitoring
    console.log(`Azure TTS Success for ${clientIP}:`, {
      textLength: textValidation.sanitized.length,
      audioSize: audioBuffer.byteLength,
      processingTime: `${processingTime}ms`,
      voice: voiceName
    })

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
        'Content-Disposition': `inline; filename="speech-${voiceName}.mp3"`,
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
        'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' ? 'https://sdnthailand.com' : '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
        'X-Processing-Time': `${processingTime}ms`,
        'X-Text-Length': textValidation.sanitized.length.toString(),
        'X-Provider': 'Azure-Cognitive-Services',
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