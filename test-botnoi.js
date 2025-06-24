// test-botnoi.js
// สคริปต์ทดสอบ Botnoi API

const fetch = require('node-fetch');

async function testBotnoiAPI() {
  try {
    console.log('🧪 Testing Botnoi Voice API...');
    
    const apiKey = 'yl4RwIbxQ9jFwGOdGWEMsV8YmrxQ6KYU';
    const apiUrl = 'https://api-voice.botnoi.ai/openapi/v1/generate_audio';
    
    const requestBody = {
      text: "สวัสดีครับ นี่คือการทดสอบเสียงจาก Botnoi Voice สำหรับเว็บไซต์ SDN Thailand",
      speaker: "41_v2", // ไซเรน V2
      volume: 1,
      speed: 1,
      type_media: "mp3",
      save_file: true,
      language: "th"
    };

    console.log('📤 Sending request...');
    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Botnoi-Token': apiKey
      },
      body: JSON.stringify(requestBody)
    });

    console.log('📥 Response status:', response.status);
    console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', errorText);
      return;
    }

    const data = await response.json();
    console.log('✅ Response data:', JSON.stringify(data, null, 2));

    // ตรวจสอบว่ามี audio URL หรือไม่
    if (data.audio_url || data.file_url) {
      console.log('🎵 Audio URL received:', data.audio_url || data.file_url);
      
      // ทดสอบดาวน์โหลดไฟล์เสียง
      const audioUrl = data.audio_url || data.file_url;
      const audioResponse = await fetch(audioUrl);
      
      console.log('🎵 Audio download status:', audioResponse.status);
      console.log('🎵 Audio content-type:', audioResponse.headers.get('content-type'));
      console.log('🎵 Audio size:', audioResponse.headers.get('content-length'), 'bytes');
      
      if (audioResponse.ok) {
        console.log('✅ Audio file downloaded successfully!');
      }
    } else if (data.audio || data.data) {
      console.log('🎵 Base64 audio data received, length:', (data.audio || data.data).length);
      console.log('✅ Audio data received successfully!');
    } else {
      console.log('⚠️  No audio content found in response');
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// รันการทดสอบ
testBotnoiAPI();

// สำหรับการใช้งานใน browser (ใส่ใน console)
/*
async function testBotnoiInBrowser() {
  const response = await fetch('/api/botnoi-tts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: 'สวัสดีครับ ทดสอบ Botnoi Voice',
      speaker: '41_v2',
      speed: 1.0,
      language: 'th'
    })
  });

  if (response.ok) {
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.play();
    console.log('✅ TTS working!', audioUrl);
  } else {
    const error = await response.json();
    console.error('❌ TTS failed:', error);
  }
}

// เรียกใช้: testBotnoiInBrowser()
*/