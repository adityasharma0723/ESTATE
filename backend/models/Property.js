const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Property title is required'],
            trim: true,
            maxlength: 200,
        },
        description: {
            type: String,
            required: [true, 'Property description is required'],
            maxlength: 5000,
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: 0,
        },
        propertyType: {
            type: String,
            required: true,
            enum: ['Apartment', 'Villa', 'Plot', 'Commercial', 'House', 'Penthouse'],
        },
        bedrooms: {
            type: Number,
            default: 0,
            min: 0,
        },
        bathrooms: {
            type: Number,
            default: 0,
            min: 0,
        },
        area: {
            type: Number,
            required: [true, 'Area is required'],
            min: 0,
        },
        amenities: {
            type: [String],
            default: [],
        },
        address: {
            type: String,
            required: [true, 'Address is required'],
        },
        city: {
            type: String,
            required: [true, 'City is required'],
            trim: true,
        },
        state: {
            type: String,
            required: [true, 'State is required'],
            trim: true,
        },
        pincode: {
            type: String,
            required: [true, 'Pincode is required'],
        },
        location: {
            lat: { type: Number, default: 0 },
            lng: { type: Number, default: 0 },
        },
        images: {
            type: [String],
            default: [],
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
            enum: ['For Sale', 'For Rent'],
            required: true,
        },
        isApproved: {
            type: Boolean,
            default: false,
        },
        agent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        views: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

// Text index for search
propertySchema.index({ title: 'text', description: 'text', city: 'text' });

module.exports = mongoose.model('Property', propertySchema);
