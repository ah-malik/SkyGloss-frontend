import { Outlet, useNavigate, useLocation } from "react-router";
import { Toaster } from "./components/ui/sonner";
import { Navigation } from "./components/Navigation";
import { useAuth } from "./AuthContext";

export default function App() {
  const { cartCount, showCartSheet, setShowCartSheet } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn =
    location.pathname.includes("dashboard") ||
    location.pathname.includes("resources") ||
    location.pathname.includes("support") ||
    location.pathname.includes("thank-you");

  return (
    <div className="size-full">
      <Navigation
        isLoggedIn={isLoggedIn}
        onLogout={() => navigate("/")}
        onNavigateResources={() => navigate("/resources")}
        onNavigateSupport={() => navigate("/support")}
        onNavigateDashboard={() => {
          const role = localStorage.getItem("role") || "technician";
          navigate(`/dashboard/${role}`);
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
