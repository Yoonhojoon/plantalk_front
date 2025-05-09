import { useEffect, useState } from "react"; // 👈 설치 관련 훅 추가
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";

// Screens
import LoginScreen from "./pages/LoginScreen";
import SignUpScreen from "./pages/SignUpScreen";
import DashboardScreen from "./pages/DashboardScreen";
import RegisterPlantScreen from "./pages/RegisterPlantScreen";
import NotificationsScreen from "./pages/NotificationsScreen";
import SettingsScreen from "./pages/SettingsScreen";
import ProfileScreen from "./pages/ProfileScreen";
import PlantDetailScreen from "./pages/PlantDetailScreen";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import { PlantProvider } from "./contexts/PlantContext";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => {
  const [canInstall, setCanInstall] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    });

    window.addEventListener("appinstalled", () => {
      console.log("✅ MoodGreen 설치됨!");
    });
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    console.log("설치 선택 결과:", result.outcome);
    setDeferredPrompt(null);
    setCanInstall(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <PlantProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner position="top-center" />

              {/* ✅ 설치 버튼 */}
              {canInstall && (
                <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 999 }}>
                  <button onClick={handleInstall} style={{
                    backgroundColor: "#4caf50",
                    color: "#fff",
                    padding: "12px 18px",
                    borderRadius: "8px",
                    border: "none",
                    fontSize: "16px",
                  }}>
                    MoodGreen 앱 설치하기
                  </button>
                </div>
              )}

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
