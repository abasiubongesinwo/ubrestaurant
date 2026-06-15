// import { useLocation, Navigate } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";

// const ProtectedRoute = ({ children, requireAdmin = false }) => {
// 	const { isAuthenticated, isAdmin } = useAuth();
// 	const location = useLocation();

// 	if (!isAuthenticated) {
// 		return <Navigate to="/login" state={{ from: location }} replace />;
// 	}

// 	if (requireAdmin && !isAdmin) {
// 		return <Navigate to="/" replace />;
// 	}

// 	return children;
// };

// export default ProtectedRoute;

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
	const { isAuthenticated, isAdmin } = useAuth();
	const location = useLocation();

	if (!isAuthenticated) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	if (requireAdmin && !isAdmin) {
		return <Navigate to="/" replace />;
	}

	return children;
};

export default ProtectedRoute;
