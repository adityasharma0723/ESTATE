const express = require('express');
const {
    createCheckoutSession,
    handleWebhook,
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post(
    '/create-checkout',
    protect,
    authorize('agent', 'admin'),
    createCheckoutSession
);

// Webhook — uses raw body (configured in server.js)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

module.exports = router;
