import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useEffect } from 'react';
import { requestForToken, onMessageListener } from './firebase';

// Screens
import LoginScreen from "./pages/LoginScreen";
import SignUpScreen from "./pages/SignUpScreen";
import DashboardScreen from "./pages/DashboardScreen";
import RegisterPlantScreen from "./pages/RegisterPlantScreen";
import NotificationsScreen from "./pages/NotificationsScreen";
import SettingsScreen from "./pages/SettingsScreen";
import ProfileScreen from "./pages/ProfileScreen";
import PlantDetailScreen from "./pages/PlantDetailScreen"; // New plant detail page
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import { PlantProvider } from "./contexts/PlantContext";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // 푸시 알림 권한 요청 및 토큰 가져오기
    const requestNotificationPermission = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          const token = await requestForToken();
          console.log('푸시 알림 토큰:', token);
          // 여기서 토큰을 서버에 저장하면 됩니다
        }
      } catch (error) {
        console.error('푸시 알림 권한 요청 실패:', error);
      }
    };

    requestNotificationPermission();

    // 포그라운드 메시지 리스너
    const unsubscribe = onMessageListener().then(payload => {
      console.log('포그라운드 메시지 수신:', payload);
      // 여기서 알림을 표시하거나 다른 작업을 수행할 수 있습니다
    });

    return () => {
      unsubscribe;
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <PlantProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner position="top-center" />
              <BrowserRouter>
                <Routes>
                  <Route path="/login" element={<LoginScreen />} />
                  <Route path="/signup" element={<SignUpScreen />} />
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<DashboardScreen />} />
                    <Route path="/register-plant" element={<RegisterPlantScreen />} />
                    <Route path="/plant-detail/:id" element={<PlantDetailScreen />} />
                    <Route path="/notifications" element={<NotificationsScreen />} />
                    <Route path="/settings" element={<SettingsScreen />} />
                    <Route path="/profile" element={<ProfileScreen />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </PlantProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
