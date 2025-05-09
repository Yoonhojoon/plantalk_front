
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, MapPin, Phone, Mail, Moon, Sun, LogOut, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { usePlantContext } from "@/contexts/PlantContext";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useTheme } from "@/contexts/ThemeContext";

export default function ProfileScreen() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { plants } = usePlantContext();
  const { isDarkMode, toggleTheme } = useTheme();
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '사용자',
    email: user?.email || 'example@email.com',
    phone: '+1 (555) 123-4567',
    location: '서울특별시'
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSaveProfile = () => {
    // In a real app, this would update the user profile in the backend
    setIsEditing(false);
    toast.success("프로필이 업데이트되었습니다");
  };
  
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
        <h1 className="text-xl font-bold">프로필</h1>
      </div>
      
      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 rounded-full bg-plant-light-green flex items-center justify-center mb-4">
          <User size={48} className="text-plant-green" />
        </div>
        {isEditing ? (
          <Input
            name="fullName"
            value={profileData.fullName}
            onChange={handleInputChange}
            className="text-center text-xl font-bold mb-1"
          />
        ) : (
          <h2 className="text-xl font-bold">{profileData.fullName}</h2>
        )}
        <p className="text-sm text-muted-foreground">식물 애호가</p>
      </div>
      
      <Card className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden mb-6">
        <div className="p-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4">
            연락처 정보
          </h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <Mail size={18} className="text-gray-500 mr-3" />
              {isEditing ? (
                <Input
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  className="text-sm h-8"
                />
              ) : (
                <span className="text-sm">{profileData.email}</span>
              )}
            </div>
            <div className="flex items-center">
              <Phone size={18} className="text-gray-500 mr-3" />
              {isEditing ? (
                <Input
                  name="phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  className="text-sm h-8"
                />
              ) : (
                <span className="text-sm">{profileData.phone}</span>
              )}
            </div>
            <div className="flex items-center">
              <MapPin size={18} className="text-gray-500 mr-3" />
              {isEditing ? (
                <Input
                  name="location"
                  value={profileData.location}
                  onChange={handleInputChange}
                  className="text-sm h-8"
                />
              ) : (
                <span className="text-sm">{profileData.location}</span>
              )}
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="p-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4">
            계정 활동
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">내 식물 수</span>
              <span className="font-medium">{plants.length}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Settings section integrated into Profile */}
        <div className="p-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4">
            설정
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {isDarkMode ? <Moon size={18} className="text-gray-500 mr-3" /> : <Sun size={18} className="text-gray-500 mr-3" />}
                <span className="text-sm">다크 모드</span>
              </div>
              <Switch 
                checked={isDarkMode}
                onCheckedChange={toggleTheme}
              />
            </div>
            
            <div className="flex items-center">
              <Info size={18} className="text-gray-500 mr-3" />
              <div className="flex flex-col">
                <span className="text-sm">앱 버전</span>
                <span className="text-xs text-muted-foreground">1.0.0</span>
              </div>
            </div>
            
            <Button 
              variant="destructive" 
              className="w-full flex items-center justify-center gap-2 rounded-full mt-4"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              <span>로그아웃</span>
            </Button>
          </div>
        </div>
      </Card>
      
      {!isEditing && (
        <Button 
          variant="outline"
          className="w-full rounded-full"
          onClick={() => setIsEditing(true)}
        >
          프로필 수정
        </Button>
      )}
      
      {isEditing && (
        <Button 
          variant="default" 
          className="w-full rounded-full"
          onClick={handleSaveProfile}
        >
          프로필 저장
        </Button>
      )}
    </div>
  );
}
