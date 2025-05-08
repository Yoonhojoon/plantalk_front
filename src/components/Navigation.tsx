
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

function NavItem({ to, icon, label, active }: NavItemProps) {
  return (
    <Link
      to={to}
      className={cn(
        "flex flex-col items-center justify-center w-full py-2 space-y-1",
        active ? "text-primary" : "text-muted-foreground hover:text-foreground"
      )}
    >
      <div className="text-xl">{icon}</div>
      <span className="text-xs">{label}</span>
    </Link>
  );
}

export default function Navigation() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 border-t bg-background flex items-center justify-around px-2 z-10">
      <NavItem
        to="/dashboard"
        icon="🌱"
        label="대시보드"
        active={currentPath === "/dashboard"}
      />
      <NavItem
        to="/register"
        icon="➕"
        label="식물 등록"
        active={currentPath === "/register"}
      />
      <NavItem
        to="/notifications"
        icon="🔔"
        label="알림"
        active={currentPath === "/notifications"}
      />
      <NavItem
        to="/simulation"
        icon="⚙️"
        label="시뮬레이션"
        active={currentPath === "/simulation"}
      />
    </div>
  );
}
