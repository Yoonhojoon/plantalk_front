
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center">
        <div className="text-6xl mb-6">🌵</div>
        <h1 className="text-4xl font-bold mb-4">페이지를 찾을 수 없습니다</h1>
        <p className="text-xl text-muted-foreground mb-6">
          요청하신 페이지가 존재하지 않습니다
        </p>
        <Button onClick={() => navigate("/dashboard")}>홈으로 돌아가기</Button>
      </div>
    </div>
  );
};

export default NotFound;
