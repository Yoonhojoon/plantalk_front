
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function SignUpScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !email || !password || !confirmPassword) {
      toast.error("모든 필드를 입력해주세요");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("비밀번호가 일치하지 않습니다");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await signup(fullName, password, email);
      if (success) {
        toast.success("계정이 성공적으로 생성되었습니다!");
        navigate('/dashboard');
      } else {
        toast.error("회원가입 실패. 다시 시도해주세요.");
      }
    } catch (error) {
      toast.error("오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-plant-light-green/40 dark:bg-gray-900 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 fade-in">
        <div className="flex flex-col items-center mb-8">
          <Logo size="medium" />
          <h1 className="text-2xl font-bold mt-4 text-center dark:text-white">계정 생성</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="이름"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="plant-form-input h-12 text-foreground dark:text-white dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="plant-form-input h-12 text-foreground dark:text-white dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="plant-form-input h-12 text-foreground dark:text-white dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="plant-form-input h-12 text-foreground dark:text-white dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-plant-green hover:bg-plant-dark-green text-white h-12 rounded-full font-medium mt-4"
            disabled={isLoading}
          >
            {isLoading ? "계정 생성 중..." : "회원가입"}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            이미 계정이 있으신가요?{" "}
            <Link to="/login" className="text-plant-green hover:underline font-medium dark:text-plant-light-green">
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
