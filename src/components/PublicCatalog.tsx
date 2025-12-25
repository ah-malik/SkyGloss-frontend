import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { FileText, Droplets, Shield, Sparkles, X, ChevronLeft, ChevronRight } from "lucide-react";
import fusionMainImage from "../assets/600x400.svg";
import fusionElementImage from "../assets/600x400.svg";
import fusionAetherImage from "../assets/600x400.svg";
import resinFilmImage from "../assets/600x400.svg";
import matteBoxImage from "../assets/600x400.svg";
import shineBoxImage from "../assets/600x400.svg";
import edgeBladeBox1Image from "../assets/600x400.svg";
import edgeBladeBox2Image from "../assets/600x400.svg";

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  additionalImages?: string[];
  features: string[];
  specifications: {
    label: string;
    value: string;
  }[];
  applicationGuide: string[];
  technicalSheet: string;
}

const products: Product[] = [
  {
    id: "1",
    name: "FUSION",
    description: "Complete dual-layer coating system combining Element base coat and Aether top coat. Professional-grade formula delivering unmatched durability, gloss enhancement, and protection.",
    image: fusionMainImage,
    additionalImages: [fusionElementImage, fusionAetherImage],
    features: [
      "Dual-layer hybrid coating system",
      "Element: Clear coat with polymer protection",
      "Aether: Advanced silica top coat",
      "Superior gloss enhancement",
      "Hydrophobic water beading",
      "Self-cleaning effect",
      "UV and chemical resistance",
      "24-month durability"
    ],
    specifications: [
      { label: "System", value: "Element (Base) + Aether (Top)" },
      { label: "Volume", value: "Element: 100ml / 250ml / 500ml | Aether: 100ml / 250ml" },
      { label: "Coverage", value: "2-4 vehicles per 100ml set" },
      { label: "Total Cure Time", value: "10 hours (4hrs Element + 6hrs Aether)" },
      { label: "Application Temp", value: "15-25°C" }
    ],
    applicationGuide: [
      "Step 1: Clean and decontaminate surface thoroughly",
      "Step 2: Apply Element base coat in thin, even layer",
      "Step 3: Work in 2x2 ft sections, level after 2-3 minutes",
      "Step 4: Allow Element to cure for 4 hours",
      "Step 5: Apply Aether top coat in ultra-thin layer",
      "Step 6: Level Aether after 1-2 minutes",
      "Step 7: Allow minimum 6 hours cure time before water exposure"
    ],
    technicalSheet: "fusion-system-tech.pdf"
  },
  {
    id: "3",
    name: "RESIN FILM",
    description: "Advanced resin & film coating technology providing superior protection and durability. Combines liquid film with resin formula for enhanced performance.",
    image: resinFilmImage,
    features: [
      "Resin & film technology",
      "Enhanced durability",
      "Superior chemical resistance",
      "Self-healing properties",
      "24-month protection"
    ],
    specifications: [
      { label: "Volume", value: "60ml" },
      { label: "Coverage", value: "2-3 vehicles" },
      { label: "Cure Time", value: "24 hours" },
      { label: "Application Temp", value: "18-25°C" }
    ],
    applicationGuide: [
      "Prepare surface with polish",
      "Clean with isopropyl alcohol",
      "Apply ultra-thin layer with foam applicator",
      "Work in 2x2 ft sections",
      "Level coating after 1-2 minutes",
      "Allow 24 hours cure before water exposure"
    ],
    technicalSheet: "resin-film-tech.pdf"
  },
  {
    id: "5",
    name: "MATTE",
    description: "Premium matte finish clear coating for professional results. Creates a sophisticated, non-reflective surface with long-term protection.",
    image: matteBoxImage,
    features: [
      "Professional matte finish",
      "Clear coat protection",
      "Anti-fingerprint formula",
      "Easy maintenance",
      "24-month durability"
    ],
    specifications: [
      { label: "Volume", value: "30ml (1.01 fl oz)" },
      { label: "Coverage", value: "1-2 vehicles" },
      { label: "Cure Time", value: "24 hours" },
      { label: "Application Temp", value: "15-25°C" }
    ],
    applicationGuide: [
      "Wash and decontaminate surface completely",
      "Ensure surface is bone dry",
      "Apply thin layer with foam applicator",
      "Work in 2x2 ft sections",
      "Level coating after 1-2 minutes",
      "Allow 24 hours cure time before exposure to water"
    ],
    technicalSheet: "matte-tech.pdf"
  },
  {
    id: "6",
    name: "SHINE",
    description: "Professional shine enhancer coating delivering exceptional gloss and depth. Perfect for achieving showroom-quality finish on all paint types.",
    image: shineBoxImage,
    features: [
      "Ultimate gloss enhancement",
      "Deep wet-look shine",
      "Easy application",
      "Quick cure time",
      "6-month durability"
    ],
    specifications: [
      { label: "Volume", value: "30ml (1.01 fl oz)" },
      { label: "Coverage", value: "2-3 vehicles" },
      { label: "Cure Time", value: "1 hour" },
      { label: "Application Temp", value: "15-30°C" }
    ],
    applicationGuide: [
      "Wash and dry vehicle thoroughly",
      "Apply to clean paint surface",
      "Work in small sections",
      "Spread evenly with microfiber applicator",
      "Buff to brilliant shine after 30 seconds",
      "Can be layered for increased depth"
    ],
    technicalSheet: "shine-tech.pdf"
  },
  {
    id: "8",
    name: "EDGE BLADE",
    description: "Professional tungsten carbide blade designed for precise clear coating application and leveling. Essential tool for achieving flawless coating results.",
    image: edgeBladeBox1Image,
    additionalImages: [edgeBladeBox2Image],
    features: [
      "Tungsten carbide construction",
      "Ultra-precise edge",
      "Chemical resistant",
      "Ergonomic design",
      "Reusable and durable"
    ],
    specifications: [
      { label: "Material", value: "Tungsten Carbide" },
      { label: "Edge Type", value: "Ultra-fine precision" },
      { label: "Compatibility", value: "All clear coatings" },
      { label: "Durability", value: "Long-lasting performance" }
    ],
    applicationGuide: [
      "Use for leveling clear coating during application",
      "Hold at 45-degree angle to surface",
      "Work in smooth, consistent strokes",
      "Clean blade frequently during use",
      "Rinse thoroughly after each application",
      "Store in protective case when not in use"
    ],
    technicalSheet: "edge-blade-tech.pdf"
  }
];

export function PublicCatalog() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

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
                      key={product.id}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Card className="skygloss-card overflow-hidden rounded-2xl h-full flex flex-col bg-white">
                        {/* Product Image */}
                        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-white p-4">
                          <ImageWithFallback
                            src={product.image}
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
                {selectedProduct.id === "1" && selectedProduct.additionalImages ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="aspect-video rounded-xl overflow-hidden">
                      <ImageWithFallback
                        src={selectedProduct.image}
                        alt="FUSION Element"
                        className="w-full h-full object-cover"
                      />
                      <p className="text-center text-sm text-[#0EA0DC] mt-2">Element (Base Coat)</p>
                    </div>
                    <div className="aspect-video rounded-xl overflow-hidden">
                      <ImageWithFallback
                        src={selectedProduct.additionalImages[0]}
                        alt="FUSION Aether"
                        className="w-full h-full object-cover"
                      />
                      <p className="text-center text-sm text-[#0EA0DC] mt-2">Aether (Top Coat)</p>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video rounded-xl overflow-hidden">
                    <ImageWithFallback
                      src={selectedProduct.image}
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
