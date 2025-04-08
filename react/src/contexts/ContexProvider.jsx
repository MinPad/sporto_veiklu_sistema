import { useContext, createContext, useState } from "react";
import lorem from '../assets/lorem.png';
import react from '../assets/react.png';
import laravel from '../assets/laravel.png';

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

    // const [surveys, setSurveys] = useState(tmpSurveys)

    // const setUserToken = (token) => {
    //     if (token) {
    //         console.log('Setting userToken:', token);

    //         localStorage.setItem('TOKEN', token)
    //     } else {
    //         console.log('SettiremoveItemn userToken:', token);

    //         localStorage.removeItem('TOKEN')
    //     }
    //     console.log('wtf userToken:', token);

    //     _setUserToken(token);
    // }
    const setUserToken = (token) => {
        if (token) {
            // console.log("Setting userToken:", token);
            localStorage.setItem("TOKEN", token);
        } else {
            // console.log("Removing userToken");
            localStorage.removeItem("TOKEN");
            localStorage.removeItem("REFRESH_TOKEN");
        }
        _setUserToken(token);
        // console.log('UserToken after setUserToken:', token); // Debugging line
    };


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
            // surveys,
            toast,
            showToast
        }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext)