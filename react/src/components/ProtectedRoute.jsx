// import { Navigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";
// import UnauthorizedModal from "./UnauthorizedModal";

// const ProtectedRoute = ({ requiredRole, redirectTo = "/UnauthorizedPage", children }) => {
//     const token = localStorage.getItem('TOKEN');

//     if (!token) {
//         // Redirect to login if no token exists
//         return <Navigate to="/login" replace />;
//     }

//     try {
//         const decodedToken = jwtDecode(token);
//         const userRole = decodedToken.role;

//         if (requiredRole && userRole !== requiredRole) {
//             return <Navigate to={redirectTo} replace />;
//         }
//     } catch (error) {
//         console.error("Invalid token:", error);
//         return <Navigate to="/login" replace />;
//     }

//     // Render the protected page if checks pass
//     return children;
// };

// export default ProtectedRoute;


import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ requiredRole, children }) => {
    const [redirectToHome, setRedirectToHome] = useState(false);
    const token = localStorage.getItem("TOKEN");

    useEffect(() => {
        if (!token) {
            setRedirectToHome(true);
            return;
        }

        try {
            const decodedToken = jwtDecode(token);
            const userRole = decodedToken.role;

            if (requiredRole && userRole !== requiredRole) {
                setRedirectToHome(true);
            }
        } catch (error) {
            console.error("Invalid token:", error);
            setRedirectToHome(true);
        }
    }, [token, requiredRole]);

    if (redirectToHome) {
        return (
            <Navigate
                to="/"
                state={{ showUnauthorizedModal: true }}
                replace
            />
        );
    }

    return children;
};

export default ProtectedRoute;
