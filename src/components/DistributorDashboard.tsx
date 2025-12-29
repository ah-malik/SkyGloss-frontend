import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { Package, FileText, Globe, CreditCard, Send, CheckCircle, Plus, Minus, XCircle } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Sheet, SheetContent, SheetTitle } from "./ui/sheet";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { NetworkDashboard } from "./NetworkDashboard";
import { toast } from "sonner";
import { Footer } from "./Footer";
import api from "../api/axios";
import { useAuth } from "../AuthContext";
import { Clock } from "lucide-react";
import fusionMainImage from "../assets/600x400.svg";
import fusionElementImage from "../assets/600x400.svg";
import fusionAetherImage from "../assets/600x400.svg";
import resinFilmImage from "../assets/600x400.svg";
import sealImage from "../assets/600x400.svg";
import matteBoxImage from "../assets/600x400.svg";
import shineBoxImage from "../assets/600x400.svg";
import applicatorBottleImage from "../assets/600x400.svg";
import edgeBladeBox1Image from "../assets/600x400.svg";
import edgeBladeBox2Image from "../assets/600x400.svg";
import paintPenBoxImage from "../assets/600x400.svg";
import paintPenToolsImage from "../assets/600x400.svg";

const distributorProducts = [
  {
    id: 1,
    name: "FUSION SYSTEM",
    description: "Complete dual-layer coating (Element + Aether)",
    sizes: ["100ml", "250ml", "500ml"],
    unitPrices: {
      "100ml": 130.98,
      "250ml": 248.98,
      "500ml": 277.98
    },
    casePrices: {
      "100ml": 1255.00,
      "250ml": 2380.00,
      "500ml": 2660.00
    },
    unitsPerCase: {
      "100ml": 10,
      "250ml": 10,
      "500ml": 10
    },
    image: fusionMainImage,
    additionalImage: fusionElementImage,
    additionalImage2: fusionAetherImage
  },
  {
    id: 3,
    name: "RESIN FILM",
    sizes: ["60ml"],
    unitPrices: { "60ml": 119.99 },
    casePrices: { "60ml": 1140.00 },
    unitsPerCase: { "60ml": 10 },
    image: resinFilmImage
  },
  {
    id: 4,
    name: "SEAL",
    sizes: ["250ml"],
    unitPrices: { "250ml": 64.99 },
    casePrices: { "250ml": 625.00 },
    unitsPerCase: { "250ml": 10 },
    image: sealImage
  },
  {
    id: 5,
    name: "MATTE",
    sizes: ["30ml"],
    unitPrices: { "30ml": 94.99 },
    casePrices: { "30ml": 910.00 },
    unitsPerCase: { "30ml": 10 },
    image: matteBoxImage
  },
  {
    id: 6,
    name: "SHINE",
    sizes: ["30ml"],
    unitPrices: { "30ml": 72.99 },
    casePrices: { "30ml": 700.00 },
    unitsPerCase: { "30ml": 10 },
    image: shineBoxImage
  },
  {
    id: 7,
    name: "APPLICATOR BOTTLE",
    sizes: ["1pc"],
    unitPrices: { "1pc": 7.49 },
    casePrices: { "1pc": 70.00 },
    unitsPerCase: { "1pc": 10 },
    image: applicatorBottleImage
  },
  {
    id: 8,
    name: "EDGE BLADE",
    sizes: ["1pc"],
    unitPrices: { "1pc": 36.99 },
    casePrices: { "1pc": 350.00 },
    unitsPerCase: { "1pc": 10 },
    image: edgeBladeBox1Image,
    additionalImages: [edgeBladeBox2Image]
  },
  {
    id: 10,
    name: "PAINT PEN",
    sizes: ["1pc"],
    unitPrices: { "1pc": 22.49 },
    casePrices: { "1pc": 210.00 },
    unitsPerCase: { "1pc": 10 },
    image: paintPenBoxImage,
    additionalImages: [paintPenToolsImage]
  }
];

interface OrderItem {
  productId: number;
  productName: string;
  size: string;
  orderType: "unit" | "case";
  quantity: number;
  price: number;
}

