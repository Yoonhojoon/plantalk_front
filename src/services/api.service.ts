import api from '@/lib/api';
import { ApiResponse, ApiError } from '@/types/api';

export class ApiService {
  protected static async get<T>(url: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    try {
      const response = await api.get<ApiResponse<T>>(url, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  protected static async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await api.post<ApiResponse<T>>(url, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  protected static async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await api.put<ApiResponse<T>>(url, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  protected static async delete<T>(url: string): Promise<ApiResponse<T>> {
    try {
      const response = await api.delete<ApiResponse<T>>(url);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private static handleError(error: any): ApiError {
    if (error.response) {
      return {
        message: error.response.data.message || '서버 오류가 발생했습니다.',
        status: error.response.status,
        errors: error.response.data.errors,
      };
    }
    return {
      message: '네트워크 오류가 발생했습니다.',
      status: 500,
    };
  }
} 