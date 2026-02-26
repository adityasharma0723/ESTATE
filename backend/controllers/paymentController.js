const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Property = require('../models/Property');

// @desc    Create Stripe checkout session for featuring a property
// @route   POST /api/payments/create-checkout
exports.createCheckoutSession = async (req, res, next) => {
    try {
        const { propertyId } = req.body;

        const property = await Property.findById(propertyId);
        if (!property) return res.status(404).json({ message: 'Property not found' });

        if (property.agent.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: `Feature Listing: ${property.title}`,
                            description: 'Make your property a featured listing for 30 days',
                        },
                        unit_amount: 99900, // ₹999
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/agent/listings?featured=success`,
            cancel_url: `${process.env.CLIENT_URL}/agent/listings?featured=cancel`,
            metadata: {
                propertyId: propertyId,
                userId: req.user._id.toString(),
            },
        });

        res.json({ success: true, url: session.url });
    } catch (error) {
        next(error);
    }
};

// @desc    Stripe webhook handler
// @route   POST /api/payments/webhook
exports.handleWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];

    try {
        const event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const propertyId = session.metadata.propertyId;

            await Property.findByIdAndUpdate(propertyId, { isFeatured: true });
            console.log(`Property ${propertyId} marked as featured`);
        }

        res.json({ received: true });
    } catch (err) {
        console.error('Webhook error:', err.message);
        res.status(400).json({ message: `Webhook Error: ${err.message}` });
    }
};
