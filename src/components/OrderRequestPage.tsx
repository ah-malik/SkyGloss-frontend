import { motion } from "motion/react";
import { useState, useEffect, useMemo } from "react";
import { Country } from 'country-state-city';
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
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
  const countries = useMemo(() => Country.getAllCountries(), []);

  // Pre-fill from user profile if available
  const [email, setEmail] = useState(user?.email || "");
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [country, setCountry] = useState(user?.country || "");
  const [callingCode, setCallingCode] = useState("");

  const [address, setAddress] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [shippingPhone, setShippingPhone] = useState(user?.phoneNumber || "");

  // Auto-set calling code from user's country on mount
  useEffect(() => {
    if (user?.country) {
      const countryObj = countries.find(c => c.name === user.country);
      if (countryObj) setCallingCode(`+${countryObj.phonecode}`);
    }
  }, [user?.country, countries]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

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
          address2,
          city,
          state,
          zipCode,
          country,
          phoneNumber: callingCode ? `${callingCode} ${shippingPhone}` : shippingPhone
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
Submit your order request here. An invoice and payment options will be sent to you separately. No payment is required as this time. 
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
                    <label className="block text-sm text-[#272727] mb-2">Email *</label>
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
                      <label className="block text-sm text-[#272727] mb-2">First Name *</label>
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
                      <label className="block text-sm text-[#272727] mb-2">Last Name *</label>
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
                    <label className="block text-sm text-[#272727] mb-2">Address *</label>
                    <Input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="123 Main St"
                      className="border-[#0EA0DC]/30 rounded-lg mb-3"
                      required
                    />
                    <Input
                      type="text"
                      value={address2}
                      onChange={(e) => setAddress2(e.target.value)}
                      placeholder="Apartment, suite, unit, etc. (optional)"
                      className="border-[#0EA0DC]/30 rounded-lg"
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-[#272727] mb-2">City *</label>
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
                      <label className="block text-sm text-[#272727] mb-2">State *</label>
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
                      <label className="block text-sm text-[#272727] mb-2">ZIP Code *</label>
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
                      <label className="block text-sm text-[#272727] mb-2">Country *</label>
                      <select
                        value={country}
                        onChange={(e) => {
                          const countryName = e.target.value;
                          setCountry(countryName);
                          const countryObj = countries.find(c => c.name === countryName);
                          if (countryObj) {
                            setCallingCode(`+${countryObj.phonecode}`);
                          } else {
                            setCallingCode("");
                          }
                        }}
                        className="w-full px-4 h-10 bg-white border border-[#0EA0DC]/30 focus:border-[#0EA0DC] rounded-lg transition-colors appearance-none"
                        required
                      >
                        <option value="">Select Country</option>
                        {countries.map(c => (
                          <option key={c.isoCode} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-[#272727] mb-2">Phone Number *</label>
                      <div className="flex gap-2">
                        <select
                          value={callingCode}
                          onChange={(e) => setCallingCode(e.target.value)}
                          className="w-[110px] shrink-0 px-2 h-10 bg-white border border-[#0EA0DC]/30 focus:border-[#0EA0DC] rounded-lg transition-colors appearance-none text-sm"
                        >
                          <option value="">Code</option>
                          {countries.map(c => (
                            <option key={c.isoCode} value={`+${c.phonecode}`}>
                              {c.isoCode} +{c.phonecode}
                            </option>
                          ))}
                        </select>
                        <Input
                          type="tel"
                          value={shippingPhone}
                          onChange={(e) => setShippingPhone(e.target.value)}
                          placeholder="234 567 8900"
                          className="border-[#0EA0DC]/30 rounded-lg flex-1"
                          required
                        />
                      </div>
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
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
