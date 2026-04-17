import { motion } from "motion/react";
import { useState, useEffect, useMemo } from "react";
import { Country } from 'country-state-city';
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner";
import { type CartItem } from "../AuthContext";
import api from "../api/axios";


interface CheckoutPageProps {
  cart: CartItem[];
  onBack: () => void;
  onComplete: () => void;
}

export function CheckoutPage({ cart, onBack, onComplete }: CheckoutPageProps) {
  // We only need shipping step now, payment is handled by Stripe
  const [loading, setLoading] = useState(false);
  const countries = useMemo(() => Country.getAllCountries(), []);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [callingCode, setCallingCode] = useState("");
  const [shippingPhone, setShippingPhone] = useState("");
  const [country, setCountry] = useState("United States");

  // Scroll to top when component mounts and set initial calling code
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Set initial calling code for default "United States"
    const usInfo = countries.find(c => c.name === "United States");
    if (usInfo) setCallingCode(`+${usInfo.phonecode}`);
  }, [countries]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal; // Shipping is now $0

  const handleCheckout = async (e: React.FormEvent) => {
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

      const response = await api.post('/orders/checkout-session', orderData);

      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        toast.error("Failed to initiate checkout");
        setLoading(false);
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/50">
        <Loader2 className="w-12 h-12 text-[#0EA0DC] animate-spin mb-4" />
        <p className="text-[#666666] font-medium">Redirecting to Payment...</p>
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
          <h1 className="text-3xl text-[#272727]">Checkout</h1>
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
                    <Check className="w-4 h-4 text-green-500" />
                    Secure Checkout via Stripe
                  </div>
                </div>

                <form onSubmit={handleCheckout} className="space-y-4">
                  <div>
                    <label className="block text-sm text-[#272727] mb-2 font-medium">Email Address <span className="text-red-500">*</span></label>
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
                      <label className="block text-sm text-[#272727] mb-2 font-medium">First Name <span className="text-red-500">*</span></label>
                      <Input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First Name"
                        className="border-[#0EA0DC]/30 rounded-lg h-11"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[#272727] mb-2 font-medium">Last Name <span className="text-red-500">*</span></label>
                      <Input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last Name"
                        className="border-[#0EA0DC]/30 rounded-lg h-11"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-[#272727] mb-2 font-medium">Shipping Address <span className="text-red-500">*</span></label>
                    <Input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Street Address, P.O. box, etc."
                      className="border-[#0EA0DC]/30 rounded-lg mb-3 h-11"
                      required
                    />
                    <Input
                      type="text"
                      value={address2}
                      onChange={(e) => setAddress2(e.target.value)}
                      placeholder="Apartment, suite, unit, etc. (optional)"
                      className="border-[#0EA0DC]/30 rounded-lg h-11"
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-[#272727] mb-2 font-medium">City <span className="text-red-500">*</span></label>
                      <Input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="City"
                        className="border-[#0EA0DC]/30 rounded-lg h-11"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[#272727] mb-2 font-medium">State / Province <span className="text-red-500">*</span></label>
                      <Input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="State"
                        className="border-[#0EA0DC]/30 rounded-lg h-11"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[#272727] mb-2 font-medium">ZIP / Postal Code <span className="text-red-500">*</span></label>
                      <Input
                        type="text"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        placeholder="ZIP Code"
                        className="border-[#0EA0DC]/30 rounded-lg h-11"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-[#272727] mb-2 font-medium">Country <span className="text-red-500">*</span></label>
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
                        className="w-full px-4 h-11 bg-white border border-[#0EA0DC]/30 focus:border-[#0EA0DC] rounded-lg transition-colors appearance-none text-[#272727]"
                        required
                      >
                        <option value="">Select Country</option>
                        {countries.map(c => (
                          <option key={c.isoCode} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-[#272727] mb-2 font-medium">Phone Number <span className="text-red-500">*</span></label>
                      <div className="flex gap-2">
                        <select
                          value={callingCode}
                          onChange={(e) => setCallingCode(e.target.value)}
                          className="w-[110px] shrink-0 px-2 h-11 bg-white border border-[#0EA0DC]/30 focus:border-[#0EA0DC] rounded-lg transition-colors appearance-none text-sm text-[#272727]"
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
                          className="border-[#0EA0DC]/30 rounded-lg flex-1 h-11"
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
                    Proceed to Payment
                  </Button>
                  <p className="text-center text-xs text-[#666666] mt-4">
                    You will be redirected to Stripe to securely complete your payment.
                  </p>
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
                <h3 className="text-lg text-[#272727] mb-4">Order Summary</h3>

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
                  <div className="flex justify-between text-sm py-1">
                    <span className="text-[#666666]">Subtotal</span>
                    <span className="text-[#272727] font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm py-1">
                    <span className="text-emerald-600 font-bold uppercase tracking-wider text-[10px]">Shipping</span>
                    <span className="text-emerald-600 font-black tracking-widest text-[11px]"> FREE</span>
                  </div>
                  <div className="h-px bg-gray-100 my-2" />
                  <div className="flex justify-between text-sm text-[#272727] font-medium pt-2">
                    <span>Total</span>
                    <span className="text-[#0EA0DC] text-xl">${total.toFixed(2)}</span>
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
