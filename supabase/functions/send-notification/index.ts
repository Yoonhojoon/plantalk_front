import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Max-Age': '86400',
};

serve(async (req) => {
  // CORS preflight 요청 처리
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    // 요청 본문 파싱
    let body;
    const contentType = req.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return new Response(
        JSON.stringify({ error: 'Content-Type이 application/json이어야 합니다.' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    try {
      const text = await req.text();
      console.log('Received request body:', text);
      body = JSON.parse(text);
      console.log("수신된 body:", JSON.stringify(body, null, 2));

    } catch (e) {
      console.error('JSON 파싱 에러:', e);
      return new Response(
        JSON.stringify({ 
          error: '잘못된 JSON 형식입니다.',
          details: e.message
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Parsed request body:', body);

    const { fcmToken, notification, data } = body;

    if (!fcmToken) {
      return new Response(
        JSON.stringify({ error: 'FCM 토큰이 필요합니다.' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const FIREBASE_SERVER_KEY = Deno.env.get('FIREBASE_SERVER_KEY');
    if (!FIREBASE_SERVER_KEY) {
      return new Response(
        JSON.stringify({ error: 'Firebase 서버 키가 설정되지 않았습니다.' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // FCM 메시지 전송
    const fcmPayload = {
      to: fcmToken,
      notification,
      data,
    };

    console.log('Sending FCM payload:', fcmPayload);

    const fcmResponse = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `key=${FIREBASE_SERVER_KEY}`,
      },
      body: JSON.stringify(fcmPayload),
    });

    const fcmResult = await fcmResponse.json();
    console.log('FCM response:', fcmResult);

    return new Response(
      JSON.stringify({
        success: fcmResponse.ok,
        result: fcmResult
      }),
      { 
        status: fcmResponse.ok ? 200 : fcmResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || '알 수 없는 오류가 발생했습니다.',
        details: error.toString()
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
