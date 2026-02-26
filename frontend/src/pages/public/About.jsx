import { HiShieldCheck, HiUserGroup, HiHome, HiChartBar } from 'react-icons/hi';

const About = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark pt-20">
            {/* Hero */}
            <div className="relative bg-gradient-to-br from-primary to-secondary py-24">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold text-white">About EstateX</h1>
                    <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
                        India&apos;s fastest-growing real estate platform, connecting buyers, renters, and agents with transparency and trust.
                    </p>
                </div>
            </div>

            {/* Mission */}
            <div className="max-w-7xl mx-auto px-4 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <span className="text-primary font-semibold text-sm uppercase tracking-wider">Our Mission</span>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">Making Real Estate Simple & Trustworthy</h2>
                        <p className="mt-4 text-gray-600 dark:text-dark-text leading-relaxed">
                            At EstateX, we believe everyone deserves a smooth property experience. Our platform brings together advanced technology, verified listings, and expert agents to eliminate the friction in buying, selling, or renting properties across India.
                        </p>
                        <p className="mt-4 text-gray-600 dark:text-dark-text leading-relaxed">
                            Founded in 2024, we&apos;ve already helped thousands of families find their ideal homes. With AI-powered recommendations, real-time chat, and transparent pricing, we&apos;re redefining how India discovers real estate.
                        </p>
                    </div>
                    <div className="rounded-2xl overflow-hidden h-80">
                        <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600" alt="Modern home" className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>

            {/* Values */}
            <div className="bg-white dark:bg-dark-card py-20">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Why Choose EstateX?</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: HiShieldCheck, title: 'Verified Listings', desc: 'Every property is verified by our team before listing.' },
                            { icon: HiUserGroup, title: 'Expert Agents', desc: '500+ trusted agents ready to help you find your dream home.' },
                            { icon: HiHome, title: '10K+ Properties', desc: 'Browse apartments, villas, plots, and commercial spaces.' },
                            { icon: HiChartBar, title: 'Smart Insights', desc: 'AI-powered recommendations based on your preferences.' },
                        ].map((item, i) => (
                            <div key={i} className="text-center p-6 rounded-2xl bg-gray-50 dark:bg-dark border border-gray-100 dark:border-dark-border hover:border-primary/30 transition-colors">
                                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <item.icon className="w-7 h-7 text-primary" />
                                </div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-dark-text mt-2">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
