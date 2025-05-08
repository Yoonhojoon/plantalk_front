
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, MapPin, Phone, Mail, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";

export default function ProfileScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  return (
    <div className="container max-w-md mx-auto px-4 pt-4 pb-20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-bold">Profile</h1>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/settings')}
        >
          <Settings size={20} />
        </Button>
      </div>
      
      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 rounded-full bg-plant-light-green flex items-center justify-center mb-4">
          <User size={48} className="text-plant-green" />
        </div>
        <h2 className="text-xl font-bold">{user?.fullName}</h2>
        <p className="text-sm text-muted-foreground">Plant Enthusiast</p>
      </div>
      
      <Card className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden mb-6">
        <div className="p-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4">
            CONTACT INFORMATION
          </h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <Mail size={18} className="text-gray-500 mr-3" />
              <span className="text-sm">{user?.email || 'example@email.com'}</span>
            </div>
            <div className="flex items-center">
              <Phone size={18} className="text-gray-500 mr-3" />
              <span className="text-sm">+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center">
              <MapPin size={18} className="text-gray-500 mr-3" />
              <span className="text-sm">San Francisco, CA</span>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="p-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4">
            ACCOUNT ACTIVITY
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Plants Registered</span>
              <span className="font-medium">2</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Purchases</span>
              <span className="font-medium">5</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Reviews</span>
              <span className="font-medium">3</span>
            </div>
          </div>
        </div>
      </Card>
      
      <Button 
        variant="outline" 
        className="w-full rounded-full"
        onClick={() => navigate('/settings')}
      >
        Edit Profile
      </Button>
    </div>
  );
}
