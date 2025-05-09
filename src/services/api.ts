import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request 인터셉터 - 토큰 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    alert('요청을 처리하는 중 오류가 발생했습니다.');
    return Promise.reject(error);
  }
);

// Response 인터셉터 - 토큰 만료 처리
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // 토큰이 만료되었거나 유효하지 않은 경우
      localStorage.removeItem('access_token');
      alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      alert('접근 권한이 없습니다.');
    } else if (error.response?.status === 404) {
      alert('요청한 리소스를 찾을 수 없습니다.');
    } else if (error.response?.status === 500) {
      alert('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } else if (!error.response) {
      alert('서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.');
    }
    return Promise.reject(error);
  }
);

export default api; 