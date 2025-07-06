// app/api/test-voices/route.ts - ทดสอบ voice ทั้งหมดที่ใช้ได้
import { NextResponse } from 'next/server'

const VOICES_TO_TEST = [
  // Thai voices
  'th-TH-Pattara',
  'th-TH-PremwadaNeural', 
  'th-TH-NiwatNeural',
  
  // English voices (backup)
  'en-US-AriaNeural',
  'en-US-JennyNeural',
  'en-US-GuyNeural',
  
  // Other common voices
  'zh-CN-XiaoxiaoNeural',
  'ja-JP-NanamiNeural'
]

export async function GET() {
  const azureSpeechKey = process.env.AZURE_SPEECH_KEY
  const azureSpeechRegion = process.env.AZURE_SPEECH_REGION
  
  if (!azureSpeechKey || !azureSpeechRegion) {
    return NextResponse.json({
      error: 'Azure credentials missing'
    })
  }

  const results = []
  
  for (const voice of VOICES_TO_TEST) {
    try {
      const isThaiVoice = voice.startsWith('th-TH')
      const testText = isThaiVoice ? 'สวัสดี' : 'Hello'
      const lang = isThaiVoice ? 'th-TH' : 
                  voice.startsWith('en-US') ? 'en-US' :
                  voice.startsWith('zh-CN') ? 'zh-CN' : 'ja-JP'
      
      const ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${lang}">
<voice name="${voice}">
${testText}
</voice>
</speak>`

      console.log(`Testing voice: ${voice}`)
      
      const response = await fetch(
        `https://${azureSpeechRegion}.tts.speech.microsoft.com/cognitiveservices/v1`,
        {
          method: 'POST',
          headers: {
            'Ocp-Apim-Subscription-Key': azureSpeechKey,
            'Content-Type': 'application/ssml+xml',
            'X-Microsoft-OutputFormat': 'audio-16khz-32kbitrate-mono-mp3'
          },
          body: ssml
        }
      )

      if (response.ok) {
        const audioBuffer = await response.arrayBuffer()
        results.push({
          voice,
          status: 'SUCCESS',
          audioSize: audioBuffer.byteLength,
          language: lang
        })
        console.log(`✅ ${voice} - SUCCESS`)
      } else {
        const errorText = await response.text()
        results.push({
          voice,
          status: 'FAILED',
          error: response.status,
          errorText: errorText.substring(0, 100),
          language: lang
        })
        console.log(`❌ ${voice} - FAILED (${response.status})`)
      }
      
      // รอสักครู่ระหว่างการทดสอบ
      await new Promise(resolve => setTimeout(resolve, 100))
      
    } catch (error) {
      results.push({
        voice,
        status: 'ERROR',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      console.log(`💥 ${voice} - ERROR`)
    }
  }

  // หา voices ที่ใช้ได้
  const workingVoices = results.filter(r => r.status === 'SUCCESS')
  const failedVoices = results.filter(r => r.status !== 'SUCCESS')

  return NextResponse.json({
    region: azureSpeechRegion,
    totalTested: VOICES_TO_TEST.length,
    workingVoices: workingVoices.length,
    failedVoices: failedVoices.length,
    results,
    summary: {
      working: workingVoices.map(v => v.voice),
      failed: failedVoices.map(v => v.voice)
    },
    recommendation: workingVoices.length > 0 ? 
      `Use: ${workingVoices[0].voice}` : 
      'No working voices found'
  })
}