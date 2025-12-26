import { Outlet, useNavigate, useLocation } from "react-router";
import { Toaster } from "./components/ui/sonner";
import { Navigation } from "./components/Navigation";
import { useAuth } from "./AuthContext";

export default function App() {
  const { cartCount, setShowCartSheet, logout, accessType } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
          navigate(`/dashboard/${accessType}`);
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
