import { LockClosedIcon } from '@heroicons/react/20/solid'
import Header from '../components/Header'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react';
import axiosClient from '../axios';
import { useStateContext } from '../contexts/ContexProvider';
import UnauthorizedAlert from '../components/core/UnauthorizedAlert';
import SuccessAlert from '../components/core/SuccessAlert';

export default function Login() {
    const { setCurrentUser, setUserToken } = useStateContext();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState({ __html: "" });

    const location = useLocation();
    const navigate = useNavigate();
    const [showProtectedBanner, setShowProtectedBanner] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const successTimeoutRef = useRef(null);
    const showSuccessMessage = (msg) => {
        setSuccessMessage(msg);
        if (successTimeoutRef.current) {
            clearTimeout(successTimeoutRef.current);
        }
        successTimeoutRef.current = setTimeout(() => {
            setSuccessMessage('');
            successTimeoutRef.current = null;
        }, 3000);
    };

    useEffect(() => {
        if (location.state?.fromProtected) {
            setShowProtectedBanner(true);

            const timeout = setTimeout(() => {
                setShowProtectedBanner(false);
            }, 4000);

            window.history.replaceState({}, document.title);
            return () => clearTimeout(timeout);
        }

        if (location.state?.signupSuccess) {
            showSuccessMessage("Signup successful! You can now log in.");
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);



    const onSubmit = (ev) => {
        ev.preventDefault();
        setError({ __html: "" });

        axiosClient
            .post("/login", {
                email,
                password,
            })
            .then(({ data }) => {
                const token = data.token || data.accessToken;
                const refreshToken = data.refreshToken;
                if (token) {
                    // console.log("Backend Response:", data);
                    // console.log("data user:", data.user);
                    setCurrentUser(data.user);
                    setUserToken(token);
                    localStorage.setItem('TOKEN', token);
                    localStorage.setItem('REFRESH_TOKEN', refreshToken);
                    navigate(`/`);
                } else {
                    console.error("No token received from API");
                }
            })
            .catch((error) => {
                if (error.response && error.response.status === 422) {
                    const finalErrors = Object.values(error.response.data.errors).reduce(
                        (accum, next) => [...accum, ...next],
                        []
                    );
                    setError({ __html: finalErrors.join("<br>") });
                }
            });
    };



    return (
        <>
            <Header />
            {showProtectedBanner && (
                <UnauthorizedAlert
                    message="You must be logged in to view that page."
                    type="warning"
                    onClose={() => setShowProtectedBanner(false)}
                />
            )}
            {successMessage && (
                <SuccessAlert
                    key={successMessage}
                    message={successMessage}
                    onClose={() => setSuccessMessage('')}
                />
            )}
            <div className="flex min-h-full flex-1 justify-center px-6 py-12 lg:px-8">
                <div className="w-full max-w-md p-4 bg-gray-100 border border-gray-300 rounded-lg shadow-lg sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                            Account login
                        </h2>
                    </div>

                    {error.__html && (
                        <div className="bg-red-500 rounded py-2 px-3 text-white text-sm space-y-1">
                            {error.__html.split("<br>").map((msg, idx) => (
                                <div key={idx}>{msg}</div>
                            ))}
                        </div>
                    )}

                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form onSubmit={onSubmit} className="mt-8 space-y-6" action="#" method="POST">
                            <input type="hidden" name="remember" defaultValue="true" />
                            <div>
                                <label htmlFor="email" className="pl-1 block text-sm font-medium leading-6 text-gray-900">
                                    Email address
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        autoComplete="email"
                                        value={email}
                                        onChange={(ev) => setEmail(ev.target.value)}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        placeholder="Email address"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="pl-1 block text-sm font-medium leading-6 text-gray-900">
                                        Password
                                    </label>
                                    <div className="text-sm">
                                        <a href="/forgot-password" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                            Forgot password?
                                        </a>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        autoComplete="current-password"
                                        value={password}
                                        onChange={(ev) => setPassword(ev.target.value)}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        placeholder="Password"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <label
                                        htmlFor="remember-me"
                                        className="ml-2 block text-sm text-gray-900"
                                    >
                                        Remember me
                                    </label>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Sign in
                                </button>
                            </div>
                        </form>

                        <p className="mt-10 text-center text-sm text-gray-500">
                            Don't have an account?{' '}
                            <Link to="/signup" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                                Signup for free
                            </Link>
                        </p>
                    </div>
                </div>

            </div >
        </>
    )
}
