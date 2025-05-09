export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user_id: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    email: string;
  } | null;
  token: string | null;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  email_verified: boolean;
  phone_verified: boolean;
} 