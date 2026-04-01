import { Outlet, useNavigate, useLocation } from "react-router";
import { useEffect } from "react";
import { Toaster } from "./components/ui/sonner";
import { Navigation } from "./components/Navigation";
import { useAuth } from "./AuthContext";
import { useChatNotifications } from "./hooks/useChatNotifications";
import { ChatWidget } from "./components/ChatWidget";

export default function App() {
  const { cartCount, setShowCartSheet, logout, accessType, user, isChatOpen, setIsChatOpen } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Activate global chat notifications for logged in users
  useChatNotifications(user?._id, user ? `${user.firstName} ${user.lastName}` : undefined);

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

      {/* Global Chat Widget */}
      {isChatOpen && (
        <ChatWidget
          userName={user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || "Guest User" : "Guest User"}
          userEmail={user?.email || "guest@skygloss.com"}
          userType={user?.role || "guest"}
          userId={user?._id}
          onClose={() => setIsChatOpen(false)}
        />
      )}

      <Toaster position="bottom-right" />
    </div>
  );
}
