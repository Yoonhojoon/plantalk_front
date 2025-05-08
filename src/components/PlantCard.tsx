
import { useState } from "react";
import { Plant } from "../models/PlantModel";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Thermometer, Droplet } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { usePlantContext } from "@/contexts/PlantContext";
import { toast } from "sonner";

interface PlantCardProps {
  plant: Plant;
}

export default function PlantCard({ plant }: PlantCardProps) {
  const { removePlant } = usePlantContext();
  const [open, setOpen] = useState(false);
  
  const handleDelete = () => {
    removePlant(plant.id);
    toast.success("Plant removed successfully");
    setOpen(false);
  };
  
  const isTemperatureOk = 
    plant.status.temperature >= plant.environment.temperature.min &&
    plant.status.temperature <= plant.environment.temperature.max;
  
  const isHumidityOk = 
    plant.status.humidity >= plant.environment.humidity.min &&
    plant.status.humidity <= plant.environment.humidity.max;

  return (
    <Card className="plant-card border-0 relative">
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 right-2 z-10 bg-white/70 hover:bg-white/90 text-gray-500 rounded-full p-1 w-8 h-8"
          >
            <Trash2 size={16} />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {plant.name} from your plant collection.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 rounded-full"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <div className="relative h-40 overflow-hidden">
        <img 
          src={plant.image} 
          alt={plant.name} 
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=500";
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3">
          <div className="flex justify-between">
            <div>
              <h3 className="text-white font-medium text-lg">{plant.name}</h3>
              <p className="text-white/80 text-xs">{plant.species}</p>
            </div>
            <div className="bg-plant-green/90 text-white text-xs font-semibold px-2 py-1 rounded-full self-start">
              {plant.location}
            </div>
          </div>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-lg ${isTemperatureOk ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
              <Thermometer size={18} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Temperature</p>
              <p className="font-medium">
                {plant.status.temperature}°C
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-lg ${isHumidityOk ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-500'}`}>
              <Droplet size={18} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Humidity</p>
              <p className="font-medium">
                {plant.status.humidity}%
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
