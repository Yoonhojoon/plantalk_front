
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Minus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export default function CartScreen() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'Snake Plant',
      image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=500',
      price: 25,
      quantity: 1
    },
    {
      id: '2',
      name: 'Monstera Deliciosa',
      image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=500',
      price: 35,
      quantity: 1
    }
  ]);
  
  const updateQuantity = (id: string, change: number) => {
    setCartItems(cartItems.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + change;
        return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
      }
      return item;
    }));
  };
  
  const removeItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };
  
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 5 : 0;
  const total = subtotal + shipping;
  
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
        <h1 className="text-xl font-bold">My Cart</h1>
      </div>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-12 rounded-lg bg-gray-50 border-2 border-dashed border-gray-200">
          <p className="text-muted-foreground">Your cart is empty</p>
          <Button 
            className="mt-4 bg-plant-green hover:bg-plant-dark-green rounded-full"
            onClick={() => navigate('/dashboard')}
          >
            Browse Plants
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            {cartItems.map((item, index) => (
              <div key={item.id}>
                <div className="p-4 flex items-center">
                  <div className="w-16 h-16 rounded-lg overflow-hidden mr-3">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="font-semibold">${item.price}</p>
                    </div>
                    <div className="flex justify-between mt-2">
                      <div className="flex items-center border rounded-full overflow-hidden">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="px-2 py-1 text-gray-600"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-3">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="px-2 py-1 text-gray-600"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500 h-8 w-8"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
                {index < cartItems.length - 1 && <Separator />}
              </div>
            ))}
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <div className="space-y-3">
              <div className="flex justify-between">
                <p className="text-gray-600">Subtotal</p>
                <p>${subtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-600">Shipping</p>
                <p>${shipping.toFixed(2)}</p>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <p>Total</p>
                <p>${total.toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          <Button 
            className="w-full bg-plant-green hover:bg-plant-dark-green text-white rounded-full h-12 mt-4"
          >
            Checkout
          </Button>
        </div>
      )}
    </div>
  );
}
