// Last Updated: 2026-01-26
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { ArrowLeft, ShoppingCart, Download, CheckCircle2, Plus, Minus } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
// import { Switch } from "./ui/switch";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import api from "../api/axios";
import { Loader2 } from "lucide-react";
import FusionPdf from "../assets/pdf/Fusion.pdf";
import MattePdf from "../assets/pdf/Matte.pdf";
import ResinFilmPdf from "../assets/pdf/Resin_Film.pdf";
import SealPdf from "../assets/pdf/Seal.pdf";
import ShinePdf from "../assets/pdf/Shine.pdf";

const productPdfMap: Record<string, string> = {
  "FUSION": FusionPdf,
  "MATTE": MattePdf,
  "RESIN FILM": ResinFilmPdf,
  "SEAL": SealPdf,
  "SHINE": ShinePdf,
};

const getProductPdf = (productName: string): string | null => {
  const upperName = productName?.toUpperCase() || "";
  for (const [key, pdf] of Object.entries(productPdfMap)) {
    if (upperName.includes(key)) return pdf;
  }
  return null;
};

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

interface ProductDetailPageProps {
  productId: string;
  onBack: () => void;
  onAddToCart: (size: string, quantity: number, price?: number, orderType?: "unit" | "case") => void;
  showPrice?: boolean;
  onOpenCart?: () => void;
  initialProduct?: any;
}


