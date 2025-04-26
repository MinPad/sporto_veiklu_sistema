import { useContext, createContext, useState, useEffect } from "react";
import axiosClient from "../axios";
import { jwtDecode } from "jwt-decode";

const StateContext = createContext({
    currentUser: {},
    userToken: null,
    userRole: null,
    toast: { message: null, show: false },
    setCurrentUser: () => { },
    setUserToken: () => { },
    showToast: () => { }
});

export const ContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState({});
    const [userToken, _setUserToken] = useState(localStorage.getItem('TOKEN') || '');
    const [userRole, setUserRole] = useState(null);
    const [toast, setToast] = useState({ message: '', show: false });

    const showToast = (message) => {
        setToast({ message, show: true });
        setTimeout(() => {
            setToast({ message: '', show: false });
        }, 5000);
    };

    const clearAuthData = () => {
        localStorage.removeItem('TOKEN');
        localStorage.removeItem('REFRESH_TOKEN');
        _setUserToken('');
        setUserRole(null);
        setCurrentUser({});
    };

    const setUserToken = (token) => {
        if (token) {
            localStorage.setItem("TOKEN", token);
            try {
                const decoded = jwtDecode(token);
                setUserRole(decoded.role || null);
            } catch (err) {
                console.error("Invalid token format:", err);
                setUserRole(null);
            }
            sessionStorage.removeItem('welcomeModalShown');
        } else {
            clearAuthData();
        }
        _setUserToken(token);
    };

    useEffect(() => {
        if (userToken && !currentUser?.id) {
            axiosClient.get('/user', {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            })
                .then(({ data }) => {
                    setCurrentUser(data.data);
                })
                .catch((err) => {
                    console.error("Failed to fetch user:", err);
                    clearAuthData();
                });
        }
    }, [userToken]);

    useEffect(() => {
        if (userToken && !userRole) {
            try {
                const decoded = jwtDecode(userToken);
                setUserRole(decoded.role || null);
            } catch {
                setUserRole(null);
            }
        }
    }, [userToken]);

    return (
        <StateContext.Provider value={{
            currentUser,
            setCurrentUser,
            userToken,
            setUserToken,
            userRole,
            toast,
            showToast
        }}>
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);