const SavedProperty = require('../models/SavedProperty');

// @desc    Get saved properties
// @route   GET /api/saved
exports.getSavedProperties = async (req, res, next) => {
    try {
        const saved = await SavedProperty.find({ user: req.user._id })
            .populate({
                path: 'property',
                populate: { path: 'agent', select: 'name avatar' },
            })
            .sort('-createdAt');

        res.json({ success: true, saved });
    } catch (error) {
        next(error);
    }
};

// @desc    Save property
// @route   POST /api/saved/:propertyId
exports.saveProperty = async (req, res, next) => {
    try {
        const existing = await SavedProperty.findOne({
            user: req.user._id,
            property: req.params.propertyId,
        });

        if (existing) {
            return res.status(400).json({ message: 'Property already saved' });
        }

        const saved = await SavedProperty.create({
            user: req.user._id,
            property: req.params.propertyId,
        });

        res.status(201).json({ success: true, saved });
    } catch (error) {
        next(error);
    }
};

// @desc    Unsave property
// @route   DELETE /api/saved/:propertyId
exports.unsaveProperty = async (req, res, next) => {
    try {
        const saved = await SavedProperty.findOneAndDelete({
            user: req.user._id,
            property: req.params.propertyId,
        });

        if (!saved) return res.status(404).json({ message: 'Not in saved list' });
        res.json({ success: true, message: 'Property removed from saved' });
    } catch (error) {
        next(error);
    }
};

// @desc    Check if property is saved
// @route   GET /api/saved/check/:propertyId
exports.checkSaved = async (req, res, next) => {
    try {
        const saved = await SavedProperty.findOne({
            user: req.user._id,
            property: req.params.propertyId,
        });
        res.json({ success: true, isSaved: !!saved });
    } catch (error) {
        next(error);
    }
};
