import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark px-4">
            <div className="text-center">
                <h1 className="text-8xl font-bold gradient-text">404</h1>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">Page Not Found</h2>
                <p className="text-gray-500 dark:text-dark-text mt-2 max-w-md mx-auto">
                    Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
                <div className="flex items-center justify-center gap-4 mt-8">
                    <Link to="/" className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors">
                        Go Home
                    </Link>
                    <Link to="/properties" className="px-6 py-3 border border-gray-300 dark:border-dark-border text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:border-primary transition-colors">
                        Browse Properties
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
