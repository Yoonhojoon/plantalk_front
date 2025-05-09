import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

console.log('LoginScreen 렌더링됨');

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      alert("이메일과 비밀번호를 모두 입력해주세요");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await login({ email, password });
      alert("로그인 성공!");
      navigate('/dashboard', { replace: true });
    } catch (error: any) {
      console.error('Login error:', error);
      
      // 에러 메시지 처리
      let errorMessage = "로그인에 실패했습니다. 다시 시도해주세요.";
      
      if (error.response) {
        // 서버에서 반환한 에러
        const status = error.response.status;
        const data = error.response.data;
        
        switch (status) {
          case 400:
            errorMessage = data.detail || "잘못된 요청입니다.";
            break;
          case 401:
            errorMessage = "이메일 또는 비밀번호가 올바르지 않습니다.";
            break;
          case 403:
            errorMessage = "접근이 거부되었습니다.";
            break;
          case 404:
            errorMessage = "서비스를 찾을 수 없습니다.";
            break;
          case 500:
            errorMessage = "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
            break;
          default:
            errorMessage = data.detail || "알 수 없는 오류가 발생했습니다.";
        }
      } else if (error.request) {
        // 요청은 보냈지만 응답을 받지 못한 경우
        errorMessage = "서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.";
      }
      
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-plant-light-white/40 dark:bg-gray-900 flex flex-col justify-between p-6">
      <div className="w-full flex flex-col items-center mt-12 fade-in">
        <Logo size="large" />
      </div>
      
      <div className="w-full max-w-md mx-auto mt-auto mb-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="plant-form-input h-12 text-foreground dark:text-white dark:bg-gray-700/90 dark:border-gray-600 backdrop-blur-sm"
            />
          
            <Input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="plant-form-input h-12 text-foreground dark:text-white dark:bg-gray-700/90 dark:border-gray-600 backdrop-blur-sm"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-plant-green hover:bg-plant-dark-green text-white h-12 rounded-full font-medium"
            disabled={isLoading}
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            계정이 없으신가요?{" "}
            <Link to="/signup" className="text-plant-green hover:underline font-medium dark:text-plant-light-green">
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
