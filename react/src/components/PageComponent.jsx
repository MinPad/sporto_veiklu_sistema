import Header from './Header';
import Footer from './Footer';

const PageComponent = ({ title, buttons, children, searchBar }) => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300">
            <Header />
            <header className="bg-white dark:bg-gray-800 shadow dark:shadow-lg">
                <div className="mx-auto max-w-full sm:max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-between space-x-3">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {title}
                    </h1>
                    <div className="flex items-center space-x-3 overflow-x-auto">
                        {searchBar}
                        {buttons}
                    </div>
                </div>
            </header>
            <main className="flex-grow">
                <div className="mx-auto max-w-full sm:max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PageComponent;
