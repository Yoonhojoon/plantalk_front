
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SearchScreen() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
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
        <h1 className="text-xl font-bold">Search Plants</h1>
      </div>
      
      <div className="relative mb-6">
        <Search size={18} className="absolute top-3 left-3 text-gray-400" />
        <Input 
          placeholder="Search plant name or species..." 
          className="pl-10 rounded-xl h-12 plant-form-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="space-y-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
          <h2 className="font-medium mb-4">Popular Searches</h2>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="rounded-full">Succulents</Button>
            <Button variant="outline" size="sm" className="rounded-full">Indoor Plants</Button>
            <Button variant="outline" size="sm" className="rounded-full">Low Light</Button>
            <Button variant="outline" size="sm" className="rounded-full">Air Purifying</Button>
            <Button variant="outline" size="sm" className="rounded-full">Pet Safe</Button>
          </div>
        </div>
        
        <div className="text-center py-10 text-muted-foreground">
          <p>Search for plants to see results</p>
        </div>
      </div>
    </div>
  );
}
