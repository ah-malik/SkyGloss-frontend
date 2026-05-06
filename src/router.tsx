import { createBrowserRouter } from "react-router";
import App from "./App";

import { LandingPage } from "./components/LandingPage";
import { ShopLogin } from "./components/ShopLogin";
import { PartnerLogin } from "./components/PartnerLogin";
import { ShopRegistration } from "./components/ShopRegistration";

import { ShopDashboard } from "./components/ShopDashboard";
import { PartnerDashboard } from "./components/PartnerDashboard";

import { ResourcesPage } from "./components/ResourcesPage";
import { SupportPage } from "./components/SupportPage";
import { ThankYouPage } from "./components/ThankYouPage";
import { ReceiptPage } from "./components/ReceiptPage";
import { ResetPassword } from "./components/ResetPassword";
import { LiveChatPage } from "./components/LiveChatPage";
import { PublicRoute, ProtectedRoute } from "./components/AuthRoutes";
import { UserProfile } from "./components/UserProfile";
import { ActivitiesPage } from "./components/ActivitiesPage";

import MapWidget from "./components/MapWidget";

export const router = createBrowserRouter([
  {
    path: "/",
    errorElement: (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold text-red-600">Something went wrong</h1>
        <p className="mt-2 text-slate-600">Please try refreshing the page or contact support.</p>
        <button 
          onClick={() => window.location.href = "/"}
          className="mt-4 px-4 py-2 bg-[#0EA0DC] text-white rounded-lg"
        >
          Go to Home
        </button>
      </div>
    ),
    children: [
      // Standalone map widget (no App layout)
      {
        path: "map-widget",
        element: (
          <div style={{ width: "100vw", height: "100vh", margin: 0, padding: 0 }}>
            <MapWidget />
          </div>
        ),
      },
      // Main App with Navigation and Auth
      {
        path: "",
        element: <App />,
        children: [
          { index: true, element: <LandingPage /> },

          // Login Pages
          {
            element: <PublicRoute />,
            children: [
              { path: "login/shop", element: <ShopLogin /> },
              { path: "login/partner", element: <PartnerLogin /> },
              { path: "register/shop", element: <ShopRegistration /> },
              { path: "reset-password", element: <ResetPassword /> },
            ]
          },

          // Dashboard Pages
          {
            element: <ProtectedRoute allowedRole="certified_shop" />,
            children: [
              { path: "dashboard/shop", element: <ShopDashboard /> },
              { path: "dashboard/shop/:productId", element: <ShopDashboard /> },
              { path: "dashboard/shop/courses", element: <ShopDashboard /> },
              { path: "dashboard/shop/courses/:courseId", element: <ShopDashboard /> },
              { path: "dashboard/shop/receipt/:orderId", element: <ReceiptPage /> },
            ]
          },
          {
            element: <ProtectedRoute allowedRole={["master_partner", "regional_partner", "partner"]} />,
            children: [
              { path: "dashboard/partner", element: <PartnerDashboard /> },
              { path: "dashboard/partner/:section", element: <PartnerDashboard /> },
              { path: "dashboard/partner/courses/:courseId", element: <PartnerDashboard /> },
            ]
          },
          {
            element: <ProtectedRoute />,
            children: [
              { path: "resources", element: <ResourcesPage /> },
              { path: "support", element: <SupportPage /> },
              { path: "thank-you/:type", element: <ThankYouPage /> },
              { path: "profile", element: <UserProfile /> },
              { path: "activities", element: <ActivitiesPage /> },
              { path: "live-chat", element: <LiveChatPage /> },
            ]
          },
          // Catch-all inside App (shows Nav)
          { path: "*", element: <LandingPage /> }
        ],
      },
    ],
  },
]);


