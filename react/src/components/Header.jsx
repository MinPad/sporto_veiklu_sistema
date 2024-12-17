import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { Bars3Icon, BellIcon, UserIcon, XMarkIcon } from '@heroicons/react/24/outline';
import logo from '../assets/third.png';
import { Fragment } from "react";
import { useNavigate, Navigate, Link, NavLink, Outlet } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

import axiosClient from "../axios";
import { useEffect, useState } from "react";
import Toast from "./Toast";
import { useStateContext } from '../contexts/ContexProvider';

const navigation = [
    { name: 'Cities', to: '/cities' },
    { name: 'Sports Events', to: '/sports-events' },
    // { name: 'Projects', href: '#', current: false },
    // { name: 'Calendar', href: '#', current: false },
    // { name: 'Reports', href: '#', current: false },
];
const userNavigation = [
    { name: 'Login', to: '/login' },
    { name: 'Sign up', to: '/signup' },
];

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function Header() {

    const { currentUser, userToken, setCurrentUser, setUserToken } = useStateContext();
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const [userId, setUserId] = useState(null);
    useEffect(() => {
        const token = localStorage.getItem("TOKEN");
        if (token) {
            const decodedToken = jwtDecode(token);
            setUserId(decodedToken.sub);
            if (decodedToken.role === "Admin") {
                setIsAdmin(true);
            }
        }

    }, []);
    // console.log(isAdmin)
    // console.log("header ", currentUser.name);
    // console.log('Current userToken in Header:', userToken); // Debugging

    // if (!userToken) {
    //     console.log("User is not logged in");
    // } else {
    //     console.log("User is logged in with token:", userToken);
    // }

    const logout = (ev) => {
        ev.preventDefault();
        axiosClient.post("/logout").then(() => {
            setCurrentUser({});
            setUserToken(null);
            navigate('/login');
        });
    };
    const profile = (ev) => {
        ev.preventDefault();
        navigate('/user/${userId}/profile');
    };

    // useEffect(() => {
    //     axiosClient.get('/me')
    //         .then(({ data }) => {
    //             setCurrentUser(data)
    //         })
    // }, [])
    return (
        <Disclosure as="nav" className="bg-gray-800">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            {/* <img
                            // alt="System of Sports Activities"
                            // src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                            // src={logo}
                            // className="h-8 w-8"
                            
                            /> */}
                            <Link to="/" className="text-gray-300 hover:text-white text-sm font-bold">
                                System of sports activities
                            </Link>
                        </div>
                        {/* Cities/gyms navigation */}
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                {navigation.map((item) => (
                                    <NavLink
                                        key={item.name}
                                        to={item.to}
                                        // aria-current={item.current ? 'page' : undefined}
                                        className={({ isActive }) => classNames(
                                            isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                            'rounded-md px-3 py-2 text-sm font-medium',
                                        )}
                                    >
                                        {item.name}
                                    </NavLink>
                                ))}
                                {/* Add Users button visible only to Admins */}
                                {isAdmin && (
                                    <NavLink
                                        to="/users"
                                        className={({ isActive }) => classNames(
                                            isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                            'rounded-md px-3 py-2 text-sm font-medium',
                                        )}
                                    >
                                        Users
                                    </NavLink>
                                )}
                            </div>
                        </div>

                    </div>
                    {/* desineje puseje login signup */}
                    <div className="ml-auto hidden md:block">
                        {!userToken ? (
                            <>
                                {/* Login and Sign Up */}
                                <div className="ml-auto flex items-baseline space-x-4">
                                    {userNavigation.map((item) => (
                                        <NavLink
                                            key={item.name}
                                            to={item.to}
                                            aria-current={item.current ? 'page' : undefined}
                                            className={({ isActive }) => classNames(
                                                isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                'rounded-md px-3 py-2 text-sm font-medium',
                                            )}
                                        >
                                            {item.name}
                                        </NavLink>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Profile Dropdown */}
                                <div className="hidden md:block">
                                    <div className="ml-4 flex items-center md:ml-6">
                                        <Menu as="div" className="relative ml-3">
                                            <div>
                                                <Menu.Button className="flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                                    <span className="sr-only">Open user menu</span>
                                                    <UserIcon className="w-8 h-8 bg-black/25 p-2 rounded-full text-white" />
                                                </Menu.Button>
                                            </div>
                                            <Transition
                                                as={Fragment}
                                                enter="transition ease-out duration-100"
                                                enterFrom="transform opacity-0 scale-95"
                                                enterTo="transform opacity-100 scale-100"
                                                leave="transition ease-in duration-75"
                                                leaveFrom="transform opacity-100 scale-100"
                                                leaveTo="transform opacity-0 scale-95"
                                            >
                                                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <a
                                                                href="#"
                                                                onClick={(ev) => logout(ev)}
                                                                className={`block px-4 py-2 text-sm ${active ? 'bg-gray-100' : 'text-gray-700'}`}
                                                            >
                                                                Sign out
                                                            </a>
                                                        )}
                                                    </Menu.Item>
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <a
                                                                href="#"
                                                                onClick={(ev) => profile(ev)}
                                                                className={`block px-4 py-2 text-sm ${active ? 'bg-gray-100' : 'text-gray-700'}`}
                                                            >
                                                                Profile
                                                            </a>
                                                        )}
                                                    </Menu.Item>
                                                </Menu.Items>
                                            </Transition>
                                        </Menu>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        {/* Mobile menu button */}
                        <DisclosureButton className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2
                         text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2
                         focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                            <span className="sr-only">Open main menu</span>
                            {open ? (
                                <Bars3Icon aria-hidden="true" className="block h-6 w-6" />
                            ) : (
                                <XMarkIcon aria-hidden="true" className="block h-6 w-6" />
                            )}
                        </DisclosureButton>
                    </div>
                </div>
            </div>
            {/* ------------------------------------- */}
            {/* TELEFONO DYDZIO */}
            {/* ------------------------------------- */}
            <DisclosurePanel className="md:hidden">
                <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                    {navigation.map((item) => (
                        <NavLink
                            key={item.name}
                            // as="a"
                            to={item.to}
                            // aria-current={item.current ? 'page' : undefined}
                            className={({ isActive }) => classNames(
                                isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                'block rounded-md px-3 py-2 text-base font-medium',
                            )}
                        >
                            {item.name}
                        </NavLink>
                    ))}
                    {/* Add Users button visible only to Admins */}
                    {isAdmin && (
                        <NavLink
                            to="/users"
                            className={({ isActive }) => classNames(
                                isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                'block rounded-md px-3 py-2 text-base font-medium',
                            )}
                        >
                            Users
                        </NavLink>
                    )}
                </div>

                <div className="border-t border-gray-700 pb-3 pt-4">
                    {/* <div className="flex items-center px-5">
                        <div className="flex-shrink-0">
                            <img alt="" src={user.imageUrl} className="h-10 w-10 rounded-full" />
                        </div>
                        <div className="ml-3">
                            <div className="text-base font-medium leading-none text-white">{user.name}</div>
                            <div className="text-sm font-medium leading-none text-gray-400">{user.email}</div>
                        </div>
                    </div> */}
                    {!userToken ? (
                        <>
                            <div className="mt-3 space-y-1 px-2">
                                {userNavigation.map((item) => (
                                    <NavLink
                                        key={item.name}
                                        to={item.to}
                                        className={({ isActive }) =>
                                            classNames(
                                                'block rounded-md px-3 py-2 text-base font-medium',
                                                // isActive ? 'text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                                                isActive ? 'bg-gray-900 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white',
                                            )}
                                    >
                                        {item.name}
                                    </NavLink>
                                ))}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="mt-3 space-y-1 px-2">
                                <Disclosure
                                    as="a"
                                    href="#"
                                    onClick={(ev) => logout(ev)}
                                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                                >
                                    Sign out
                                </Disclosure>
                                <Disclosure
                                    as="a"
                                    href="#"
                                    onClick={(ev) => profile(ev)}
                                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                                >
                                    Profile
                                </Disclosure>
                            </div>
                        </>
                    )}
                </div>
            </DisclosurePanel>
        </Disclosure>
    );
}
