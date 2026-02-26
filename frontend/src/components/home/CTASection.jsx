import { Link } from 'react-router-dom';
import { HiArrowRight } from 'react-icons/hi';

const CTASection = () => {
    return (
        <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative rounded-3xl overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1920&q=80"
                        alt="Beautiful home"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90" />

                    <div className="relative px-8 py-16 sm:px-16 sm:py-24 text-center">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                            Ready to List Your Property?
                        </h2>
                        <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
                            Join 500+ trusted agents on EstateX. Reach thousands of verified buyers and
                            renters. Premium listings get 3x more visibility.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to="/register"
                                className="px-8 py-3.5 bg-white text-primary font-semibold rounded-xl hover:bg-gray-100 transition-colors shadow-xl flex items-center gap-2"
                            >
                                Get Started Free <HiArrowRight className="w-5 h-5" />
                            </Link>
                            <Link
                                to="/about"
                                className="px-8 py-3.5 bg-white/10 backdrop-blur text-white font-semibold rounded-xl border border-white/30 hover:bg-white/20 transition-colors"
                            >
                                Learn More
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
