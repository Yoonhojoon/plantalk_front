
import { Outlet, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import BottomNavigation from "./BottomNavigation";

export default function Layout() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
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
