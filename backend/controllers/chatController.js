const Chat = require('../models/Chat');

// @desc    Get user's chats
// @route   GET /api/chat
exports.getChats = async (req, res, next) => {
    try {
        const chats = await Chat.find({ participants: req.user._id })
            .populate('participants', 'name avatar')
            .populate('property', 'title images')
            .sort('-updatedAt');

        res.json({ success: true, chats });
    } catch (error) {
        next(error);
    }
};

// @desc    Get or create chat for a property
// @route   POST /api/chat/:propertyId
exports.getOrCreateChat = async (req, res, next) => {
    try {
        const { agentId } = req.body;

        // Look for existing chat
        let chat = await Chat.findOne({
            property: req.params.propertyId,
            participants: { $all: [req.user._id, agentId] },
        })
            .populate('participants', 'name avatar')
            .populate('property', 'title images');

        if (!chat) {
            chat = await Chat.create({
                participants: [req.user._id, agentId],
                property: req.params.propertyId,
                messages: [],
            });
            await chat.populate('participants', 'name avatar');
            await chat.populate('property', 'title images');
        }

        res.json({ success: true, chat });
    } catch (error) {
        next(error);
    }
};

// @desc    Send message in chat
// @route   POST /api/chat/:chatId/message
exports.sendMessage = async (req, res, next) => {
    try {
        const chat = await Chat.findById(req.params.chatId);
        if (!chat) return res.status(404).json({ message: 'Chat not found' });

        if (!chat.participants.includes(req.user._id)) {
            return res.status(403).json({ message: 'Not a participant' });
        }

        const message = {
            sender: req.user._id,
            text: req.body.text,
            timestamp: new Date(),
        };

        chat.messages.push(message);
        chat.lastMessage = req.body.text;
        await chat.save();

        res.json({ success: true, message: chat.messages[chat.messages.length - 1] });
    } catch (error) {
        next(error);
    }
};
