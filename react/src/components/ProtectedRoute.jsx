import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ requiredRole, children }) => {
    const token = localStorage.getItem("TOKEN");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    try {
        const decodedToken = jwtDecode(token);
        const userRole = decodedToken.role;

        if (requiredRole && userRole !== requiredRole) {
            return <Navigate to="/UnauthorizedPage" replace />;
        }
    } catch (error) {
        console.error("Invalid token:", error);
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
