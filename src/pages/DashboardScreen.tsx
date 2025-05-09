
import { Link } from "react-router-dom";
import { usePlantContext } from "@/contexts/PlantContext";
import { useAuth } from "@/contexts/AuthContext";
import PlantCard from "@/components/PlantCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function DashboardScreen() {
  const { plants } = usePlantContext();
  const { user } = useAuth();

  return (
    <div className="container max-w-md mx-auto px-4 pt-6 pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">안녕하세요, {user?.fullName?.split(' ')[0] || '사용자'}님</h1>
        <p className="text-sm text-muted-foreground">Plantalk에 오신 것을 환영합니다</p>
      </div>

      <div className="bg-plant-light-green/25 rounded-2xl p-4 mb-6">
        <h2 className="text-lg font-semibold text-plant-green">식물 관리 팁</h2>
        <p className="text-sm mt-1">여름철에는 습도 수준을 확인하세요. 식물에 더 많은 물이 필요할 수 있습니다!</p>
      </div>

      <h2 className="text-lg font-semibold mb-3">내 식물</h2>

      {plants.length === 0 ? (
        <div className="text-center py-12 rounded-lg bg-gray-50 border-2 border-dashed border-gray-200">
          <p className="text-muted-foreground">아직 등록된 식물이 없습니다</p>
          <Link to="/register-plant">
            <Button className="mt-4 bg-plant-green hover:bg-plant-dark-green rounded-full">
              첫 번째 식물 추가하기
            </Button>
          </Link>
        </div>



      ) : (
        <div className="grid grid-cols-2 gap-4">
          {plants.map((plant) => (
            <PlantCard key={plant.id} plant={plant} />
          ))}
        </div>
      )}

      <Link to="/register-plant" className="fixed bottom-20 right-4">
        <Button size="icon" className="w-14 h-14 rounded-full bg-plant-green hover:bg-plant-dark-green shadow-lg">
          <Plus size={24} />
        </Button>
      </Link>
    </div>
  );
}
