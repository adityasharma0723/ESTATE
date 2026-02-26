const express = require('express');
const {
    getChats,
    getOrCreateChat,
    sendMessage,
} = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getChats);
router.post('/:propertyId', protect, getOrCreateChat);
router.post('/:chatId/message', protect, sendMessage);

module.exports = router;
