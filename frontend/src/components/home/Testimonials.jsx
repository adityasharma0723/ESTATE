import { useState } from 'react';
import { HiStar } from 'react-icons/hi';

const testimonials = [
    {
        name: 'Priya Sharma',
        role: 'Homebuyer, Mumbai',
        avatar: 'PS',
        rating: 5,
        text: 'EstateX made finding our dream apartment incredibly easy. The agent was professional, the process was transparent, and we moved in within 3 weeks!',
    },
    {
        name: 'Rahul Patel',
        role: 'Property Investor, Bangalore',
        avatar: 'RP',
        rating: 5,
        text: 'As an investor, I need reliability and data. EstateX provides both. Their analytics and verified listings have helped me make smart decisions.',
    },
    {
        name: 'Ananya Krishnan',
        role: 'First-Time Buyer, Chennai',
        avatar: 'AK',
        rating: 5,
        text: 'I was nervous about buying my first home, but the agents on EstateX guided me through every step. The comparison feature is a game-changer!',
    },
];

const Testimonials = () => {
    const [active, setActive] = useState(0);

    return (
        <section className="py-20 bg-gray-50 dark:bg-dark">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <span className="text-primary font-semibold text-sm uppercase tracking-wider">Testimonials</span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-2">
                        What Our Clients Say
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((t, i) => (
                        <div
                            key={i}
                            className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${active === i
                                    ? 'bg-gradient-to-br from-primary to-primary-dark text-white border-primary shadow-xl shadow-primary/20 scale-105'
                                    : 'bg-white dark:bg-dark-card border-gray-200 dark:border-dark-border hover:border-primary/30'
                                }`}
                            onClick={() => setActive(i)}
                        >
                            <div className="flex items-center space-x-1 mb-4">
                                {Array.from({ length: t.rating }).map((_, j) => (
                                    <HiStar key={j} className={`w-4 h-4 ${active === i ? 'text-amber-300' : 'text-amber-400'}`} />
                                ))}
                            </div>

                            <p className={`text-sm leading-relaxed ${active === i ? 'text-white/90' : 'text-gray-600 dark:text-dark-text'}`}>
                                &ldquo;{t.text}&rdquo;
                            </p>

                            <div className="flex items-center mt-6 space-x-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${active === i ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'
                                    }`}>
                                    {t.avatar}
                                </div>
                                <div>
                                    <p className={`text-sm font-semibold ${active === i ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                                        {t.name}
                                    </p>
                                    <p className={`text-xs ${active === i ? 'text-white/70' : 'text-gray-500 dark:text-dark-text'}`}>
                                        {t.role}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
