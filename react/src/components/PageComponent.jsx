import Header from './Header';

const PageComponent = ({ title, buttons, children }) => {
    return (
        <div className="min-h-full">
            <Header />
            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">{title}</h1>
                    {buttons} {/* Render the buttons here */}
                </div>
            </header>
            <main>
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default PageComponent;