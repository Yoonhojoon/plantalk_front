
import PlantForm from "@/components/PlantForm";
import { useNavigate } from "react-router-dom";

export default function RegisterScreen() {
  const navigate = useNavigate();
  
  const handleComplete = () => {
    navigate("/dashboard");
  };

  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-2xl font-bold">식물 등록</h1>
      <PlantForm onComplete={handleComplete} />
    </div>
  );
}
