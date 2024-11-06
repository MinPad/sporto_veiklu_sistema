import { createBrowserRouter } from "react-router-dom";
import App from './App';
import Login from "./views/Login";
import Signup from "./views/signup";
import Cities from "./views/Cities";
import Gyms from "./views/Gyms";
import GymView from "./views/GymView";
// import GuestLayout from "./components/guestLayout";

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/signup',
        element: <Signup />
    },
    {
        path: '/cities',
        element: <Cities />
    },
    {
        path: '/gyms',
        element: <Gyms />
    },
    {
        path: '/gyms/create',
        element: <GymView />
    },
    // {
    //     path: '/',
    //     element: <GuestLayout />,
    //     children: [
    //         {
    //             path: '/login',
    //             element: <Login />
    //         },
    //         {
    //             path: '/signup',
    //             element: <Signup />
    //         },
    //     ]
    // }
])

export default router;