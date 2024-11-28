import { createBrowserRouter } from "react-router-dom";
import App from './App';
import Login from "./views/Login";
import Signup from "./views/signup";
import Cities from "./views/Cities";
import Gyms from "./views/Gyms";
import GymView from "./views/GymView";
import GymUpdate from "./views/GymUpdate";
import CityCreateView from "./views/CityCreateView";
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
    // -------------------------------
    {
        path: '/cities',
        element: <Cities />
    },
    {
        path: '/cities/create',
        element: <CityCreateView />
    },
    // -----------------------------
    {
        path: '/gyms',
        element: <Gyms />
    },
    {
        path: '/cities/:cityId/gyms', // Dynamic route for gyms by city
        element: <Gyms />
    },
    {
        path: '/cities/:cityId/gyms/create', // Dynamic route for creating gyms in a city
        element: <GymView />
    },
    {
        path: '/cities/:cityId/gyms/:gymId/update', // Dynamic route for creating gyms in a city
        element: <GymUpdate />
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