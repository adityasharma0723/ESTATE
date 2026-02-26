const express = require('express');
const {
    createReview,
    getPropertyReviews,
    deleteReview,
    getAllReviews,
} = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, createReview);
router.get('/', protect, authorize('admin'), getAllReviews);
router.get('/property/:id', getPropertyReviews);
router.delete('/:id', protect, deleteReview);

module.exports = router;
