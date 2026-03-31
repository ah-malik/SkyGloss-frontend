import { Outlet, useNavigate, useLocation } from "react-router";
import { useEffect } from "react";
import { Toaster } from "./components/ui/sonner";
import { Navigation } from "./components/Navigation";
import { useAuth } from "./AuthContext";

export default function App() {
  const { cartCount, setShowCartSheet, logout, accessType } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Auto-redirect if user comes from WordPress about-us page
    if (document.referrer && document.referrer.includes('skygloss.com/about-us')) {
      navigate('/register/shop');
    }
    // Also redirect if they navigate to /about-us within the react app
    if (location.pathname === '/about-us' || location.pathname === '/about-us/') {
      navigate('/register/shop');
    }
  }, [location.pathname, navigate]);

  const getDashboardPath = (role: string | null) => {
    switch (role) {
      case 'certified_shop': return '/dashboard/shop';
      case 'master_partner':
      case 'regional_partner':
      case 'partner': return '/dashboard/partner';
      default: return '/';
    }
  };

  const isLoggedIn = !!accessType;

  return (
    <div className="size-full">
      <Navigation
        isLoggedIn={isLoggedIn}
        onLogout={() => {
          logout();
          navigate("/");
        }}
        onNavigateResources={() => navigate("/resources")}
        onNavigateSupport={() => navigate("/support")}
        onNavigateDashboard={() => {
          navigate(getDashboardPath(accessType));
        }}
        cartCount={cartCount}
        onCartClick={() => setShowCartSheet(true)}
        showCart={location.pathname.includes("dashboard")}
      />

      {/* Render the current page */}
      <Outlet />

      <Toaster position="bottom-right" />
    </div>
  );
}
