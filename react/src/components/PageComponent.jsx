import Header from './Header';
import Footer from './Footer';
// import { PlusCircleIcon, TrashIcon, EyeIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const PageComponent = ({ title, buttons, children, searchBar }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">{title}</h1>
                    <div className="flex items-center space-x-4">
                        {searchBar} {/* Render the search bar */}
                        {buttons} {/* Render the buttons */}
                    </div>
                </div>
            </header>
            <main className="flex-grow">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PageComponent;
