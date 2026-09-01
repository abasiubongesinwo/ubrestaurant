import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children, allowedRoles = [], adminOnly = false }) => {
	const { isAuthenticated, isAdmin, user, loading } = useAuth();
	const location = useLocation();
	const userRole = String(user?.role || "")
		.trim()
		.toLowerCase();
	const normalizedAllowedRoles = allowedRoles.map((role) =>
		String(role).trim().toLowerCase(),
	);
	const isManagementUser = ["admin", "superadmin"].includes(userRole);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="animate-spin rounded-full h-14 w-14 border-4 border-amber-200 border-t-amber-600" />
			</div>
		);
	}

	if (!isAuthenticated) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	if (adminOnly && !isAdmin) {
		return <Navigate to="/" replace />;
	}

	if (normalizedAllowedRoles.length > 0) {
		const hasRequiredRole = normalizedAllowedRoles.includes(userRole);

		if (!hasRequiredRole) {
			if (isManagementUser) {
				return <Navigate to="/admin/dashboard" replace />;
			}

			return <Navigate to="/" replace />;
		}
	}

	return children;
};

export default ProtectedRoute;
