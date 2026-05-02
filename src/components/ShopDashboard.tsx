import { motion } from "motion/react";
import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import { Search, ShoppingCart, Plus, Minus, Eye, Loader2, GraduationCap, ShoppingBag, Lock, CheckCircle, MessageCircle, Clock, Award, FileText } from "lucide-react";
import api from "../api/axios";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Sheet, SheetContent, SheetTitle } from "./ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Package } from "lucide-react";

import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ProductDetailPage } from "./ProductDetailPage";
import { CoursePlayer } from "./CoursePlayer";
import { FusionGuide } from "./FusionGuide";
import { ResinFilmGuide } from "./ResinFilmGuide";
import { SealGuide } from "./SealGuide";
import { MatteGuide } from "./MatteGuide";
import { ShineGuide } from "./ShineGuide";
import { UnderstandingSkyGloss } from "./UnderstandingSkyGloss";
import { WelcomeToSkyGloss } from "./WelcomeToSkyGloss";
import SkyGlossShopSetup from "./SkyGlossShopSetup";
import { CheckoutPage } from "./CheckoutPage";
import { OrderRequestPage } from "./OrderRequestPage";
import { toast } from "sonner";
import { useAuth } from "../AuthContext";
import completeImage from "../../src/assets/complete.jpg";



const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham' },
  { code: 'PKR', symbol: 'Rs.', name: 'Pakistani Rupee' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'SAR', symbol: 'SR', name: 'Saudi Riyal' },
  { code: 'QAR', symbol: 'QR', name: 'Qatari Rial' },
  { code: 'KWD', symbol: 'KD', name: 'Kuwaiti Dinar' },
  { code: 'BHD', symbol: 'BD', name: 'Bahraini Dinar' },
  { code: 'OMR', symbol: 'OR', name: 'Omani Rial' },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone' },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'MXN', symbol: 'Mex$', name: 'Mexican Peso' },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
  { code: 'PHP', symbol: '₱', name: 'Philippine Peso' },
  { code: 'THB', symbol: '฿', name: 'Thai Baht' },
  { code: 'VND', symbol: '₫', name: 'Vietnamese Dong' },
  { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
  { code: 'GHS', symbol: 'GH₵', name: 'Ghanaian Cedi' },
  { code: 'MAD', symbol: 'DH', name: 'Moroccan Dirham' },
  { code: 'KZT', symbol: '₸', name: 'Kazakhstani Tenge' },
  { code: 'UAH', symbol: '₴', name: 'Ukrainian Hryvnia' },
  { code: 'PLN', symbol: 'zł', name: 'Polish Zloty' },
  { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna' },
  { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint' },
  { code: 'ILS', symbol: '₪', name: 'Israeli New Shekel' },
  { code: 'CLP', symbol: 'CLP$', name: 'Chilean Peso' },
  { code: 'COP', symbol: 'COL$', name: 'Colombian Peso' },
  { code: 'ARS', symbol: 'ARS$', name: 'Argentine Peso' },
  { code: 'PEN', symbol: 'S/', name: 'Peruvian Sol' },
  { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka' },
  { code: 'LKR', symbol: 'Rs', name: 'Sri Lankan Rupee' },
].sort((a, b) => a.code.localeCompare(b.code));

const getSymbol = (code: string) => currencies.find(c => c.code === code)?.symbol || '$';

// Master Partner Dashboard Assets for Courses
import fusionMainImage from "../assets/Master_Partner_Dashboard/1 Fusion.png";
import resinFilmImage from "../assets/Master_Partner_Dashboard/2 Resin Film.png";
import sealImage from "../assets/Master_Partner_Dashboard/3 Seal.png";
import matteBoxImage from "../assets/Master_Partner_Dashboard/4 Matte.png";
import shineBoxImage from "../assets/Master_Partner_Dashboard/5 Shine.png";
import applicatorBottleImage from "../assets/Master_Partner_Dashboard/6 Applicator Bottle.png";
import edgeBladeBox1Image from "../assets/Master_Partner_Dashboard/7 Edge Blade.png";
import paintPenBoxImage from "../assets/Master_Partner_Dashboard/8 Paint Pen.png";
import applicatorsImage from "../assets/Master_Partner_Dashboard/8 Applicator.png";
import certificationCongratulationsImage from "../assets/certification_congratulations.png";



const COURSE_STEPS: { [key: string]: number } = {
  'UNDERSTANDING_SKYGLOSS': 9,
  'WELCOME_TO_SKYGLOSS': 16,
  'SKYGLOSS_SHOP_SETUP': 4,
  'FUSION': 20,
  'RESIN_FILM': 7,
  'SEAL': 5,
  'SHINE': 6,
  'MATTE': 6
};

const getCourseKey = (productName: string) => {
  if (!productName) return null;
  const name = productName.toUpperCase();
  if (name.includes('UNDERSTANDING')) return 'UNDERSTANDING_SKYGLOSS';
  if (name.includes('WELCOME TO SKYGLOSS')) return 'WELCOME_TO_SKYGLOSS';
  if (name.includes('SHOP SETUP')) return 'SKYGLOSS_SHOP_SETUP';
  if (name.includes('FUSION')) return 'FUSION';
  if (name.includes('RESIN FILM') || name.includes('RESIN_FILM')) return 'RESIN_FILM';
  if (name.includes('SEAL')) return 'SEAL';
  if (name.includes('MATTE')) return 'MATTE';
  if (name.includes('SHINE')) return 'SHINE';
  return null;
};

interface ShopDashboardProps {
  onShowThankYou?: () => void;
  onCartCountChange?: (count: number) => void;
  showCartSheet?: boolean;
  onCartSheetChange?: (show: boolean) => void;
}

const getCourseDuration = (productName: string) => {
  const name = productName.toUpperCase();
  if (name.includes('FUSION')) return '1h 30m';
  if (name.includes('SHINE')) return '1 hour';
  if (name.includes('RESIN FILM')) return '50 mins';
  if (name.includes('MATTE')) return '50 mins';
  if (name.includes('SEAL')) return '55 mins';
  return '45 mins';
};

const getCourseImage = (productName: string) => {
  const name = productName.toUpperCase();
  if (name.includes('FUSION')) return fusionMainImage;
  if (name.includes('RESIN FILM')) return resinFilmImage;
  if (name.includes('SEAL')) return sealImage;
  if (name.includes('MATTE')) return matteBoxImage;
  if (name.includes('SHINE')) return shineBoxImage;
  if (name.includes('APPLICATOR BOTTLE')) return applicatorBottleImage;
  if (name.includes('EDGE BLADE')) return edgeBladeBox1Image;
  if (name.includes('PAINT PEN')) return paintPenBoxImage;
  if (name.includes('APPLICATOR')) return applicatorsImage;
  return null;
};

export function ShopDashboard({
  onShowThankYou,
  onCartCountChange,
}: ShopDashboardProps) {
  const {
    cart,
    addToCart: addToCartContext,
    updateQuantity,
    clearCart,
    showCartSheet,
    setShowCartSheet,
    user,
    setUser
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { productId, courseId } = useParams();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSizes, setSelectedSizes] = useState<{ [key: string]: string }>({});
  const [viewingProduct, setViewingProduct] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"shop" | "courses">("courses");

  const [viewingCourse, setViewingCourse] = useState(false);
  const [showOrderRequest, setShowOrderRequest] = useState(false);
  const [showOrderSuccessModal, setShowOrderSuccessModal] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isSubmittingTraining, setIsSubmittingTraining] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const handlePayNow = async () => {
    if (!user) return;
    setIsPaying(true);
    try {
      const response = await api.post('/orders/activation-fee');
      if (response.data?.url) {
        window.location.href = response.data.url;
      }
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to initiate payment session');
      setIsPaying(false);
    }
  };

  // Compute if all available courses (structural + dynamic product ones) are 100% completed
  const isAllCoursesCompleted = useMemo(() => {
    if (!user || !user.courseProgress) return false;

    // Fixed required courses that always show up
    const requiredKeys: string[] = [
      'WELCOME_TO_SKYGLOSS',
      'SKYGLOSS_SHOP_SETUP',
      'UNDERSTANDING_SKYGLOSS'
    ];

    // Determine what product-specific courses are currently rendered
    products
      .filter(p => !['PPF GLOSS', 'PPF MATTE', 'APPLICATOR', 'APPLICATOR BOTTLE', 'EDGE BLADE', 'PAINT PEN', 'FUSION EXTREME']
        .includes(p.name.toUpperCase()) && !p.name.includes('APPLICATORS') && !p.name.includes('Applicators (2-Pack)'))
      .forEach(product => {
        const key = getCourseKey(product.name);
        if (key && !requiredKeys.includes(key)) {
          requiredKeys.push(key);
        }
      });

    // Verify 100% completion for all required keys
    for (const key of requiredKeys) {
      const progress = user.courseProgress[key] || user.courseProgress[key.replace('_', ' ')] || [];
      const requiredSteps = COURSE_STEPS[key] || 1;
      if (progress.length < requiredSteps) {
        return false;
      }
    }
    return true;
  }, [user, products]);
  const handleDevAutoComplete = async () => {
    setIsSubmittingTraining(true);
    try {
      const requiredKeys: string[] = [
        'WELCOME_TO_SKYGLOSS',
        'SKYGLOSS_SHOP_SETUP',
        'UNDERSTANDING_SKYGLOSS'
      ];
      products.forEach(product => {
        const key = getCourseKey(product.name);
        if (key && !requiredKeys.includes(key) && !['PPF GLOSS', 'PPF MATTE', 'APPLICATOR', 'APPLICATOR BOTTLE', 'EDGE BLADE', 'PAINT PEN', 'FUSION EXTREME'].includes(product.name.toUpperCase()) && !product.name.includes('APPLICATORS') && !product.name.includes('Applicators (2-Pack)')) {
          requiredKeys.push(key);
        }
      });

      const promises = [];
      for (const key of requiredKeys) {
        const steps = COURSE_STEPS[key] || 1;
        for (let i = 1; i <= steps; i++) {
          promises.push(
            api.patch('/users/me/course-progress', {
              courseName: key,
              stepId: `dev_auto_fill_${i}`
            })
          );
        }
      }
      await Promise.all(promises);
      toast.success("Dev Test: All courses filled 100%");
      fetchUserProfile();
    } catch (err) {
      console.error(err);
      toast.error("Dev Auto-Complete Failed");
    } finally {
      setIsSubmittingTraining(false);
    }
  };

  const handleTrainingComplete = async () => {
    setIsSubmittingTraining(true);
    try {
      await api.post('/users/me/training-complete');
      toast.success("Training completion submitted!", {
        description: "Your partner has been notified that you've completed all courses."
      });
      fetchUserProfile(); // Refresh user to reflect that isTrainingComplete is true
    } catch (err: any) {
      console.error('Training Error Details:', err.response?.data || err.message || err);
      const errorMsg = err.response?.data?.message || err.message || "Unknown error";
      toast.error(`Failed to submit: ${errorMsg}`);
    } finally {
      setIsSubmittingTraining(false);
    }
  };

  const handleDownloadCertificate = async () => {
    try {
      const response = await api.get('/pdf/certificate', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `SkyGloss_Certificate_${user.firstName}_${user.lastName}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download failed", err);
      toast.error("Failed to download certificate");
    }
  };

  const showPrice = true;

  // Sync state with URL
  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes('/courses')) {
      setActiveTab("courses");
      if (courseId) {
        setViewingCourse(true);
        setViewingProduct(courseId);
      } else {
        setViewingCourse(false);
        setViewingProduct(null);
      }
    } else {
      setActiveTab("shop");
      if (productId) {
        setViewingProduct(productId);
      } else {
        setViewingProduct(null);
      }
      setViewingCourse(false);
    }
  }, [productId, courseId, location.pathname]);

  useEffect(() => {
    fetchProducts();
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const res = await api.get('/auth/profile');
      if (res.data) {
        setUser(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch user profile", err);
    }
  };

  // Handle Stripe Callback
  useEffect(() => {
    const fn = async () => {
      const params = new URLSearchParams(window.location.search);
      if (params.get('success') === 'true') {
        const orderId = params.get('order_id');

        if (orderId) {
          try {
            // Trigger manual verification on backend (fallback for webhooks)
            await api.get(`/orders/verify/${orderId}`);
          } catch (err) {
            console.error("Verification check failed", err);
            // Don't block UI success flow, as webhook might have succeeded
          }
        }

        toast.success("Payment Successful! Thank you for your order.", {
          duration: 5000,
        });
        clearCart();

        // Navigate to Receipt Page
        if (orderId) {
          navigate(`/dashboard/shop/receipt/${orderId}`);
        } else {
          navigate('/dashboard/shop/my-orders');
        }
        if (onShowThankYou) onShowThankYou();
      } else if (params.get('canceled') === 'true') {
        toast.error("Payment Canceled.");
        window.history.replaceState({}, '', window.location.pathname);
      }
    };
    fn();
  }, []); // Run once on mount

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products?status=published&targetAudience=shop');
      const filteredProducts = res.data.filter((p: any) =>
        !["Advanced Technical Training", "Advanced Sales Training", "Lead Generation Marketing Program"]
          .includes(p.name)
      );
      setProducts(filteredProducts);
    } catch (err) {
      console.error("Failed to fetch products", err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };


  // Calculate cart values
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Scroll to top when viewing changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [viewingProduct, showCheckout, viewingCourse]);

  // Update cart count in parent - although count is also in AuthContext
  useEffect(() => {
    if (onCartCountChange) {
      onCartCountChange(cartCount);
    }
  }, [cartCount, onCartCountChange]);

  const addToCart = (product: any) => {
    const selectedSizeStr = selectedSizes[product._id] || product.sizes[0]?.size;
    addToCartContext(product, selectedSizeStr);

    // Auto-add Applicator Bottle if Fusion product
    if (product.name.toUpperCase().includes('FUSION')) {
      const applicatorBottle = products.find(p => p.name.toUpperCase().includes('APPLICATOR BOTTLE'));
      if (applicatorBottle) {
        addToCartContext(applicatorBottle, applicatorBottle.sizes[0]?.size, 1);
      }
    }

    toast.success("Added to cart", {
      description: `${product.name} (${selectedSizeStr})`
    });
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    // Clear sub-route if navigating to checkout
    if (productId) {
      navigate('/dashboard/shop', { replace: true });
    }
    setShowCheckout(true);
  };

  const handleOpenProduct = (id: string) => {
    navigate(`/dashboard/shop/${id}`);
  };

  const handleBackFromProduct = () => {
    navigate('/dashboard/shop');
  };

  const handleAddFromProductPage = (size: string, quantity: number, price?: number) => {
    const product = products.find(p => p._id === viewingProduct);
    if (!product) return;
    // Pass explicit price so cart always uses the correct size-based price
    // (price may be undefined for non-US users, addToCartContext handles that gracefully)
    addToCartContext(product, size, quantity, price);

    // Auto-add Applicator Bottle if Fusion product
    if (product.name.toUpperCase().includes('FUSION')) {
      const applicatorBottle = products.find(p => p.name.toUpperCase().includes('APPLICATOR BOTTLE'));
      if (applicatorBottle) {
        addToCartContext(applicatorBottle, applicatorBottle.sizes[0]?.size, quantity);
      }
    }
  };

  // Filter products based on search query
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => {
    const aIsFusion = a.name.toUpperCase().includes('FUSION');
    const bIsFusion = b.name.toUpperCase().includes('FUSION');
    if (aIsFusion && !bIsFusion) return -1;
    if (!aIsFusion && bIsFusion) return 1;
    return 0;
  });



  if (viewingCourse) {
    if (viewingProduct === 'understanding-skygloss') {
      return <UnderstandingSkyGloss onBack={() => {
        navigate('/dashboard/shop/courses');
      }} />;
    }

    if (viewingProduct === 'welcome-to-skygloss') {
      return <WelcomeToSkyGloss onBack={() => {
        navigate('/dashboard/shop/courses');
      }} />;
    }

    if (viewingProduct === 'skygloss-shop-setup') {
      return <SkyGlossShopSetup onBack={() => {
        navigate('/dashboard/shop/courses');
      }} />;
    }

    const product = products.find(p => p._id === viewingProduct) || {};
    const isFusion = product.name?.toUpperCase().includes('FUSION');
    const isResinFilm = product.name?.toUpperCase().includes('RESIN FILM');

    if (isFusion) {
      const isUnpaid = user?.role === 'certified_shop' && !user?.isPartnerPaid && user?.isSelfRegistered;
      if (isUnpaid) {
        return (
          <div className="min-h-screen bg-white pt-32 pb-12 flex justify-center px-4">
            <Card className="p-8 max-w-md w-full text-center space-y-6">
              <Lock className="w-16 h-16 text-[#0EA0DC] mx-auto opacity-50" />
              <h2 className="text-2xl font-bold text-[#272727]">Course Locked</h2>
              <p className="text-[#666666]">
                Please complete your account activation payment to access the FUSION masterclass and training materials.
              </p>
              <div className="space-y-3">
                <Button
                  onClick={handlePayNow}
                  disabled={isPaying}
                  className="w-full bg-[#0EA0DC] text-white hover:bg-[#0EA0DC]/90 h-12 rounded-xl font-bold"
                >
                  {isPaying ? "Loading..." : "Pay Now"}
                </Button>
                <Button
                  onClick={() => navigate('/dashboard/shop/courses')}
                  variant="outline"
                  className="w-full h-12 rounded-xl"
                >
                  Back to Courses
                </Button>
              </div>
            </Card>
          </div>
        );
      }
      return <FusionGuide onBack={() => {
        navigate('/dashboard/shop/courses');
      }} />;
    }

    if (isResinFilm) {
      return <ResinFilmGuide onBack={() => {
        navigate('/dashboard/shop/courses');
      }} />;
    }

    const isSeal = product.name?.toUpperCase().includes('SEAL');
    if (isSeal) {
      return <SealGuide onBack={() => {
        navigate('/dashboard/shop/courses');
      }} />;
    }

    const isMatte = product.name?.toUpperCase().includes('MATTE');
    if (isMatte) {
      return <MatteGuide onBack={() => {
        navigate('/dashboard/shop/courses');
      }} />;
    }

    const isShine = product.name?.toUpperCase().includes('SHINE');
    if (isShine) {
      return <ShineGuide onBack={() => {
        navigate('/dashboard/shop/courses');
      }} />;
    }

    return <CoursePlayer productName={product.name || "Product"} onBack={() => {
      navigate('/dashboard/shop/courses');
    }} />;
  }

  if (showCheckout) {
    if (user?.country === "United States") {
      return (
        <CheckoutPage
          cart={cart}
          onBack={() => setShowCheckout(false)}
          onComplete={() => {
            setShowCheckout(false);
            clearCart();
            if (onShowThankYou) {
              onShowThankYou();
            }
          }}
        />
      );
    } else {
      return (
        <OrderRequestPage
          cart={cart}
          onBack={() => setShowCheckout(false)}
          onComplete={() => {
            setShowCheckout(false);
            clearCart();
            // Optional: Navigate to a success page or just show "Thank You"
            setShowOrderSuccessModal(true);
            navigate('/dashboard/shop/my-orders');
            if (onShowThankYou) {
              onShowThankYou();
            }
          }}
        />
      );
    }
  }

  return (
    <div className="min-h-screen bg-white pt-20 pb-12">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white space-y-4">
          <Loader2 className="w-12 h-12 text-[#0EA0DC] animate-spin" />
          <p className="text-gray-500 font-medium tracking-wide">Initializing Premium Workshop...</p>
        </div>
      ) : viewingProduct !== null ? (
        <ProductDetailPage
          productId={viewingProduct}
          onBack={handleBackFromProduct}
          onAddToCart={handleAddFromProductPage}
          showPrice={showPrice}
          onOpenCart={() => {
            setShowCartSheet(true);
          }}
        />
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl text-[#272727] mb-2">
              Shop Dashboard
            </h1>
            {/* <p className="text-[#666666]">
              {activeTab === "shop" ? "" : "Access product training and resources"}
            </p> */}
          </motion.div>

          {/* Main Tab Toggle - Visible for all Shops */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="inline-flex rounded-xl border-2 border-[#0EA0DC] p-1 bg-white shadow-[0_0_10px_rgba(14,160,220,0.1)]">


              <button
                onClick={() => navigate("/dashboard/shop")}
                className={`flex items-center px-10 py-4 rounded-lg transition-all duration-200 ${activeTab === "shop"
                  ? "bg-[#272727] text-white shadow-lg"
                  : "bg-transparent text-[#666666] hover:text-[#0EA0DC]"
                  }`}
              >
                <ShoppingBag className="w-5 h-5 mr-3" />
                <span className="text-lg">Shop</span>
              </button>
              <button
                onClick={() => navigate("/dashboard/shop/courses")}
                className={`flex items-center px-10 py-4 rounded-lg transition-all duration-200 ${activeTab === "courses"
                  ? "bg-[#272727] text-white shadow-lg"
                  : "bg-transparent text-[#666666] hover:text-[#0EA0DC]"
                  }`}
              >
                <GraduationCap className="w-5 h-5 mr-3" />
                <span className="text-lg">Courses</span>
              </button>
            </div>
          </motion.div>

          {activeTab === "shop" ? (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 w-full">

                {/* Search */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mb-6"
                >
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
                    <Input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-white rounded-lg border-[#0EA0DC]/30"
                    />
                  </div>
                </motion.div>

                {/* Products List - Vertical Layout */}
                <div className="space-y-6">
                  {filteredProducts.map((product, index) => {
                    const currentSizeStr = selectedSizes[product._id] || product.sizes[0]?.size;
                    const currentSizeData = product.sizes.find((s: any) => s.size === currentSizeStr);
                    const currentPrice = currentSizeData ? currentSizeData.price : 0;

                    return (
                      <motion.div
                        key={product._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="skygloss-card p-4 sm:p-6 rounded-2xl">
                          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                            {/* Image Section */}
                            <div
                              className="flex-shrink-0 w-full sm:w-48 bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 flex items-center justify-center"
                              onClick={() => {
                                const isFusionProduct = product.name.toUpperCase().includes('FUSION');
                                const isUnpaid = user?.role === 'certified_shop' && !user?.isPartnerPaid && user?.isSelfRegistered;

                                if (isFusionProduct && isUnpaid) {
                                  toast.error("Please activate your account to view this product.");
                                } else {
                                  handleOpenProduct(product._id);
                                }
                              }}
                              style={{ cursor: product.name.toUpperCase().includes('FUSION') && (user?.role === 'certified_shop' && !user?.isPartnerPaid && user?.isSelfRegistered) ? 'not-allowed' : 'pointer' }}
                            >
                              <ImageWithFallback
                                src={product.shopImages?.[0] || product.images?.[0]}
                                alt={product.name}
                                className="w-full h-40 sm:h-40 object-contain"
                              />
                            </div>

                            {/* Content Section */}
                            <div className="flex-1 min-w-0 flex flex-col">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="text-lg sm:text-xl text-[#272727] font-semibold">{product.name}</h3>
                                  <p className="text-sm text-[#666666] mt-1 line-clamp-2">{product.description}</p>
                                </div>
                                <Badge
                                  variant="secondary"
                                  className={`shrink-0 ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                                >
                                  {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                </Badge>
                              </div>

                              <div className="mt-auto pt-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                                {/* Size Selection */}
                                <div>
                                  <label className="text-xs text-[#666666] mb-2 block font-medium">
                                    Select Size:
                                  </label>
                                  <div className="flex flex-wrap gap-2">
                                    {product.sizes?.map((s: any) => (
                                      <button
                                        key={s.size}
                                        onClick={() => {
                                          const isFusionProduct = product.name.toUpperCase().includes('FUSION');
                                          const isUnpaid = user?.role === 'certified_shop' && !user?.isPartnerPaid && user?.isSelfRegistered;

                                          if (isFusionProduct && isUnpaid) {
                                            toast.error("Please activate your account to modify sizes.");
                                          } else {
                                            setSelectedSizes({ ...selectedSizes, [product._id]: s.size });
                                          }
                                        }}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${currentSizeStr === s.size
                                          ? "bg-[#272727] text-white shadow-md"
                                          : "bg-gray-100 text-[#666666] hover:bg-gray-200"
                                          }`}
                                      >
                                        {s.size}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                {/* Price and Actions */}
                                <div className="flex items-center gap-4">
                                  {(() => {
                                    const isFusionProduct = product.name.toUpperCase().includes('FUSION');
                                    const isUnpaid = user?.role === 'certified_shop' && !user?.isPartnerPaid && user?.isSelfRegistered;

                                    if (isFusionProduct && isUnpaid) {
                                      return (
                                        <div className="flex flex-col items-end gap-2">
                                          <span className="text-lg font-bold text-amber-600">To Unlock </span>
                                          <Button
                                            size="sm"
                                            onClick={handlePayNow}
                                            disabled={isPaying}
                                            className="bg-[#0EA0DC] text-white hover:shadow-[0_0_20px_rgba(14,160,220,0.4)] transition-all duration-200 rounded-lg h-10 px-6 font-bold uppercase tracking-wider"
                                          >
                                            {isPaying ? "Loading..." : "Complete Registration"}
                                          </Button>
                                        </div>
                                      );
                                    }

                                    return (
                                      <>
                                        {showPrice && (
                                          <div className="text-right">
                                            <span className="text-2xl font-bold text-[#0EA0DC]">
                                              {getSymbol(product.currency)}{currentPrice.toFixed(2)}
                                            </span>
                                          </div>
                                        )}
                                        <div className="flex gap-2">
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleOpenProduct(product._id)}
                                            className="rounded-lg border-[#0EA0DC]/30 hover:text-[#0EA0DC]  text-[#0EA0DC] hover:bg-[#0EA0DC]/10 h-10 px-4"
                                          >
                                            <Eye className="w-4 h-4 mr-2" />
                                            Details
                                          </Button>
                                          <Button
                                            size="sm"
                                            disabled={product.stock === 0}
                                            onClick={() => addToCart(product)}
                                            className="bg-[#0EA0DC] text-white hover:shadow-[0_0_20px_rgba(14,160,220,0.4)] transition-all duration-200 rounded-lg h-10 px-4"
                                          >
                                            <ShoppingCart className="w-4 h-4 mr-2" />
                                            Add to Cart
                                          </Button>
                                        </div>
                                      </>
                                    );
                                  })()}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}

                  {filteredProducts.length === 0 && (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                      <p className="text-gray-500">No products found matching your search.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Cart Sidebar - Desktop Only */}
              <div className="hidden lg:block lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="sticky top-24"
                >
                  <Card className="skygloss-card p-0 rounded-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-br from-[#0EA0DC] to-[#0c80b3] p-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg text-white">Shopping Cart</h3>
                        <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                          {cartCount} {cartCount === 1 ? "item" : "items"}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-6">
                      {cart.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                            <ShoppingCart className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-[#666666]">Your cart is empty</p>
                          <p className="text-sm text-[#999999] mt-1">Add products to get started</p>
                        </div>
                      ) : (
                        <>
                          <div className="space-y-3 mb-6 max-h-96 overflow-y-auto pr-2">
                            {cart.map((item) => (
                              <div key={`${item.id}-${item.size}`} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                                <div className="flex gap-3">
                                  {/* Product Image */}
                                  <div className="w-16 h-16 flex-shrink-0 bg-gradient-to-br from-gray-50 to-white rounded-lg p-2 border border-gray-200">
                                    <ImageWithFallback
                                      src={item.image}
                                      alt={item.name}
                                      className="w-full h-full object-contain"
                                    />
                                  </div>

                                  {/* Product Info */}
                                  <div className="flex-1 min-w-0">
                                    <div className="mb-2">
                                      <h4 className="text-sm text-[#272727] truncate mb-1">{item.name}</h4>
                                      <p className="text-xs text-[#999999] bg-gray-100 rounded px-2 py-0.5 inline-block">
                                        {item.size}
                                      </p>
                                    </div>

                                    {/* Price and Quantity Controls */}
                                    <div className="flex items-center justify-between mt-3">
                                      {showPrice && (
                                        <div className="text-sm text-[#0EA0DC]">
                                          {getSymbol(item.currency || 'USD')} {(item.price * item.quantity).toFixed(2)}
                                          {item.quantity > 1 && (
                                            <span className="text-xs text-[#999999] block">
                                              {getSymbol(item.currency || 'USD')}{item.price.toFixed(2)} each
                                            </span>
                                          )}
                                        </div>
                                      )}

                                      {/* Quantity Controls */}
                                      <div className="flex items-center gap-1.5 bg-gray-100 rounded-lg p-1">
                                        <button
                                          onClick={() => updateQuantity(item.id, item.size, -1)}
                                          className="w-7 h-7 rounded-md bg-white hover:bg-[#0EA0DC] hover:text-white transition-all flex items-center justify-center shadow-sm"
                                        >
                                          <Minus className="w-3 h-3" />
                                        </button>
                                        <span className="text-sm text-[#272727] w-6 text-center">
                                          {item.quantity}
                                        </span>
                                        <button
                                          onClick={() => updateQuantity(item.id, item.size, 1)}
                                          className="w-7 h-7 rounded-md bg-white hover:bg-[#0EA0DC] hover:text-white transition-all flex items-center justify-center shadow-sm"
                                        >
                                          <Plus className="w-3 h-3" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          <Separator className="my-4 bg-gray-300" />

                          <div className="space-y-3 mb-6">
                            {showPrice && (
                              <>
                                <div className="flex justify-between text-[#666666]">
                                  <span>Subtotal</span>
                                  <span className="text-[#272727]">{getSymbol(products[0]?.currency)}{(cartTotal).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-emerald-600 font-bold">
                                  <span>Shipping</span>
                                  <span>FREE</span>
                                </div>
                                <Separator className="bg-gray-300" />
                                <div className="flex justify-between items-baseline">
                                  <span className="text-[#272727]">Total</span>
                                  <span className="text-xl text-[#0EA0DC]">{getSymbol(products[0]?.currency)}{(cartTotal).toFixed(2)}</span>
                                </div>
                              </>
                            )}
                          </div>

                          <Button
                            onClick={handleCheckout}
                            className="w-full bg-[#0EA0DC] text-white hover:shadow-[0_0_20px_rgba(14,160,220,0.4)] hover:bg-[#0c80b3] transition-all duration-200 h-12 rounded-lg"
                          >
                            {user?.country === "United States" ? "Proceed to Checkout" : "Generate Order Request"}
                          </Button>
                        </>
                      )}
                    </div>
                  </Card>
                </motion.div>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl text-[#272727] mb-2">Training Courses</h2>
                  <p className="text-[#666666]">
                    Comprehensive training courses for everything you need to know about SkyGloss!
                  </p>
                </div>
                {/* DEV TESTING BUTTON */}
                <Button
                  onClick={handleDevAutoComplete}
                  disabled={isSubmittingTraining}
                  variant="outline"
                  className="bg-yellow-50 text-yellow-700 border-yellow-300 hover:bg-yellow-100 font-bold shrink-0 hidden"
                >
                  {isSubmittingTraining ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Developer: Auto-Complete 100%
                </Button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Understanding SkyGloss Course Card (First) */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="skygloss-card p-6 rounded-2xl h-full flex flex-col group hover:shadow-xl transition-all border-0 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                      <GraduationCap className="w-24 h-24 text-[#0EA0DC]" />
                    </div>
                    <div className="bg-gradient-to-br from-[#0EA0DC] to-[#0bcaf8] rounded-xl mb-4 p-8 border border-gray-800 flex items-center justify-center">
                      <h4 className="text-2xl font-black text-white uppercase shadow-2xl">
                        WELCOME
                      </h4>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <Badge className="bg-[#0EA0DC]/10 text-[#0EA0DC] border-0 w-fit font-bold">
                        Introduction
                      </Badge>
                      {(() => {
                        const key = 'WELCOME_TO_SKYGLOSS';
                        const progress = user?.courseProgress?.[key] || [];

                        if (progress.length > 0) {
                          const completedCount = progress.length;
                          const totalSteps = COURSE_STEPS[key] || 16;
                          const percentage = Math.min(100, Math.round((completedCount / totalSteps) * 100));

                          if (completedCount >= totalSteps) {
                            return (
                              <span className="text-emerald-600 font-black text-xs uppercase tracking-wider animate-pulse">
                                COMPLETED
                              </span>
                            );
                          }

                          return (
                            <span className="text-[#0EA0DC] font-black text-xs">
                              {percentage}% READ
                            </span>
                          );
                        }
                        return null;
                      })()}
                    </div>

                    <h4 className="text-lg font-bold text-[#272727] mb-2 uppercase">
                      Welcome to SkyGloss</h4>

                    <p className="text-sm text-[#666666] mb-6 flex-1 leading-relaxed">
                      Start your journey with SkyGloss. Learn about our mission, technology, and how we are redefining automotive paint restoration.
                    </p>

                    <div className="hidden grid grid-cols-2 gap-2 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="text-center">
                        <div className="text-[10px] uppercase tracking-wider font-bold text-[#999999] mb-1">Modules</div>
                        <div className="text-sm font-bold text-[#272727]">18</div>
                      </div>
                      <div className="text-center border-l border-gray-200">
                        <div className="text-[10px] uppercase tracking-wider font-bold text-[#999999] mb-1">Level</div>
                        <div className="text-sm font-bold text-[#272727]">Intro</div>
                      </div>
                    </div>

                    {(() => {
                      const key = 'WELCOME_TO_SKYGLOSS';
                      const progress = user?.courseProgress?.[key] || [];

                      if (progress.length > 0) {
                        const completedCount = progress.length;
                        const totalSteps = COURSE_STEPS[key] || 16;
                        const percentage = Math.min(100, Math.round((completedCount / totalSteps) * 100));

                        return (
                          <div className="mb-6 space-y-2">
                            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                              <span className="text-[#666666]">Course Progress</span>
                              <span className="text-[#0EA0DC]">{percentage}%</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-100/50 p-[1px]">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                className="h-full bg-gradient-to-r from-[#0EA0DC] to-[#0bcaf8] rounded-full shadow-[0_0_8px_rgba(14,160,220,0.3)]"
                              />
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })()}

                    <Button
                      onClick={() => {
                        navigate(`/dashboard/shop/courses/welcome-to-skygloss`);
                      }}
                      className="w-full bg-[#272727] text-white hover:bg-[#0EA0DC] transition-colors h-12 rounded-xl font-bold"
                    >
                      Launch Course
                    </Button>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="skygloss-card p-6 rounded-2xl h-full flex flex-col group hover:shadow-xl transition-all border-0 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                      <GraduationCap className="w-24 h-24 text-[#0EA0DC]" />
                    </div>
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl mb-4 p-8 border border-gray-800 flex items-center justify-center">
                      <h4 className="text-2xl font-black text-white uppercase shadow-2xl">
                        SHOP SETUP
                      </h4>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <Badge className="bg-[#0EA0DC]/10 text-[#0EA0DC] border-0 w-fit font-bold">
                        Essentials
                      </Badge>
                      {(() => {
                        const key = 'SKYGLOSS_SHOP_SETUP';
                        const progress = user?.courseProgress?.[key] || [];

                        if (progress.length > 0) {
                          const completedCount = progress.length;
                          const totalSteps = COURSE_STEPS[key] || 4;
                          const percentage = Math.min(100, Math.round((completedCount / totalSteps) * 100));

                          if (completedCount >= totalSteps) {
                            return (
                              <span className="text-emerald-600 font-black text-xs uppercase tracking-wider animate-pulse">
                                COMPLETED
                              </span>
                            );
                          }

                          return (
                            <span className="text-[#0EA0DC] font-black text-xs">
                              {percentage}% DONE
                            </span>
                          );
                        }
                        return null;
                      })()}
                    </div>

                    <h4 className="text-lg font-bold text-[#272727] mb-2 uppercase">
                      SkyGloss Shop Setup</h4>

                    <p className="text-sm text-[#666666] mb-6 flex-1 leading-relaxed">
                      Configure your professional shop profile, connect with Partners, and set up your inventory for success.
                    </p>

                    <div className="hidden grid grid-cols-2 gap-2 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="text-center">
                        <div className="text-[10px] uppercase tracking-wider font-bold text-[#999999] mb-1">Steps</div>
                        <div className="text-sm font-bold text-[#272727]">4</div>
                      </div>
                      <div className="text-center border-l border-gray-200">
                        <div className="text-[10px] uppercase tracking-wider font-bold text-[#999999] mb-1">Level</div>
                        <div className="text-sm font-bold text-[#272727]">Setup</div>
                      </div>
                    </div>

                    {(() => {
                      const key = 'SKYGLOSS_SHOP_SETUP';
                      const progress = user?.courseProgress?.[key] || [];

                      if (progress.length > 0) {
                        const completedCount = progress.length;
                        const totalSteps = COURSE_STEPS[key] || 4;
                        const percentage = Math.min(100, Math.round((completedCount / totalSteps) * 100));

                        return (
                          <div className="mb-6 space-y-2">
                            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                              <span className="text-[#666666]">Progress</span>
                              <span className="text-[#0EA0DC]">{percentage}%</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-100/50 p-[1px]">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                className="h-full bg-gradient-to-r from-[#0EA0DC] to-[#0bcaf8] rounded-full shadow-[0_0_8px_rgba(14,160,220,0.3)]"
                              />
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })()}

                    <Button
                      onClick={() => {
                        navigate(`/dashboard/shop/courses/skygloss-shop-setup`);
                      }}
                      className="w-full bg-[#272727] text-white hover:bg-[#0EA0DC] transition-colors h-12 rounded-xl font-bold"
                    >
                      Launch Course
                    </Button>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="skygloss-card p-6 rounded-2xl h-full flex flex-col group hover:shadow-xl transition-all border-0 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                      <GraduationCap className="w-24 h-24 text-[#0EA0DC]" />
                    </div>
                    <div className="bg-gradient-to-br from-[#272727] to-black rounded-xl mb-4 p-8 border border-gray-800 flex items-center justify-center">
                      <h4 className="text-2xl font-black text-[#0EA0DC] uppercase shadow-2xl">
                        PHILOSOPHY
                      </h4>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <Badge className="bg-[#0EA0DC]/10 text-[#0EA0DC] border-0 w-fit font-bold">
                        Core Masterclass
                      </Badge>
                      {(() => {
                        const key = 'UNDERSTANDING_SKYGLOSS';
                        // Robust check for both formats
                        const progress = user?.courseProgress?.[key] ||
                          user?.courseProgress?.[key.replace('_', ' ')] ||
                          [];

                        if (progress.length > 0) {
                          const completedCount = progress.length;
                          const totalSteps = COURSE_STEPS[key];
                          const percentage = Math.min(100, Math.round((completedCount / totalSteps) * 100));

                          if (completedCount >= totalSteps) {
                            return (
                              <span className="text-emerald-600 font-black text-xs uppercase tracking-wider animate-pulse">
                                COMPLETED
                              </span>
                            );
                          }

                          return (
                            <span className="text-[#0EA0DC] font-black text-xs">
                              {percentage}% READ
                            </span>
                          );
                        }
                        return null;
                      })()}
                    </div>

                    <h4 className="text-lg font-bold text-[#272727] mb-2 uppercase">
                      Sales Philosophy</h4>

                    <p className="text-sm text-[#666666] mb-6 flex-1 leading-relaxed">
                      Master the SkyGloss sales philosophy. Learn how to educate customers, align expectations, and articulate the true value of paint health.
                    </p>

                    <div className=" hidden grid grid-cols-3 gap-2 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="text-center">
                        <div className="text-[10px] uppercase tracking-wider font-bold text-[#999999] mb-1">Modules</div>
                        <div className="text-sm font-bold text-[#272727]">9</div>
                      </div>
                      <div className="text-center border-x border-gray-200">
                        <div className="text-[10px] uppercase tracking-wider font-bold text-[#999999] mb-1">Type</div>
                        <div className="text-sm font-bold text-[#272727]">Sales</div>
                      </div>
                      <div className="text-center">
                        <div className="text-[10px] uppercase tracking-wider font-bold text-[#999999] mb-1">Level</div>
                        <div className="text-sm font-bold text-[#272727]">All</div>
                      </div>
                    </div>

                    {(() => {
                      const key = 'UNDERSTANDING_SKYGLOSS';
                      const progress = user?.courseProgress?.[key] ||
                        user?.courseProgress?.[key.replace('_', ' ')] ||
                        [];

                      if (progress.length > 0) {
                        const completedCount = progress.length;
                        const totalSteps = COURSE_STEPS[key];
                        const percentage = Math.min(100, Math.round((completedCount / totalSteps) * 100));

                        return (
                          <div className="mb-6 space-y-2">
                            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                              <span className="text-[#666666]">Course Progress</span>
                              <span className="text-[#0EA0DC]">{percentage}%</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-100/50 p-[1px]">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                className="h-full bg-gradient-to-r from-[#0EA0DC] to-[#0bcaf8] rounded-full shadow-[0_0_8px_rgba(14,160,220,0.3)]"
                              />
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })()}

                    <Button
                      onClick={() => {
                        navigate(`/dashboard/shop/courses/understanding-skygloss`);
                      }}
                      className="w-full bg-[#272727] text-white hover:bg-[#0EA0DC] transition-colors h-12 rounded-xl font-bold"
                    >
                      Launch Course
                    </Button>
                  </Card>
                </motion.div>

                {[...products]
                  .filter(p => !['PPF GLOSS', 'PPF MATTE', 'APPLICATOR', 'APPLICATOR BOTTLE', 'EDGE BLADE', 'PAINT PEN', 'FUSION EXTREME']
                    .includes(p.name.toUpperCase()) && !p.name.includes('APPLICATORS') && !p.name.includes('Applicators (2-Pack)'))
                  .sort((a, b) => {
                    const aIsFusion = a.name.toUpperCase().includes('FUSION');
                    const bIsFusion = b.name.toUpperCase().includes('FUSION');
                    if (aIsFusion && !bIsFusion) return -1;
                    if (!aIsFusion && bIsFusion) return 1;
                    return 0;
                  })
                  .map((product, index) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="skygloss-card p-6 rounded-2xl h-full flex flex-col group hover:shadow-xl transition-all border-0 shadow-lg">
                        <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl mb-4 p-4 border border-gray-50">
                          <ImageWithFallback
                            src={getCourseImage(product.name) || product.shopImages?.[0] || product.images?.[0]}
                            alt={product.name}
                            className="w-full h-40 object-contain mx-auto group-hover:scale-105 transition-transform"
                          />
                        </div>

                        <div className="flex items-center justify-between mb-3">
                          <Badge className="bg-[#0EA0DC]/10 text-[#0EA0DC] border-0 w-fit font-bold">
                            Training Course
                          </Badge>
                          {(() => {
                            const key = getCourseKey(product.name);
                            if (key) {
                              const progress = user?.courseProgress?.[key] ||
                                user?.courseProgress?.[key.replace('_', ' ')] ||
                                [];

                              if (progress.length > 0) {
                                const completedCount = progress.length;
                                const totalSteps = COURSE_STEPS[key] || 1;
                                const percentage = Math.min(100, Math.round((completedCount / totalSteps) * 100));

                                if (completedCount >= totalSteps) {
                                  return (
                                    <span className="text-emerald-600 font-black text-xs uppercase tracking-wider animate-pulse">
                                      COMPLETED
                                    </span>
                                  );
                                }

                                return (
                                  <span className="text-[#0EA0DC] font-black text-xs">
                                    {percentage}% READ
                                  </span>
                                );
                              }
                            }
                            return null;
                          })()}
                        </div>

                        <h4 className="text-lg font-bold text-[#272727] mb-2">{product.name}</h4>

                        <p className="text-sm text-[#666666] mb-6 flex-1 leading-relaxed">
                          Comprehensive masterclass covering professional application, surface prep, and advanced maintenance for the {product.name} system.
                        </p>

                        <div className="hidden grid grid-cols-3 gap-2 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                          <div className="text-center">
                            <div className="text-[10px] uppercase tracking-wider font-bold text-[#999999] mb-1">Lessons</div>
                            <div className="text-sm font-bold text-[#272727]">20</div>
                          </div>
                          <div className="text-center border-x border-gray-200">
                            <div className="text-[10px] uppercase tracking-wider font-bold text-[#999999] mb-1">Duration</div>
                            <div className="text-sm font-bold text-[#272727]">{getCourseDuration(product.name)}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-[10px] uppercase tracking-wider font-bold text-[#999999] mb-1">Level</div>
                            <div className="text-sm font-bold text-[#272727]">Master</div>
                          </div>
                        </div>

                        {(() => {
                          const key = getCourseKey(product.name);
                          if (key) {
                            const progress = user?.courseProgress?.[key] ||
                              user?.courseProgress?.[key.replace('_', ' ')] ||
                              [];

                            if (progress.length > 0) {
                              const completedCount = progress.length;
                              const totalSteps = COURSE_STEPS[key] || 1;
                              const percentage = Math.min(100, Math.round((completedCount / totalSteps) * 100));

                              return (
                                <div className="mb-6 space-y-2">
                                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                                    <span className="text-[#666666]">Course Progress</span>
                                    <span className="text-[#0EA0DC]">{percentage}%</span>
                                  </div>
                                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-100/50 p-[1px]">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${percentage}%` }}
                                      className="h-full bg-gradient-to-r from-[#0EA0DC] to-[#0bcaf8] rounded-full shadow-[0_0_8px_rgba(14,160,220,0.3)]"
                                    />
                                  </div>
                                </div>
                              );
                            }
                          }
                          return null;
                        })()}

                        {(() => {
                          const isFusion = product.name.toUpperCase().includes('FUSION');
                          const isUnpaid = user?.role === 'certified_shop' && !user?.isPartnerPaid && user?.isSelfRegistered;
                          const showPayNow = isFusion && isUnpaid;

                          if (showPayNow) {
                            return (
                              <div className="mt-4">
                                <p className="text-sm font-bold text-amber-600 mb-3 text-center">
                                  Please pay now to access this course.
                                </p>
                                <Button
                                  onClick={handlePayNow}
                                  disabled={isPaying}
                                  className="w-full bg-[#0EA0DC] text-white hover:bg-[#0EA0DC]/90 transition-colors h-12 rounded-xl font-bold uppercase tracking-wider"
                                >
                                  {isPaying ? "Loading..." : "Pay Now"}
                                </Button>
                              </div>
                            );
                          }

                          return (
                            <Button
                              onClick={() => {
                                navigate(`/dashboard/shop/courses/${product._id}`);
                              }}
                              className="w-full bg-[#272727] text-white hover:bg-[#0EA0DC] transition-colors h-12 rounded-xl font-bold"
                            >
                              Launch Course
                            </Button>
                          );
                        })()}
                      </Card>
                    </motion.div>
                  ))}
                {/* =========================
    CERTIFICATION COMPLETION CARD
========================= */}
                <div
                  id="Congratulations-courses"
                  onClick={isAllCoursesCompleted && !user?.isTrainingComplete ? handleTrainingComplete : undefined}
                  className={`transition-all duration-500 ${isAllCoursesCompleted && !user?.isTrainingComplete
                    ? "cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                    : user?.isTrainingComplete
                      ? "cursor-default"
                      : "cursor-not-allowed opacity-40 grayscale-[0.5]"
                    }`}
                >
                  <Card className={`p-1 pb-8 sm:p-12 rounded-3xl bg-white border shadow-sm text-center relative overflow-hidden transition-colors ${isAllCoursesCompleted && !user?.isTrainingComplete ? "border-[#0EA0DC]/30 bg-gradient-to-br from-white to-[#0EA0DC]/5" : "border-gray-100"
                    }`}>

                    {/* Image */}
                    <div className="flex justify-center mb-8">
                      <img
                        src={completeImage}
                        alt="Certification Complete"
                        className="w-64 sm:w-80 rounded-2xl shadow-md object-cover"
                      />
                    </div>

                    {/* Heading */}
                    <h2 className="text-xl px-2 sm:text-2xl font-bold text-[#272727] mb-4">
                      {user?.isTrainingComplete
                        ? "Verification Submitted!"
                        : isAllCoursesCompleted
                          ? "Congratulations! You've Completed All Courses"
                          : "Complete All Courses to Proceed"}
                    </h2>

                    {/* Description */}
                    <p className="text-[#666666] text-sm sm:text-base max-w-2xl mx-auto mb-3 leading-relaxed">
                      {user?.isTrainingComplete
                        ? "Your partner has been notified. We will reach out shortly to finalize your certification."
                        : isAllCoursesCompleted
                          ? "Great job! You are now ready to notify your partner and finalize your certification."
                          : "You must finish all the training modules listed above before you can request certification."}
                    </p>

                    <p className="text-[#666666] text-sm sm:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
                      {user?.isCertified
                        ? "Congratulations! You are now a certified SkyGloss professional."
                        : user?.isTrainingComplete
                          ? "Your request has been sent. A representative will contact you shortly to finalize your certification."
                          : isAllCoursesCompleted
                            ? "Click the button below to send your certification request for partner approval."
                            : "Complete all training modules above to unlock your certification request."}
                    </p>

                    {/* Button */}
                    <div className="flex flex-col   justify-center gap-4 px-5">
                      <Button
                        disabled={!isAllCoursesCompleted || isSubmittingTraining || user?.isTrainingComplete}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTrainingComplete();
                        }}
                        className={`w-full sm:w-auto px-10 h-12 rounded-xl font-bold uppercase tracking-wider shadow-md transition-all ${user?.isCertified
                          ? "bg-emerald-600 text-white cursor-default"
                          : user?.isTrainingComplete
                            ? "bg-amber-500 text-white cursor-default"
                            : "bg-[#0EA0DC] hover:bg-[#0b86b8] text-white"
                          }`}
                      >
                        {isSubmittingTraining ? (
                          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Finalizing...</>
                        ) : user?.isCertified ? (
                          <><Award className="w-4 h-4 mr-2" /> Skygloss Certified</>
                        ) : user?.isTrainingComplete ? (
                          <><Clock className="w-4 h-4 mr-2" /> Pending Certification</>
                        ) : isAllCoursesCompleted ? (
                          "Submit Verification"
                        ) : (
                          "Locked"
                        )}
                      </Button>

                      {user?.isCertified && (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadCertificate();
                          }}
                          variant="outline"
                          className=" w-full sm:w-auto px-8 h-12 rounded-xl font-bold border-2 border-[#0EA0DC] text-[#0EA0DC] hover:bg-[#0EA0DC] hover:text-white transition-all shadow-md"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Download Certificate
                        </Button>
                      )}
                    </div>

                  </Card>
                </div>
                {/* Congratulations Card at the end of the grid */}
                {isAllCoursesCompleted && !user?.isTrainingComplete && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="md:col-span-2 lg:col-span-3"
                  >
                    {/* <Card className="p-8 rounded-[32px] border-2 border-[#0EA0DC]/30 bg-gradient-to-br from-white to-[#0EA0DC]/5 shadow-2xl overflow-hidden relative group"> */}
                    <Card >

                      <div className="absolute top-0 right-0 w-64 h-64 opacity-[0.03] pointer-events-none -mr-12 -mt-12">
                        <GraduationCap className="w-full h-full text-[#0EA0DC]" />
                      </div>

                      <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                        {/* Image Section */}
                        {/* <div className="shrink-0 w-full md:w-80">
                          <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#0EA0DC] to-[#0bcaf8] rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                            <div className="relative bg-white rounded-3xl p-3 border border-gray-100 shadow-2xl">
                              <img
                                src={certificationCongratulationsImage}
                                alt="Certification Congratulations"
                                className="w-full h-auto rounded-2xl object-cover"
                              />
                            </div>
                          </div>
                        </div> */}

                        {/* <div className="flex-1 text-center md:text-left space-y-6">
                          <div className="space-y-4">
                            <Badge className="bg-[#0EA0DC]/10 text-[#0EA0DC] border-0 px-4 py-1 font-bold text-sm tracking-wider uppercase">
                              Achievement Unlocked
                            </Badge>
                            <h3 className="text-3xl sm:text-4xl font-black text-[#272727] leading-tight tracking-tight uppercase">
                              Congratulations!<br /> You’ve completed all the courses.
                            </h3>
                          </div>

                          <p className="text-[#666666] text-lg leading-relaxed font-medium max-w-2xl">
                            The next step is to connect you with a local representative to finalize your certification.
                            Click on <span className="text-[#0EA0DC] font-bold underline decoration-2 underline-offset-4">Complete Certification</span> below, and our team will get in touch with you right away.
                          </p>

                          <div className="pt-4">
                            <Button
                              disabled={isSubmittingTraining}
                              onClick={handleTrainingComplete}
                              className="h-16 px-12 text-xl font-black rounded-2xl bg-[#0EA0DC] hover:bg-[#272727] text-white shadow-xl shadow-[#0EA0DC]/30 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 w-full md:w-auto min-w-[300px]"
                            >
                              {isSubmittingTraining ? (
                                <><Loader2 className="w-6 h-6 mr-3 animate-spin" /> Finalizing...</>
                              ) : (
                                "Complete Certification"
                              )}
                            </Button>
                          </div>
                        </div> */}
                      </div>
                    </Card>
                  </motion.div>
                )}
              </div>

              {/* Training Completion Gate */}
              {/* <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-12"
              >
                <Card className={`p-8 rounded-2xl border-2 transition-all duration-300 shadow-lg ${user?.isTrainingComplete
                  ? 'bg-emerald-50/50 border-emerald-200'
                  : isAllCoursesCompleted
                    ? 'bg-blue-50/50 border-[#0EA0DC]/30 shadow-[#0EA0DC]/10'
                    : 'bg-gray-50 border-gray-200 opacity-70 grayscale-[0.2]'
                  }`}>
                  <div className="flex flex-col md:flex-col items-center gap-6 text-center md:text-left">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center shrink-0 ${user?.isTrainingComplete
                      ? 'bg-emerald-100 text-emerald-600'
                      : isAllCoursesCompleted
                        ? 'bg-[#0EA0DC]/10 text-[#0EA0DC]'
                        : 'bg-gray-200 text-gray-500'
                      }`}>
                      {user?.isTrainingComplete ? (
                        <CheckCircle className="w-8 h-8" />
                      ) : isAllCoursesCompleted ? (
                        <MessageCircle className="w-8 h-8" />
                      ) : (
                        <Lock className="w-8 h-8" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-[#272727] mb-2">
                        {user?.isTrainingComplete
                          ? "Training Verification Complete"
                          : isAllCoursesCompleted
                            ? "Ready for Certification"
                            : "Complete All Courses to Proceed"}
                      </h3>
                      <p className="text-[#666666]">
                        {user?.isTrainingComplete
                          ? "Your partner has been notified of your 100% completion status. You can now communicate directly."
                          : isAllCoursesCompleted
                            ? "Congratulations! You have successfully completed 100% of all required SkyGloss training. Notify your Partner to issue your certification and unlock direct chat."
                            : "You must reach 100% completion across all Available Training Courses above before you can notify your Partner and proceed to Shop Certification."}
                      </p>
                    </div>
                    <div className="shrink-0 w-full md:w-auto mt-4 md:mt-0">
                      <Button
                        disabled={!isAllCoursesCompleted || user?.isTrainingComplete || isSubmittingTraining}
                        onClick={handleTrainingComplete}
                        className={`w-full md:w-auto h-12 px-8 font-bold rounded-xl transition-all ${user?.isTrainingComplete
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : isAllCoursesCompleted
                            ? 'bg-[#0EA0DC] hover:bg-[#272727] text-white shadow-lg shadow-[#0EA0DC]/20'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                      >
                        {isSubmittingTraining ? (
                          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting</>
                        ) : user?.isTrainingComplete ? (
                          <><CheckCircle className="w-4 h-4 mr-2" /> Partner Notified</>
                        ) : (
                          "Notify Partner"
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div> */}
            </motion.div>
          )}
        </div>
      )}

      {/* Mobile Cart Sheet */}
      <Sheet open={showCartSheet} onOpenChange={setShowCartSheet}>
        <SheetContent side="right" className="w-full sm:max-w-md bg-white p-0 flex flex-col">
          {/* Header with gradient background */}
          <div className="bg-gradient-to-br from-[#0EA0DC] to-[#0c80b3] p-6 pb-8">
            <div>
              <SheetTitle className="text-white text-2xl mb-2">Shopping Cart</SheetTitle>
              <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                {cartCount} {cartCount === 1 ? "item" : "items"}
              </Badge>
            </div>
          </div>

          {/* Cart Content */}
          <div className="flex-1 flex flex-col overflow-hidden -mt-4">
            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center px-6">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <ShoppingCart className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-[#666666]">Your cart is empty</p>
                <p className="text-sm text-[#999999] mt-1">Add products to get started</p>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                  {cart.map((item) => (
                    <div key={`${item.id}-${item.size}`} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="w-20 h-20 flex-shrink-0 bg-gradient-to-br from-gray-50 to-white rounded-lg p-2 border border-gray-200">
                          <ImageWithFallback
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-contain"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <div className="mb-2">
                            <h4 className="text-[#272727] truncate mb-1">{item.name}</h4>
                            <p className="text-xs text-[#999999] bg-gray-100 rounded px-2 py-0.5 inline-block">
                              {item.size}
                            </p>
                          </div>

                          {/* Price and Quantity Controls */}
                          <div className="flex items-center justify-between mt-3">
                            {showPrice && (
                              <div className="text-[#0EA0DC]">
                                {getSymbol(item.currency || 'USD')}{(item.price * item.quantity).toFixed(2)}
                                {item.quantity > 1 && (
                                  <span className="text-xs text-[#999999] ml-1">
                                    ({getSymbol(item.currency || 'USD')}{item.price.toFixed(2)} each)
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                              <button
                                onClick={() => updateQuantity(item.id, item.size, -1)}
                                className="w-8 h-8 rounded-md bg-white hover:bg-[#0EA0DC] hover:text-white transition-all flex items-center justify-center shadow-sm text-[rgb(0,0,0)]"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="text-[#272727] w-8 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.size, 1)}
                                className="w-8 h-8 rounded-md bg-white hover:bg-[#0EA0DC] hover:text-white transition-all flex items-center justify-center shadow-sm text-[rgb(0,0,0)]"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cart Summary Footer */}
                <div className="border-t border-gray-200 bg-gray-50 px-6 py-5 space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-[#666666]">
                      <span>Subtotal</span>
                      <span className="text-[#272727]">{getSymbol(products[0]?.currency)}{(cartTotal).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-[#999999]">
                      <span>Shipping</span>
                      <span>Calculated at checkout</span>
                    </div>
                    <Separator className="bg-gray-300" />
                    <div className="flex justify-between items-baseline">
                      <span className="text-[#272727]">Total</span>
                      <span className="text-2xl text-[#0EA0DC]">{getSymbol(products[0]?.currency)}{(cartTotal).toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      handleCheckout();
                      setShowCartSheet(false);
                    }}
                    className="w-full bg-[#0EA0DC] text-white hover:shadow-[0_0_20px_rgba(14,160,220,0.4)] hover:bg-[#0c80b3] transition-all duration-200 h-12 rounded-lg"
                  >
                    {user?.country === "United States" ? "Proceed to Checkout" : "Generate Order Request"}
                  </Button>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
      {/* Order Success Dialog */}
      <Dialog open={showOrderSuccessModal} onOpenChange={setShowOrderSuccessModal}>
        <DialogContent className="max-w-[500px] w-[75%] rounded-3xl border-0 shadow-2xl overflow-hidden p-0">
          <div className="bg-[#0EA0DC] p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <Package className="w-64 h-64 -rotate-12 -translate-x-12 -translate-y-12" />
            </div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border border-white/30 shadow-inner">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">Request Received!</h2>
              <p className="text-white/80 text-sm">Your order inquiry has been logged</p>
            </div>
          </div>
          <div className="p-8 bg-white">
            <DialogDescription className="text-[#272727] text-lg font-medium leading-relaxed mb-8 text-center">
              Thank you for your order! A Skygloss representative will contact you shortly to finalize shipping, payment, and invoicing details.
            </DialogDescription>
            <Button
              onClick={() => setShowOrderSuccessModal(false)}
              className="w-full bg-[#0EA0DC] text-white hover:bg-[#0c80b3] h-14 rounded-2xl font-bold text-lg transition-all shadow-[0_4px_15px_rgba(14,160,220,0.3)]"
            >
              Got it, Thanks!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
