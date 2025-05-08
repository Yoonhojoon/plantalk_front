
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center">
        <div className="text-6xl mb-6">🌱</div>
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        <p className="text-xl text-muted-foreground mb-6">
          The page you're looking for doesn't exist.
        </p>
        <Button 
          onClick={() => navigate("/dashboard")}
          className="bg-plant-green hover:bg-plant-dark-green rounded-full"
        >
          Go Back Home
        </Button>
      </div>
    </div>
  );
}