export function ProductDetailPage({ productId, onBack, onAddToCart, showPrice = true, onOpenCart, initialProduct }: ProductDetailPageProps) {
  const [product, setProduct] = useState<any>(initialProduct || null);
  const [loading, setLoading] = useState(!initialProduct);
  const [selectedSize, setSelectedSize] = useState(() => {
    if (initialProduct?.sizes?.length > 0) {
      return typeof initialProduct.sizes[0] === 'string' ? initialProduct.sizes[0] : initialProduct.sizes[0].size;
    }
    return "";
  });
  const [selectedImage, setSelectedImage] = useState(0);
  const [showBottomBar, setShowBottomBar] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showAether] = useState(false); // false = Element, true = Aether
  const [quantity, setQuantity] = useState(1);
  const [orderType, setOrderType] = useState<"unit" | "case">("unit");

  const isPartner = product?.id && !product._id; // Simple check for Partner hardcoded products

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
    if (!initialProduct) {
      fetchProduct();
    } else {
      setProduct(initialProduct);
      setLoading(false);
      if (initialProduct.sizes?.length > 0) {
        setSelectedSize(typeof initialProduct.sizes[0] === 'string' ? initialProduct.sizes[0] : initialProduct.sizes[0].size);
      }
    }
  }, [productId, initialProduct]);

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
  const productImageList = (product.shopImages?.length > 0)
    ? product.shopImages
    : (product.images?.length > 0)
      ? product.images
      : isPartner
        ? [product.image, product.additionalImage, product.additionalImage2, ...(product.additionalImages || [])].filter(Boolean)
        : [];

  const currentPrice = isPartner
    ? (orderType === "unit" ? product.unitPrices?.[selectedSize] : product.casePrices?.[selectedSize]) || 0
    : (sizes.find((s: any) => s.size === selectedSize)?.price || 0);



  const handleAddToCart = () => {
    onAddToCart(selectedSize, quantity, showPrice ? currentPrice : undefined, isPartner ? orderType : undefined);
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
            {/* {isFusion && (
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

              
                <div className="rounded-xl overflow-hidden w-full bg-[#0EA0DC]/5 p-4 border border-[#0EA0DC]/20">
                  <div className="flex flex-col items-center">
                    <h4 className="text-sm font-bold text-[#0EA0DC] mb-1">DUAL-LAYER PROTECTION</h4>
                    <p className="text-xs text-[#666666]">Element (Base Coat) + Aether (Top Coat)</p>
                  </div>
                </div>
              </div>
            )} */}

            {/* Select Size */}
            <div className="mb-6">
              <label className="block text-sm text-[#272727] mb-3">
                {isFusion ? "Select Size (Element + Aether)" : "Select Size"}
              </label>
              <div className="flex flex-wrap gap-3">
                {sizes.map((s: any) => {
                  const size = typeof s === 'string' ? s : s.size;
                  const price = typeof s === 'string' ? null : s.price;
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`flex-1 min-w-[100px] px-4 py-3 rounded-lg border-2 transition-all duration-200 ${selectedSize === size
                        ? "bg-[#272727] text-white border-[#272727]"
                        : "bg-white text-[#666666] border-gray-300 hover:border-[#0EA0DC]"
                        }`}
                    >
                      <div className="text-sm font-medium">{size}</div>
                      {showPrice && price !== null && <div className="text-xs mt-1">{getSymbol(product.currency)}{price}</div>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Partner Order Type Selection */}
            {isPartner && (
              <div className="mb-6">
                <label className="block text-sm text-[#272727] mb-3">
                  Select Order Type:
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setOrderType("unit")}
                    className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all duration-200 ${orderType === "unit"
                      ? "bg-[#0EA0DC] text-white border-[#0EA0DC]"
                      : "bg-white text-[#666666] border-gray-300 hover:border-[#0EA0DC]"
                      }`}
                  >
                    Unit {showPrice && `(${getSymbol(product.currency)}{(product.unitPrices?.[selectedSize] || 0).toFixed(2)})`}
                  </button>
                  <button
                    onClick={() => setOrderType("case")}
                    className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all duration-200 ${orderType === "case"
                      ? "bg-[#0EA0DC] text-white border-[#0EA0DC]"
                      : "bg-white text-[#666666] border-gray-300 hover:border-[#0EA0DC]"
                      }`}
                  >
                    Case {showPrice && `(${getSymbol(product.currency)}{(product.casePrices?.[selectedSize] || 0).toFixed(2)})`}
                    {showPrice && (
                      <div className="text-[10px] opacity-80">
                        {product.unitsPerCase?.[selectedSize] || 0} units/case
                      </div>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Price */}
            {showPrice && (
              <div className="mb-8">
                <div className="text-3xl text-[#0EA0DC] mb-2">
                  {getSymbol(product.currency)}{currentPrice.toFixed(2)}
                </div>
                {!isPartner && (
                  <Badge variant="secondary" className={`border-0 ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </Badge>
                )}
                {isPartner && (
                  <Badge variant="secondary" className="border-0 bg-blue-100 text-blue-800">
                    Partner Exclusive
                  </Badge>
                )}
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-8 hidden">
              <label className="block text-sm text-[#272727] mb-3 font-medium">Quantity</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-gray-100 rounded-xl p-1.5 border border-gray-200">
                  <button
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-[#272727] shadow-sm hover:bg-[#0EA0DC] hover:text-white transition-all disabled:opacity-50"
                    disabled={quantity <= 1 || product.stock === 0}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-bold text-[#272727] text-lg">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(prev => prev + 1)}
                    className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-[#272727] shadow-sm hover:bg-[#0EA0DC] hover:text-white transition-all"
                    disabled={product.stock === 0}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {showPrice && (
                  <span className="text-sm text-[#666666]">
                    Total: <span className="text-[#0EA0DC] font-semibold">{getSymbol(product.currency)}{(currentPrice * quantity).toFixed(2)}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Add to Cart Button - Central */}
            <Button
              onClick={handleAddToCart}
              disabled={!isPartner && product.stock === 0}
              className="w-full bg-[#0EA0DC] text-white hover:shadow-[0_0_20px_rgba(14,160,220,0.4)] h-14 rounded-lg text-lg disabled:bg-gray-400"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {isPartner ? 'Add to Order' : (product.stock > 0 ? 'Add to Cart' : 'Out of Stock')}
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
                style={{
                  fontSize: "23px"
                }}
                className="data-[state=active]:bg-white 
                data-[state=active]:text-[#0EA0DC] 
                data-[state=active]:border-2 
                
                 data-[state=inactive]:bg-gray-100 
                 data-[state=inactive]:text-[#666666]
                  data-[state=inactive]:border-92 
                  data-[state=inactive]:border-transparent
                   rounded-xl px-4 sm:px-8 py-3 sm:py-4 
                   text-sm sm:text-base
                    transition-all duration-200 w-full sm:w-auto"
              >
                Product Details
              </TabsTrigger>
            </TabsList>

            {/* Description Tab */}
            <TabsContent value="description" className="space-y-8">
              {/* Technical Specifications Section */}
              {/* Specifications Section (Rich Text) */}
              {/* {typeof product.specifications === 'string' && product.specifications && (
                <Card className="skygloss-card p-4 sm:p-10 rounded-2xl mb-8">
                  <h3 className="text-xl sm:text-2xl text-[#272727] mb-6 sm:mb-8">Specifications</h3>
                  <div
                    className="text-[#666666] [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 
                    [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-[#272727] [&_h1]:mb-3 [&_h2]:text-xl 
                    [&_h2]:font-bold [&_h2]:text-[#272727] [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-bold 
                    [&_h3]:text-[#272727] [&_h3]:mb-2 [&_h4]:text-base [&_h4]:font-bold [&_h4]:text-[#272727] 
                    [&_h4]:mb-2 [&_p]:mb-3 [&_strong]:text-[#272727] [&_li]:mb-1"
                    dangerouslySetInnerHTML={{ __html: product.specifications }}
                  />
                </Card>
              )} */}

              {/* Technical Specifications Section */}
              <Card className="skygloss-card p-4 sm:p-10 rounded-2xl">
                <h3 className="text-xl sm:text-2xl text-[#272727] mb-6 sm:mb-8">Technical Specifications</h3>
                {product.technicalSpecifications ? (
                  <div
                    className="technical-specifications-rich  text-[#666666] [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-[#272727] [&_h1]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[#272727] [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-[#272727] [&_h3]:mb-2 [&_h4]:text-base [&_h4]:font-bold [&_h4]:text-[#272727] [&_h4]:mb-2 [&_p]:mb-3 [&_strong]:text-[#272727] [&_li]:mb-1"
                    dangerouslySetInnerHTML={{ __html: product.technicalSpecifications }}
                  />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 sm:gap-x-12 gap-y-4">
                    {Array.isArray(product.specifications) && product.specifications.length > 0 ? (
                      product.specifications.map((spec: any, idx: number) => (
                        <div key={idx} className="flex justify-between py-4 border-b border-[#0EA0DC]/10">
                          <span className="text-[#666666]">{spec.label}</span>
                          <span className="text-[#272727]">{spec.value}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500">No technical specifications available.</div>
                    )}
                  </div>
                )}
              </Card>


              {/* Downloads Section */}
              <Card className="skygloss-card p-4 sm:p-10 rounded-2xl">
                <h3 className="text-xl sm:text-2xl text-[#272727] mb-4 sm:mb-6">Downloads & Documentation</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <Button
                    variant="outline"
                    className="h-auto py-3 sm:py-4 flex-col items-start border-[#0EA0DC]/30 text-[#0EA0DC] 
                    hover:bg-[#0EA0DC] hover:border-[#0EA0DC]"
                  >
                    <Download className="w-5 h-5 mb-2" />
                    <span className="text-sm text-[rgb(255,255,255)]">Safety Data Sheet (SDS)</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-3 sm:py-4 flex-col items-start border-[#0EA0DC]/30 text-[#0EA0DC]
                     hover:bg-[#0EA0DC] hover:border-[#0EA0DC]"
                  >
                    <Download className="w-5 h-5 mb-2" />
                    <span className="text-sm text-[rgb(255,255,255)]">Technical Data Sheet (TDS)</span>
                  </Button>
                  <Button
                    variant="outline"
                    className={`h-auto py-3 sm:py-4 flex-col items-start border-[#0EA0DC]/30 text-[#0EA0DC]
                     hover:bg-[#0EA0DC] hover:border-[#0EA0DC] ${!getProductPdf(product.name) ? 'opacity-40 pointer-events-none' : ''}`}
                    onClick={() => {
                      const pdf = getProductPdf(product.name);
                      if (pdf) window.open(pdf, '_blank');
                    }}
                    disabled={!getProductPdf(product.name)}
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
              {product.name} ({selectedSize}) has been added to your cart
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
                      <h3 className="text-sm sm:text-lg text-[#272727] truncate">{product.name}</h3>
                      {showPrice && (
                        <div className="text-base sm:text-xl text-[#666666]">
                          {getSymbol(product.currency)}{currentPrice.toFixed(2)}
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

                  {/* Quantity Controls */}
                  <div className="flex  items-center gap-3 bg-gray-100 rounded-lg p-1.5 border border-gray-200">
                    <button
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      className="w-8 h-8 rounded-md bg-white hover:bg-[#0EA0DC] text-[#0EA0DC]
                      hover:text-white transition-all flex items-center justify-center shadow-sm disabled:opacity-50"
                      disabled={quantity <= 1 || product.stock === 0}
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-base font-bold text-[#272727] w-8 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(prev => prev + 1)}
                      className="w-8 h-8 rounded-md bg-white hover:bg-[#0EA0DC]   text-[#0EA0DC] hover:text-white transition-all flex items-center justify-center shadow-sm"
                      disabled={product.stock === 0}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Price and Add Button */}
                <div className="flex items-center gap-4">
                  {showPrice && (
                    <div className="text-right">
                      <span className="text-2xl font-bold text-[#0EA0DC]">
                        {getSymbol(product.currency)}{currentPrice.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <Button
                    onClick={handleAddToCart}
                    disabled={!isPartner && product.stock === 0}
                    className="bg-[#0EA0DC] text-white hover:shadow-[0_0_20px_rgba(14,160,220,0.4)] h-11 sm:h-12 px-6 sm:px-8 rounded-lg w-full sm:w-auto text-sm sm:text-base disabled:bg-gray-400"
                  >
                    <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    {isPartner ? 'Add to Order' : (product.stock > 0 ? 'Add to Cart' : 'Out of Stock')}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
