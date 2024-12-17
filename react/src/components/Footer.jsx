import { Link } from "react-router-dom";
import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";

export default function Footer() {
    return (
        <footer className="bg-gray-800 text-gray-300 py-6">
            <div className="flex flex-col md:flex-row justify-between items-stretch md:divide-x md:divide-gray-600">
                {/* Left Section: Logo and Copyright */}
                <div className="flex flex-col items-start md:items-start px-4">
                    <p className="text-sm">
                        &copy; {new Date().getFullYear()} System of Sports Activities. All rights reserved.
                    </p>
                    {/* Semi-transparent Name, Surname, and Current Year */}
                    <p className="text-sm text-gray-400 mt-2">
                        Mindaugas Padegimas IFF-1/6
                    </p>
                </div>
                {/* vertical line in mobile */}
                <div className="mb-2 border-b border-gray-600 pb-1 md:border-none" />
                {/* Center Section: Navigation Links */}
                <div className="flex flex-col items-start px-4">
                    <h3 className="text-lg font-semibold text-white mb-2">Quick Links</h3>
                    <ul className="space-y-1">
                        <li>
                            <Link to="/privacy-policy" className="hover:text-white text-sm">Privacy Policy</Link>
                        </li>
                        <li>
                            <Link to="/contact" className="hover:text-white text-sm">About Us</Link>
                        </li>
                    </ul>
                </div>
                {/* vertical line in mobile */}
                <div className="mb-2 border-b border-gray-600 pb-1 md:border-none" />
                {/* Right Section: Contact Info and Social Media */}
                <div className="flex flex-col items-start px-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>

                    {/* Contact Details */}
                    <div className="flex items-center text-sm mb-2">
                        <EnvelopeIcon className="h-5 w-5 mr-2" />
                        <a href="mailto:info@sportsactivities.com" className="hover:text-white mr-6">
                            info@sportsactivities.com
                        </a>
                        <PhoneIcon className="h-5 w-5 mr-2" />
                        <a href="tel:+1234567890" className="hover:text-white">
                            +1 234 567 890
                        </a>
                    </div>

                    {/* Social Media Icons */}
                    <div className="flex items-center space-x-4">
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                className="h-6 w-6"
                                aria-label="Twitter"
                                role="img"
                            >
                                <title>Twitter</title>
                                <path d="M24 4.56c-.89.39-1.85.65-2.85.77 1.02-.61 1.8-1.57 2.16-2.72-.96.57-2.02.98-3.14 1.2A4.5 4.5 0 0016.6 3c-2.48 0-4.5 2.01-4.5 4.5 0 .35.04.69.11 1.02C8.73 8.39 4.62 6.5 1.64 3.1c-.37.63-.58 1.36-.58 2.13 0 1.47.75 2.78 1.88 3.54-.69-.02-1.33-.21-1.9-.52v.05c0 2.06 1.47 3.78 3.43 4.17-.36.1-.73.15-1.12.15-.27 0-.54-.03-.8-.07.54 1.68 2.1 2.9 3.95 2.93a9.04 9.04 0 01-5.6 1.92c-.36 0-.72-.02-1.08-.07A12.76 12.76 0 006.86 21c8.29 0 12.83-6.87 12.83-12.83l-.01-.59c.88-.64 1.64-1.44 2.24-2.36z" />
                            </svg>
                        </a>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                className="h-6 w-6"
                                aria-label="Facebook"
                                role="img"
                            >
                                <title>Facebook</title>
                                <path d="M22.675 0H1.325C.593 0 0 .594 0 1.326V22.67c0 .733.593 1.326 1.325 1.326h11.495V14.5h-3.11v-3.62h3.11V8.5c0-3.1 1.893-4.788 4.657-4.788 1.324 0 2.463.098 2.795.142v3.24H17.71c-1.365 0-1.63.648-1.63 1.6v2.1h3.26l-.425 3.62h-2.835V24h5.545c.733 0 1.326-.593 1.326-1.326V1.326C24 .594 23.408 0 22.675 0z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
