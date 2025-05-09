import { useEffect, useState } from "react"; // 👈 설치 관련 훅 추가
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useNotification } from "./hooks/useNotification";

// Screens
import LoginScreen from "./pages/LoginScreen";
import SignUpScreen from "./pages/SignUpScreen";
import DashboardScreen from "./pages/DashboardScreen";
import RegisterPlantScreen from "./pages/RegisterPlantScreen";
import NotificationsPage from "./pages/NotificationsPage";
import ProfileScreen from "./pages/ProfileScreen";
import PlantDetailScreen from "./pages/PlantDetailScreen";
import PlantsScreen from "./pages/PlantsScreen";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import { PlantProvider } from "./contexts/PlantContext";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => {
  const { token, error } = useNotification();

  useEffect(() => {
    if (token) {
      // TODO: 토큰을 서버에 저장하는 로직 구현
      console.log('FCM Token:', token);
    }
    if (error) {
      console.error('FCM Error:', error);
    }
  }, [token, error]);

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
                    <Route path="/plants" element={<PlantsScreen />} />
                    <Route path="/register-plant" element={<RegisterPlantScreen />} />
                    <Route path="/plant-detail/:id" element={<PlantDetailScreen />} />
                    <Route path="/notifications" element={<NotificationsPage />} />
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
