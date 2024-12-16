import { createBrowserRouter } from "react-router-dom";
import App from './App';
import Login from "./views/Login";
import Signup from "./views/signup";
import Cities from "./views/Cities";
import Users from "./views/Users";
import UserProfile from "./views/Profile";
import Gyms from "./views/Gyms";
import Coaches from "./views/Coaches";
import CoachView from "./views/CoachView";
import GymView from "./views/GymView";
import GymUpdate from "./views/GymUpdate";
import CoachUpdate from "./views/CoachUpdate";
import CityCreateView from "./views/CityCreateView";
import CoachCreateView from "./views/CoachCreateView";
// import GuestLayout from "./components/guestLayout";
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';

const router = createBrowserRouter([
    {
        path: '/forgot-password',
        element: <ForgotPassword />
    },
    {
        path: '/reset-password',
        element: <ResetPassword />
    },

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
        path: '/cities/:cityId/gyms',
        element: <Gyms />
    },
    {
        path: '/cities/:cityId/gyms/create',
        element: <GymView />
    },
    {
        path: '/cities/:cityId/gyms/:gymId/update',
        element: <GymUpdate />
    },
    // -----------------------------
    {
        path: '/users',
        element: <Users />
    },
    {
        path: '/user/:userId/profile',
        element: <UserProfile />
    },
    // -----------------------------
    {
        path: '/cities/:cityId/gyms/:gymId/coaches',
        element: <Coaches />
    },
    {
        path: '/cities/:cityId/gyms/:gymId/coaches/create',
        element: <CoachCreateView />
    },
    {
        path: '/cities/:cityId/gyms/:gymId/coaches/:coachId/update',
        element: <CoachUpdate />
    },
    // {
    //     path: '/cities/:cityId/gyms/:gymId/coaches:coach', 
    //     element: <CoachView />
    // },
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