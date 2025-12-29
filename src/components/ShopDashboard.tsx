import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Search, ShoppingCart, Plus, Minus, Eye, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import api from "../api/axios";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Sheet, SheetContent, SheetTitle } from "./ui/sheet";

import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ProductDetailPage } from "./ProductDetailPage";
import { CheckoutPage } from "./CheckoutPage";
import { toast } from "sonner";
import { useAuth } from "../AuthContext";



interface ShopDashboardProps {
  onShowThankYou?: () => void;
  onCartCountChange?: (count: number) => void;
  showCartSheet?: boolean;
  onCartSheetChange?: (show: boolean) => void;
}

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
    setShowCartSheet
  } = useAuth();
  const navigate = useNavigate();
  const { productId } = useParams();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSizes, setSelectedSizes] = useState<{ [key: string]: string }>({});
  const [viewingProduct, setViewingProduct] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sync viewingProduct with URL parameter
  useEffect(() => {
    if (productId) {
      setViewingProduct(productId);
    } else {
      setViewingProduct(null);
    }
  }, [productId]);

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
  }, [viewingProduct, showCheckout]);

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

  // Carousel logic for filtered products
  const productsPerView = 2; // Show 2 products at a time
  const maxIndex = Math.max(0, filteredProducts.length - productsPerView);

  const handlePrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
  };

  const visibleProducts = filteredProducts.slice(currentIndex, currentIndex + productsPerView);


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
          <p className="text-gray-500 font-medium tracking-wide">Initializing Premium Workshop...</p>
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
              Shop Catalog
            </h1>
            <p className="text-[#666666]">
              Browse and order SkyGloss products
            </p>
          </motion.div>

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

              {/* Products Carousel */}
              <div className="relative">
                {/* Navigation Arrows */}
                <Button
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border-2 border-[#0EA0DC]/30 text-[#0EA0DC] hover:bg-[#0EA0DC] hover:text-white hover:border-[#0EA0DC] disabled:opacity-30 disabled:cursor-not-allowed shadow-lg transition-all duration-200 p-0"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>

                <div className="grid sm:grid-cols-2 gap-6">
                  {visibleProducts.map((product, index) => {
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
                        <Card className="skygloss-card p-6 rounded-2xl">
                          <div
                            className="cursor-pointer bg-gradient-to-br from-gray-50 to-white rounded-xl mb-4 p-4 hover:opacity-90 transition-opacity"
                            onClick={() => handleOpenProduct(product._id)}
                          >
                            <ImageWithFallback
                              src={product.images?.[0]}
                              alt={product.name}
                              className="w-full h-48 object-contain"
                            />
                          </div>

                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-[#272727]">{product.name}</h3>
                              <p className="text-sm text-[#666666] mt-1 line-clamp-2">{product.description}</p>
                            </div>
                            <Badge
                              variant="secondary"
                              className={`${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                            >
                              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                            </Badge>
                          </div>

                          {/* Size Selection */}
                          <div className="mb-4">
                            <label className="text-xs text-[#666666] mb-2 block font-medium">
                              Select Size:
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {product.sizes?.map((s: any) => (
                                <button
                                  key={s.size}
                                  onClick={() => setSelectedSizes({ ...selectedSizes, [product._id]: s.size })}
                                  className={`px-3 py-1.5 rounded-lg text-xs transition-all duration-200 text-center leading-tight ${currentSizeStr === s.size
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
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-2xl font-bold text-[#0EA0DC]">
                                ${currentPrice.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleOpenProduct(product._id)}
                                className="rounded-lg border-[#0EA0DC]/30 text-[#0EA0DC] hover:bg-[#0EA0DC]/10"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                disabled={product.stock === 0}
                                onClick={() => addToCart(product)}
                                className="bg-[#0EA0DC] text-white hover:shadow-[0_0_20px_rgba(14,160,220,0.4)] transition-all duration-200 rounded-lg"
                              >
                                <ShoppingCart className="w-4 h-4 mr-1" />
                                Add
                              </Button>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>

                <Button
                  onClick={handleNext}
                  disabled={currentIndex >= maxIndex}
                  className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border-2 border-[#0EA0DC]/30 text-[#0EA0DC] hover:bg-[#0EA0DC] hover:text-white hover:border-[#0EA0DC] disabled:opacity-30 disabled:cursor-not-allowed shadow-lg transition-all duration-200 p-0"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>

                {/* Carousel Indicator */}
                <div className="text-center mt-4 text-sm text-[#666666]">
                  Showing {currentIndex + 1}-{Math.min(currentIndex + productsPerView, filteredProducts.length)} of {filteredProducts.length} products
                </div>
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
                          <div className="flex justify-between text-sm text-[#999999]">
                            <span>Shipping</span>
                            <span>At checkout</span>
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
                          Proceed to Checkout
                        </Button>
                      </>
                    )}
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
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
                    <div className="flex justify-between text-sm text-[#999999]">
                      <span>Shipping</span>
                      <span>Calculated at checkout</span>
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
                    Proceed to Checkout
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
