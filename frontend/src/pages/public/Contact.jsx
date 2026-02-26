import { useState } from 'react';
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';
import toast from 'react-hot-toast';

const Contact = () => {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        toast.success('Message sent! We\'ll get back to you soon.');
        setForm({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark pt-20">
            <div className="bg-gradient-to-br from-primary to-secondary py-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold text-white">Get in Touch</h1>
                    <p className="mt-2 text-white/80">We&apos;d love to hear from you. Send us a message.</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact cards */}
                    <div className="space-y-6">
                        {[
                            { icon: HiMail, title: 'Email', value: 'hello@estatex.com', link: 'mailto:hello@estatex.com' },
                            { icon: HiPhone, title: 'Phone', value: '+91 98765 43210', link: 'tel:+919876543210' },
                            { icon: HiLocationMarker, title: 'Office', value: '123 Business District, Mumbai, MH 400001' },
                        ].map((item, i) => (
                            <div key={i} className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-6">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                                    <item.icon className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                                {item.link ? (
                                    <a href={item.link} className="text-primary text-sm mt-1 block">{item.value}</a>
                                ) : (
                                    <p className="text-gray-500 dark:text-dark-text text-sm mt-1">{item.value}</p>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Name</label>
                                    <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-dark border border-gray-200 dark:border-dark-border rounded-xl text-sm focus:outline-none focus:border-primary" placeholder="Your name" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                                    <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-dark border border-gray-200 dark:border-dark-border rounded-xl text-sm focus:outline-none focus:border-primary" placeholder="you@example.com" />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Subject</label>
                                <input type="text" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-dark border border-gray-200 dark:border-dark-border rounded-xl text-sm focus:outline-none focus:border-primary" placeholder="How can we help?" />
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Message</label>
                                <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-dark border border-gray-200 dark:border-dark-border rounded-xl text-sm focus:outline-none focus:border-primary" placeholder="Your message..." />
                            </div>
                            <button type="submit" className="px-8 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors">
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
