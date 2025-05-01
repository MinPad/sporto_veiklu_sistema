import { Navigate, useLocation } from "react-router-dom";
import { useStateContext } from "../contexts/ContexProvider";

const ProtectedRoute = ({ requiredRole, children }) => {
    const { userToken, userRole } = useStateContext();
    const location = useLocation();

    if (!userToken) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ fromProtected: true, from: location.pathname }}
            />
        );
    }

    if (requiredRole && userRole !== requiredRole) {
        return <Navigate to="/UnauthorizedPage" replace />;
    }

    return children;
};

export default ProtectedRoute;
