import { useState } from 'react';
import { HiChevronDown } from 'react-icons/hi';

const faqs = [
    { q: 'How do I create an account on EstateX?', a: 'Click the "Sign Up" button on the top right corner. Choose whether you want to buy/rent or list properties, fill in your details, and you\'re ready to go!' },
    { q: 'Is it free to browse properties?', a: 'Yes! Browsing properties on EstateX is completely free. You can search, filter, and view property details without any charges.' },
    { q: 'How do I contact a property agent?', a: 'On any property details page, you\'ll find the agent\'s profile and an inquiry form. Fill it out and the agent will receive a notification to get back to you.' },
    { q: 'Can I save properties to view later?', a: 'Yes! Click the heart icon on any property card to save it. You can view all saved properties from your dashboard.' },
    { q: 'How does the property comparison feature work?', a: 'Click the compare icon on up to 3 properties. A comparison drawer will show side-by-side details including price, area, amenities, and more.' },
    { q: 'How can I list my property on EstateX?', a: 'Register as an Agent, then navigate to your dashboard and click "Add Property". Fill in all the details, upload images, and submit for review.' },
    { q: 'Are the listings verified?', a: 'All listings go through an admin review process before being published. We verify details to ensure quality and accuracy.' },
    { q: 'What is a Featured Listing?', a: 'Featured listings appear at the top of search results and on the homepage. Agents can upgrade their listing to "Featured" for ₹999 through our secure payment system.' },
    { q: 'Is my payment information secure?', a: 'Absolutely. We use Stripe for payment processing, which is PCI-DSS compliant and trusted by millions of businesses worldwide.' },
    { q: 'How do I reset my password?', a: 'Click "Forgot Password" on the login page, enter your email, and we\'ll send you a secure reset link. The link expires in 10 minutes.' },
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark pt-20">
            <div className="bg-gradient-to-br from-primary to-secondary py-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold text-white">Frequently Asked Questions</h1>
                    <p className="mt-2 text-white/80">Everything you need to know about EstateX</p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-16">
                <div className="space-y-3">
                    {faqs.map((faq, i) => (
                        <div key={i} className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border overflow-hidden">
                            <button onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                                className="w-full flex items-center justify-between p-5 text-left">
                                <span className="font-medium text-gray-900 dark:text-white pr-4">{faq.q}</span>
                                <HiChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${openIndex === i ? 'rotate-180' : ''}`} />
                            </button>
                            {openIndex === i && (
                                <div className="px-5 pb-5 text-sm text-gray-600 dark:text-dark-text animate-fade-in">
                                    {faq.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FAQ;
