const Review = require('../models/Review');

// @desc    Create review
// @route   POST /api/reviews
exports.createReview = async (req, res, next) => {
    try {
        const { propertyId, rating, comment } = req.body;

        const existing = await Review.findOne({
            user: req.user._id,
            property: propertyId,
        });
        if (existing) {
            return res.status(400).json({ message: 'You already reviewed this property' });
        }

        const review = await Review.create({
            user: req.user._id,
            property: propertyId,
            rating,
            comment,
        });

        await review.populate('user', 'name avatar');
        res.status(201).json({ success: true, review });
    } catch (error) {
        next(error);
    }
};

// @desc    Get reviews for a property
// @route   GET /api/reviews/property/:id
exports.getPropertyReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find({ property: req.params.id })
            .populate('user', 'name avatar')
            .sort('-createdAt');

        const avgRating =
            reviews.length > 0
                ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
                : 0;

        res.json({ success: true, reviews, avgRating: Math.round(avgRating * 10) / 10 });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete review (admin)
// @route   DELETE /api/reviews/:id
exports.deleteReview = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ message: 'Review not found' });

        if (
            review.user.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await Review.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Review deleted' });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all reviews (admin)
// @route   GET /api/reviews
exports.getAllReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find()
            .populate('user', 'name email')
            .populate('property', 'title')
            .sort('-createdAt');

        res.json({ success: true, reviews });
    } catch (error) {
        next(error);
    }
};
