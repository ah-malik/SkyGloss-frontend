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

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <LandingPage /> },

      // Login Pages
      { path: "login/technician", element: <TechnicianLogin /> },
      { path: "login/shop", element: <ShopLogin /> },
      { path: "login/distributor", element: <DistributorLogin /> },

      // Dashboard Pages
      { path: "dashboard/technician", element: <TechnicianDashboard /> },
      { path: "dashboard/shop", element: <ShopDashboard /> },
      { path: "dashboard/distributor", element: <DistributorDashboard /> },

      // Other Pages
      { path: "resources", element: <ResourcesPage /> },
      { path: "support", element: <SupportPage /> },

      // Thank You
      { path: "thank-you/:type", element: <ThankYouPage /> },
    ],
  },
]);
