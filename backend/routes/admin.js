const express = require('express');
const { getAnalytics } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/analytics', protect, authorize('admin'), getAnalytics);

module.exports = router;
