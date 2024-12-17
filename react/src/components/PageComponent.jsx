import Header from './Header';
import Footer from './Footer';

const PageComponent = ({ title, buttons, children, searchBar }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <header className="bg-white shadow">
                <div className="mx-auto max-w-full sm:max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-between space-x-3">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">{title}</h1>
                    <div className="flex items-center space-x-3 overflow-x-auto">
                        {searchBar} {/* Render the search bar */}
                        {buttons} {/* Render the buttons */}
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
// import Header from './Header';
// import Footer from './Footer';
// import { motion, AnimatePresence } from 'framer-motion';

// const pageVariants = {
//     initial: {
//         // Experiment with these values
//         opacity: 0,
//         scale: 1,  // Try values between 0.8 and 0.95
//         x: 0,      // Increase horizontal movement, try 50-200
//         // Optional: add rotation for more dynamic effect
//         rotate: 0    // Add a slight rotation on initial state
//     },
//     in: {
//         opacity: 1,
//         scale: 1,
//         x: 0,
//         rotate: 0,
//         transition: {
//             // Try different easing functions
//             duration: 0.5,  // Increase duration for slower transition
//             ease: [0.1, 0.1, 0.1, 0.1],  // Different easing curve
//             // Optional: add spring-like behavior
//             type: "spring",
//             stiffness: 100,
//             damping: 15
//         }
//     },
//     out: {
//         opacity: 0,
//         scale: 0.95,
//         x: 0,     // Mirror the initial x movement
//         rotate: -5,  // Slight counter-rotation
//         transition: {
//             duration: 0.3,
//             ease: [0.55, 0.055, 0.675, 0.19]  // Different easing out
//         }
//     }
// };

// const PageComponent = ({
//     title,
//     buttons,
//     children,
//     searchBar,
//     key  // Add a unique key prop for each page
// }) => {
//     return (
//         <AnimatePresence mode="wait">
//             <motion.div
//                 key={key}  // Unique key helps Framer Motion track page changes
//                 initial="initial"
//                 animate="in"
//                 exit="out"
//                 variants={pageVariants}
//                 className="min-h-screen flex flex-col"
//             >
//                 <Header />
//                 <header className="bg-white shadow">
//                     <div className="mx-auto max-w-full sm:max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-between space-x-3">
//                         <h1 className="text-3xl font-bold tracking-tight text-gray-900">{title}</h1>
//                         <div className="flex items-center space-x-3 overflow-x-auto">
//                             {searchBar}
//                             {buttons}
//                         </div>
//                     </div>
//                 </header>
//                 <main className="flex-grow">
//                     <div className="mx-auto max-w-full sm:max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
//                         {children}
//                     </div>
//                 </main>
//                 <Footer />
//             </motion.div>
//         </AnimatePresence>
//     );
// };

// export default PageComponent;