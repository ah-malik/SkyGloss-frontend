import { useState, useEffect } from "react";
import api from "../api/axios";
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { FileText, Droplets, Shield, Sparkles, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  description: string;
  images: string[];
  features: string[];
  specifications: {
    label: string;
    value: string;
  }[];
  applicationGuide: string[];
  technicalSheetUrl?: string;
}



export function PublicCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products?status=published');
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch public products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Determine how many products to show based on screen size
  const productsPerView = 4; // Desktop: 4 products at a time
  const maxIndex = Math.max(0, products.length - productsPerView);

  const handlePrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
  };

  const visibleProducts = products.slice(currentIndex, currentIndex + productsPerView);

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <Loader2 className="w-10 h-10 text-[#0EA0DC] animate-spin" />
      </div>
    );
  }

  return (
    <div className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-[#0EA0DC]/10 text-[#0EA0DC] border-[#0EA0DC]/20">
            Product Catalog
          </Badge>
          <h2 className="text-4xl text-[#272727] mb-4">
            SkyGloss Product Lineup
          </h2>
        </motion.div>

        {/* Products Carousel */}
        <div className="relative">
          {/* Navigation Arrows */}
          <div className="flex items-center gap-4">
            <Button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white border-2 border-[#0EA0DC]/30 text-[#0EA0DC] hover:bg-[#0EA0DC] hover:text-white hover:border-[#0EA0DC] disabled:opacity-30 disabled:cursor-not-allowed shadow-lg transition-all duration-200"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>

            {/* Products Grid */}
            <div className="w-full overflow-hidden">
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <AnimatePresence mode="popLayout">
                  {visibleProducts.map((product, index) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Card className="skygloss-card overflow-hidden rounded-2xl h-full flex flex-col bg-white">
                        {/* Product Image */}
                        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-white p-4">
                          <ImageWithFallback
                            src={product.images?.[0]}
                            alt={product.name}
                            className="w-full h-full object-contain"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="p-5 flex flex-col flex-1">
                          <h3 className="text-[#272727] mb-2">
                            {product.name}
                          </h3>
                          <p className="text-sm text-[#666666] mb-4 line-clamp-2 flex-1">
                            {product.description}
                          </p>

                          {/* Features Icons */}
                          <div className="flex gap-2 mb-4">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#0EA0DC]/10">
                              <Droplets className="w-4 h-4 text-[#0EA0DC]" />
                            </div>
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#0EA0DC]/10">
                              <Shield className="w-4 h-4 text-[#0EA0DC]" />
                            </div>
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#0EA0DC]/10">
                              <Sparkles className="w-4 h-4 text-[#0EA0DC]" />
                            </div>
                          </div>

                          <Button
                            variant="outline"
                            onClick={() => setSelectedProduct(product)}
                            className="w-full border-[#0EA0DC]/30 text-[rgb(255,255,255)] hover:bg-[#0EA0DC]/10 hover:border-[#0EA0DC] transition-all duration-200"
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>

            <Button
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
              className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white border-2 border-[#0EA0DC]/30 text-[#0EA0DC] hover:bg-[#0EA0DC] hover:text-white hover:border-[#0EA0DC] disabled:opacity-30 disabled:cursor-not-allowed shadow-lg transition-all duration-200"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>

          {/* Carousel Indicator */}
          <div className="text-center mt-6 text-sm text-[#666666]">
            Showing {currentIndex + 1}-{Math.min(currentIndex + productsPerView, products.length)} of {products.length} products
          </div>
        </div>

        {/* Login CTA */}
      </div>

      {/* Product Detail Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedProduct.name}</DialogTitle>
                <DialogDescription className="sr-only">
                  View detailed information about {selectedProduct.name}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 bg-[rgba(168,159,159,0)]">
                {/* Product Images */}
                {selectedProduct.images?.length > 1 ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="aspect-video rounded-xl overflow-hidden">
                      <ImageWithFallback
                        src={selectedProduct.images[0]}
                        alt={selectedProduct.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="aspect-video rounded-xl overflow-hidden">
                      <ImageWithFallback
                        src={selectedProduct.images[1]}
                        alt={selectedProduct.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video rounded-xl overflow-hidden">
                    <ImageWithFallback
                      src={selectedProduct.images?.[0]}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Tabs */}
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-white rounded-xl p-1.5 border-2 border-[#0EA0DC] shadow-[0_0_10px_rgba(14,160,220,0.15)] h-auto">
                    <TabsTrigger
                      value="overview"
                      className="data-[state=active]:bg-[#272727] data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-[#0EA0DC] py-3 px-4 rounded-lg transition-all duration-200"
                    >
                      Overview
                    </TabsTrigger>
                    <TabsTrigger
                      value="specifications"
                      className="data-[state=active]:bg-[#272727] data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-[#0EA0DC] py-3 px-4 rounded-lg transition-all duration-200"
                    >
                      Specifications
                    </TabsTrigger>
                    <TabsTrigger
                      value="application"
                      className="data-[state=active]:bg-[#272727] data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-[#0EA0DC] py-3 px-4 rounded-lg transition-all duration-200"
                    >
                      Application
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4 pt-4">
                    <div>
                      <h4 className="text-[#272727] mb-2">Description</h4>
                      <p className="text-[#666666]">{selectedProduct.description}</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="specifications" className="space-y-3 pt-4">
                    {selectedProduct.specifications.map((spec, idx) => (
                      <div key={idx} className="flex justify-between items-center py-3 border-b border-[#0EA0DC]/10">
                        <span className="text-[#272727]">{spec.label}</span>
                        <span className="text-[#666666]">{spec.value}</span>
                      </div>
                    ))}

                    <div className="mt-6 p-4 bg-[#0EA0DC]/5 rounded-xl border border-[#0EA0DC]/20">
                      <div className="flex items-start">
                        <FileText className="w-5 h-5 text-[#0EA0DC] mr-3 mt-0.5" />
                        <div>
                          <h5 className="text-[#272727] mb-1">Technical Sheet</h5>
                          <p className="text-sm text-[#666666] mb-2">
                            Full technical documentation available for download
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-[#0EA0DC]/30 text-[#0EA0DC] hover:bg-[#0EA0DC]/10 transition-all duration-200"
                          >
                            Download PDF
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="application" className="space-y-3 pt-4">
                    <h4 className="text-[#272727] mb-3">Application Guide</h4>
                    <ol className="space-y-3">
                      {selectedProduct.applicationGuide.map((step, idx) => (
                        <li key={idx} className="flex items-start">
                          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[#0EA0DC] text-white text-sm mr-3 flex-shrink-0">
                            {idx + 1}
                          </div>
                          <span className="text-[#666666] pt-1">{step}</span>
                        </li>
                      ))}
                    </ol>

                    <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
                      <h5 className="font-semibold text-amber-900 mb-2">⚠️ Important Notes</h5>
                      <ul className="text-sm text-amber-800 space-y-1">
                        <li>• Always test on a small area first</li>
                        <li>• Work in shaded area, not in direct sunlight</li>
                        <li>• Use only as directed in technical sheet</li>
                      </ul>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Login CTA */}
                <div className="pt-4 border-t border-[#0EA0DC]/20">
                  <div className="bg-[#0EA0DC]/5 rounded-xl p-4 text-center border border-[#0EA0DC]/20">
                    <p className="text-sm text-[#0EA0DC] mb-2">
                      🔒 Pricing and ordering available after login
                    </p>
                    <p className="text-xs text-[#666666]">
                      Contact your distributor for access credentials
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
