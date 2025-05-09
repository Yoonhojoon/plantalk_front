// API 응답 기본 타입
export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}

// 에러 응답 타입
export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

// 페이지네이션 응답 타입
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 