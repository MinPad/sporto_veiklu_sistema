import { useContext, createContext, useState } from "react";
import lorem from '../assets/lorem.png';
import react from '../assets/react.png';
import laravel from '../assets/laravel.png';
import { useEffect } from "react";
import axiosClient from "../axios";
import { jwtDecode } from "jwt-decode";
const StateContext = createContext({
    currentUser: {},
    userToken: null,
    // surveys: [],
    toast: {
        message: null,
        show: false,
    },
    setCurrentUser: () => { },
    setUserToken: () => { }
})

export const ContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState({})
    const [userToken, _setUserToken] = useState(localStorage.getItem('TOKEN') || '');
    const [toast, setToast] = useState({ message: '', show: false })
    const [userRole, setUserRole] = useState(null);
    // const [surveys, setSurveys] = useState(tmpSurveys)
    useEffect(() => {
        if (userToken && !currentUser?.id) {
            axiosClient.get('/user')
                .then(({ data }) => setCurrentUser(data.data))
                .catch((err) => {
                    setCurrentUser({});
                    setUserLoadError("Failed to load user data.");
                    showToast("Oops! Could not load your profile. Please try again.");
                });
        }
    }, [userToken]);
    const setUserToken = (token) => {
        if (token) {
            localStorage.setItem("TOKEN", token);
            try {
                const decoded = jwtDecode(token);
                setUserRole(decoded.role || null);
            } catch (err) {
                console.error("Invalid token format", err);
                setUserRole(null);
            }
            sessionStorage.removeItem('welcomeModalShown');

        } else {
            localStorage.removeItem("TOKEN");
            localStorage.removeItem("REFRESH_TOKEN");
            setUserRole(null);
        }
        _setUserToken(token);
    };
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
    // console.log("Decoded Token:", jwtDecode(userToken));

    const showToast = (message) => {
        setToast({ message, show: true })
        setTimeout(() => {
            setToast({ message: '', show: false })
        }, 5000)
    }
    // console.log("currentUser", currentUser);

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
    )
}

export const useStateContext = () => useContext(StateContext)