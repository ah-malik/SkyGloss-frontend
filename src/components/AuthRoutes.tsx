import { Navigate, Outlet } from "react-router";
import { useAuth } from "../AuthContext";

const getDashboardType = (role: string | null) => {
    if (!role) return "";
    if (role === 'certified_shop') return 'shop';
    if (role === 'master_distributor' || role === 'regional_distributor') return 'distributor';
    return role;
};

/**
 * PublicRoute redirects logged-in users away from auth pages (Login, Sign Up)
 * to their respective dashboards.
 */
export function PublicRoute() {
    const { accessType } = useAuth();

    if (accessType) {
        return <Navigate to={`/dashboard/${getDashboardType(accessType)}`} replace />;
    }

    return <Outlet />;
}

/**
 * ProtectedRoute ensures that only authenticated users can access internal pages.
 * If not logged in, it redirects to the landing page.
 */
interface ProtectedRouteProps {
    allowedRole?: string | string[];
}

export function ProtectedRoute({ allowedRole }: ProtectedRouteProps) {
    const { accessType } = useAuth();

    if (!accessType) {
        return <Navigate to="/" replace />;
    }

    if (allowedRole) {
        const isAllowed = Array.isArray(allowedRole)
            ? allowedRole.includes(accessType)
            : accessType === allowedRole;

        if (!isAllowed) {
            // Redirect to their appropriate dashboard if they try to access a route for another role
            return <Navigate to={`/dashboard/${getDashboardType(accessType)}`} replace />;
        }
    }

    return <Outlet />;
}
