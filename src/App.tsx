
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardScreen from "./pages/DashboardScreen";
import RegisterScreen from "./pages/RegisterScreen";
import NotificationsScreen from "./pages/NotificationsScreen";
import SimulationScreen from "./pages/SimulationScreen";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import { PlantProvider } from "./contexts/PlantContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <PlantProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardScreen />} />
              <Route path="/register" element={<RegisterScreen />} />
              <Route path="/notifications" element={<NotificationsScreen />} />
              <Route path="/simulation" element={<SimulationScreen />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </PlantProvider>
  </QueryClientProvider>
);

export default App;
