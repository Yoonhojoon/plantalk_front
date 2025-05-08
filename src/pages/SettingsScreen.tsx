
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut, User, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function SettingsScreen() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  
  const handleLogout = () => {
    logout();
    toast.success("로그아웃되었습니다");
    navigate("/login");
  };
  
  return (
    <div className="container max-w-md mx-auto px-4 pt-4 pb-20">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-xl font-bold">설정</h1>
      </div>
      
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="bg-plant-light-green text-plant-green rounded-full p-3">
              <User size={24} />
            </div>
            <div>
              <h2 className="font-semibold text-lg">{user?.fullName}</h2>
              <p className="text-sm text-muted-foreground">{user?.email || '이메일 없음'}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm divide-y">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center">
              {isDarkMode ? <Moon size={18} className="mr-3" /> : <Sun size={18} className="mr-3" />}
              <span>다크 모드</span>
            </div>
            <Switch 
              checked={isDarkMode}
              onCheckedChange={toggleTheme}
            />
          </div>
          
          <div className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">앱 버전</h3>
            <p className="text-sm">1.0.0</p>
          </div>
          
          <div className="p-4">
            <Button 
              variant="destructive" 
              className="w-full flex items-center justify-center gap-2 rounded-full"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              <span>로그아웃</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
