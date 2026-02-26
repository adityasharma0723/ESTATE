import { HiSearch, HiCalendar, HiKey } from 'react-icons/hi';

const steps = [
    {
        icon: HiSearch,
        title: 'Search & Discover',
        desc: 'Browse thousands of verified listings with advanced filters to find your perfect match.',
        color: 'from-primary to-primary-dark',
    },
    {
        icon: HiCalendar,
        title: 'Schedule a Visit',
        desc: 'Connect with verified agents, ask questions, and schedule property visits at your convenience.',
        color: 'from-secondary to-blue-600',
    },
    {
        icon: HiKey,
        title: 'Close the Deal',
        desc: 'Finalize your dream property with transparent pricing and hassle-free documentation support.',
        color: 'from-accent to-orange-500',
    },
];

const Stats = () => {
    return (
        <section className="py-20 bg-white dark:bg-dark-card">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="text-primary font-semibold text-sm uppercase tracking-wider">Simple Process</span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-2">
                        How It Works
                    </h2>
                    <p className="text-gray-500 dark:text-dark-text mt-3 max-w-lg mx-auto">
                        Finding your dream property is just three simple steps away.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((step, i) => (
                        <div key={i} className="relative text-center group">
                            {/* Connector line */}
                            {i < steps.length - 1 && (
                                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-gray-300 dark:from-dark-border to-transparent" />
                            )}

                            <div className={`inline-flex w-20 h-20 bg-gradient-to-br ${step.color} rounded-2xl items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                <step.icon className="w-9 h-9 text-white" />
                            </div>

                            <div className="text-xs font-bold text-gray-400 dark:text-dark-text uppercase tracking-widest mb-2">
                                Step {i + 1}
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{step.title}</h3>
                            <p className="text-gray-500 dark:text-dark-text mt-2">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Stats;
