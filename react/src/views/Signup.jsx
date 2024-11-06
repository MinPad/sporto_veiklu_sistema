import { LockClosedIcon } from '@heroicons/react/20/solid'
import Header from '../components/Header'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import axiosClient from '../axios.js';

export default function Signup() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setpasswordConfirmation] = useState('');

    const [error, setError] = useState({ __html: "" });

    const onSubmit = (ev) => {
        ev.preventDefault();
        setError({ __html: "" })

        axiosClient.post('/signup', {
            name: fullName,
            email,
            password,
            password_confirmation: passwordConfirmation
        })
            .then(({ data }) => {
                console.log(data);
            })
            .catch((error) => {
                if (error.response) {
                    const finalErrors = Object.values(error.response.data.errors).reduce((accum, next) =>
                        [...accum, ...next], [])
                    console.log(finalErrors)
                    setError({ __html: finalErrors.join('<br>') })
                }
                console.error(error)
            });
    };
    return (
        <>
            <Header />
            <div className="flex min-h-full flex-1 justify-center px-6 py-12 lg:px-8">
                <div className="w-full max-w-md p-4 bg-gray-100 border border-gray-300 rounded-lg shadow-lg sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                            Signup cia
                        </h2>
                    </div>

                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">

                        {error.__html && (<div className="bg-red-500 rounded py-2 px-3 text-white"
                            dangerouslySetInnerHTML={error}>
                        </div>)}

                        <form onSubmit={onSubmit} action="#" method="POST" className="space-y-6">
                            <div>
                                <label htmlFor="full-name" className="block text-sm font-medium leading-6 text-gray-900">
                                    Full Name
                                </label>
                                {/* {fullName} */}
                                <div className="mt-2">
                                    <input
                                        id="full-name"
                                        name="name"
                                        type="text"
                                        required
                                        value={fullName}
                                        onChange={ev => setFullName(ev.target.value)}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset
                                     ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset
                                     focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        placeholder="Full Name"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                    Email address
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={ev => setEmail(ev.target.value)}
                                        autoComplete="email"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1
                                     ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset
                                     focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        placeholder="Email"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                        Password
                                    </label>
                                </div>
                                <div className="mt-2">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={ev => setPassword(ev.target.value)}
                                        autoComplete="current-password"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset
                                     ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset
                                     focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        placeholder="Password"
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password-confirmation" className="block text-sm font-medium leading-6 text-gray-900">
                                        Password Confirmation
                                    </label>
                                </div>
                                <div className="mt-2">
                                    <input
                                        id="password-confirmation"
                                        name="password_confirmation"
                                        type="password"
                                        required
                                        value={passwordConfirmation}
                                        onChange={ev => setpasswordConfirmation(ev.target.value)}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset
                                     ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset
                                     focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        placeholder="Password Confirmation"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="group relative flex w-full justify-center rounded-md
                                border border-transparent bg-indigo-600 px-4 py-2
                                text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-700
                                focus-visible:outline focus:outline-none focus:ring-offset-2
                                focus:ring-indigo-500"
                                >
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <LockClosedIcon
                                            className="h-5 w-5 text-idngo-500 group-hover:text-indigo-400"
                                            aria-hidden="true"
                                        />
                                    </span>
                                    Signup
                                </button>
                            </div>
                        </form>

                        <p className="mt-10 text-center text-sm text-gray-500">
                            Already have an account?{' '}
                            <Link to="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}
