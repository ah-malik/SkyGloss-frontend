import { createBrowserRouter } from "react-router";
import App from "./App";

import { LandingPage } from "./components/LandingPage";
import { ShopLogin } from "./components/ShopLogin";
import { DistributorLogin } from "./components/DistributorLogin";
import { DistributorRegistration } from "./components/DistributorRegistration";

import { ShopDashboard } from "./components/ShopDashboard";
import { DistributorDashboard } from "./components/DistributorDashboard";

import { ResourcesPage } from "./components/ResourcesPage";
import { SupportPage } from "./components/SupportPage";
import { ThankYouPage } from "./components/ThankYouPage";
import { ReceiptPage } from "./components/ReceiptPage";
import { ResetPassword } from "./components/ResetPassword";
import { PublicRoute, ProtectedRoute } from "./components/AuthRoutes";

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
          { path: "login/distributor", element: <DistributorLogin /> },
          { path: "register/distributor", element: <DistributorRegistration /> },
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
        element: <ProtectedRoute allowedRole={["master_distributor", "regional_distributor"]} />,
        children: [
          { path: "dashboard/distributor", element: <DistributorDashboard /> },
          { path: "dashboard/distributor/:section", element: <DistributorDashboard /> },
          { path: "dashboard/distributor/courses/:courseId", element: <DistributorDashboard /> },
        ]
      },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "resources", element: <ResourcesPage /> },
          { path: "support", element: <SupportPage /> },
          { path: "thank-you/:type", element: <ThankYouPage /> },
        ]
      },
    ],
  },
]);
