import { motion } from "motion/react";
import { LogOut, FileText, HelpCircle, Menu, X, ShoppingCart, ShoppingBag, Wrench, Package } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useState } from "react";
import logoImage from "../assets/logo.svg";
import { useAuth } from "../AuthContext";

interface NavigationProps {
  isLoggedIn: boolean;
  onLogout?: () => void;
  onNavigateResources?: () => void;
  onNavigateSupport?: () => void;
  onNavigateDashboard?: () => void;
  cartCount?: number;
  onCartClick?: () => void;
  showCart?: boolean;
}

export function Navigation({
  isLoggedIn,
  onLogout,
  onNavigateResources,
  onNavigateSupport,
  onNavigateDashboard,
  cartCount = 0,
  onCartClick,
  showCart = false
}: NavigationProps) {
  const { accessType } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getRoleInfo = () => {
    switch (accessType) {
      case "shop":
        return { label: "Shop", Icon: ShoppingBag };
      case "technician":
        return { label: "Technician", Icon: Wrench };
      case "distributor":
        return { label: "Distributor", Icon: Package };
      default:
        return { label: "Dashboard", Icon: Package };
    }
  };

  const roleInfo = getRoleInfo();

  const handleNavClick = (action?: () => void) => {
    if (action) action();
    setMobileMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-sm border-b border-[#0EA0DC]/20 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.button
            onClick={isLoggedIn ? onNavigateDashboard : undefined}
            className={`flex items-center space-x-2 sm:space-x-3 ${isLoggedIn ? 'cursor-pointer' : 'cursor-default'}`}
            whileHover={isLoggedIn ? { scale: 1.02 } : { scale: 1.01 }}
            transition={{ duration: 0.2 }}
            disabled={!isLoggedIn}
          >
            <img
              src={logoImage}
              alt="SkyGloss"
              style={{ maxWidth: "130px" }}
              className="h-7 sm:h-8 w-auto"
            />
            <div className="hidden sm:block h-8 w-px bg-[#0EA0DC]/20"></div>
            <div className="hidden sm:block">
              <p className="text-xs text-[#666666]">Partner Portal</p>
            </div>
          </motion.button>

          {/* Desktop Navigation */}
          {isLoggedIn && (
            <>
              <div className="hidden md:flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onNavigateDashboard}
                  className="text-[#0EA0DC] font-semibold hover:bg-[#0EA0DC]/5 transition-all duration-200"
                >
                  <roleInfo.Icon className="w-4 h-4 mr-2" />
                  {roleInfo.label}
                </Button>
                {showCart && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onCartClick}
                    className="text-[#666666] hover:text-[#0EA0DC] hover:bg-[#0EA0DC]/5 transition-all duration-200 relative"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Cart
                    {cartCount > 0 && (
                      <Badge className="ml-2 bg-[#0EA0DC] text-white px-2 py-0.5 text-xs">
                        {cartCount}
                      </Badge>
                    )}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onNavigateResources}
                  className="text-[#666666] hover:text-[#0EA0DC] hover:bg-[#0EA0DC]/5 transition-all duration-200"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Resources
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onNavigateSupport}
                  className="text-[#666666] hover:text-[#0EA0DC] hover:bg-[#0EA0DC]/5 transition-all duration-200"
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Support
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLogout}
                  className="text-[#666666] hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>

              {/* Mobile Right Section - Cart + Menu */}
              <div className="md:hidden flex items-center gap-2">
                {/* Cart Button (Mobile) */}
                {showCart && (
                  <button
                    onClick={onCartClick}
                    className="relative p-2 rounded-lg hover:bg-[#0EA0DC]/5 transition-colors"
                  >
                    <ShoppingCart className="w-6 h-6 text-[#272727]" />
                    {cartCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 bg-[#0EA0DC] text-white px-1.5 py-0 min-w-[20px] h-5 flex items-center justify-center text-xs rounded-full">
                        {cartCount}
                      </Badge>
                    )}
                  </button>
                )}

                {/* Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-lg hover:bg-[#0EA0DC]/5 transition-colors"
                >
                  {mobileMenuOpen ? (
                    <X className="w-6 h-6 text-[#272727]" />
                  ) : (
                    <Menu className="w-6 h-6 text-[#272727]" />
                  )}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        {isLoggedIn && mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden py-4 border-t border-[#0EA0DC]/20"
          >
            <div className="flex flex-col space-y-2">
              <Button
                variant="ghost"
                onClick={() => handleNavClick(onNavigateDashboard)}
                className="justify-start text-[#0EA0DC] font-semibold hover:bg-[#0EA0DC]/5"
              >
                <roleInfo.Icon className="w-4 h-4 mr-3" />
                {roleInfo.label}
              </Button>
              <Button
                variant="ghost"
                onClick={() => handleNavClick(onNavigateResources)}
                className="justify-start text-[#666666] hover:text-[#0EA0DC] hover:bg-[#0EA0DC]/5"
              >
                <FileText className="w-4 h-4 mr-3" />
                Resources
              </Button>
              <Button
                variant="ghost"
                onClick={() => handleNavClick(onNavigateSupport)}
                className="justify-start text-[#666666] hover:text-[#0EA0DC] hover:bg-[#0EA0DC]/5"
              >
                <HelpCircle className="w-4 h-4 mr-3" />
                Support
              </Button>
              <Button
                variant="ghost"
                onClick={() => handleNavClick(onLogout)}
                className="justify-start text-[#666666] hover:text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Logout
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
