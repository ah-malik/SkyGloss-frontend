// Last Updated: 2026-01-26
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ShoppingBag, GraduationCap, Search, Eye, ShoppingCart, Plus, Minus, Loader2 } from "lucide-react";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Sheet, SheetContent, SheetTitle } from "./ui/sheet";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { CoursePlayer } from "./CoursePlayer";
import { ProductDetailPage } from "./ProductDetailPage";
import { CheckoutPage } from "./CheckoutPage";
import { toast } from "sonner";
import { useAuth } from "../AuthContext";
import api from "../api/axios";

interface TechnicianDashboardProps {
  onShowThankYou?: () => void;
  onCartCountChange?: (count: number) => void;
  showCartSheet?: boolean;
  onCartSheetChange?: (show: boolean) => void;
}

export function TechnicianDashboard({
  onShowThankYou,
  onCartCountChange,
}: TechnicianDashboardProps) {
  const {
    cart,
    addToCart: addToCartContext,
    updateQuantity,
    clearCart,
    showCartSheet,
    setShowCartSheet
  } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"shop" | "courses">("shop");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewingCourse, setViewingCourse] = useState(false);
  const [viewingProduct, setViewingProduct] = useState<string | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<{ [key: string]: string }>({});
  const [showCheckout, setShowCheckout] = useState(false);

  // Fetch Products
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
            await api.get(`/orders/verify/${orderId}`);
          } catch (err) {
            console.error("Verification check failed", err);
          }
        }

        toast.success("Payment Successful! Thank you for your order.", {
          duration: 5000,
        });
        clearCart();

        if (orderId) {
          navigate(`/dashboard/technician/receipt/${orderId}`);
        } else {
          navigate('/dashboard/technician');
        }

        if (onShowThankYou) onShowThankYou();
      } else if (params.get('canceled') === 'true') {
        toast.error("Payment Canceled.");
        window.history.replaceState({}, '', window.location.pathname);
      }
    };
    fn();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products?status=published&targetAudience=technician');
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
  }, [viewingCourse, viewingProduct, showCheckout]);

  // Update cart count in parent
  useEffect(() => {
    if (onCartCountChange) {
      onCartCountChange(cartCount);
    }
  }, [cartCount, onCartCountChange]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    setShowCheckout(true);
  };

  const handleOpenProduct = (id: string) => {
    setViewingProduct(id);
  };

  const handleBackFromProduct = () => {
    setViewingProduct(null);
  };

  const handleAddFromProductPage = (size: string, quantity: number, price?: number) => {
    const product = products.find(p => p._id === viewingProduct);
    if (!product || !price) return;
    addToCartContext(product, size, quantity);
  };


  if (viewingCourse) {
    return <CoursePlayer onBack={() => setViewingCourse(false)} />;
  }

  if (showCheckout) {
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
  }

  return (
    <div className="min-h-screen bg-white pt-20 pb-12">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white space-y-4">
          <Loader2 className="w-12 h-12 text-[#0EA0DC] animate-spin" />
          <p className="text-gray-500 font-medium tracking-wide">Initializing Technician Portal...</p>
        </div>
      ) : viewingProduct !== null ? (
        <ProductDetailPage
          productId={viewingProduct}
          onBack={handleBackFromProduct}
          onAddToCart={handleAddFromProductPage}
          showPrice={true}
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
              Technician Dashboard
            </h1>
            <p className="text-[#666666]">
              Access product catalog and training courses
            </p>
          </motion.div>

          {/* Main Tab Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="inline-flex rounded-xl border-2 border-[#0EA0DC] p-1 bg-white shadow-[0_0_10px_rgba(14,160,220,0.1)]">
              <button
                onClick={() => setActiveTab("shop")}
                className={`flex items-center px-10 py-4 rounded-lg transition-all duration-200 ${activeTab === "shop"
                  ? "bg-[#272727] text-white shadow-lg"
                  : "bg-transparent text-[#666666] hover:text-[#0EA0DC]"
                  }`}
              >
                <ShoppingBag className="w-5 h-5 mr-3" />
                <span className="text-lg">Shop</span>
              </button>
              <button
                onClick={() => setActiveTab("courses")}
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

          {/* Shop Tab Content */}
          {activeTab === "shop" && (
            <div className="grid lg:grid-cols-3 gap-10">
              {/* Left Column - Catalog */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="mb-10">
                    <h2 className="text-2xl text-[#272727] mb-2">Shop</h2>
                    <p className="text-[#666666] mb-6">Browse and order SkyGloss products</p>

                    {/* Search Bar */}
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
                      <Input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 bg-white rounded-xl border-[#0EA0DC]/30 h-14 text-base shadow-sm"
                      />
                    </div>
                  </div>

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
                                className="flex-shrink-0 w-full sm:w-48 cursor-pointer bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 hover:opacity-90 transition-opacity flex items-center justify-center h-48 sm:h-48"
                                onClick={() => handleOpenProduct(product._id)}
                              >
                                <ImageWithFallback
                                  src={product.images?.[0]}
                                  alt={product.name}
                                  className="w-full h-full object-contain"
                                />
                              </div>

                              {/* Content Section */}
                              <div className="flex-1 min-w-0 flex flex-col">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h3 className="text-xl text-[#272727] font-semibold">{product.name}</h3>
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
                                    <div className="text-right">
                                      <span className="text-2xl font-bold text-[#0EA0DC]">
                                        ${currentPrice.toFixed(2)}
                                      </span>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleOpenProduct(product._id)}
                                        className="rounded-lg border-[#0EA0DC]/30 text-[#0EA0DC] hover:bg-[#0EA0DC]/10 h-10 px-4"
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
                                        Add
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

                </motion.div>
              </div>

              {/* Right Column - Shopping Cart - Desktop Only */}
              <div className="hidden lg:block lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="sticky top-24"
                >
                  {/* Spacer to align with search bar */}
                  <div className="h-[100px] p-[0px]" />

                  <Card className="skygloss-card p-0 rounded-2xl overflow-hidden mx-[0px] my-[-11px]">
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
                                      <div className="text-sm text-[#0EA0DC]">
                                        ${(item.price * item.quantity).toFixed(2)}
                                        {item.quantity > 1 && (
                                          <span className="text-xs text-[#999999] block">
                                            ${item.price.toFixed(2)} each
                                          </span>
                                        )}
                                      </div>

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
                            <div className="flex justify-between text-[#666666]">
                              <span>Subtotal</span>
                              <span className="text-[#272727]">${cartTotal.toFixed(2)}</span>
                            </div>
                            <Separator className="bg-gray-300" />
                            <div className="flex justify-between items-baseline">
                              <span className="text-[#272727]">Total</span>
                              <span className="text-xl text-[#0EA0DC]">${cartTotal.toFixed(2)}</span>
                            </div>
                          </div>

                          <Button
                            onClick={handleCheckout}
                            className="w-full bg-[#0EA0DC] text-white hover:shadow-[0_0_20px_rgba(14,160,220,0.4)] hover:bg-[#0c80b3] transition-all duration-200 h-12 rounded-lg"
                          >
                            Complete Purchase
                          </Button>
                        </>
                      )}
                    </div>
                  </Card>
                </motion.div>
              </div>
            </div>
          )}

          {/* Courses Tab Content */}
          {activeTab === "courses" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key="courses"
            >
              {/* Course Categories */}
              <div className="mb-8">
                <h2 className="text-2xl text-[#272727] mb-4">Available Training Courses</h2>
                <p className="text-[#666666] mb-6">
                  Complete comprehensive training for each SkyGloss product line
                </p>
              </div>

              {/* Courses Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="skygloss-card p-6 rounded-2xl h-full flex flex-col">
                      <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg mb-4 p-4">
                        <ImageWithFallback
                          src={product.images?.[0]}
                          alt={product.name}
                          className="w-full h-40 object-contain"
                        />
                      </div>

                      <Badge className="mb-3 bg-[#0EA0DC]/10 text-[#0EA0DC] border-[#0EA0DC]/20 w-fit">
                        {product.category || 'Course'}
                      </Badge>

                      <h4 className="text-lg text-[#272727] mb-2">{product.name}</h4>

                      <p className="text-sm text-[#666666] mb-4 flex-1">
                        Complete training course with comprehensive lessons covering application techniques, safety procedures, and best practices.
                      </p>

                      {/* Course Stats */}
                      <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
                        <div className="text-center">
                          <div className="text-xs text-[#666666]">Lessons</div>
                          <div className="text-sm text-[#272727]">10</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-[#666666]">Duration</div>
                          <div className="text-sm text-[#272727]">2h 30m</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-[#666666]">Level</div>
                          <div className="text-sm text-[#272727]">All</div>
                        </div>
                      </div>

                      <Button
                        onClick={() => setViewingCourse(true)}
                        className="w-full bg-[#0EA0DC] text-white hover:shadow-[0_0_20px_rgba(14,160,220,0.4)] h-11 rounded-lg"
                      >
                        Start Course
                      </Button>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Additional Course Categories */}
              <div className="mt-12">
                <h3 className="text-xl text-[#272727] mb-6">Additional Training</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="skygloss-card p-6 rounded-2xl">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-[#0EA0DC] flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg text-[#272727] mb-2">Safety & Compliance</h4>
                        <p className="text-sm text-[#666666] mb-4">
                          Essential safety protocols and industry compliance standards
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-[#0EA0DC]/30 text-[#0EA0DC] hover:border-[#0EA0DC] hover:bg-[#0EA0DC]/5"
                        >
                          View Course
                        </Button>
                      </div>
                    </div>
                  </Card>

                  <Card className="skygloss-card p-6 rounded-2xl">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-[#0EA0DC] flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg text-[#272727] mb-2">Customer Service</h4>
                        <p className="text-sm text-[#666666] mb-4">
                          Best practices for client communication and education
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-[#0EA0DC]/30 text-[#0EA0DC] hover:border-[#0EA0DC] hover:bg-[#0EA0DC]/5"
                        >
                          View Course
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
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
                      <span className="text-[#272727]">${cartTotal.toFixed(2)}</span>
                    </div>
                    <Separator className="bg-gray-300" />
                    <div className="flex justify-between items-baseline">
                      <span className="text-[#272727]">Total</span>
                      <span className="text-2xl text-[#0EA0DC]">${cartTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      handleCheckout();
                      setShowCartSheet(false);
                    }}
                    className="w-full bg-[#0EA0DC] text-white hover:shadow-[0_0_20px_rgba(14,160,220,0.4)] hover:bg-[#0c80b3] transition-all duration-200 h-12 rounded-lg"
                  >
                    Complete Purchase
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
