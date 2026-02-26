const User = require('../models/User');
const Property = require('../models/Property');
const Inquiry = require('../models/Inquiry');
const Review = require('../models/Review');
const Blog = require('../models/Blog');

// @desc    Get site analytics
// @route   GET /api/admin/analytics
exports.getAnalytics = async (req, res, next) => {
    try {
        const [totalUsers, totalAgents, totalProperties, totalInquiries, totalReviews, totalBlogs] =
            await Promise.all([
                User.countDocuments({ role: 'user' }),
                User.countDocuments({ role: 'agent' }),
                Property.countDocuments(),
                Inquiry.countDocuments(),
                Review.countDocuments(),
                Blog.countDocuments(),
            ]);

        const pendingProperties = await Property.countDocuments({ isApproved: false });
        const activeListings = await Property.countDocuments({ isApproved: true });
        const forSale = await Property.countDocuments({ isApproved: true, status: 'For Sale' });
        const forRent = await Property.countDocuments({ isApproved: true, status: 'For Rent' });

        // Monthly registrations for chart (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyUsers = await User.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
        ]);

        const monthlyProperties = await Property.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
        ]);

        // Top cities
        const topCities = await Property.aggregate([
            { $match: { isApproved: true } },
            { $group: { _id: '$city', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
        ]);

        // Property type distribution
        const propertyTypes = await Property.aggregate([
            { $match: { isApproved: true } },
            { $group: { _id: '$propertyType', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);

        res.json({
            success: true,
            stats: {
                totalUsers,
                totalAgents,
                totalProperties,
                totalInquiries,
                totalReviews,
                totalBlogs,
                pendingProperties,
                activeListings,
                forSale,
                forRent,
            },
            charts: {
                monthlyUsers,
                monthlyProperties,
                topCities,
                propertyTypes,
            },
        });
    } catch (error) {
        next(error);
    }
};
