const Blog = require('../models/Blog');
const cloudinary = require('../config/cloudinary');

// @desc    Get all published blogs
// @route   GET /api/blogs
exports.getBlogs = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;
        const skip = (page - 1) * limit;

        const filter = { isPublished: true };
        if (req.query.tag) filter.tags = req.query.tag;

        const total = await Blog.countDocuments(filter);
        const blogs = await Blog.find(filter)
            .populate('author', 'name avatar')
            .skip(skip)
            .limit(limit)
            .sort('-createdAt');

        res.json({
            success: true,
            blogs,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single blog by slug
// @route   GET /api/blogs/:slug
exports.getBlog = async (req, res, next) => {
    try {
        const blog = await Blog.findOne({ slug: req.params.slug }).populate(
            'author',
            'name avatar bio'
        );
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        res.json({ success: true, blog });
    } catch (error) {
        next(error);
    }
};

// @desc    Create blog (admin)
// @route   POST /api/blogs
exports.createBlog = async (req, res, next) => {
    try {
        req.body.author = req.user._id;

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'estatex/blogs',
            });
            req.body.coverImage = result.secure_url;
        }

        if (typeof req.body.tags === 'string') {
            req.body.tags = req.body.tags.split(',').map((t) => t.trim());
        }

        const blog = await Blog.create(req.body);
        res.status(201).json({ success: true, blog });
    } catch (error) {
        next(error);
    }
};

// @desc    Update blog (admin)
// @route   PUT /api/blogs/:id
exports.updateBlog = async (req, res, next) => {
    try {
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'estatex/blogs',
            });
            req.body.coverImage = result.secure_url;
        }

        if (typeof req.body.tags === 'string') {
            req.body.tags = req.body.tags.split(',').map((t) => t.trim());
        }

        const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        res.json({ success: true, blog });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete blog (admin)
// @route   DELETE /api/blogs/:id
exports.deleteBlog = async (req, res, next) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        res.json({ success: true, message: 'Blog deleted' });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all blogs for admin (including unpublished)
// @route   GET /api/blogs/admin/all
exports.getAllBlogsAdmin = async (req, res, next) => {
    try {
        const blogs = await Blog.find()
            .populate('author', 'name')
            .sort('-createdAt');
        res.json({ success: true, blogs });
    } catch (error) {
        next(error);
    }
};
