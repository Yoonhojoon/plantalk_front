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
      toast.error("이메일과 비밀번호를 모두 입력해주세요");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        toast.success("로그인 성공!");
        console.log('Login successful, navigating to dashboard');
        navigate('/dashboard', { replace: true });
      } else {
        toast.error("로그인 실패. 다시 시도해주세요.");
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || "오류가 발생했습니다. 다시 시도해주세요.");
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
