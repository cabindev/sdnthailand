// app/api/test-minimal/route.ts - ทดสอบ Azure แบบง่ายที่สุด
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const azureSpeechKey = process.env.AZURE_SPEECH_KEY
    const azureSpeechRegion = process.env.AZURE_SPEECH_REGION
    
    if (!azureSpeechKey || !azureSpeechRegion) {
      return NextResponse.json({
        error: 'Azure credentials missing',
        hasKey: !!azureSpeechKey,
        hasRegion: !!azureSpeechRegion
      })
    }

    // ทดสอบด้วยข้อความสั้น ๆ และ voice ที่ทำงานได้
    const simpleSSML = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="th-TH">
<voice name="th-TH-NiwatNeural">
สวัสดี
</voice>
</speak>`

    console.log('Testing Azure with minimal SSML:', simpleSSML)

    const azureUrl = `https://${azureSpeechRegion}.tts.speech.microsoft.com/cognitiveservices/v1`

    const response = await fetch(azureUrl, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': azureSpeechKey,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-16khz-32kbitrate-mono-mp3' // ลองใช้ format ง่าย ๆ
      },
      body: simpleSSML
    })

    console.log('Azure Response Status:', response.status)
    console.log('Azure Response Headers:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Azure Error Response:', errorText)
      
      return NextResponse.json({
        error: 'Azure API Error',
        status: response.status,
        statusText: response.statusText,
        responseText: errorText,
        url: azureUrl,
        requestHeaders: {
          'Ocp-Apim-Subscription-Key': azureSpeechKey.substring(0, 8) + '...',
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-16khz-32kbitrate-mono-mp3'
        },
        ssml: simpleSSML
      })
    }

    const audioBuffer = await response.arrayBuffer()
    
    return NextResponse.json({
      success: true,
      audioSize: audioBuffer.byteLength,
      message: 'Azure TTS is working!',
      ssml: simpleSSML
    })

  } catch (error) {
    console.error('Test Error:', error)
    return NextResponse.json({
      error: 'Test failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

// ทดสอบ POST ด้วย
export async function POST() {
  try {
    // ทดสอบด้วยข้อความภาษาอังกฤษที่มี voice tag
    const englishSSML = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
<voice name="en-US-AriaNeural">
Hello world
</voice>
</speak>`
    
    const response = await fetch(
      `https://${process.env.AZURE_SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`,
      {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': process.env.AZURE_SPEECH_KEY!,
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-16khz-32kbitrate-mono-mp3'
        },
        body: englishSSML
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json({
        error: 'English test failed',
        status: response.status,
        errorText,
        ssml: englishSSML
      })
    }

    return NextResponse.json({
      success: true,
      message: 'English test passed!',
      audioSize: (await response.arrayBuffer()).byteLength
    })

  } catch (error) {
    return NextResponse.json({
      error: 'POST test failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}