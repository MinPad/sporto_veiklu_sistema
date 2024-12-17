import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ requiredRole, redirectTo = "/UnauthorizedPage", children }) => {
    const token = localStorage.getItem('TOKEN');

    if (!token) {
        // Redirect to login if no token exists
        return <Navigate to="/login" replace />;
    }

    try {
        const decodedToken = jwtDecode(token);
        const userRole = decodedToken.role;

        if (requiredRole && userRole !== requiredRole) {
            return <Navigate to={redirectTo} replace />;
        }
    } catch (error) {
        console.error("Invalid token:", error);
        return <Navigate to="/login" replace />;
    }

    // Render the protected page if checks pass
    return children;
};

export default ProtectedRoute;
