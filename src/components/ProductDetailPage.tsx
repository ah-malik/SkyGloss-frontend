import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { ArrowLeft, ShoppingCart, Download, Play, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
// import { Switch } from "./ui/switch";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import api from "../api/axios";
import { Loader2 } from "lucide-react";

interface ProductDetailPageProps {
  productId: string;
  onBack: () => void;
  onAddToCart: (size: string, price?: number) => void;
  showPrice?: boolean;
  onOpenCart?: () => void;
}

const videos = [
  { title: "Product Overview", duration: "5:24", thumbnail: "https://via.placeholder.com/600x400?text=Overview" },
  { title: "Application Tutorial", duration: "12:45", thumbnail: "https://via.placeholder.com/600x400?text=Tutorial" },
  { title: "Surface Preparation", duration: "8:30", thumbnail: "https://via.placeholder.com/600x400?text=Prep" },
  { title: "Maintenance Guide", duration: "6:15", thumbnail: "https://via.placeholder.com/600x400?text=Maintenance" }
];

export function ProductDetailPage({ productId, onBack, onAddToCart, showPrice = true, onOpenCart }: ProductDetailPageProps) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [showBottomBar, setShowBottomBar] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showAether, setShowAether] = useState(false); // false = Element, true = Aether

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/products/${productId}`);
      const data = res.data;
      setProduct(data);
      if (data.sizes?.length > 0) {
        setSelectedSize(data.sizes[0].size);
      }
    } catch (err) {
      console.error("Failed to fetch product", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [productId]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBottomBar(true);
      } else {
        setShowBottomBar(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white space-y-4">
        <Loader2 className="w-12 h-12 text-[#0EA0DC] animate-spin" />
        <p className="text-gray-500 font-medium tracking-wide">Loading Product Details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <p className="text-gray-500">Product not found</p>
        <Button onClick={onBack} variant="link" className="text-[#0EA0DC]">Back to Catalog</Button>
      </div>
    );
  }

  const sizes = product.sizes || [];
  const productImageList = product.images || [];
  const currentPrice = sizes.find((s: any) => s.size === selectedSize)?.price || 0;

  const handleAddToCart = () => {
    onAddToCart(selectedSize, showPrice ? currentPrice : undefined);
    setShowConfirmDialog(true);
  };

  const handleContinueShopping = () => {
    setShowConfirmDialog(false);
    onBack();
  };

  const handleProceedToCheckout = () => {
    setShowConfirmDialog(false);
    if (onOpenCart) {
      onOpenCart();
    }
  };

  const isFusion = product.name?.toUpperCase().includes("FUSION");

  return (
    <div className="min-h-screen bg-white pt-20 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-[#666666] hover:text-[#0EA0DC] hover:bg-[#0EA0DC]/5 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Catalog
          </Button>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Left Column - Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="w-full"
          >
            <div className="w-full">
              {/* Main Image */}
              <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-gray-50 to-white border border-[#0EA0DC]/10 p-6">
                <ImageWithFallback
                  src={product.id === 1 && showAether
                    ? productImageList[1] || productImageList[0]
                    : productImageList[selectedImage] || productImageList[0]}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Thumbnail Gallery */}
              {!isFusion && (
                <div className="grid grid-cols-4 gap-3">
                  {productImageList.map((image: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 bg-gradient-to-br from-gray-50 to-white p-2 ${selectedImage === idx
                        ? "border-[#272727] ring-2 ring-[#272727]/20"
                        : "border-transparent hover:border-[#0EA0DC]/30"
                        }`}
                    >
                      <ImageWithFallback
                        src={image}
                        alt={`View ${idx + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Column - Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full"
          >
            <Badge className="mb-4 bg-[#0EA0DC]/10 text-[#0EA0DC] border-[#0EA0DC]/20 capitalize">
              {product.category || 'Premium'}
            </Badge>

            <h1 className="text-4xl text-[#272727] mb-4">
              {product.name}
            </h1>

            <p className="text-lg text-[#666666] mb-8">
              {product.description}
            </p>

            {/* FUSION Layer Selection */}
            {isFusion && (
              <div className="mb-8 w-full">
                <label className="block text-sm text-[#272727] mb-3">
                  View Product Layer:
                </label>
                <div className="grid grid-cols-2 gap-3 mb-4 w-full">
                  <button
                    onClick={() => setShowAether(false)}
                    className={`px-4 py-3 rounded-xl border-2 transition-all duration-300 ${!showAether
                      ? "bg-gradient-to-br from-[#0EA0DC] to-[#0EA0DC]/80 text-white border-[#0EA0DC] shadow-lg shadow-[#0EA0DC]/30"
                      : "bg-white text-[#666666] border-gray-200 hover:border-[#0EA0DC]/50"
                      }`}
                  >
                    <div className="text-center">
                      <div className={`text-sm ${!showAether ? '' : 'text-[#272727]'} mb-1`}>Element</div>
                      <div className="text-xs opacity-80">Base Coat</div>
                    </div>
                  </button>
                  <button
                    onClick={() => setShowAether(true)}
                    className={`px-4 py-3 rounded-xl border-2 transition-all duration-300 ${showAether
                      ? "bg-gradient-to-br from-[#0EA0DC] to-[#0EA0DC]/80 text-white border-[#0EA0DC] shadow-lg shadow-[#0EA0DC]/30"
                      : "bg-white text-[#666666] border-gray-200 hover:border-[#0EA0DC]/50"
                      }`}
                  >
                    <div className="text-center">
                      <div className={`text-sm ${showAether ? '' : 'text-[#272727]'} mb-1`}>Aether</div>
                      <div className="text-xs opacity-80">Top Coat</div>
                    </div>
                  </button>
                </div>

                {/* Dual-Layer System Banner - Placeholder since it was an import */}
                <div className="rounded-xl overflow-hidden w-full bg-[#0EA0DC]/5 p-4 border border-[#0EA0DC]/20">
                  <div className="flex flex-col items-center">
                    <h4 className="text-sm font-bold text-[#0EA0DC] mb-1">DUAL-LAYER PROTECTION</h4>
                    <p className="text-xs text-[#666666]">Element (Base Coat) + Aether (Top Coat)</p>
                  </div>
                </div>
              </div>
            )}

            {/* Select Size */}
            <div className="mb-6">
              <label className="block text-sm text-[#272727] mb-3">
                {isFusion ? "Select Size (Element + Aether)" : "Select Size"}
              </label>
              <div className="flex flex-wrap gap-3">
                {sizes.map(({ size, price }: any) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`flex-1 min-w-[100px] px-4 py-3 rounded-lg border-2 transition-all duration-200 ${selectedSize === size
                      ? "bg-[#272727] text-white border-[#272727]"
                      : "bg-white text-[#666666] border-gray-300 hover:border-[#0EA0DC]"
                      }`}
                  >
                    <div className="text-sm font-medium">{size}</div>
                    {showPrice && <div className="text-xs mt-1">${price}</div>}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            {showPrice && (
              <div className="mb-8">
                <div className="text-3xl text-[#0EA0DC] mb-2">
                  ${currentPrice.toFixed(2)}
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800 border-0">
                  In Stock
                </Badge>
              </div>
            )}

            {/* Add to Cart Button - Central */}
            <Button
              onClick={handleAddToCart}
              className="w-full bg-[#0EA0DC] text-white hover:shadow-[0_0_20px_rgba(14,160,220,0.4)] h-14 rounded-lg text-lg"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </Button>
          </motion.div>
        </div>

        {/* Product Details Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full flex-col sm:flex-row justify-start bg-transparent h-auto p-0 mb-8 sm:mb-12 gap-2 sm:gap-4">
              <TabsTrigger
                value="description"
                className="data-[state=active]:bg-white data-[state=active]:text-[#0EA0DC] data-[state=active]:border-2 data-[state=active]:border-[#0EA0DC] data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-[#666666] data-[state=inactive]:border-2 data-[state=inactive]:border-transparent rounded-xl px-4 sm:px-8 py-3 sm:py-4 text-sm sm:text-base hover:border-[#0EA0DC]/30 transition-all duration-200 w-full sm:w-auto"
              >
                Description
              </TabsTrigger>
            </TabsList>

            {/* Description Tab */}
            <TabsContent value="description" className="space-y-8">
              {/* Technical Specifications Section */}
              <Card className="skygloss-card p-4 sm:p-10 rounded-2xl">
                <h3 className="text-xl sm:text-2xl text-[#272727] mb-6 sm:mb-8">Technical Specifications</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 sm:gap-x-12 gap-y-4">
                  {[
                    { label: "Volume Options", value: "100ml / 250ml / 500ml" },
                    { label: "Coverage", value: "3-4 vehicles (100ml)" },
                    { label: "Cure Time", value: "4 hours" },
                    { label: "Durability", value: "18 months" },
                    { label: "Application Temp", value: "15-30°C" },
                    { label: "Technology", value: "Hybrid Fusion" }
                  ].map((spec, idx) => (
                    <div key={idx} className="flex justify-between py-4 border-b border-[#0EA0DC]/10">
                      <span className="text-[#666666]">{spec.label}</span>
                      <span className="text-[#272727]">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Application Guidelines Section */}
              <Card className="skygloss-card p-4 sm:p-10 rounded-2xl">
                <h3 className="text-xl sm:text-2xl text-[#272727] mb-6">Application Guidelines</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Step 1 */}
                  <div className="flex gap-4 p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-[#0EA0DC]/10">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-[#0EA0DC] flex items-center justify-center text-white">
                        1
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg text-[#272727] mb-2">Surface Preparation</h4>
                      <p className="text-sm text-[#666666] mb-3">
                        Clean and decontaminate surface thoroughly. Ensure surface is completely dry and free from contaminants.
                      </p>
                      <div className="aspect-video rounded-lg bg-[#272727] flex items-center justify-center overflow-hidden relative group cursor-pointer mb-2">
                        <ImageWithFallback
                          src={videos[2].thumbnail}
                          alt={videos[2].title}
                          className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-[#0EA0DC] flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Play className="w-6 h-6 text-white ml-0.5" />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#666666]">{videos[2].duration}</span>
                        <Button size="sm" className="h-7 text-xs bg-[#0EA0DC] text-white hover:shadow-[0_0_20px_rgba(14,160,220,0.4)]">
                          Watch Video
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex gap-4 p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-[#0EA0DC]/10">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-[#0EA0DC] flex items-center justify-center text-white">
                        2
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg text-[#272727] mb-2">Application</h4>
                      <p className="text-sm text-[#666666] mb-3">
                        Apply thin, even layer with foam applicator. Work in 2x2 ft sections for best results.
                      </p>
                      <div className="aspect-video rounded-lg bg-[#272727] flex items-center justify-center overflow-hidden relative group cursor-pointer mb-2">
                        <ImageWithFallback
                          src={videos[1].thumbnail}
                          alt={videos[1].title}
                          className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-[#0EA0DC] flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Play className="w-6 h-6 text-white ml-0.5" />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#666666]">{videos[1].duration}</span>
                        <Button size="sm" className="h-7 text-xs bg-[#0EA0DC] text-white hover:shadow-[0_0_20px_rgba(14,160,220,0.4)]">
                          Watch Video
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex gap-4 p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-[#0EA0DC]/10">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-[#0EA0DC] flex items-center justify-center text-white">
                        3
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg text-[#272727] mb-2">Leveling</h4>
                      <p className="text-sm text-[#666666] mb-3">
                        Level coating after 2-3 minutes using clean microfiber towel. Ensure even coverage.
                      </p>
                      <div className="aspect-video rounded-lg bg-[#272727] flex items-center justify-center overflow-hidden relative group cursor-pointer mb-2">
                        <ImageWithFallback
                          src={videos[0].thumbnail}
                          alt={videos[0].title}
                          className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-[#0EA0DC] flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Play className="w-6 h-6 text-white ml-0.5" />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#666666]">{videos[0].duration}</span>
                        <Button size="sm" className="h-7 text-xs bg-[#0EA0DC] text-white hover:shadow-[0_0_20px_rgba(14,160,220,0.4)]">
                          Watch Video
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="flex gap-4 p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-[#0EA0DC]/10">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-[#0EA0DC] flex items-center justify-center text-white">
                        4
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg text-[#272727] mb-2">Curing</h4>
                      <p className="text-sm text-[#666666] mb-3">
                        Allow 4 hours cure time before water exposure. Full cure achieved in 24 hours for maximum protection.
                      </p>
                      <div className="aspect-video rounded-lg bg-[#272727] flex items-center justify-center overflow-hidden relative group cursor-pointer mb-2">
                        <ImageWithFallback
                          src={videos[3].thumbnail}
                          alt={videos[3].title}
                          className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-[#0EA0DC] flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Play className="w-6 h-6 text-white ml-0.5" />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#666666]">{videos[3].duration}</span>
                        <Button size="sm" className="h-7 text-xs bg-[#0EA0DC] text-white hover:shadow-[0_0_20px_rgba(14,160,220,0.4)]">
                          Watch Video
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Downloads Section */}
              <Card className="skygloss-card p-4 sm:p-10 rounded-2xl">
                <h3 className="text-xl sm:text-2xl text-[#272727] mb-4 sm:mb-6">Downloads & Documentation</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <Button
                    variant="outline"
                    className="h-auto py-3 sm:py-4 flex-col items-start border-[#0EA0DC]/30 text-[#0EA0DC] hover:bg-[#0EA0DC]/5 hover:border-[#0EA0DC]"
                  >
                    <Download className="w-5 h-5 mb-2" />
                    <span className="text-sm text-[rgb(255,255,255)]">Safety Data Sheet (SDS)</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-3 sm:py-4 flex-col items-start border-[#0EA0DC]/30 text-[#0EA0DC] hover:bg-[#0EA0DC]/5 hover:border-[#0EA0DC]"
                  >
                    <Download className="w-5 h-5 mb-2" />
                    <span className="text-sm text-[rgb(255,255,255)]">Technical Data Sheet (TDS)</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-3 sm:py-4 flex-col items-start border-[#0EA0DC]/30 text-[#0EA0DC] hover:bg-[#0EA0DC]/5 hover:border-[#0EA0DC]"
                  >
                    <Download className="w-5 h-5 mb-2" />
                    <span className="text-sm text-[rgb(255,255,255)]">Application Guide (PDF)</span>
                  </Button>
                </div>
              </Card>
            </TabsContent>

          </Tabs>
        </motion.div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl">Added to Cart!</DialogTitle>
            <DialogDescription className="text-center text-[#666666]">
              SkyGloss Shield ({selectedSize}) has been added to your cart
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <Button
              onClick={handleContinueShopping}
              variant="outline"
              className="border-[#0EA0DC]/30 text-[#0EA0DC] hover:bg-[#0EA0DC]/5"
            >
              Continue Shopping
            </Button>
            <Button
              onClick={handleProceedToCheckout}
              className="bg-[#0EA0DC] text-white hover:shadow-[0_0_20px_rgba(14,160,220,0.4)]"
            >
              Proceed to Checkout
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sticky Bottom Bar - Only shows when scrolled */}
      <AnimatePresence>
        {showBottomBar && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#0EA0DC]/20 shadow-[0_-4px_16px_rgba(0,0,0,0.1)] z-50"
          >
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-6">
                {/* Product Info & Size Selection */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-8 flex-1 min-w-0">
                  {/* Product Name & Price */}
                  <div className="flex items-center justify-between w-full sm:w-auto">
                    <div>
                      <h3 className="text-sm sm:text-lg text-[#272727] truncate">SkyGloss Shield</h3>
                      {showPrice && (
                        <div className="text-base sm:text-xl text-[#666666]">
                          ${currentPrice.toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Size Buttons */}
                  <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                    {sizes.map(({ size }: any) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`flex-1 sm:flex-none px-3 sm:px-6 py-2 sm:py-2.5 rounded-lg transition-all duration-200 text-sm sm:text-base ${selectedSize === size
                          ? "bg-[#272727] text-white"
                          : "bg-gray-100 text-[#666666] hover:bg-gray-200"
                          }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Add to Cart Button */}
                <Button
                  onClick={handleAddToCart}
                  className="bg-[#0EA0DC] text-white hover:shadow-[0_0_20px_rgba(14,160,220,0.4)] h-11 sm:h-12 px-6 sm:px-8 rounded-lg w-full sm:w-auto text-sm sm:text-base"
                >
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
