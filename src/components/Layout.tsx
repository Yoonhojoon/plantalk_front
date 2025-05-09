import { Outlet, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import BottomNavigation from "./BottomNavigation";
import { useEffect } from "react";

export default function Layout() {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // 인증 상태가 변경될 때마다 로그

  }, [isAuthenticated, user]);

  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  if (!isAuthenticated || !user) {
    console.log('Layout - Redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen pb-16 bg-background">
      <main>
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  );
}
