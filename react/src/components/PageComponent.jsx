import Header from './Header';
import Footer from './Footer';

const PageComponent = ({ title, buttons, children, searchBar }) => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300">
            <Header />
            <header className="bg-white dark:bg-gray-800 shadow dark:shadow-lg">
                <div className="mx-auto max-w-full sm:max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        {/* Title */}
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white text-center sm:text-left">
                            {title}
                        </h1>

                        {/* Search + Buttons */}
                        {(searchBar || buttons) && (
                            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-end w-full sm:w-auto">
                                {searchBar && <div className="w-full sm:w-auto">{searchBar}</div>}
                                {buttons && <div className="w-full sm:w-auto">{buttons}</div>}
                            </div>
                        )}
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
