const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

  // 👉 여기에 로그 삽입
  console.log("📦 SUPABASE_URL:", SUPABASE_URL);
  
if (!SUPABASE_URL) {
  console.error('Supabase URL이 설정되지 않았습니다.');
}

export const sendFCMNotification = async (data: {
  token: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}) => {
  if (!data.token) {
    throw new Error('FCM 토큰이 필요합니다.');
  }

  if (!SUPABASE_URL) {
    throw new Error('Supabase URL이 설정되지 않았습니다.');
  }

  try {
    const url = `${SUPABASE_URL}/functions/v1/send-notification`;
    console.log("📦 요청 URL:", url);
    
    const requestData = {
      fcmToken: data.token,
      notification: {
        title: data.title,
        body: data.body,
      },
      data: data.data,
    };

    console.log('알림 전송 시도:', {
      url,
      data: requestData
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    let responseData;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      const text = await response.text();
      console.error('Edge Function 응답이 JSON이 아닙니다:', text);
      throw new Error(`Edge Function 응답이 JSON이 아닙니다: ${text}`);
    }

    if (!response.ok) {
      console.error('Edge Function 응답 에러:', {
        status: response.status,
        statusText: response.statusText,
        error: responseData,
        url,
        headers: Object.fromEntries(response.headers.entries())
      });
      throw new Error(`HTTP error! status: ${response.status}, message: ${JSON.stringify(responseData)}`);
    }

    console.log('알림 전송 성공:', responseData);
    return responseData;
  } catch (error) {
    console.error('FCM 알림 전송 실패:', error);
    if (error instanceof Error) {
      console.error('에러 상세:', error.message);
      console.error('에러 스택:', error.stack);
    }
    throw error;
  }
}; 