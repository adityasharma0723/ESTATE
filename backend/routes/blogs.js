const express = require('express');
const {
    getBlogs,
    getBlog,
    createBlog,
    updateBlog,
    deleteBlog,
    getAllBlogsAdmin,
} = require('../controllers/blogController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', getBlogs);
router.get('/admin/all', protect, authorize('admin'), getAllBlogsAdmin);
router.get('/:slug', getBlog);
router.post('/', protect, authorize('admin'), upload.single('coverImage'), createBlog);
router.put('/:id', protect, authorize('admin'), upload.single('coverImage'), updateBlog);
router.delete('/:id', protect, authorize('admin'), deleteBlog);

module.exports = router;
