// app/api/test-english/route.ts - ทดสอบด้วยภาษาอังกฤษก่อน
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const azureSpeechKey = process.env.AZURE_SPEECH_KEY
    const azureSpeechRegion = process.env.AZURE_SPEECH_REGION
    
    if (!azureSpeechKey || !azureSpeechRegion) {
      return NextResponse.json({
        error: 'Azure credentials missing'
      })
    }

    // ทดสอบด้วยภาษาอังกฤษที่น่าจะใช้ได้แน่นอน
    const englishSSML = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
<voice name="en-US-AriaNeural">
Hello world, this is a test.
</voice>
</speak>`

    console.log('Testing English voice...')

    const response = await fetch(
      `https://${azureSpeechRegion}.tts.speech.microsoft.com/cognitiveservices/v1`,
      {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': azureSpeechKey,
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-16khz-32kbitrate-mono-mp3'
        },
        body: englishSSML
      }
    )

    console.log('English test response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('English test error:', errorText)
      
      return NextResponse.json({
        success: false,
        status: response.status,
        error: errorText,
        message: 'English voice test failed',
        ssml: englishSSML,
        region: azureSpeechRegion,
        keyPrefix: azureSpeechKey.substring(0, 8) + '...'
      })
    }

    const audioBuffer = await response.arrayBuffer()
    
    return NextResponse.json({
      success: true,
      message: 'English voice works!',
      audioSize: audioBuffer.byteLength,
      voice: 'en-US-AriaNeural',
      region: azureSpeechRegion
    })

  } catch (error) {
    console.error('English test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}