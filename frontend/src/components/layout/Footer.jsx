import { Link } from 'react-router-dom';
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';

const Footer = () => {
    return (
        <footer className="bg-gray-900 dark:bg-dark text-gray-300">
            {/* Main footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div>
                        <Link to="/" className="flex items-center space-x-2 mb-4">
                            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
                                <span className="font-serif text-white font-bold text-lg">E</span>
                            </div>
                            <span className="font-serif text-xl font-bold text-white">
                                Estate<span className="text-primary-light">X</span>
                            </span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Your trusted partner in finding the perfect property. Premium listings, verified agents, and seamless experiences.
                        </p>

                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            {[
                                { to: '/properties', label: 'Browse Properties' },
                                { to: '/about', label: 'About Us' },
                                { to: '/blog', label: 'Blog' },
                                { to: '/faq', label: 'FAQ' },
                                { to: '/contact', label: 'Contact Us' },
                            ].map((link) => (
                                <li key={link.to}>
                                    <Link to={link.to} className="text-gray-400 hover:text-primary text-sm transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Property Types */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Property Types</h4>
                        <ul className="space-y-2">
                            {['Apartments', 'Villas', 'Plots', 'Commercial', 'Penthouse'].map((type) => (
                                <li key={type}>
                                    <Link to={`/properties?propertyType=${type.slice(0, -1)}`} className="text-gray-400 hover:text-primary text-sm transition-colors">
                                        {type}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Contact Us</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start space-x-3">
                                <HiLocationMarker className="w-5 h-5 text-primary mt-0.5" />
                                <span className="text-gray-400 text-sm">123 Business District, Mumbai, MH 400001</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <HiPhone className="w-5 h-5 text-primary" />
                                <span className="text-gray-400 text-sm">+91 98765 43210</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <HiMail className="w-5 h-5 text-primary" />
                                <span className="text-gray-400 text-sm">hello@estatex.com</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-gray-800 dark:border-dark-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
                    <p>© {new Date().getFullYear()} EstateX. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
