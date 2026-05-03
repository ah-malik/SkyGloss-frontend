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

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <LandingPage /> },

      // Login Pages (Protected from logged-in users)
      {
        element: <PublicRoute />,
        children: [
          { path: "login/shop", element: <ShopLogin /> },
          { path: "login/partner", element: <PartnerLogin /> },
          { path: "register/shop", element: <ShopRegistration /> },
          { path: "reset-password", element: <ResetPassword /> },
        ]
      },

      // Dashboard Pages (Protected from non-logged-in users)
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
    ],
  },
]);
