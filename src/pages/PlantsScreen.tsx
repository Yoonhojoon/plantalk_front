import { Link } from "react-router-dom";
import { usePlantContext } from "@/contexts/PlantContext";
import PlantCard from "@/components/PlantCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function PlantsScreen() {
  const { plants, loading, error, refreshPlants } = usePlantContext();

  if (loading) {
    return (
      <div className="container max-w-md mx-auto px-4 pt-6 pb-20">
        <div className="text-center py-12">
          <p className="text-muted-foreground">식물 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-md mx-auto px-4 pt-6 pb-20">
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <Button 
            onClick={refreshPlants}
            className="bg-plant-green hover:bg-plant-dark-green rounded-full"
          >
            다시 시도
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-md mx-auto px-4 pt-6 pb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">식물들</h1>
        <Link to="/register-plant">
          <Button className="bg-plant-green hover:bg-plant-dark-green rounded-full">
            <Plus className="mr-2 h-4 w-4" />
            새 식물
          </Button>
        </Link>
      </div>

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
    </div>
  );
} 