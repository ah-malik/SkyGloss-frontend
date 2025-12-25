import { motion } from "motion/react";
import { useEffect } from "react";
import { Card } from "./ui/card";
import { Footer } from "./Footer";
import { PublicCatalog } from "./PublicCatalog";
import { DistributorIcon, ShopIcon } from "./CustomIcons";
import { useNavigate } from "react-router";

interface LandingPageProps {}

type AccessType = "shop" | "distributor";

interface AccessTypeItem {
  id: AccessType;
  title: string;
  badge?: string;
  description?: string;
  IconComponent: React.ComponentType<{ className?: string }>;
}

export function LandingPage(_: LandingPageProps) {
  const navigate = useNavigate();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSelectAccessType = (type: AccessType) => {
    // Save role for later use in dashboard
    localStorage.setItem("role", type);
    navigate(`/login/${type}`);
  };

  const scrollToCatalog = () => {
    const catalogElement = document.getElementById("product-catalog");
    catalogElement?.scrollIntoView({ behavior: "smooth" });
  };

  const accessTypes: AccessTypeItem[] = [
    {
      id: "distributor",
      title: "Distributor Login",
      IconComponent: DistributorIcon,
    },
    {
      id: "shop",
      title: "Certified Shop Login",
      IconComponent: ShopIcon,
    },
  ];

  return (
    <div className="min-h-screen geometric-bg">
      {/* Public Catalog Section */}
      <div id="product-catalog" className="pt-16 sm:pt-20">
        <PublicCatalog />
      </div>

      {/* Partner Login Section */}
      <div
        id="partner-login"
        className="min-h-screen flex items-center justify-center p-4 sm:p-6 py-16 sm:py-24"
      >
        <div className="w-full max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl text-[#272727] mb-3 sm:mb-4 px-4">
              Partner Portal Access
            </h1>
            <p className="text-base sm:text-lg text-[#666666] max-w-2xl mx-auto px-4">
              Select your access type to continue.
            </p>
          </motion.div>

          {/* Access Type Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {accessTypes.map((type, index) => (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                <Card
                  onClick={() => handleSelectAccessType(type.id)}
                  className="relative overflow-hidden cursor-pointer p-0 rounded-2xl sm:rounded-3xl group bg-white border-2 border-[#0EA0DC]/10 hover:border-[#0EA0DC]/30 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(14,160,220,0.2)] hover:-translate-y-1 sm:hover:-translate-y-2"
                >
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0EA0DC]/0 via-[#0EA0DC]/0 to-[#0EA0DC]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative p-6 sm:p-8">
                    {/* Icon */}
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#0EA0DC] to-[#0EA0DC]/80 flex items-center justify-center mb-4 sm:mb-6 group-hover:shadow-[0_0_30px_rgba(14,160,220,0.5)] transition-all duration-300"
                    >
                      <type.IconComponent className="text-white" />
                    </motion.div>

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl text-[#272727] mb-2 sm:mb-3 group-hover:text-[#0EA0DC] transition-colors duration-300">
                      {type.title}
                    </h3>

                    {/* Action */}
                    <div className="flex items-center justify-between pt-4 border-t border-[#0EA0DC]/10">
                      <span className="text-[#0EA0DC] group-hover:translate-x-1 transition-transform duration-300">
                        Access Portal
                      </span>
                      <motion.div
                        className="w-8 h-8 rounded-full bg-[#0EA0DC]/10 flex items-center justify-center group-hover:bg-[#0EA0DC] transition-all duration-300"
                        whileHover={{ scale: 1.1 }}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          className="text-[#0EA0DC] group-hover:text-white transition-colors duration-300"
                        >
                          <path
                            d="M3 8h10M9 4l4 4-4 4"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </motion.div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Support info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center mt-8 text-sm text-[#666666]"
          >
            <p>Need help? Contact support@skygloss.com</p>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
