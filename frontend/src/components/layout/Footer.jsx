import { Link } from 'react-router-dom';
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-gray-900 dark:bg-dark text-gray-300">
            {/* Newsletter */}
            <div className="bg-gradient-to-r from-primary to-secondary">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-2xl font-bold text-white">Stay Updated</h3>
                            <p className="text-white/80 mt-1">Get the latest property listings delivered to your inbox.</p>
                        </div>
                        <div className="flex w-full md:w-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 md:w-80 px-5 py-3 rounded-l-xl bg-white/20 backdrop-blur text-white placeholder-white/60 border border-white/30 focus:outline-none focus:border-white"
                            />
                            <button className="px-6 py-3 bg-white text-primary font-semibold rounded-r-xl hover:bg-gray-100 transition-colors">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div>
                        <Link to="/" className="flex items-center space-x-2 mb-4">
                            <div className="w-9 h-9 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-lg">E</span>
                            </div>
                            <span className="text-xl font-bold text-white">
                                Estate<span className="text-primary-light">X</span>
                            </span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Your trusted partner in finding the perfect property. Premium listings, verified agents, and seamless experiences.
                        </p>
                        <div className="flex space-x-3 mt-6">
                            {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, i) => (
                                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-gray-800 dark:bg-dark-card flex items-center justify-center text-gray-400 hover:text-primary hover:bg-gray-700 transition-colors">
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
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
                    <div className="flex space-x-6 mt-2 sm:mt-0">
                        <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
