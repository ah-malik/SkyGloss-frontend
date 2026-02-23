import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import { Search, ShoppingCart, Plus, Minus, Eye, Loader2, GraduationCap, ShoppingBag } from "lucide-react";
import api from "../api/axios";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Sheet, SheetContent, SheetTitle } from "./ui/sheet";

import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ProductDetailPage } from "./ProductDetailPage";
import { CoursePlayer } from "./CoursePlayer";
import { FusionGuide } from "./FusionGuide";
import { ResinFilmGuide } from "./ResinFilmGuide";
import { SealGuide } from "./SealGuide";
import { MatteGuide } from "./MatteGuide";
import { ShineGuide } from "./ShineGuide";
import { CheckoutPage } from "./CheckoutPage";
import { OrderRequestPage } from "./OrderRequestPage";
import { toast } from "sonner";
import { useAuth } from "../AuthContext";

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

// Master Distributor Dashboard Assets for Courses
import fusionMainImage from "../assets/Master_Distributor_Dashboard/1 Fusion.png";
import resinFilmImage from "../assets/Master_Distributor_Dashboard/2 Resin Film.png";
import sealImage from "../assets/Master_Distributor_Dashboard/3 Seal.png";
import matteBoxImage from "../assets/Master_Distributor_Dashboard/4 Matte.png";
import shineBoxImage from "../assets/Master_Distributor_Dashboard/5 Shine.png";
import applicatorBottleImage from "../assets/Master_Distributor_Dashboard/6 Applicator Bottle.png";
import edgeBladeBox1Image from "../assets/Master_Distributor_Dashboard/7 Edge Blade.png";
import paintPenBoxImage from "../assets/Master_Distributor_Dashboard/8 Paint Pen.png";
import applicatorsImage from "../assets/Master_Distributor_Dashboard/8 Applicator.png";



interface ShopDashboardProps {
  onShowThankYou?: () => void;
  onCartCountChange?: (count: number) => void;
  showCartSheet?: boolean;
  onCartSheetChange?: (show: boolean) => void;
}

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
    user
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { productId, courseId } = useParams();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSizes, setSelectedSizes] = useState<{ [key: string]: string }>({});
  const [viewingProduct, setViewingProduct] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"shop" | "courses">("shop");
  const [viewingCourse, setViewingCourse] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const showPrice = user?.country === "United States";

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
  }, []);

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
      setProducts(res.data);
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
    if (!product || !price) return;
    addToCartContext(product, size, quantity);
  };

  // Filter products based on search query
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );



  if (viewingCourse) {
    const product = products.find(p => p._id === viewingProduct) || {};
    const isFusion = product.name?.toUpperCase().includes('FUSION');
    const isResinFilm = product.name?.toUpperCase().includes('RESIN FILM');

    if (isFusion) {
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
              Shop Catalog
            </h1>
            <p className="text-[#666666]">
              {activeTab === "shop" ? "Browse and order SkyGloss products" : "Access product training and resources"}
            </p>
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
                              className="flex-shrink-0 w-full sm:w-48 cursor-pointer bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 hover:opacity-90 transition-opacity flex items-center justify-center"
                              onClick={() => handleOpenProduct(product._id)}
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
                                        onClick={() => setSelectedSizes({ ...selectedSizes, [product._id]: s.size })}
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
                                <div className="flex justify-between text-sm text-[#999999]">
                                  <span>Shipping</span>
                                  <span>At checkout</span>
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
              <div className="mb-8">
                <h2 className="text-2xl text-[#272727] mb-4">Available Training Courses</h2>
                <p className="text-[#666666] mb-6">
                  Complete comprehensive training for each SkyGloss product line
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products
                  .filter(p => !['PPF GLOSS', 'PPF MATTE', 'APPLICATOR', 'APPLICATOR BOTTLE', 'EDGE BLADE', 'PAINT PEN']
                    .includes(p.name.toUpperCase()) && !p.name.includes('APPLICATORS') && !p.name.includes('Applicators (2-Pack)'))
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
                          onClick={() => {
                            navigate(`/dashboard/shop/courses/${product._id}`);
                          }}
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
    </div>
  );
}