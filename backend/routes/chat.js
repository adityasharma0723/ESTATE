const express = require('express');
const {
    getChats,
    getOrCreateChat,
    sendMessage,
    aiAssistant,
} = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getChats);
router.post('/ai-assistant', protect, aiAssistant);
router.post('/:propertyId', protect, getOrCreateChat);
router.post('/:chatId/message', protect, sendMessage);

module.exports = router;
