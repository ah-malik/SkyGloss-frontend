import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { ArrowLeft, CreditCard, Lock, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner";

interface CartItem {
  id: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
}

interface CheckoutPageProps {
  cart: CartItem[];
  onBack: () => void;
  onComplete: () => void;
}

export function CheckoutPage({ cart, onBack, onComplete }: CheckoutPageProps) {
  const [step, setStep] = useState<"shipping" | "payment" | "review" | "confirmation">("shipping");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("US");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 15.00;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
    window.scrollTo(0, 0);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("review");
    window.scrollTo(0, 0);
  };

  const handlePlaceOrder = () => {
    setStep("confirmation");
    window.scrollTo(0, 0);
    toast.success("Order placed successfully!");
  };

  if (step === "confirmation") {
    return (
      <div className="min-h-screen bg-gray-50 geometric-bg pt-20 pb-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <Card className="skygloss-card p-12 rounded-2xl">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl text-[#272727] mb-3">
                Order Confirmed!
              </h1>
              <p className="text-lg text-[#666666] mb-6">
                Thank you for your purchase. Your order has been confirmed.
              </p>
              <div className="bg-[#0EA0DC]/5 rounded-lg p-4 mb-6">
                <p className="text-sm text-[#666666] mb-2">Order Number:</p>
                <p className="text-xl text-[#272727]">#SKYGLOSS-{Math.random().toString(36).substring(7).toUpperCase()}</p>
              </div>
              <p className="text-sm text-[#666666] mb-8">
                A confirmation email has been sent to {email}
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={onComplete}
                  className="flex-1 border-[#0EA0DC]/30 text-[rgb(255,255,255)] hover:border-[#0EA0DC] hover:bg-[#0EA0DC]/5 h-12"
                >
                  Continue Shopping
                </Button>
                <Button
                  className="flex-1 bg-[#0EA0DC] text-white hover:shadow-[0_0_20px_rgba(14,160,220,0.4)] h-12"
                >
                  Download Invoice
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    );
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
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8">
              {["Shipping", "Payment", "Review"].map((label, index) => {
                const stepNames = ["shipping", "payment", "review"];
                const currentIndex = stepNames.indexOf(step);
                const isActive = currentIndex >= index;

                return (
                  <div key={label} className="flex items-center flex-1">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${isActive ? "bg-[#0EA0DC] text-white" : "bg-gray-200 text-[#666666]"
                        }`}>
                        {currentIndex > index ? <Check className="w-4 h-4" /> : index + 1}
                      </div>
                      <span className={`ml-2 text-sm ${isActive ? "text-[#272727]" : "text-[#666666]"}`}>
                        {label}
                      </span>
                    </div>
                    {index < 2 && (
                      <div className={`flex-1 h-0.5 mx-4 ${isActive ? "bg-[#0EA0DC]" : "bg-gray-200"}`} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Shipping Form */}
            {step === "shipping" && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="skygloss-card p-8 rounded-2xl">
                  <h2 className="text-2xl text-[#272727] mb-6">Shipping Information</h2>
                  <form onSubmit={handleShippingSubmit} className="space-y-4">
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

                    <div>
                      <label className="block text-sm text-[#272727] mb-2">Country</label>
                      <Select value={country} onValueChange={setCountry}>
                        <SelectTrigger className="border-[#0EA0DC]/30 rounded-lg">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="US">United States</SelectItem>
                          <SelectItem value="CA">Canada</SelectItem>
                          <SelectItem value="MX">Mexico</SelectItem>
                          <SelectItem value="AR">Argentina</SelectItem>
                          <SelectItem value="BR">Brazil</SelectItem>
                          <SelectItem value="CL">Chile</SelectItem>
                          <SelectItem value="CO">Colombia</SelectItem>
                          <SelectItem value="PE">Peru</SelectItem>
                          <SelectItem value="VE">Venezuela</SelectItem>
                          <SelectItem value="EC">Ecuador</SelectItem>
                          <SelectItem value="GT">Guatemala</SelectItem>
                          <SelectItem value="CU">Cuba</SelectItem>
                          <SelectItem value="BO">Bolivia</SelectItem>
                          <SelectItem value="HT">Haiti</SelectItem>
                          <SelectItem value="DO">Dominican Republic</SelectItem>
                          <SelectItem value="HN">Honduras</SelectItem>
                          <SelectItem value="PY">Paraguay</SelectItem>
                          <SelectItem value="NI">Nicaragua</SelectItem>
                          <SelectItem value="SV">El Salvador</SelectItem>
                          <SelectItem value="CR">Costa Rica</SelectItem>
                          <SelectItem value="PA">Panama</SelectItem>
                          <SelectItem value="UY">Uruguay</SelectItem>
                          <SelectItem value="UK">United Kingdom</SelectItem>
                          <SelectItem value="DE">Germany</SelectItem>
                          <SelectItem value="FR">France</SelectItem>
                          <SelectItem value="IT">Italy</SelectItem>
                          <SelectItem value="ES">Spain</SelectItem>
                          <SelectItem value="PL">Poland</SelectItem>
                          <SelectItem value="RO">Romania</SelectItem>
                          <SelectItem value="NL">Netherlands</SelectItem>
                          <SelectItem value="BE">Belgium</SelectItem>
                          <SelectItem value="GR">Greece</SelectItem>
                          <SelectItem value="PT">Portugal</SelectItem>
                          <SelectItem value="CZ">Czech Republic</SelectItem>
                          <SelectItem value="HU">Hungary</SelectItem>
                          <SelectItem value="SE">Sweden</SelectItem>
                          <SelectItem value="AT">Austria</SelectItem>
                          <SelectItem value="BG">Bulgaria</SelectItem>
                          <SelectItem value="DK">Denmark</SelectItem>
                          <SelectItem value="FI">Finland</SelectItem>
                          <SelectItem value="SK">Slovakia</SelectItem>
                          <SelectItem value="NO">Norway</SelectItem>
                          <SelectItem value="IE">Ireland</SelectItem>
                          <SelectItem value="HR">Croatia</SelectItem>
                          <SelectItem value="SI">Slovenia</SelectItem>
                          <SelectItem value="LT">Lithuania</SelectItem>
                          <SelectItem value="LV">Latvia</SelectItem>
                          <SelectItem value="EE">Estonia</SelectItem>
                          <SelectItem value="CH">Switzerland</SelectItem>
                          <SelectItem value="CN">China</SelectItem>
                          <SelectItem value="IN">India</SelectItem>
                          <SelectItem value="ID">Indonesia</SelectItem>
                          <SelectItem value="PK">Pakistan</SelectItem>
                          <SelectItem value="BD">Bangladesh</SelectItem>
                          <SelectItem value="JP">Japan</SelectItem>
                          <SelectItem value="PH">Philippines</SelectItem>
                          <SelectItem value="VN">Vietnam</SelectItem>
                          <SelectItem value="TR">Turkey</SelectItem>
                          <SelectItem value="IR">Iran</SelectItem>
                          <SelectItem value="TH">Thailand</SelectItem>
                          <SelectItem value="KR">South Korea</SelectItem>
                          <SelectItem value="IQ">Iraq</SelectItem>
                          <SelectItem value="AF">Afghanistan</SelectItem>
                          <SelectItem value="SA">Saudi Arabia</SelectItem>
                          <SelectItem value="MY">Malaysia</SelectItem>
                          <SelectItem value="NP">Nepal</SelectItem>
                          <SelectItem value="YE">Yemen</SelectItem>
                          <SelectItem value="KH">Cambodia</SelectItem>
                          <SelectItem value="LK">Sri Lanka</SelectItem>
                          <SelectItem value="SG">Singapore</SelectItem>
                          <SelectItem value="AE">United Arab Emirates</SelectItem>
                          <SelectItem value="IL">Israel</SelectItem>
                          <SelectItem value="JO">Jordan</SelectItem>
                          <SelectItem value="TW">Taiwan</SelectItem>
                          <SelectItem value="NG">Nigeria</SelectItem>
                          <SelectItem value="ET">Ethiopia</SelectItem>
                          <SelectItem value="EG">Egypt</SelectItem>
                          <SelectItem value="CD">DR Congo</SelectItem>
                          <SelectItem value="ZA">South Africa</SelectItem>
                          <SelectItem value="TZ">Tanzania</SelectItem>
                          <SelectItem value="KE">Kenya</SelectItem>
                          <SelectItem value="UG">Uganda</SelectItem>
                          <SelectItem value="DZ">Algeria</SelectItem>
                          <SelectItem value="SD">Sudan</SelectItem>
                          <SelectItem value="MA">Morocco</SelectItem>
                          <SelectItem value="AO">Angola</SelectItem>
                          <SelectItem value="GH">Ghana</SelectItem>
                          <SelectItem value="MZ">Mozambique</SelectItem>
                          <SelectItem value="MG">Madagascar</SelectItem>
                          <SelectItem value="CM">Cameroon</SelectItem>
                          <SelectItem value="CI">Ivory Coast</SelectItem>
                          <SelectItem value="NE">Niger</SelectItem>
                          <SelectItem value="BF">Burkina Faso</SelectItem>
                          <SelectItem value="ML">Mali</SelectItem>
                          <SelectItem value="MW">Malawi</SelectItem>
                          <SelectItem value="ZM">Zambia</SelectItem>
                          <SelectItem value="SN">Senegal</SelectItem>
                          <SelectItem value="SO">Somalia</SelectItem>
                          <SelectItem value="TD">Chad</SelectItem>
                          <SelectItem value="ZW">Zimbabwe</SelectItem>
                          <SelectItem value="GN">Guinea</SelectItem>
                          <SelectItem value="RW">Rwanda</SelectItem>
                          <SelectItem value="BJ">Benin</SelectItem>
                          <SelectItem value="TN">Tunisia</SelectItem>
                          <SelectItem value="BI">Burundi</SelectItem>
                          <SelectItem value="SS">South Sudan</SelectItem>
                          <SelectItem value="AU">Australia</SelectItem>
                          <SelectItem value="NZ">New Zealand</SelectItem>
                          <SelectItem value="PG">Papua New Guinea</SelectItem>
                          <SelectItem value="FJ">Fiji</SelectItem>
                          <SelectItem value="RU">Russia</SelectItem>
                          <SelectItem value="UA">Ukraine</SelectItem>
                          <SelectItem value="UZ">Uzbekistan</SelectItem>
                          <SelectItem value="KZ">Kazakhstan</SelectItem>
                          <SelectItem value="BY">Belarus</SelectItem>
                          <SelectItem value="AZ">Azerbaijan</SelectItem>
                          <SelectItem value="GE">Georgia</SelectItem>
                          <SelectItem value="TJ">Tajikistan</SelectItem>
                          <SelectItem value="KG">Kyrgyzstan</SelectItem>
                          <SelectItem value="TM">Turkmenistan</SelectItem>
                          <SelectItem value="AM">Armenia</SelectItem>
                          <SelectItem value="MD">Moldova</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-[#0EA0DC] text-white hover:shadow-[0_0_20px_rgba(14,160,220,0.4)] h-12 rounded-lg"
                    >
                      Continue to Payment
                    </Button>
                  </form>
                </Card>
              </motion.div>
            )}

            {/* Payment Form */}
            {step === "payment" && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="skygloss-card p-8 rounded-2xl">
                  <div className="flex items-center gap-2 mb-6">
                    <Lock className="w-5 h-5 text-[#0EA0DC]" />
                    <h2 className="text-2xl text-[#272727]">Payment Information</h2>
                  </div>
                  <form onSubmit={handlePaymentSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm text-[#272727] mb-2">Card Number</label>
                      <div className="relative">
                        <Input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="1234 5678 9012 3456"
                          className="border-[#0EA0DC]/30 rounded-lg pl-10"
                          required
                        />
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-[#272727] mb-2">Cardholder Name</label>
                      <Input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="John Doe"
                        className="border-[#0EA0DC]/30 rounded-lg"
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-[#272727] mb-2">Expiry Date</label>
                        <Input
                          type="text"
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="border-[#0EA0DC]/30 rounded-lg"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#272727] mb-2">CVV</label>
                        <Input
                          type="text"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          placeholder="123"
                          className="border-[#0EA0DC]/30 rounded-lg"
                          required
                        />
                      </div>
                    </div>

                    <div className="bg-[#0EA0DC]/5 rounded-lg p-4 border border-[#0EA0DC]/20">
                      <div className="flex items-start gap-3">
                        <Lock className="w-5 h-5 text-[#0EA0DC] mt-0.5" />
                        <div>
                          <p className="text-sm text-[#272727] mb-1">Secure Payment</p>
                          <p className="text-xs text-[#666666]">
                            Your payment information is encrypted and secure. We use Stripe for payment processing.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep("shipping")}
                        className="flex-1 border-[#0EA0DC]/30 text-[rgb(255,255,255)] hover:border-[#0EA0DC] hover:bg-[#0EA0DC]/5 h-12"
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-[#0EA0DC] text-white hover:shadow-[0_0_20px_rgba(14,160,220,0.4)] h-12 rounded-lg"
                      >
                        Review Order
                      </Button>
                    </div>
                  </form>
                </Card>
              </motion.div>
            )}

            {/* Review Order */}
            {step === "review" && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="skygloss-card p-8 rounded-2xl mb-6">
                  <h2 className="text-2xl text-[#272727] mb-6">Review Your Order</h2>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-[#272727] mb-3">Shipping Address</h3>
                      <div className="text-[#666666]">
                        <p>{firstName} {lastName}</p>
                        <p>{address}</p>
                        <p>{city}, {state} {zipCode}</p>
                        <p>{country}</p>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-[#272727] mb-3">Payment Method</h3>
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-[#0EA0DC]" />
                        <span className="text-[#666666]">
                          •••• •••• •••• {cardNumber.slice(-4)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep("payment")}
                    className="flex-1 border-[#0EA0DC]/30 text-[rgb(255,255,255)] hover:border-[#0EA0DC] hover:bg-[#0EA0DC]/5 h-12"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handlePlaceOrder}
                    className="flex-1 bg-[#0EA0DC] text-white hover:shadow-[0_0_20px_rgba(14,160,220,0.4)] h-12 rounded-lg"
                  >
                    Place Order
                  </Button>
                </div>
              </motion.div>
            )}
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
                  <div className="flex justify-between text-sm text-[#666666]">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-[#666666]">
                    <span>Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-[#666666]">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg text-[#272727]">
                    <span>Total</span>
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
