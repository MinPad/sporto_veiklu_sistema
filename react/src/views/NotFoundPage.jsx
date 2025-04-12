import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl font-bold text-red-600 mb-4">404 - Page Not Found</h1>
            <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
            <Link to="/" className="text-blue-500 underline">Go back to Dashboard</Link>
        </div>
    );
};

export default NotFoundPage;