interface DistributorDashboardProps {
  onShowThankYou?: () => void;
  onCartCountChange?: (count: number) => void;
  showCartSheet?: boolean;
  onCartSheetChange?: (show: boolean) => void;
}

export function DistributorDashboard({
  onShowThankYou,
  onCartCountChange,
}: DistributorDashboardProps) {
  const { showCartSheet, setShowCartSheet } = useAuth();
  const [activeSection, setActiveSection] = useState<"shop" | "certified" | "network">("shop");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [certCountry, setCertCountry] = useState("");
  const [certRequester, setCertRequester] = useState("");
  const [showAether, setShowAether] = useState(false); // false = Element, true = Aether
  const [certShopName, setCertShopName] = useState("");
  const [certEmail, setCertEmail] = useState("");
  const [certPhone, setCertPhone] = useState("");
  const [certShopCity, setCertShopCity] = useState("");
  const [certSubmitted, setCertSubmitted] = useState(false);
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  // Check for successful payment from Stripe
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const sessionId = urlParams.get('session_id');

    if (success === 'true' && sessionId) {
      verifyAndRefresh(sessionId);
    } else if (urlParams.get('canceled') === 'true') {
      toast.error("Payment canceled");
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const verifyAndRefresh = async (sessionId: string) => {
    try {
      const response = await api.get(`/certifications/verify-payment/${sessionId}`);
      if (response.data.success) {
        toast.success("Payment successful! Status updated.");
        setActiveSection("certified");
        fetchMyRequests();
      } else {
        toast.error("Payment verification failed. Please check back later.");
      }
    } catch (error) {
      console.error("Verification error:", error);
    } finally {
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  };

  // Calculate cart values
  const orderCount = orderItems.reduce((sum, item) => sum + item.quantity, 0);
  const orderTotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Scroll to top when section changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (activeSection === "certified") {
      fetchMyRequests();
    }
  }, [activeSection]);

  const fetchMyRequests = async () => {
    setLoadingRequests(true);
    try {
      const response = await api.get("/certifications/my-requests");
      setMyRequests(response.data);
    } catch (error) {
      console.error("Failed to fetch requests", error);
    } finally {
      setLoadingRequests(false);
    }
  };

  // Update cart count in parent
  useEffect(() => {


    if (onCartCountChange) {
      onCartCountChange(orderCount);
    }
  }, [orderCount, onCartCountChange]);

  const addToOrder = (product: typeof distributorProducts[0], size: string, orderType: "unit" | "case") => {
    const price = orderType === "unit"
      ? product.unitPrices[size as keyof typeof product.unitPrices]
      : product.casePrices[size as keyof typeof product.casePrices];

    const existingItem = orderItems.find(
      item => item.productId === product.id && item.size === size && item.orderType === orderType
    );

    if (existingItem) {
      setOrderItems(orderItems.map(item =>
        item.productId === product.id && item.size === size && item.orderType === orderType
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setOrderItems([...orderItems, {
        productId: product.id,
        productName: product.name,
        size,
        orderType,
        quantity: 1,
        price: price || 0
      }]);
    }

    toast.success(`Added ${product.name} (${size}) - ${orderType === "case" ? "Case" : "Unit"}`);
  };

  const updateOrderQuantity = (index: number, delta: number) => {
    setOrderItems(orderItems.map((item, i) => {
      if (i === index) {
        const newQuantity = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };


  const generateOrderRequest = () => {
    if (orderItems.length === 0) {
      toast.error("Please add items to your order");
      return;
    }

    setOrderItems([]);
    if (onShowThankYou) {
      onShowThankYou();
    } else {
      toast.success("Order request generated!", {
        description: "Invoice sent to SkyGloss admin team"
      });
    }
  };

  const handleCertificateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await api.post("/certifications/checkout-session", {
        country: certCountry,
        requesterName: certRequester,
        shopName: certShopName,
        shopEmail: certEmail,
        shopPhone: certPhone,
        shopCity: certShopCity
      });

      if (response.data?.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to initiate certification request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "rejected": return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-amber-500" />;
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="min-h-screen bg-white pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl text-[#272727] mb-2">
            Master Distributor Dashboard
          </h1>
          <p className="text-sm sm:text-base text-[#666666]">
            Manage orders, generate certificates, and access global network tools
          </p>
        </motion.div>

        {/* Navigation Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10 flex justify-start px-2"
        >
          <div className="inline-flex flex-col sm:flex-row rounded-xl border-2 border-[#0EA0DC] p-1.5 bg-white shadow-[0_0_10px_rgba(14,160,220,0.15)] w-full sm:w-auto">
            <button
              onClick={() => setActiveSection("shop")}
              className={`flex items-center justify-center px-4 sm:px-10 py-3 sm:py-4 rounded-lg transition-all duration-200 ${activeSection === "shop"
                ? "bg-[#272727] text-white shadow-lg"
                : "bg-transparent text-[#0EA0DC] hover:bg-[#0EA0DC]/5"
                }`}
            >
              <Package className="w-5 h-5 mr-2 sm:mr-3" />
              <span className="text-base sm:text-lg">Shop</span>
            </button>
            <button
              onClick={() => setActiveSection("certified")}
              className={`flex items-center justify-center px-4 sm:px-10 py-3 sm:py-4 rounded-lg transition-all duration-200 ${activeSection === "certified"
                ? "bg-[#272727] text-white shadow-lg"
                : "bg-transparent text-[#0EA0DC] hover:bg-[#0EA0DC]/5"
                }`}
            >
              <FileText className="w-5 h-5 mr-2 sm:mr-3" />
              <span className="text-base sm:text-lg">Certified</span>
            </button>
            <button
              onClick={() => setActiveSection("network")}
              className={`flex items-center justify-center px-4 sm:px-10 py-3 sm:py-4 rounded-lg transition-all duration-200 ${activeSection === "network"
                ? "bg-[#272727] text-white shadow-lg"
                : "bg-transparent text-[#0EA0DC] hover:bg-[#0EA0DC]/5"
                }`}
            >
              <Globe className="w-5 h-5 mr-2 sm:mr-3" />
              <span className="text-base sm:text-lg">Dashboard</span>
            </button>
          </div>
        </motion.div>

        {/* Content Sections with Animation */}
        <AnimatePresence mode="wait">
          {/* Shop Section */}
          {activeSection === "shop" && (
            <motion.div
              key="shop"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                <div className="lg:col-span-2 order-2 lg:order-1">
                  <div className="space-y-4 lg:space-y-6">
                    {distributorProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="skygloss-card p-4 sm:p-6 rounded-2xl">
                          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                            <div className="flex-shrink-0 w-full sm:w-auto self-center sm:self-start">
                              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-3 sm:p-6">
                                <ImageWithFallback
                                  src={product.id === 1 && showAether && product.additionalImage
                                    ? product.additionalImage
                                    : product.image}
                                  alt={product.name}
                                  className="w-full h-64 sm:w-48 sm:h-48 object-contain mx-auto"
                                />
                              </div>

                              {/* Layer Selection for FUSION Product */}
                              {product.id === 1 && (
                                <div className="mt-3">


                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base sm:text-lg text-[#272727] mb-3 sm:mb-4">
                                {product.name}
                              </h3>
                              <div className="space-y-3">
                                {product.sizes.map(size => (
                                  <div key={size} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-lg gap-3">
                                    <div className="flex-1 min-w-0">
                                      <span className="text-[#272727] block mb-1">
                                        {product.id === 1 ? `${size} (Element + Aether)` : size}
                                      </span>
                                      <div className="flex flex-col sm:flex-row sm:gap-4 gap-1">
                                        <span className="text-xs sm:text-sm text-[#666666]">
                                          Unit: <span className="text-[#0EA0DC]">
                                            ${product.unitPrices[size as keyof typeof product.unitPrices]}
                                          </span>
                                        </span>
                                        <span className="text-xs sm:text-sm text-[#666666]">
                                          Case ({product.unitsPerCase[size as keyof typeof product.unitsPerCase]} units): <span className="text-[#0EA0DC]">
                                            ${product.casePrices[size as keyof typeof product.casePrices]}
                                          </span>
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => addToOrder(product, size, "unit")}
                                        className="rounded-lg border-[#0EA0DC]/30 text-[rgb(255,255,255)] hover:border-[#0EA0DC] hover:bg-[#0EA0DC]/5 flex-1 sm:flex-none"
                                      >
                                        + Unit
                                      </Button>
                                      <Button
                                        size="sm"
                                        onClick={() => addToOrder(product, size, "case")}
                                        className="bg-[#0EA0DC] text-white hover:shadow-[0_0_20px_rgba(14,160,220,0.4)] rounded-lg flex-1 sm:flex-none"
                                      >
                                        + Case
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Order Summary - Desktop Only */}
                <div className="hidden lg:block lg:col-span-1 order-1 lg:order-2">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:sticky lg:top-24"
                  >
                    <Card className="skygloss-card p-0 rounded-2xl overflow-hidden">
                      {/* Header */}
                      <div className="bg-gradient-to-br from-[#0EA0DC] to-[#0c80b3] p-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg text-white">Order Summary</h3>
                          <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                            {orderCount} {orderCount === 1 ? "item" : "items"}
                          </Badge>
                        </div>
                      </div>

                      <div className="p-6">
                        {orderItems.length === 0 ? (
                          <div className="text-center py-12">
                            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                              <Package className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-[#666666]">No items added</p>
                            <p className="text-sm text-[#999999] mt-1">Add products to create order</p>
                          </div>
                        ) : (
                          <>
                            <div className="space-y-3 mb-6 max-h-96 overflow-y-auto pr-2">
                              {orderItems.map((item, index) => (
                                <div key={index} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                                  <div className="flex items-start justify-between gap-3 mb-3">
                                    <div className="flex-1 min-w-0">
                                      <h4 className="text-sm text-[#272727] mb-1">{item.productName}</h4>
                                      <p className="text-xs text-[#999999] bg-gray-100 rounded px-2 py-0.5 inline-block">
                                        {item.size} - {item.orderType === "case" ? "Case" : "Unit"}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between">
                                    <div className="text-sm text-[#0EA0DC]">
                                      ${(item.price * item.quantity).toFixed(2)}
                                      {item.quantity > 1 && (
                                        <span className="text-xs text-[#999999] block">
                                          ${item.price.toFixed(2)} each
                                        </span>
                                      )}
                                    </div>

                                    <div className="flex items-center gap-1.5 bg-gray-100 rounded-lg p-1">
                                      <button
                                        onClick={() => updateOrderQuantity(index, -1)}
                                        className="w-7 h-7 rounded-md bg-white hover:bg-[#0EA0DC] hover:text-white transition-all flex items-center justify-center shadow-sm"
                                      >
                                        <Minus className="w-3 h-3" />
                                      </button>
                                      <span className="text-sm text-[#272727] w-6 text-center">
                                        {item.quantity}
                                      </span>
                                      <button
                                        onClick={() => updateOrderQuantity(index, 1)}
                                        className="w-7 h-7 rounded-md bg-white hover:bg-[#0EA0DC] hover:text-white transition-all flex items-center justify-center shadow-sm"
                                      >
                                        <Plus className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <Separator className="my-4 bg-gray-300" />

                            <div className="space-y-3 mb-6">
                              <div className="flex justify-between items-baseline">
                                <span className="text-[#272727]">Total</span>
                                <span className="text-xl text-[#0EA0DC]">${orderTotal.toFixed(2)}</span>
                              </div>
                            </div>

                            <Button
                              onClick={generateOrderRequest}
                              className="w-full bg-[#0EA0DC] text-white hover:shadow-[0_0_20px_rgba(14,160,220,0.4)] hover:bg-[#0c80b3] transition-all duration-200 h-12 rounded-lg"
                            >
                              <Send className="w-4 h-4 mr-2" />
                              Generate Order Request
                            </Button>

                            <p className="text-xs text-[#666666] mt-3 text-center">
                              Request will be sent to SkyGloss admin team
                            </p>
                          </>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Certified Section */}
          {activeSection === "certified" && (
            <motion.div
              key="certified"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl mx-auto"
            >
              <Card className="skygloss-card p-4 sm:p-8 rounded-2xl">
                {!certSubmitted ? (
                  <>
                    <div className="text-center mb-6 sm:mb-8">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-lg bg-[#0EA0DC] flex items-center justify-center">
                        <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                      </div>
                      <h3 className="text-lg sm:text-xl text-[#272727] mb-2">
                        Request Certification
                      </h3>
                      <p className="text-sm sm:text-base text-[#666666]">
                        Generate a new shop certificate for your network
                      </p>
                      <Badge className="mt-3 bg-[#0EA0DC] text-white">
                        $25.00 Fee
                      </Badge>
                    </div>

                    <form onSubmit={handleCertificateRequest} className="space-y-4">
                      <div>
                        <label className="block text-sm text-[#272727] mb-2">
                          Country
                        </label>
                        <Select value={certCountry} onValueChange={setCertCountry} required>
                          <SelectTrigger className="bg-white rounded-lg border-[#0EA0DC]/30">
                            <SelectValue placeholder="Select country" />
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

                      <div>
                        <label className="block text-sm text-[#272727] mb-2">
                          Requester Name
                        </label>
                        <Input
                          type="text"
                          value={certRequester}
                          onChange={(e) => setCertRequester(e.target.value)}
                          placeholder="Enter your name"
                          className="bg-white rounded-lg border-[#0EA0DC]/30"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-[#272727] mb-2">
                          Shop Name
                        </label>
                        <Input
                          type="text"
                          value={certShopName}
                          onChange={(e) => setCertShopName(e.target.value)}
                          placeholder="Enter shop name"
                          className="bg-white rounded-lg border-[#0EA0DC]/30"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-[#272727] mb-2">
                          Shop Email
                        </label>
                        <Input
                          type="email"
                          value={certEmail}
                          onChange={(e) => setCertEmail(e.target.value)}
                          placeholder="Enter shop email"
                          className="bg-white rounded-lg border-[#0EA0DC]/30"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-[#272727] mb-2">
                          Shop Phone
                        </label>
                        <Input
                          type="tel"
                          value={certPhone}
                          onChange={(e) => setCertPhone(e.target.value)}
                          placeholder="Enter shop phone number"
                          className="bg-white rounded-lg border-[#0EA0DC]/30"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-[#272727] mb-2">
                          Shop City
                        </label>
                        <Input
                          type="text"
                          value={certShopCity}
                          onChange={(e) => setCertShopCity(e.target.value)}
                          placeholder="Enter shop city"
                          className="bg-white rounded-lg border-[#0EA0DC]/30"
                          required
                        />
                      </div>

                      <div className="bg-[#0EA0DC]/5 border border-[#0EA0DC]/20 rounded-lg p-4 mt-6">
                        <div className="flex items-start gap-3">
                          <CreditCard className="w-5 h-5 text-[#0EA0DC] mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm text-[#272727] mb-1">
                              Payment Integration
                            </p>
                            <p className="text-xs text-[#666666]">
                              This form integrates with Stripe for secure $25 payment processing.
                              Certificate will be generated upon successful payment.
                            </p>
                          </div>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#0EA0DC] text-white hover:shadow-[0_0_20px_rgba(14,160,220,0.4)] h-12 rounded-lg mt-6"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Processing...
                          </div>
                        ) : "Submit & Pay $25.00"}
                      </Button>
                    </form>

                    {/* Request History Section */}
                    {myRequests.length > 0 && (
                      <div className="mt-12">
                        <h4 className="text-lg font-semibold text-[#272727] mb-6 flex items-center gap-2">
                          <FileText className="w-5 h-5 text-[#0EA0DC]" />
                          My Requests History
                        </h4>
                        <div className="space-y-4">
                          {loadingRequests ? (
                            <div className="flex justify-center p-8">
                              <div className="w-6 h-6 border-2 border-[#0EA0DC] border-t-transparent rounded-full animate-spin" />
                            </div>
                          ) : (
                            myRequests.map((request) => (
                              <div key={request._id} className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-center justify-between">
                                <div className="space-y-1">
                                  <h5 className="font-medium text-[#272727]">{request.shopName}</h5>
                                  <div className="flex items-center gap-3 text-sm text-[#666666]">
                                    <span className="flex items-center gap-1">
                                      <Globe className="w-3 h-3" /> {request.shopCity}
                                    </span>
                                    <span>•</span>
                                    <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                                  </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                  <Badge className={request.paymentStatus === 'paid' ? 'bg-green-100 text-green-700 hover:bg-green-100 border-0' : 'bg-gray-100 text-gray-500 hover:bg-gray-100 border-0'}>
                                    {request.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                                  </Badge>
                                  <div className="flex items-center gap-1.5 text-sm font-medium">
                                    {getStatusIcon(request.requestStatus)}
                                    <span className={
                                      request.requestStatus === 'approved' ? 'text-green-600' :
                                        request.requestStatus === 'rejected' ? 'text-red-600' :
                                          'text-amber-600'
                                    }>
                                      {getStatusText(request.requestStatus)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8 sm:py-12"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
                    </div>
                    <h3 className="text-xl sm:text-2xl text-[#272727] mb-3">
                      Certificate Requested!
                    </h3>
                    <p className="text-sm sm:text-base text-[#666666] mb-6 px-4">
                      Your certificate request has been submitted and payment processed.
                      The admin team will generate your certificate and add the shop to the mapping system.
                    </p>
                    <Button
                      onClick={() => setCertSubmitted(false)}
                      variant="outline"
                      className="rounded-lg border-[#0EA0DC]/30 text-[#0EA0DC] hover:border-[#0EA0DC] hover:bg-[#0EA0DC]/5"
                    >
                      Submit Another Request
                    </Button>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          )}

          {/* Network Section */}
          {activeSection === "network" && (
            <motion.div
              key="network"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <NetworkDashboard />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <Footer />

      {/* Mobile Cart Sheet */}
      <Sheet open={showCartSheet} onOpenChange={setShowCartSheet}>
        <SheetContent side="right" className="w-full sm:max-w-md bg-white p-0 flex flex-col">
          {/* Header with gradient background */}
          <div className="bg-gradient-to-br from-[#0EA0DC] to-[#0c80b3] p-6 pb-8">
            <div>
              <SheetTitle className="text-white text-2xl mb-2">Order Summary</SheetTitle>
              <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                {orderCount} {orderCount === 1 ? "item" : "items"}
              </Badge>
            </div>
          </div>

          {/* Cart Content */}
          <div className="flex-1 flex flex-col overflow-hidden -mt-4">
            {orderItems.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center px-6">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Package className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-[#666666]">No items added</p>
                <p className="text-sm text-[#999999] mt-1">Add products to create order</p>
              </div>
            ) : (
              <>
                {/* Order Items */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                  {orderItems.map((item, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                      <div className="mb-3">
                        <h4 className="text-[#272727] mb-1">{item.productName}</h4>
                        <p className="text-xs text-[#999999] bg-gray-100 rounded px-2 py-0.5 inline-block">
                          {item.size} - {item.orderType === "case" ? "Case" : "Unit"}
                        </p>
                      </div>

                      {/* Price and Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="text-[#0EA0DC]">
                          ${(item.price * item.quantity).toFixed(2)}
                          {item.quantity > 1 && (
                            <span className="text-xs text-[#999999] ml-1">
                              (${item.price.toFixed(2)} each)
                            </span>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                          <button
                            onClick={() => updateOrderQuantity(index, -1)}
                            className="w-8 h-8 rounded-md bg-white hover:bg-[#0EA0DC] hover:text-white transition-all flex items-center justify-center shadow-sm text-[rgb(0,0,0)]"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-[#272727] w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateOrderQuantity(index, 1)}
                            className="w-8 h-8 rounded-md bg-white hover:bg-[#0EA0DC] hover:text-white transition-all flex items-center justify-center shadow-sm text-[rgb(0,0,0)]"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary Footer */}
                <div className="border-t border-gray-200 bg-gray-50 px-6 py-5 space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-baseline">
                      <span className="text-[#272727]">Total</span>
                      <span className="text-2xl text-[#0EA0DC]">${orderTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      generateOrderRequest();
                      setShowCartSheet(false);
                    }}
                    className="w-full bg-[#0EA0DC] text-white hover:shadow-[0_0_20px_rgba(14,160,220,0.4)] hover:bg-[#0c80b3] transition-all duration-200 h-12 rounded-lg"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Generate Order Request
                  </Button>

                  <p className="text-xs text-[#666666] text-center">
                    Request will be sent to SkyGloss admin team
                  </p>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
