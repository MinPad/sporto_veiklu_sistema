import { lazy } from 'react';

import App from './App';
import Login from './views/Login';
import Signup from './views/signup';
import Cities from './views/Cities';
import Users from './views/Users';
import UserProfile from './views/Profile';
import Gyms from './views/Gyms';
import Coaches from './views/Coaches';
// import CoachView from './views/CoachView';

import GymView from './views/GymView';
import GymUpdate from './views/GymUpdate';
import GymDetail from './views/GymDetailView';
import CoachUpdate from './views/CoachUpdate';
import CityCreateView from './views/CityCreateView';
import CoachCreateView from './views/CoachCreateView';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import UnauthorizedPage from './views/UnauthorizedPage';
import ProtectedRoute from './components/ProtectedRoute';
import SportsEventsPage from './views/SportsEvents';
import SportEventDetail from './views/SportEventDetailView.jsx';
import NotFoundPage from './views/NotFoundPage';

import GymReviewsView from './views/GymReviewsView';

const CoachView = lazy(() => import('./views/CoachView'));

const routes = [
    {
        path: '*',
        element: <NotFoundPage />,
    },
    {
        path: '/',
        element: <App />,
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/signup',
        element: <Signup />,
    },
    {
        path: '/sports-events',
        element: <SportsEventsPage />,
    },
    {
        path: '/sports-events/:sporteventid/details',
        element: (
            <ProtectedRoute>
                <SportEventDetail />
            </ProtectedRoute>
        ),
    },
    {
        path: '/UnauthorizedPage',
        element: <UnauthorizedPage />,
    },
    {
        path: '/forgot-password',
        element: <ForgotPassword />,
    },
    {
        path: '/reset-password',
        element: <ResetPassword />,
    },
    {
        path: '/cities',
        element: <Cities />,
    },
    {
        path: '/cities/create',
        element: (
            <ProtectedRoute requiredRole="Admin">
                <CityCreateView />
            </ProtectedRoute>
        ),
    },
    {
        path: '/gyms',
        element: <Gyms />,
    },
    {
        path: '/cities/:cityId/gyms',
        element: <Gyms />,
    },
    {
        path: '/cities/:cityId/gyms/create',
        element: (
            <ProtectedRoute requiredRole="Admin">
                <GymView />
            </ProtectedRoute>
        ),
    },
    {
        path: '/cities/:cityId/gyms/:gymId/update',
        element: (
            <ProtectedRoute requiredRole="Admin">
                <GymUpdate />
            </ProtectedRoute>
        ),
    },
    {
        path: '/cities/:cityId/gyms/:gymId/details',
        element: <GymDetail />,
    },
    {
        path: '/users',
        element: (
            <ProtectedRoute requiredRole="Admin">
                <Users />
            </ProtectedRoute>
        ),
    },
    {
        path: '/user/:userId/profile',
        element: <UserProfile />,
    },
    {
        path: '/cities/:cityId/gyms/:gymId/coaches',
        element: <Coaches />,
    },
    {
        path: '/cities/:cityId/gyms/:gymId/coaches/create',
        element: (
            <ProtectedRoute requiredRole="Admin">
                <CoachCreateView />
            </ProtectedRoute>
        ),
    },
    {
        path: '/cities/:cityId/gyms/:gymId/coaches/:coachId/update',
        element: (
            <ProtectedRoute requiredRole="Admin">
                <CoachUpdate />
            </ProtectedRoute>
        ),
    },
    {
        path: '/cities/:cityId/gyms/:gymId/reviews',
        element: <GymReviewsView />,
    }
];

export default routes;
