import { createBrowserRouter } from "react-router";
import App from "./App";

import { LandingPage } from "./components/LandingPage";
import { TechnicianLogin } from "./components/TechnicianLogin";
import { ShopLogin } from "./components/ShopLogin";
import { DistributorLogin } from "./components/DistributorLogin";

import { TechnicianDashboard } from "./components/TechnicianDashboard";
import { ShopDashboard } from "./components/ShopDashboard";
import { DistributorDashboard } from "./components/DistributorDashboard";

import { ResourcesPage } from "./components/ResourcesPage";
import { SupportPage } from "./components/SupportPage";
import { ThankYouPage } from "./components/ThankYouPage";
import { ReceiptPage } from "./components/ReceiptPage";
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
          { path: "login/technician", element: <TechnicianLogin /> },
          { path: "login/shop", element: <ShopLogin /> },
          { path: "login/distributor", element: <DistributorLogin /> },
        ]
      },

      // Dashboard Pages (Protected from non-logged-in users)
      {
        element: <ProtectedRoute />,
        children: [
          { path: "dashboard/technician", element: <TechnicianDashboard /> },
          { path: "dashboard/shop", element: <ShopDashboard /> },
          { path: "dashboard/shop/:productId", element: <ShopDashboard /> },
          { path: "dashboard/distributor", element: <DistributorDashboard /> },
          { path: "resources", element: <ResourcesPage /> },
          { path: "support", element: <SupportPage /> },
          { path: "dashboard/shop/receipt/:orderId", element: <ReceiptPage /> },
          { path: "thank-you/:type", element: <ThankYouPage /> },
        ]
      },
    ],
  },
]);
