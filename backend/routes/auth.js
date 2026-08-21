const express = require('express');
const {
    register,
    login,
    getMe,
    logout,
    forgotPassword,
    resetPassword,
    contactUs,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.post('/contact', contactUs);


module.exports = router;
