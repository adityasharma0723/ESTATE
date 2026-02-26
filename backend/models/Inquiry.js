const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        property: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Property',
            required: true,
        },
        agent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        message: {
            type: String,
            required: [true, 'Message is required'],
            maxlength: 1000,
        },
        phone: {
            type: String,
            default: '',
        },
        status: {
            type: String,
            enum: ['pending', 'responded', 'closed'],
            default: 'pending',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Inquiry', inquirySchema);
