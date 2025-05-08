
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
import PlantDetailScreen from "./pages/PlantDetailScreen"; // New plant detail page
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import { PlantProvider } from "./contexts/PlantContext";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => (
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

export default App;
