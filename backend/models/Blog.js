const mongoose = require('mongoose');
const slugify = require('slugify');

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Blog title is required'],
            trim: true,
            maxlength: 200,
        },
        slug: {
            type: String,
            unique: true,
        },
        content: {
            type: String,
            required: [true, 'Blog content is required'],
        },
        coverImage: {
            type: String,
            default: '',
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        tags: {
            type: [String],
            default: [],
        },
        isPublished: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

blogSchema.pre('save', function (next) {
    if (this.isModified('title')) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    next();
});

module.exports = mongoose.model('Blog', blogSchema);
