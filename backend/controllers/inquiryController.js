const Inquiry = require('../models/Inquiry');
const Property = require('../models/Property');
const sendEmail = require('../utils/sendEmail');

// @desc    Create inquiry
// @route   POST /api/inquiries
exports.createInquiry = async (req, res, next) => {
    try {
        const { propertyId, message, phone } = req.body;

        const property = await Property.findById(propertyId).populate('agent', 'email name');
        if (!property) return res.status(404).json({ message: 'Property not found' });

        const inquiry = await Inquiry.create({
            user: req.user._id,
            property: propertyId,
            agent: property.agent._id,
            message,
            phone,
        });

        // Send email notification to agent
        try {
            await sendEmail({
                email: property.agent.email,
                subject: `New Inquiry for "${property.title}" — EstateX`,
                html: `
          <h2>New Property Inquiry</h2>
          <p><strong>${req.user.name}</strong> is interested in your listing: <strong>${property.title}</strong></p>
          <p><strong>Message:</strong> ${message}</p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
          <p>Login to your dashboard to respond.</p>
        `,
            });
        } catch (emailErr) {
            console.error('Email notification failed:', emailErr.message);
        }

        res.status(201).json({ success: true, inquiry });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user's inquiries
// @route   GET /api/inquiries/my
exports.getMyInquiries = async (req, res, next) => {
    try {
        const inquiries = await Inquiry.find({ user: req.user._id })
            .populate('property', 'title images price city')
            .populate('agent', 'name email')
            .sort('-createdAt');

        res.json({ success: true, inquiries });
    } catch (error) {
        next(error);
    }
};

// @desc    Get agent's received inquiries
// @route   GET /api/inquiries/agent
exports.getAgentInquiries = async (req, res, next) => {
    try {
        const inquiries = await Inquiry.find({ agent: req.user._id })
            .populate('property', 'title images price city')
            .populate('user', 'name email phone')
            .sort('-createdAt');

        res.json({ success: true, inquiries });
    } catch (error) {
        next(error);
    }
};

// @desc    Update inquiry status
// @route   PUT /api/inquiries/:id
exports.updateInquiry = async (req, res, next) => {
    try {
        const inquiry = await Inquiry.findById(req.params.id);
        if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });

        if (inquiry.agent.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        inquiry.status = req.body.status || inquiry.status;
        await inquiry.save();

        res.json({ success: true, inquiry });
    } catch (error) {
        next(error);
    }
};
