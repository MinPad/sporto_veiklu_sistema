// src/utils/TokenGate.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function TokenGate() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("TOKEN");
        const refreshToken = localStorage.getItem("REFRESH_TOKEN");

        try {
            if (!token || !refreshToken) throw new Error();

            const decoded = jwtDecode(token);
            const decodedRefresh = jwtDecode(refreshToken);
            const now = Date.now() / 1000;

            if (decoded.exp < now || decodedRefresh.exp < now) {
                throw new Error("expired");
            }
        } catch {
            localStorage.removeItem("TOKEN");
            localStorage.removeItem("REFRESH_TOKEN");
            navigate("/login");
        }
    }, []);

    return null;
}