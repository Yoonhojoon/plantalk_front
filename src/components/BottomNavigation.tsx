
import { Link, useLocation } from "react-router-dom";
import { Home, Search, ShoppingCart, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BottomNavigation() {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    {
      icon: <Home size={20} />,
      label: "Home",
      path: "/dashboard",
    },
    {
      icon: <Search size={20} />,
      label: "Search",
      path: "/search",
    },
    {
      icon: <ShoppingCart size={20} />,
      label: "Cart",
      path: "/cart",
    },
    {
      icon: <User size={20} />,
      label: "Profile",
      path: "/profile",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex items-center justify-around z-10">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={cn(
            "flex flex-col items-center justify-center w-full py-1 space-y-1",
            currentPath === item.path
              ? "text-plant-green"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          )}
        >
          <div>{item.icon}</div>
          <span className="text-xs">{item.label}</span>
        </Link>
      ))}
    </div>
  );
}
