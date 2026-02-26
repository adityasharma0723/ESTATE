const Property = require('../models/Property');
const cloudinary = require('../config/cloudinary');
const { getRecommendations } = require('../utils/recommend');
const SavedProperty = require('../models/SavedProperty');

// @desc    Get all properties (with filters, pagination)
// @route   GET /api/properties
exports.getProperties = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        const filter = { isApproved: true };

        // Filters
        if (req.query.city) filter.city = { $regex: req.query.city, $options: 'i' };
        if (req.query.state) filter.state = { $regex: req.query.state, $options: 'i' };
        if (req.query.propertyType) filter.propertyType = req.query.propertyType;
        if (req.query.status) filter.status = req.query.status;
        if (req.query.bedrooms) filter.bedrooms = { $gte: parseInt(req.query.bedrooms) };
        if (req.query.bathrooms) filter.bathrooms = { $gte: parseInt(req.query.bathrooms) };
        if (req.query.minPrice || req.query.maxPrice) {
            filter.price = {};
            if (req.query.minPrice) filter.price.$gte = parseInt(req.query.minPrice);
            if (req.query.maxPrice) filter.price.$lte = parseInt(req.query.maxPrice);
        }
        if (req.query.minArea || req.query.maxArea) {
            filter.area = {};
            if (req.query.minArea) filter.area.$gte = parseInt(req.query.minArea);
            if (req.query.maxArea) filter.area.$lte = parseInt(req.query.maxArea);
        }
        if (req.query.search) {
            filter.$text = { $search: req.query.search };
        }
        if (req.query.featured === 'true') filter.isFeatured = true;

        // Sort
        let sort = '-createdAt';
        if (req.query.sort === 'price_asc') sort = 'price';
        if (req.query.sort === 'price_desc') sort = '-price';
        if (req.query.sort === 'newest') sort = '-createdAt';
        if (req.query.sort === 'popular') sort = '-views';

        const total = await Property.countDocuments(filter);
        const properties = await Property.find(filter)
            .populate('agent', 'name email avatar phone')
            .skip(skip)
            .limit(limit)
            .sort(sort);

        res.json({
            success: true,
            properties,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single property
// @route   GET /api/properties/:id
exports.getProperty = async (req, res, next) => {
    try {
        const property = await Property.findById(req.params.id).populate(
            'agent',
            'name email avatar phone bio'
        );
        if (!property) return res.status(404).json({ message: 'Property not found' });

        // Increment views
        property.views += 1;
        await property.save();

        res.json({ success: true, property });
    } catch (error) {
        next(error);
    }
};

// @desc    Create property
// @route   POST /api/properties
exports.createProperty = async (req, res, next) => {
    try {
        req.body.agent = req.user._id;

        // Upload images to Cloudinary
        if (req.files && req.files.length > 0) {
            const imagePromises = req.files.map((file) =>
                cloudinary.uploader.upload(file.path, {
                    folder: 'estatex/properties',
                    transformation: [{ width: 1200, height: 800, crop: 'fill' }],
                })
            );
            const results = await Promise.all(imagePromises);
            req.body.images = results.map((r) => r.secure_url);
        }

        // Parse location
        if (req.body.lat && req.body.lng) {
            req.body.location = {
                lat: parseFloat(req.body.lat),
                lng: parseFloat(req.body.lng),
            };
        }

        // Parse amenities if string
        if (typeof req.body.amenities === 'string') {
            req.body.amenities = req.body.amenities.split(',').map((a) => a.trim());
        }

        const property = await Property.create(req.body);
        res.status(201).json({ success: true, property });
    } catch (error) {
        next(error);
    }
};

// @desc    Update property
// @route   PUT /api/properties/:id
exports.updateProperty = async (req, res, next) => {
    try {
        let property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ message: 'Property not found' });

        // Only agent owner or admin can update
        if (
            property.agent.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Upload new images if provided
        if (req.files && req.files.length > 0) {
            const imagePromises = req.files.map((file) =>
                cloudinary.uploader.upload(file.path, {
                    folder: 'estatex/properties',
                    transformation: [{ width: 1200, height: 800, crop: 'fill' }],
                })
            );
            const results = await Promise.all(imagePromises);
            req.body.images = [
                ...(property.images || []),
                ...results.map((r) => r.secure_url),
            ];
        }

        if (req.body.lat && req.body.lng) {
            req.body.location = {
                lat: parseFloat(req.body.lat),
                lng: parseFloat(req.body.lng),
            };
        }

        if (typeof req.body.amenities === 'string') {
            req.body.amenities = req.body.amenities.split(',').map((a) => a.trim());
        }

        property = await Property.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.json({ success: true, property });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
exports.deleteProperty = async (req, res, next) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ message: 'Property not found' });

        if (
            property.agent.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await Property.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Property deleted' });
    } catch (error) {
        next(error);
    }
};

// @desc    Approve property (admin)
// @route   PUT /api/properties/:id/approve
exports.approveProperty = async (req, res, next) => {
    try {
        const property = await Property.findByIdAndUpdate(
            req.params.id,
            { isApproved: req.body.isApproved },
            { new: true }
        );
        if (!property) return res.status(404).json({ message: 'Property not found' });
        res.json({ success: true, property });
    } catch (error) {
        next(error);
    }
};

// @desc    Get my listings (agent)
// @route   GET /api/properties/my-listings
exports.getMyListings = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const total = await Property.countDocuments({ agent: req.user._id });
        const properties = await Property.find({ agent: req.user._id })
            .skip(skip)
            .limit(limit)
            .sort('-createdAt');

        res.json({
            success: true,
            properties,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get AI recommendations
// @route   GET /api/properties/recommended
exports.getRecommended = async (req, res, next) => {
    try {
        // Get user's saved / interacted properties
        const savedProps = await SavedProperty.find({ user: req.user._id }).populate('property');
        const userProperties = savedProps
            .map((s) => s.property)
            .filter(Boolean);

        const allProperties = await Property.find({ isApproved: true })
            .populate('agent', 'name email avatar')
            .limit(100);

        const recommended = getRecommendations(userProperties, allProperties, 6);
        res.json({ success: true, properties: recommended });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all properties for admin (including unapproved)
// @route   GET /api/properties/admin/all
exports.getAllPropertiesAdmin = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = {};
        if (req.query.isApproved !== undefined) {
            filter.isApproved = req.query.isApproved === 'true';
        }

        const total = await Property.countDocuments(filter);
        const properties = await Property.find(filter)
            .populate('agent', 'name email')
            .skip(skip)
            .limit(limit)
            .sort('-createdAt');

        res.json({
            success: true,
            properties,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (error) {
        next(error);
    }
};
