const express = require('express');
const {
    createInquiry,
    getMyInquiries,
    getAgentInquiries,
    updateInquiry,
} = require('../controllers/inquiryController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, createInquiry);
router.get('/my', protect, getMyInquiries);
router.get('/agent', protect, authorize('agent', 'admin'), getAgentInquiries);
router.put('/:id', protect, authorize('agent', 'admin'), updateInquiry);

module.exports = router;
