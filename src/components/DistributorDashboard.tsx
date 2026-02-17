// Last Updated: 2026-02-02
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import { Package, FileText, Globe, CreditCard, Send, CheckCircle, Plus, Minus, XCircle, Award, GraduationCap, Clock } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Sheet, SheetContent, SheetTitle } from "./ui/sheet";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { NetworkDashboard } from "./NetworkDashboard";
import { ProductDetailPage } from "./ProductDetailPage";
import { CoursePlayer } from "./CoursePlayer";
import { FusionGuide } from "./FusionGuide";
import { ResinFilmGuide } from "./ResinFilmGuide";
import { SealGuide } from "./SealGuide";
import { MatteGuide } from "./MatteGuide";
import { ShineGuide } from "./ShineGuide";
import { useAuth } from "../AuthContext";
import api from "../api/axios";
import { toast } from "sonner";
import { Footer } from "./Footer";
import fusionMainImage from "../assets/Master_Distributor_Dashboard/1 Fusion.png";
import fusionElementImage from "../assets/Master_Distributor_Dashboard/1 Fusion.png";
import fusionAetherImage from "../assets/Master_Distributor_Dashboard/1 Fusion.png";
import resinFilmImage from "../assets/Master_Distributor_Dashboard/2 Resin Film.png";
import sealImage from "../assets/Master_Distributor_Dashboard/3 Seal.png";
import matteBoxImage from "../assets/Master_Distributor_Dashboard/4 Matte.png";
import shineBoxImage from "../assets/Master_Distributor_Dashboard/5 Shine.png";
import applicatorBottleImage from "../assets/Master_Distributor_Dashboard/6 Applicator Bottle.png";
import edgeBladeBox1Image from "../assets/Master_Distributor_Dashboard/7 Edge Blade.png";
import edgeBladeBox2Image from "../assets/Master_Distributor_Dashboard/7 Edge Blade.png";
import paintPenBoxImage from "../assets/Master_Distributor_Dashboard/8 Paint Pen.png";
import paintPenToolsImage from "../assets/Master_Distributor_Dashboard/8 Paint Pen.png";
import applicatorsImage from "../assets/Master_Distributor_Dashboard/8 Applicator.png";
const distributorProducts = [
  {
    id: 1,
    name: "FUSION SYSTEM",
    description: "Complete dual-layer coating (Element + Aether)",
    sizes: ["250ml", "500ml", "2L"],
    unitPrices: {
      "250ml": 90.00,
      "500ml": 160.00,
      "2L": 600.00
    },
    casePrices: {
      "250ml": 900.00,
      "500ml": 960.00,
      "2L": 3600.00
    },
    unitsPerCase: {
      "250ml": 10,
      "500ml": 6,
      "2L": 6
    },
    image: fusionMainImage,
    additionalImage: fusionElementImage,
    additionalImage2: fusionAetherImage
  },
  {
    id: 3,
    name: "RESIN FILM",
    sizes: ["60ml"],
    unitPrices: { "60ml": 90.00 },
    casePrices: { "60ml": 900.00 },
    unitsPerCase: { "60ml": 10 },
    image: resinFilmImage
  },
  {
    id: 6,
    name: "SHINE",
    sizes: ["30ml"],
    unitPrices: { "30ml": 60.00 },
    casePrices: { "30ml": 600.00 },
    unitsPerCase: { "30ml": 10 },
    image: shineBoxImage
  },
  {
    id: 5,
    name: "MATTE",
    sizes: ["30ml"],
    unitPrices: { "30ml": 60.00 },
    casePrices: { "30ml": 600.00 },
    unitsPerCase: { "30ml": 10 },
    image: matteBoxImage
  },
  {
    id: 4,
    name: "SEAL",
    sizes: ["250ml"],
    unitPrices: { "250ml": 30.00 },
    casePrices: { "250ml": 300.00 },
    unitsPerCase: { "250ml": 10 },
    image: sealImage
  },
  {
    id: 9,
    name: "APPLICATORS (2-Pack)",
    sizes: ["2-Pack"],
    unitPrices: { "2-Pack": 2.00 },
    casePrices: { "2-Pack": 40.00 },
    unitsPerCase: { "2-Pack": 20 },
    image: applicatorsImage // Placeholder as no image provided
  },
  {
    id: 7,
    name: "APPLICATOR BOTTLE",
    sizes: ["1pc"],
    unitPrices: { "1pc": 50.00 },
    casePrices: { "1pc": 1000.00 },
    unitsPerCase: { "1pc": 20 },
    image: applicatorBottleImage
  },
  {
    id: 8,
    name: "EDGE BLADE",
    sizes: ["1pc"],
    unitPrices: { "1pc": 2.00 },
    casePrices: { "1pc": 20.00 },
    unitsPerCase: { "1pc": 10 },
    image: edgeBladeBox1Image,
    additionalImages: [edgeBladeBox2Image]
  },
  {
    id: 10,
    name: "PAINT PEN",
    sizes: ["1pc"],
    unitPrices: { "1pc": 30.00 },
    casePrices: { "1pc": 300.00 },
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
  const { showCartSheet, setShowCartSheet, user } = useAuth();
  const { section, courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState<"shop" | "certified" | "network" | "courses">("shop");
  const [viewingCourse, setViewingCourse] = useState<string | null>(null);

  // Sync state with URL
  useEffect(() => {
    if (section) {
      if (["shop", "certified", "network", "courses"].includes(section)) {
        setActiveSection(section as any);
      }
    } else if (!courseId) {
      setActiveSection("shop");
    }

    if (courseId) {
      setActiveSection("courses");
      setViewingCourse(courseId);
    } else {
      setViewingCourse(null);
    }
  }, [section, courseId, location.pathname]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  // Certification States
  const [certRequester, setCertRequester] = useState("");
  const [certDistributorName, setCertDistributorName] = useState("");
  const [certShopName, setCertShopName] = useState("");
  const [certEmail, setCertEmail] = useState("");
  const [certPhone, setCertPhone] = useState("");
  const [certCountry, setCertCountry] = useState("US");
  const [certShopAddress, setCertShopAddress] = useState("");
  const [certShopCity, setCertShopCity] = useState("");
  const [certShopState, setCertShopState] = useState("");
  const [certShopZip, setCertShopZip] = useState("");
  const [certInstagram, setCertInstagram] = useState("");
  const [certWebsite, setCertWebsite] = useState("");
  const [certFacebook, setCertFacebook] = useState("");
  const [certSubmitted, setCertSubmitted] = useState(false);

  const [showAether, setShowAether] = useState(false); // false = Element, true = Aether
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewingProduct, setViewingProduct] = useState<number | null>(null);

  // Shipping details for Order Request
  const [shippingPhone, setShippingPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingCountry, setShippingCountry] = useState("");

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
        navigate("/dashboard/distributor/certified");
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

  const generateOrderRequest = async () => {
    if (orderItems.length === 0) {
      toast.error("Please add items to your order");
      return;
    }

    if (!shippingPhone || !shippingAddress || !shippingCountry) {
      toast.error("Please fill in all shipping details");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post("/orders/request", {
        items: orderItems.map(item => ({
          product: item.productId.toString(),
          name: item.productName,
          size: item.size,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: {
          email: user?.email || "",
          firstName: user?.firstName || "",
          lastName: user?.lastName || "",
          address: shippingAddress,
          city: "N/A",
          state: "N/A",
          zipCode: "N/A",
          country: shippingCountry,
          phoneNumber: shippingPhone
        }
      });

      setOrderItems([]);
      setShippingPhone("");
      setShippingAddress("");
      setShippingCountry("");

      if (onShowThankYou) {
        onShowThankYou();
      } else {
        toast.success("Order request generated!", {
          description: "Our admin team will review and contact you."
        });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to generate order request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCertificateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await api.post("/certifications/checkout-session", {
        country: certCountry,
        distributorName: certDistributorName,
        requesterName: certRequester,
        shopName: certShopName,
        shopEmail: certEmail,
        shopPhone: certPhone,
        shopAddress: certShopAddress,
        shopCity: certShopCity,
        shopState: certShopState,
        shopZip: certShopZip,
        shopInstagram: certInstagram,
        shopWebsite: certWebsite,
        shopFacebook: certFacebook
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

  if (viewingCourse) {
    const isFusion = viewingCourse.toUpperCase().includes('FUSION');
    const isResinFilm = viewingCourse.toUpperCase().includes('RESIN FILM');

    if (isFusion) {
      return <FusionGuide onBack={() => navigate('/dashboard/distributor/courses')} />;
    }

    if (isResinFilm) {
      return <ResinFilmGuide onBack={() => navigate('/dashboard/distributor/courses')} />;
    }

    const isSeal = viewingCourse.toUpperCase().includes('SEAL');
    if (isSeal) {
      return <SealGuide onBack={() => navigate('/dashboard/distributor/courses')} />;
    }

    const isMatte = viewingCourse.toUpperCase().includes('MATTE');
    if (isMatte) {
      return <MatteGuide onBack={() => navigate('/dashboard/distributor/courses')} />;
    }

    const isShine = viewingCourse.toUpperCase().includes('SHINE');
    if (isShine) {
      return <ShineGuide onBack={() => navigate('/dashboard/distributor/courses')} />;
    }

    return <CoursePlayer productName={viewingCourse} onBack={() => navigate('/dashboard/distributor/courses')} />;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "rejected": return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-amber-500" />;
    }
  };

  const handleBackFromProduct = () => {
    setViewingProduct(null);
  };

  const handleAddFromProductPage = (size: string, quantity: number, _price?: number, oType?: "unit" | "case") => {
    const product = distributorProducts.find(p => p.id === viewingProduct);
    if (!product) return;

    for (let i = 0; i < quantity; i++) {
      addToOrder(product, size, oType || "unit");
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-[#272727] mb-2">
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
              onClick={() => navigate("/dashboard/distributor/shop")}
              className={`flex items-center justify-center px-4 sm:px-10 py-3 sm:py-4 rounded-lg transition-all duration-200 ${activeSection === "shop"
                ? "bg-[#272727] text-white shadow-lg"
                : "bg-transparent text-[#0EA0DC] hover:bg-[#0EA0DC]/5"
                }`}
            >
              <Package className="w-5 h-5 mr-2 sm:mr-3" />
              <span className="text-base sm:text-lg">Shop</span>
            </button>
            <button
              onClick={() => navigate("/dashboard/distributor/certified")}
              className={`flex items-center justify-center px-4 sm:px-10 py-3 sm:py-4 rounded-lg transition-all duration-200 ${activeSection === "certified"
                ? "bg-[#272727] text-white shadow-lg"
                : "bg-transparent text-[#0EA0DC] hover:bg-[#0EA0DC]/5"
                }`}
            >
              <Award className="w-5 h-5 mr-2 sm:mr-3" />
              <span className="text-base sm:text-lg">Certified</span>
            </button>
            <button
              onClick={() => navigate("/dashboard/distributor/network")}
              className={`flex items-center justify-center px-4 sm:px-10 py-3 sm:py-4 rounded-lg transition-all duration-200 ${activeSection === "network"
                ? "bg-[#272727] text-white shadow-lg"
                : "bg-transparent text-[#0EA0DC] hover:bg-[#0EA0DC]/5"
                }`}
            >
              <Globe className="w-5 h-5 mr-2 sm:mr-3" />
              <span className="text-base sm:text-lg">Dashboard</span>
            </button>
            <button
              onClick={() => navigate("/dashboard/distributor/courses")}
              className={`flex items-center justify-center px-4 sm:px-10 py-3 sm:py-4 rounded-lg transition-all duration-200 ${activeSection === "courses"
                ? "bg-[#272727] text-white shadow-lg"
                : "bg-transparent text-[#0EA0DC] hover:bg-[#0EA0DC]/5"
                }`}
            >
              <GraduationCap className="w-5 h-5 mr-2 sm:mr-3" />
              <span className="text-base sm:text-lg">Courses</span>
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
              {viewingProduct !== null ? (
                <ProductDetailPage
                  productId={viewingProduct.toString()}
                  initialProduct={distributorProducts.find(p => p.id === viewingProduct)}
                  onBack={handleBackFromProduct}
                  onAddToCart={handleAddFromProductPage}
                  showPrice={true}
                  onOpenCart={() => setShowCartSheet(true)}
                />
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 pb-12">
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
                                    className="w-full h-64 sm:w-48 sm:h-48 object-contain mx-auto cursor-pointer hover:scale-105 transition-transform duration-300"
                                  // onClick={() => setViewingProduct(product.id)}
                                  />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3
                                  className="text-base sm:text-lg font-semibold text-[#272727] mb-3 sm:mb-4 cursor-pointer hover:text-[#0EA0DC] transition-colors"
                                  onClick={() => setViewingProduct(product.id)}
                                >
                                  {product.name}
                                </h3>
                                <div className="space-y-3">
                                  {product.sizes.map(size => (
                                    <div key={size} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-lg gap-3">
                                      <div className="flex-1 min-w-0">
                                        <span className="text-[#272727] font-medium block mb-1">
                                          {product.id === 1 ? `${size} (Element + Aether)` : size}
                                        </span>
                                        <div className="flex flex-col sm:flex-row sm:gap-4 gap-1">
                                          <span className="text-xs sm:text-sm text-[#666666]">
                                            Unit: <span className="text-[#0EA0DC] font-semibold">
                                              ${product.unitPrices[size as keyof typeof product.unitPrices].toFixed(2)}
                                            </span>
                                          </span>
                                          <span className="text-xs sm:text-sm text-[#666666]">
                                            Case ({product.unitsPerCase[size as keyof typeof product.unitsPerCase]} units): <span className="text-[#0EA0DC] font-semibold">
                                              ${product.casePrices[size as keyof typeof product.casePrices].toFixed(2)}
                                            </span>
                                          </span>
                                        </div>
                                      </div>
                                      <div className="flex gap-2">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => addToOrder(product, size, "unit")}
                                          className="rounded-lg border-[#0EA0DC]/30 text-[#0EA0DC] hover:border-[#0EA0DC] hover:bg-[#0EA0DC]/5 flex-1 sm:flex-none"
                                        >
                                          + Unit
                                        </Button>
                                        <Button
                                          size="sm"
                                          onClick={() => addToOrder(product, size, "case")}
                                          className="bg-[#0EA0DC] text-white hover:shadow-[0_0_20px_rgba(14,160,220,0.4)] rounded-lg flex-1 sm:flex-none font-medium"
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
                      <Card className="skygloss-card p-0 rounded-2xl overflow-hidden shadow-xl border-0">
                        <div className="bg-gradient-to-br from-[#0EA0DC] to-[#0c80b3] p-6 text-white">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-bold">Order Summary</h3>
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
                              <p className="text-[#666666] font-medium">No items added</p>
                              <p className="text-sm text-[#999999] mt-1">Add products to create order</p>
                            </div>
                          ) : (
                            <>
                              <div className="space-y-3 mb-6 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                                {orderItems.map((item, index) => (
                                  <div key={index} className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                      <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-semibold text-[#272727] mb-1">{item.productName}</h4>
                                        <p className="text-xs text-[#999999] bg-gray-50 rounded-full px-2 py-0.5 inline-block border border-gray-100">
                                          {item.size} • {item.orderType === "case" ? "Case" : "Unit"}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                      <div className="text-sm font-bold text-[#0EA0DC]">
                                        ${(item.price * item.quantity).toFixed(2)}
                                        {item.quantity > 1 && (
                                          <span className="text-[10px] text-[#999999] block font-normal">
                                            ${item.price.toFixed(2)} each
                                          </span>
                                        )}
                                      </div>

                                      <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg p-1 border border-gray-100">
                                        <button
                                          onClick={() => updateOrderQuantity(index, -1)}
                                          className="w-7 h-7 rounded-md bg-white hover:bg-[#0EA0DC] hover:text-white transition-all flex items-center justify-center shadow-sm"
                                        >
                                          <Minus className="w-3.5 h-3.5" />
                                        </button>
                                        <span className="text-sm font-bold text-[#272727] w-6 text-center">
                                          {item.quantity}
                                        </span>
                                        <button
                                          onClick={() => updateOrderQuantity(index, 1)}
                                          className="w-7 h-7 rounded-md bg-white hover:bg-[#0EA0DC] hover:text-white transition-all flex items-center justify-center shadow-sm"
                                        >
                                          <Plus className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <Separator className="my-4 bg-gray-100" />

                              <div className="space-y-3 mb-6">
                                <div className="flex justify-between items-baseline">
                                  <span className="text-[#666666] font-medium">Total Amount</span>
                                  <span className="text-2xl font-bold text-[#0EA0DC]">${orderTotal.toFixed(2)}</span>
                                </div>
                              </div>

                              <div className="space-y-4 mb-6">
                                <h4 className="text-sm font-bold text-[#272727] flex items-center gap-2">
                                  <Globe className="w-4 h-4 text-[#0EA0DC]" />
                                  Shipping Details
                                </h4>
                                <div className="space-y-3">
                                  <Input
                                    placeholder="Phone Number"
                                    value={shippingPhone}
                                    onChange={(e) => setShippingPhone(e.target.value)}
                                    className="bg-white rounded-lg border-gray-200 focus:border-[#0EA0DC]"
                                  />
                                  <Input
                                    placeholder="Shipping Street Address"
                                    value={shippingAddress}
                                    onChange={(e) => setShippingAddress(e.target.value)}
                                    className="bg-white rounded-lg border-gray-200 focus:border-[#0EA0DC]"
                                  />
                                  <Input
                                    placeholder="Country"
                                    value={shippingCountry}
                                    onChange={(e) => setShippingCountry(e.target.value)}
                                    className="bg-white rounded-lg border-gray-200 focus:border-[#0EA0DC]"
                                  />
                                </div>
                              </div>

                              <Button
                                onClick={generateOrderRequest}
                                disabled={!shippingPhone || !shippingAddress || !shippingCountry || isSubmitting}
                                className="w-full bg-[#0EA0DC] text-white hover:shadow-[0_0_20px_rgba(14,160,220,0.4)] hover:bg-[#0c80b3] transition-all duration-200 h-12 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed font-bold"
                              >
                                {isSubmitting ? (
                                  <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Generating...
                                  </div>
                                ) : (
                                  <>
                                    <Send className="w-4 h-4 mr-2" />
                                    Generate Order Request
                                  </>
                                )}
                              </Button>

                              <p className="text-[10px] text-[#999999] mt-4 text-center">
                                Detailed request will be sent to SkyGloss admin team for review and invoice generation.
                              </p>
                            </>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  </div>
                </div>
              )}
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
              className="max-w-3xl mx-auto pb-12"
            >
              <Card className="skygloss-card p-4 sm:p-10 rounded-3xl shadow-xl border-0 overflow-hidden">
                {!certSubmitted ? (
                  <>
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#0EA0DC] to-[#0c80b3] flex items-center justify-center shadow-lg transform rotate-3">
                        <Award className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-[#272727] mb-2">
                        Shop Certification Request
                      </h3>
                      <p className="text-sm sm:text-base text-[#666666] max-w-md mx-auto">
                        Verify your shop and unlock exclusive master distributor benefits and mapping placement.
                      </p>
                      <Badge className="mt-4 bg-[#0EA0DC]/10 text-[#0EA0DC] border-0 px-4 py-1.5 text-sm font-semibold">
                        $25.00 Verification Fee
                      </Badge>
                    </div>

                    <form onSubmit={handleCertificateRequest} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-[#272727]">Requester Name</label>
                          <Input
                            value={certRequester}
                            onChange={(e) => setCertRequester(e.target.value)}
                            placeholder="Full name"
                            className="bg-white rounded-xl border-gray-200 focus:border-[#0EA0DC] h-11"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-[#272727]">Distributor Name</label>
                          <Input
                            value={certDistributorName}
                            onChange={(e) => setCertDistributorName(e.target.value)}
                            placeholder="Registered distributor name"
                            className="bg-white rounded-xl border-gray-200 focus:border-[#0EA0DC] h-11"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-[#272727]">Shop Name</label>
                          <Input
                            value={certShopName}
                            onChange={(e) => setCertShopName(e.target.value)}
                            placeholder="Public shop name"
                            className="bg-white rounded-xl border-gray-200 focus:border-[#0EA0DC] h-11"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-[#272727]">Shop Email</label>
                          <Input
                            type="email"
                            value={certEmail}
                            onChange={(e) => setCertEmail(e.target.value)}
                            placeholder="contact@shop.com"
                            className="bg-white rounded-xl border-gray-200 focus:border-[#0EA0DC] h-11"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-[#272727]">Shop Phone</label>
                          <Input
                            type="tel"
                            value={certPhone}
                            onChange={(e) => setCertPhone(e.target.value)}
                            placeholder="+1 (xxx) xxx-xxxx"
                            className="bg-white rounded-xl border-gray-200 focus:border-[#0EA0DC] h-11"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-[#272727]">Country</label>
                          <Select value={certCountry} onValueChange={setCertCountry}>
                            <SelectTrigger className="bg-white rounded-xl border-gray-200 focus:border-[#0EA0DC] h-11">
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px]">
                              <SelectItem value="US">United States</SelectItem>
                              <SelectItem value="CA">Canada</SelectItem>
                              <SelectItem value="UK">United Kingdom</SelectItem>
                              <SelectItem value="AU">Australia</SelectItem>
                              <SelectItem value="MX">Mexico</SelectItem>
                              <SelectItem value="DE">Germany</SelectItem>
                              <SelectItem value="FR">France</SelectItem>
                              <SelectItem value="IT">Italy</SelectItem>
                              <SelectItem value="ES">Spain</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-[#272727]">Shop Street Address</label>
                        <Input
                          value={certShopAddress}
                          onChange={(e) => setCertShopAddress(e.target.value)}
                          placeholder="Full street address"
                          className="bg-white rounded-xl border-gray-200 focus:border-[#0EA0DC] h-11"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-[#272727]">City</label>
                          <Input
                            value={certShopCity}
                            onChange={(e) => setCertShopCity(e.target.value)}
                            placeholder="City"
                            className="bg-white rounded-xl border-gray-200 focus:border-[#0EA0DC] h-11"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-[#272727]">State/Prov</label>
                          <Input
                            value={certShopState}
                            onChange={(e) => setCertShopState(e.target.value)}
                            placeholder="State"
                            className="bg-white rounded-xl border-gray-200 focus:border-[#0EA0DC] h-11"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-[#272727]">ZIP Code</label>
                          <Input
                            value={certShopZip}
                            onChange={(e) => setCertShopZip(e.target.value)}
                            placeholder="ZIP"
                            className="bg-white rounded-xl border-gray-200 focus:border-[#0EA0DC] h-11"
                            required
                          />
                        </div>
                      </div>

                      <div className="pt-6 border-t border-gray-100">
                        <h4 className="text-sm font-bold text-[#272727] mb-4 flex items-center gap-2">
                          <Globe className="w-4 h-4 text-[#0EA0DC]" />
                          Online Presence (Optional)
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-[#666666]">Instagram Handle</label>
                            <Input
                              value={certInstagram}
                              onChange={(e) => setCertInstagram(e.target.value)}
                              placeholder="@username"
                              className="bg-white rounded-xl border-gray-100 focus:border-[#0EA0DC] h-10 text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-[#666666]">Facebook Page</label>
                            <Input
                              value={certFacebook}
                              onChange={(e) => setCertFacebook(e.target.value)}
                              placeholder="Shop Name / URL"
                              className="bg-white rounded-xl border-gray-100 focus:border-[#0EA0DC] h-10 text-sm"
                            />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <label className="text-xs font-semibold text-[#666666]">Website URL</label>
                            <Input
                              type="url"
                              value={certWebsite}
                              onChange={(e) => setCertWebsite(e.target.value)}
                              placeholder="https://www.yourshop.com"
                              className="bg-white rounded-xl border-gray-100 focus:border-[#0EA0DC] h-10 text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="bg-[#0EA0DC]/5 border border-[#0EA0DC]/10 rounded-2xl p-4 flex items-start gap-4 shadow-inner">
                        <CreditCard className="w-6 h-6 text-[#0EA0DC] flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <p className="text-sm font-bold text-[#272727] mb-1">Secure Checkout</p>
                          <p className="text-xs text-[#666666] leading-relaxed">
                            You will be redirected to Stripe for secure $25 payment.
                            Verification takes 1-2 business days after successful submission.
                          </p>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#0EA0DC] text-white hover:shadow-[0_0_25px_rgba(14,160,220,0.5)] h-14 rounded-2xl font-bold text-lg transition-all"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Redirecting...
                          </div>
                        ) : "Submit & Pay $25.00"}
                      </Button>
                    </form>

                    {/* Request History Section */}
                    {myRequests.length > 0 && (
                      <div className="mt-16">
                        <h4 className="text-lg font-bold text-[#272727] mb-8 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-[#0EA0DC]" />
                            Request History
                          </div>
                          <Badge variant="outline" className="font-normal text-[#666666] border-gray-200">
                            {myRequests.length} Total
                          </Badge>
                        </h4>

                        <div className="space-y-4">
                          {loadingRequests ? (
                            <div className="flex justify-center p-12">
                              <div className="w-8 h-8 border-2 border-[#0EA0DC] border-t-transparent rounded-full animate-spin" />
                            </div>
                          ) : (
                            myRequests.map((request) => (
                              <div
                                key={request._id}
                                className="group bg-white border border-gray-100 rounded-2xl p-5 flex items-center justify-between hover:border-[#0EA0DC]/30 hover:shadow-md transition-all"
                              >
                                <div className="space-y-1.5 py-1">
                                  <h5 className="font-bold text-[#272727] group-hover:text-[#0EA0DC] transition-colors">
                                    {request.shopName}
                                  </h5>
                                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#999999]">
                                    <span className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                                      <Globe className="w-3 h-3 text-[#0EA0DC]" /> {request.shopCity}
                                    </span>
                                    <span className="flex items-center gap-1.5 opacity-70">
                                      <Clock className="w-3 h-3" /> {new Date(request.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex flex-col items-end gap-2.5">
                                  <Badge className={
                                    request.paymentStatus === 'paid'
                                      ? 'bg-green-100 text-green-700 hover:bg-green-100 border-0 shadow-sm'
                                      : 'bg-amber-100 text-amber-700 hover:bg-amber-100 border-0 shadow-sm'
                                  }>
                                    {request.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                                  </Badge>
                                  <div className="flex items-center gap-1.5 text-xs font-bold">
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
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12 px-4"
                  >
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-50 flex items-center justify-center border-4 border-green-100">
                      <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#272727] mb-3">
                      Application Submitted!
                    </h3>
                    <p className="text-[#666666] mb-8 leading-relaxed max-w-sm mx-auto">
                      Your certification request is being reviewed. You will receive an email confirmation once the process is complete.
                    </p>
                    <Button
                      onClick={() => setCertSubmitted(false)}
                      variant="outline"
                      className="rounded-xl border-gray-200 text-[#666666] hover:bg-gray-50 px-8"
                    >
                      New Application
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

          {/* Courses Section */}
          {activeSection === "courses" && (
            <motion.div
              key="courses"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#272727] mb-4">Available Training Courses</h2>
                <p className="text-[#666666] mb-6">
                  Complete comprehensive training for each SkyGloss product line to maintain certified status.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {distributorProducts
                  .filter(p => !['PPF GLOSS', 'PPF MATTE', 'APPLICATOR', 'APPLICATOR BOTTLE', 'EDGE BLADE', 'PAINT PEN']
                    .includes(p.name.toUpperCase()) && !p.name.includes('APPLICATORS'))
                  .map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="skygloss-card p-6 rounded-2xl h-full flex flex-col group hover:shadow-xl transition-all border-0 shadow-lg">
                        <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl mb-4 p-4 border border-gray-50">
                          <ImageWithFallback
                            src={product.image}
                            alt={product.name}
                            className="w-full h-40 object-contain mx-auto group-hover:scale-105 transition-transform"
                          />
                        </div>

                        <Badge className="mb-3 bg-[#0EA0DC]/10 text-[#0EA0DC] border-0 w-fit font-bold">
                          Training Course
                        </Badge>

                        <h4 className="text-lg font-bold text-[#272727] mb-2">{product.name}</h4>

                        <p className="text-sm text-[#666666] mb-6 flex-1 leading-relaxed">
                          Comprehensive masterclass covering professional application, surface prep, and advanced maintenance for the {product.name} system.
                        </p>

                        <div className="grid grid-cols-3 gap-2 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                          <div className="text-center">
                            <div className="text-[10px] uppercase tracking-wider font-bold text-[#999999] mb-1">Lessons</div>
                            <div className="text-sm font-bold text-[#272727]">12</div>
                          </div>
                          <div className="text-center border-x border-gray-200">
                            <div className="text-[10px] uppercase tracking-wider font-bold text-[#999999] mb-1">Duration</div>
                            <div className="text-sm font-bold text-[#272727]">3h 15m</div>
                          </div>
                          <div className="text-center">
                            <div className="text-[10px] uppercase tracking-wider font-bold text-[#999999] mb-1">Level</div>
                            <div className="text-sm font-bold text-[#272727]">Master</div>
                          </div>
                        </div>

                        <Button
                          onClick={() => navigate(`/dashboard/distributor/courses/${product.name}`)}
                          className="w-full bg-[#272727] text-white hover:bg-[#0EA0DC] transition-colors h-12 rounded-xl font-bold"
                        >
                          Launch Course
                        </Button>
                      </Card>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />

      {/* Mobile Cart Sheet */}
      <Sheet open={showCartSheet} onOpenChange={setShowCartSheet}>
        <SheetContent side="right" className="w-full sm:max-w-md bg-white p-0 flex flex-col rounded-l-[32px] overflow-hidden border-0 shadow-2xl">
          <div className="bg-gradient-to-br from-[#0EA0DC] to-[#0c80b3] p-8 pb-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl" />
            <div className="relative z-10">
              <SheetTitle className="text-white text-3xl font-bold mb-3">Order Basket</SheetTitle>
              <Badge className="bg-white/20 text-white border-0 backdrop-blur-md px-4 py-1 font-medium">
                {orderCount} {orderCount === 1 ? "item" : "items"}
              </Badge>
            </div>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden -mt-6 bg-white rounded-t-[32px] relative z-20">
            {orderItems.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center px-6">
                <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center mb-6 shadow-inner border border-gray-100">
                  <Package className="w-12 h-12 text-gray-300" />
                </div>
                <p className="text-lg font-bold text-[#272727]">Your basket is empty</p>
                <p className="text-sm text-[#999999] mt-2 text-center max-w-[200px]">Browse our catalog to add products to your order request.</p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-8 space-y-4 custom-scrollbar">
                  {orderItems.map((item, index) => (
                    <div key={index} className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-[#0EA0DC]/30 transition-all shadow-sm">
                      <div className="mb-4">
                        <h4 className="text-base font-bold text-[#272727] mb-1.5">{item.productName}</h4>
                        <Badge variant="outline" className="text-[10px] font-bold text-[#999999] border-gray-200">
                          {item.size} • {item.orderType === "case" ? "Case" : "Unit"}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold text-[#0EA0DC]">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>

                        <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1.5 border border-gray-100 shadow-inner">
                          <button
                            onClick={() => updateOrderQuantity(index, -1)}
                            className="w-9 h-9 rounded-lg bg-white hover:bg-[#0EA0DC] hover:text-white transition-all flex items-center justify-center shadow-sm text-black border border-gray-100"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-base font-bold text-[#272727] w-10 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateOrderQuantity(index, 1)}
                            className="w-9 h-9 rounded-lg bg-white hover:bg-[#0EA0DC] hover:text-white transition-all flex items-center justify-center shadow-sm text-black border border-gray-100"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 bg-white px-8 py-8 space-y-6 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
                  <div className="flex justify-between items-baseline">
                    <span className="text-gray-400 font-bold uppercase tracking-wider text-xs">Subtotal</span>
                    <div className="text-right">
                      <span className="text-3xl font-bold text-[#272727]">${orderTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      generateOrderRequest();
                      setShowCartSheet(false);
                    }}
                    className="w-full bg-[#0EA0DC] text-white hover:shadow-[0_0_30px_rgba(14,160,220,0.5)] hover:bg-[#0c80b3] transition-all duration-300 h-16 rounded-2xl text-lg font-bold"
                  >
                    <Send className="w-5 h-5 mr-3" />
                    Place Order Request
                  </Button>

                  <p className="text-[11px] text-[#999999] text-center leading-relaxed">
                    By clicking above, you confirm this is a request for inquiry.
                    A formal invoice will be generated by our sales department.
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
