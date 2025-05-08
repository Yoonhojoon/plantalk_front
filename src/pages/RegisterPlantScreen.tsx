
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePlantContext } from "@/contexts/PlantContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Camera, Image, Thermometer, Droplet } from "lucide-react";
import { toast } from "sonner";

export default function RegisterPlantScreen() {
  const navigate = useNavigate();
  const { addPlant } = usePlantContext();
  
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [location, setLocation] = useState("Indoor");
  const [image, setImage] = useState("");
  const [temperature, setTemperature] = useState({ min: 18, max: 26 });
  const [humidity, setHumidity] = useState({ min: 40, max: 70 });
  
  const handleImageSelect = () => {
    // In a real app, this would open a file picker or camera
    // For now, we'll use placeholder images
    const placeholderImages = [
      "https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=500",
      "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=500",
      "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=500",
      "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=500"
    ];
    setImage(placeholderImages[Math.floor(Math.random() * placeholderImages.length)]);
    toast.success("Image selected!");
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !species || !image) {
      toast.error("Please fill all required fields and select an image");
      return;
    }
    
    addPlant(name, species, location, image, {
      temperature,
      light: { min: 40, max: 80 }, // Default light values
      humidity
    });
    
    toast.success("Plant added successfully!");
    navigate("/dashboard");
  };
  
  return (
    <div className="container max-w-md mx-auto px-4 pt-4 pb-20">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-xl font-bold">Register New Plant</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <Label htmlFor="name">Plant Name</Label>
          <Input
            id="name"
            placeholder="E.g., Peace Lily"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="plant-form-input"
          />
        </div>
        
        <div className="space-y-4">
          <Label htmlFor="species">Plant Species</Label>
          <Input
            id="species"
            placeholder="E.g., Spathiphyllum"
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            className="plant-form-input"
          />
        </div>
        
        <div className="space-y-4">
          <Label htmlFor="location">Location</Label>
          <Select
            value={location}
            onValueChange={setLocation}
          >
            <SelectTrigger className="plant-form-input">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Indoor">Indoor</SelectItem>
              <SelectItem value="Outdoor">Outdoor</SelectItem>
              <SelectItem value="Balcony">Balcony</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-4">
          <Label>Plant Image</Label>
          {image ? (
            <div className="relative overflow-hidden rounded-xl h-64">
              <img 
                src={image} 
                alt="Selected plant" 
                className="w-full h-full object-cover"
              />
              <Button
                type="button"
                className="absolute bottom-3 right-3 rounded-full bg-white text-plant-green hover:bg-white/90"
                onClick={handleImageSelect}
              >
                Change Image
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant="outline"
                className="h-24 flex flex-col gap-2 rounded-xl border-dashed"
                onClick={handleImageSelect}
              >
                <Camera size={24} />
                <span className="text-xs">Take Photo</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-24 flex flex-col gap-2 rounded-xl border-dashed"
                onClick={handleImageSelect}
              >
                <Image size={24} />
                <span className="text-xs">Choose from Gallery</span>
              </Button>
            </div>
          )}
        </div>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Thermometer size={18} className="text-red-500" />
                  <Label>Temperature (°C)</Label>
                </div>
                <div className="text-sm font-medium">
                  {temperature.min}°C - {temperature.max}°C
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <Label className="text-xs mb-2 block">Minimum</Label>
                  <Slider
                    value={[temperature.min]}
                    min={0}
                    max={40}
                    step={1}
                    onValueChange={(values) => 
                      setTemperature({ ...temperature, min: values[0] })
                    }
                  />
                </div>
                <div>
                  <Label className="text-xs mb-2 block">Maximum</Label>
                  <Slider
                    value={[temperature.max]}
                    min={0}
                    max={40}
                    step={1}
                    onValueChange={(values) => 
                      setTemperature({ ...temperature, max: values[0] })
                    }
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Droplet size={18} className="text-blue-500" />
                  <Label>Humidity (%)</Label>
                </div>
                <div className="text-sm font-medium">
                  {humidity.min}% - {humidity.max}%
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <Label className="text-xs mb-2 block">Minimum</Label>
                  <Slider
                    value={[humidity.min]}
                    min={0}
                    max={100}
                    step={5}
                    onValueChange={(values) => 
                      setHumidity({ ...humidity, min: values[0] })
                    }
                  />
                </div>
                <div>
                  <Label className="text-xs mb-2 block">Maximum</Label>
                  <Slider
                    value={[humidity.max]}
                    min={0}
                    max={100}
                    step={5}
                    onValueChange={(values) => 
                      setHumidity({ ...humidity, max: values[0] })
                    }
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Button 
          type="submit" 
          className="w-full bg-plant-green hover:bg-plant-dark-green text-white rounded-full h-12"
        >
          Add Plant
        </Button>
      </form>
    </div>
  );
}
