import { Navigate, Outlet } from "react-router";
import { useAuth } from "../AuthContext";

/**
 * PublicRoute redirects logged-in users away from auth pages (Login, Sign Up)
 * to their respective dashboards.
 */
export function PublicRoute() {
    const { accessType } = useAuth();

    if (accessType) {
        return <Navigate to={`/dashboard/${accessType}`} replace />;
    }

    return <Outlet />;
}

/**
 * ProtectedRoute ensures that only authenticated users can access internal pages.
 * If not logged in, it redirects to the landing page.
 */
export function ProtectedRoute() {
    const { accessType } = useAuth();

    if (!accessType) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
