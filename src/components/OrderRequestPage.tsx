import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { ArrowLeft, Check, Send, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner";
import { type CartItem, useAuth } from "../AuthContext";
import api from "../api/axios";


interface OrderRequestPageProps {
  cart: CartItem[];
  onBack: () => void;
  onComplete: () => void;
}

export function OrderRequestPage({ cart, onBack, onComplete }: OrderRequestPageProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Pre-fill from user profile if available
  const [email, setEmail] = useState(user?.email || "");
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [country, setCountry] = useState(user?.country || "");
  
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [shippingPhone, setShippingPhone] = useState(user?.phoneNumber || "");

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 15.00;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        items: cart.map(item => ({
          product: item.id,
          name: item.name,
          size: item.size,
          quantity: item.quantity,
          price: item.price,
          image: item.image
        })),
        shippingAddress: {
          email,
          firstName,
          lastName,
          address,
          city,
          state,
          zipCode,
          country,
          phoneNumber: shippingPhone
        }
      };

      await api.post('/orders/request', orderData);

      toast.success("Order Request Submitted!", {
        description: "Our admin team will review your request and contact you shortly."
      });
      
      onComplete(); // Clears cart and shows Thank You in parent
      
    } catch (error: any) {
      console.error("Order request error:", error);
      toast.error(error.response?.data?.message || "Failed to submit order request. Please try again.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/50">
        <Loader2 className="w-12 h-12 text-[#0EA0DC] animate-spin mb-4" />
        <p className="text-[#666666] font-medium">Submitting Order Request...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 geometric-bg pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-[#666666] hover:text-[#0EA0DC] hover:bg-[#0EA0DC]/5 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Button>
          <h1 className="text-3xl text-[#272727]">Request Order</h1>
          <p className="text-[#666666] mt-2">
            Submit your order request for review. No payment is required at this stage.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">

            {/* Shipping Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="skygloss-card p-8 rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl text-[#272727]">Shipping Information</h2>
                  <div className="text-sm text-[#666666] flex items-center gap-2">
                    <Send className="w-4 h-4 text-[#0EA0DC]" />
                    Order Request
                  </div>
                </div>

                <form onSubmit={handleRequestSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm text-[#272727] mb-2">Email</label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="border-[#0EA0DC]/30 rounded-lg"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-[#272727] mb-2">First Name</label>
                      <Input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John"
                        className="border-[#0EA0DC]/30 rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[#272727] mb-2">Last Name</label>
                      <Input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Doe"
                        className="border-[#0EA0DC]/30 rounded-lg"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-[#272727] mb-2">Address</label>
                    <Input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="123 Main St"
                      className="border-[#0EA0DC]/30 rounded-lg"
                      required
                    />
                  </div>

                   <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-[#272727] mb-2">City</label>
                      <Input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="New York"
                        className="border-[#0EA0DC]/30 rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[#272727] mb-2">State</label>
                      <Input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="NY"
                        className="border-[#0EA0DC]/30 rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[#272727] mb-2">ZIP Code</label>
                      <Input
                        type="text"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        placeholder="10001"
                        className="border-[#0EA0DC]/30 rounded-lg"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-[#272727] mb-2">Country</label>
                        <Input
                            type="text"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="border-[#0EA0DC]/30 rounded-lg bg-gray-50"
                            placeholder="Country"
                            required
                            readOnly={!!user?.country} // Read-only if coming from user profile to prevent switching logic bypass? No, let them edit if they moved, but the logic depends on LOGIN country, not shipping country usually. User said "kisi aur country se login hota he".
                        />
                         {/* Note: We allow editing country for shipping, but the *Access* logic was handled at dashboard entry. */}
                    </div>
                    <div>
                        <label className="block text-sm text-[#272727] mb-2">Phone Number</label>
                        <Input 
                            type="tel"
                            value={shippingPhone}
                            onChange={(e) => setShippingPhone(e.target.value)}
                            placeholder="+1 (555) 000-0000"
                            className="border-[#0EA0DC]/30 rounded-lg"
                            required
                        />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#0EA0DC] text-white hover:shadow-[0_0_20px_rgba(14,160,220,0.4)] h-12 rounded-lg mt-6"
                  >
                    Submit Order Request
                  </Button>
                </form>
              </Card>
            </motion.div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-24"
            >
              <Card className="skygloss-card p-6 rounded-2xl">
                <h3 className="text-lg text-[#272727] mb-4">Request Summary</h3>

                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={`${item.id}-${item.size}`} className="flex gap-3">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="text-sm text-[#272727]">{item.name}</h4>
                        <p className="text-xs text-[#666666]">{item.size} × {item.quantity}</p>
                        <p className="text-sm text-[#0EA0DC] mt-1">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-[#666666]">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-[#666666]">
                    <span>Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-[#666666]">
                    <span>Tax (Est.)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg text-[#272727]">
                    <span>Total Value</span>
                    <span className="text-[#0EA0DC]">${total.toFixed(2)}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
