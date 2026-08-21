import { useState } from 'react';
import { HiMail, HiPhone, HiLocationMarker, HiChat, HiClock, HiShieldCheck } from 'react-icons/hi';
import toast from 'react-hot-toast';
import API from '../../api/axios';

const Contact = () => {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [sending, setSending] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.subject || !form.message) {
            toast.error('Please fill in all fields.');
            return;
        }
        setSending(true);
        try {
            await API.post('/auth/contact', form);
            toast.success("Message sent! We'll get back to you within 24 hours.");
            setForm({ name: '', email: '', subject: '', message: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to send message. Please try again.');
        } finally {
            setSending(false);
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark pt-20">
            {/* Hero — Image background with adaptive overlay (matching Home) */}
            <div className="relative min-h-[70vh] flex items-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1920&q=80"
                        alt="Modern office"
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
                            <span className="text-sm text-gray-700 dark:text-white/80 font-medium">We respond within 24 hours</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight animate-slide-up">
                            Let&apos;s Start a{' '}
                            <span className="bg-gradient-to-r from-primary-light to-secondary bg-clip-text text-transparent">
                                Conversation
                            </span>
                        </h1>
                        <p className="mt-5 text-lg text-gray-600 dark:text-gray-300 leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            Have a question about a property or need expert advice? Our team is here to help you every step of the way.
                        </p>
                        <div className="flex gap-8 mt-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            {[
                                { value: '24/7', label: 'Support' },
                                { value: '<2h', label: 'Avg. Response' },
                                { value: '98%', label: 'Satisfaction' },
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

            {/* Contact Info — Two-column (matching About mission section) */}
            <div className="max-w-7xl mx-auto px-4 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    {/* Form */}
                    <div>
                        <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider rounded-full">
                            Send a Message
                        </span>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-4 leading-tight">
                            We&apos;d Love to<br />Hear From You
                        </h2>
                        <p className="mt-4 text-gray-600 dark:text-dark-text leading-relaxed mb-8">
                            Fill out the form and our team will get back to you promptly. Whether it&apos;s a property inquiry or general question, we&apos;re happy to help.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Name</label>
                                    <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all" placeholder="Your name" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                                    <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        className="w-full px-4 py-3 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all" placeholder="you@example.com" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Subject</label>
                                <input type="text" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                    className="w-full px-4 py-3 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all" placeholder="How can we help?" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Message</label>
                                <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                                    className="w-full px-4 py-3 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all resize-none" placeholder="Your message..." />
                            </div>
                            <button type="submit" disabled={sending}
                                className="inline-flex items-center gap-2 px-8 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors disabled:opacity-60">
                                {sending ? (
                                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
                                ) : (
                                    'Send Message →'
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Right side —  contact cards + map */}
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { icon: HiMail, title: 'Email', value: 'hello@estatex.com', desc: 'Drop us a line anytime', link: 'mailto:hello@estatex.com', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                                { icon: HiPhone, title: 'Phone', value: '+91 98765 43210', desc: 'Mon-Sat, 9 AM – 7 PM', link: 'tel:+919876543210', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
                                { icon: HiLocationMarker, title: 'Office', value: 'Mumbai, MH 400001', desc: '123 Business District', color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-900/20' },
                                { icon: HiChat, title: 'Live Chat', value: 'Chat with agent', desc: 'Typically replies in minutes', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
                            ].map((item, i) => (
                                <a key={i} href={item.link || '#'}
                                    className="group p-5 rounded-2xl bg-gray-50 dark:bg-dark border border-gray-100 dark:border-dark-border hover:border-gray-200 dark:hover:border-dark-border hover:shadow-lg transition-all duration-300">
                                    <div className={`w-11 h-11 ${item.bg} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                                        <item.icon className={`w-5 h-5 ${item.color}`} />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                                    <p className="text-primary text-sm font-medium mt-0.5">{item.value}</p>
                                    <p className="text-xs text-gray-400 dark:text-dark-text mt-1">{item.desc}</p>
                                </a>
                            ))}
                        </div>

                        {/* Map */}
                        <div className="relative rounded-2xl overflow-hidden border border-gray-100 dark:border-dark-border h-60 shadow-lg">
                            <iframe
                                title="EstateX Office"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609823277!2d72.74109995!3d19.08219865!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai!5e0!3m2!1sen!2sin!4v1"
                                className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-500"
                                allowFullScreen loading="lazy" />
                            <div className="absolute bottom-3 left-3 bg-white dark:bg-dark-card rounded-lg shadow-md px-3 py-2 text-xs font-medium text-gray-700 dark:text-white flex items-center gap-1.5">
                                <HiLocationMarker className="w-3.5 h-3.5 text-primary" /> Mumbai, India
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Why Reach Out — Card grid (matching About "Why Choose Us" section) */}
            <div className="bg-white dark:bg-dark-card border-y border-gray-100 dark:border-dark-border py-20">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-14">
                        <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider rounded-full">
                            Why Reach Out
                        </span>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">
                            How We Can Help
                        </h2>
                        <p className="text-gray-500 dark:text-dark-text mt-2 max-w-md mx-auto">
                            Our team of experts is ready to assist you with any aspect of your real estate journey.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { icon: HiShieldCheck, title: 'Property Inquiries', desc: 'Get detailed information about any listed property including pricing, availability, and legal documentation.', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
                            { icon: HiClock, title: 'Schedule Visits', desc: 'Book in-person tours or virtual walkthroughs at your convenience. Available weekdays and weekends.', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                            { icon: HiChat, title: 'Agent Support', desc: 'Connect with verified real estate agents who specialize in your preferred location and budget.', color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-900/20' },
                            { icon: HiMail, title: 'Investment Advice', desc: 'Get expert guidance on real estate investment opportunities across major Indian cities.', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
                            { icon: HiPhone, title: 'Legal Assistance', desc: 'Our legal partners can help with property verification, RERA compliance, and documentation.', color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20' },
                            { icon: HiLocationMarker, title: 'Relocation Help', desc: 'Moving to a new city? We can help you find the perfect home in any of our 12+ covered cities.', color: 'text-teal-500', bg: 'bg-teal-50 dark:bg-teal-900/20' },
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

            {/* CTA — Image background (matching About CTA section) */}
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

export default Contact;
