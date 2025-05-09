import { supabase } from '@/lib/supabase';
import { LoginRequest, LoginResponse } from '@/types/auth';

export class AuthService {
  static async login(data: LoginRequest): Promise<LoginResponse> {
    console.log('로그인 요청 데이터:', data);
    
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      console.error('Supabase 로그인 에러:', error);
      throw new Error(error.message);
    }

    if (!authData.session) {
      throw new Error('로그인 세션이 생성되지 않았습니다.');
    }

    const response: LoginResponse = {
      access_token: authData.session.access_token,
      token_type: 'bearer',
      user_id: authData.user.id,
    };

    return response;
  }

  static async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Supabase 로그아웃 에러:', error);
      throw new Error(error.message);
    }
  }

  static setAuthToken(token: string): void {
    // Supabase는 자동으로 토큰을 관리하므로 별도의 저장이 필요 없습니다.
  }

  static async getAuthToken(): Promise<string | null> {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  }
} 