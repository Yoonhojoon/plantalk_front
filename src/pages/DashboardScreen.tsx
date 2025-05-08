
import { Link } from "react-router-dom";
import { usePlantContext } from "@/contexts/PlantContext";
import { useAuth } from "@/contexts/AuthContext";
import PlantCard from "@/components/PlantCard";
import { Button } from "@/components/ui/button";
import { Bell, Settings, Plus } from "lucide-react";

export default function DashboardScreen() {
  const { plants } = usePlantContext();
  const { user } = useAuth();

  return (
    <div className="container max-w-md mx-auto px-4 pt-6 pb-20">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Hello, {user?.fullName?.split(' ')[0] || 'there'}</h1>
          <p className="text-sm text-muted-foreground">Welcome to your plant dashboard</p>
        </div>
        <div className="flex space-x-2">
          <Link to="/notifications">
            <Button variant="outline" size="icon" className="rounded-full">
              <Bell size={20} />
            </Button>
          </Link>
          <Link to="/settings">
            <Button variant="outline" size="icon" className="rounded-full">
              <Settings size={20} />
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-plant-light-green/25 rounded-2xl p-4 mb-6">
        <h2 className="text-lg font-semibold text-plant-green">Plant Care Tips</h2>
        <p className="text-sm mt-1">Remember to check humidity levels during summer months. Your plants may need more water!</p>
      </div>

      <h2 className="text-lg font-semibold mb-3">Your Plants</h2>

      {plants.length === 0 ? (
        <div className="text-center py-12 rounded-lg bg-gray-50 border-2 border-dashed border-gray-200">
          <p className="text-muted-foreground">You haven't added any plants yet</p>
          <Link to="/register-plant">
            <Button className="mt-4 bg-plant-green hover:bg-plant-dark-green rounded-full">
              Add Your First Plant
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
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
