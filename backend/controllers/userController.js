const User = require('../models/User');
const cloudinary = require('../config/cloudinary');

// @desc    Get all users (admin)
// @route   GET /api/users
exports.getUsers = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = {};
        if (req.query.role) filter.role = req.query.role;
        if (req.query.search) {
            filter.$or = [
                { name: { $regex: req.query.search, $options: 'i' } },
                { email: { $regex: req.query.search, $options: 'i' } },
            ];
        }

        const total = await User.countDocuments(filter);
        const users = await User.find(filter).skip(skip).limit(limit).sort('-createdAt');

        res.json({
            success: true,
            users,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single user
// @route   GET /api/users/:id
exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ success: true, user });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
exports.updateUser = async (req, res, next) => {
    try {
        const { name, phone, bio } = req.body;
        const updateData = {};
        if (name) updateData.name = name;
        if (phone !== undefined) updateData.phone = phone;
        if (bio !== undefined) updateData.bio = bio;

        // Handle avatar upload
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'estatex/avatars',
                width: 300,
                height: 300,
                crop: 'fill',
            });
            updateData.avatar = result.secure_url;
        }

        const user = await User.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ success: true, user });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete user (admin)
// @route   DELETE /api/users/:id
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ success: true, message: 'User deleted' });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user role (admin)
// @route   PUT /api/users/:id/role
exports.updateUserRole = async (req, res, next) => {
    try {
        const { role } = req.body;
        if (!['user', 'agent', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        );
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ success: true, user });
    } catch (error) {
        next(error);
    }
};
