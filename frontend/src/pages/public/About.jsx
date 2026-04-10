import { HiShieldCheck, HiUserGroup, HiHome, HiChartBar, HiLightningBolt, HiGlobe } from 'react-icons/hi';

const About = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark pt-20">
            {/* Hero — Image background with adaptive overlay (matching Home) */}
            <div className="relative min-h-[70vh] flex items-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80"
                        alt="Modern architecture"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/75 to-white/40 dark:from-dark/90 dark:via-dark/70 dark:to-dark/40" />
                </div>

                {/* Floating shapes */}
                <div className="absolute top-20 right-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
                    <div className="max-w-xl">
                        <div className="inline-flex items-center gap-2 bg-gray-900/10 dark:bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-white/20 rounded-full px-4 py-1.5 mb-6 animate-fade-in">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                            <span className="text-sm text-gray-700 dark:text-white/80 font-medium">Trusted by 10,000+ homebuyers</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight animate-slide-up">
                            We&apos;re Building the{' '}
                            <span className="bg-gradient-to-r from-primary-light to-secondary bg-clip-text text-transparent">
                                Future of Real Estate
                            </span>
                        </h1>
                        <p className="mt-5 text-lg text-gray-600 dark:text-gray-300 leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            India&apos;s fastest-growing property platform — connecting buyers, renters, and agents with transparency, trust, and technology.
                        </p>
                        <div className="flex gap-8 mt-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            {[
                                { value: '10K+', label: 'Properties' },
                                { value: '500+', label: 'Agents' },
                                { value: '12+', label: 'Cities' },
                            ].map((stat) => (
                                <div key={stat.label}>
                                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mission — Clean two-column */}
            <div className="max-w-7xl mx-auto px-4 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider rounded-full">
                            Our Mission
                        </span>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-4 leading-tight">
                            Making Real Estate<br />Simple & Trustworthy
                        </h2>
                        <p className="mt-5 text-gray-600 dark:text-dark-text leading-relaxed">
                            At EstateX, we believe everyone deserves a smooth property experience. Our platform brings together advanced technology, verified listings, and expert agents to eliminate the friction in buying, selling, or renting properties across India.
                        </p>
                        <p className="mt-4 text-gray-600 dark:text-dark-text leading-relaxed">
                            Founded in 2024, we&apos;ve already helped thousands of families find their ideal homes. With AI-powered recommendations, real-time chat, and transparent pricing, we&apos;re redefining how India discovers real estate.
                        </p>
                        <div className="flex gap-4 mt-8">
                            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                <span className="w-5 h-5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center text-xs">✓</span>
                                RERA Compliant
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                <span className="w-5 h-5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center text-xs">✓</span>
                                Verified Agents
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                <span className="w-5 h-5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center text-xs">✓</span>
                                24/7 Support
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="rounded-2xl overflow-hidden h-96 shadow-2xl">
                            <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600" alt="Modern home" className="w-full h-full object-cover" />
                        </div>
                        {/* Floating card */}
                        <div className="absolute -bottom-6 -left-6 bg-white dark:bg-dark-card rounded-2xl shadow-xl border border-gray-100 dark:border-dark-border p-5 max-w-[220px]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                                    <HiLightningBolt className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-white text-lg">5K+</p>
                                    <p className="text-xs text-gray-500 dark:text-dark-text">Happy Families</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Why Choose Us — Card grid */}
            <div className="bg-white dark:bg-dark-card border-y border-gray-100 dark:border-dark-border py-20">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-14">
                        <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider rounded-full">
                            Why EstateX
                        </span>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">
                            What Sets Us Apart
                        </h2>
                        <p className="text-gray-500 dark:text-dark-text mt-2 max-w-md mx-auto">
                            We combine technology with trust to deliver the best property experience.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { icon: HiShieldCheck, title: 'Verified Listings', desc: 'Every property is verified by our team before going live. No fake listings, no surprises.', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
                            { icon: HiUserGroup, title: 'Expert Agents', desc: '500+ trusted and vetted agents ready to guide you through your property journey.', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                            { icon: HiHome, title: '10K+ Properties', desc: 'Apartments, villas, plots, commercial spaces — browse across 12+ major Indian cities.', color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-900/20' },
                            { icon: HiChartBar, title: 'Smart Insights', desc: 'AI-powered recommendations and market analytics to help you make informed decisions.', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
                            { icon: HiLightningBolt, title: 'Instant Chat', desc: 'Connect with agents in real-time. Get immediate responses to your property queries.', color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20' },
                            { icon: HiGlobe, title: 'Pan-India Coverage', desc: 'From Mumbai to Bangalore, Delhi to Chennai — we cover all major metros and beyond.', color: 'text-teal-500', bg: 'bg-teal-50 dark:bg-teal-900/20' },
                        ].map((item, i) => (
                            <div key={i} className="group p-6 rounded-2xl bg-gray-50 dark:bg-dark border border-gray-100 dark:border-dark-border hover:border-gray-200 dark:hover:border-dark-border hover:shadow-lg transition-all duration-300">
                                <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    <item.icon className={`w-6 h-6 ${item.color}`} />
                                </div>
                                <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{item.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-dark-text mt-2 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA section */}
            <div className="max-w-7xl mx-auto px-4 py-20">
                <div className="relative rounded-3xl overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80"
                        alt="Luxury property"
                        className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/50 flex items-center">
                        <div className="px-10 sm:px-16">
                            <h3 className="text-2xl sm:text-3xl font-bold text-white">Ready to find your dream home?</h3>
                            <p className="text-white/60 mt-2">Browse thousands of verified properties across India.</p>
                            <a href="/properties" className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors">
                                Explore Properties →
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
