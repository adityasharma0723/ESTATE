const socketIO = require('socket.io');

const initSocket = (server) => {
    const io = socketIO(server, {
        cors: {
            origin: process.env.CLIENT_URL || 'http://localhost:5173',
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });

    // Track online users
    const onlineUsers = new Map();

    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        // User joins with their user ID
        socket.on('user_online', (userId) => {
            onlineUsers.set(userId, socket.id);
            io.emit('online_users', Array.from(onlineUsers.keys()));
        });

        // Join a chat room
        socket.on('join_chat', (chatId) => {
            socket.join(chatId);
        });

        // Leave a chat room
        socket.on('leave_chat', (chatId) => {
            socket.leave(chatId);
        });

        // Send message — broadcast to room
        socket.on('send_message', (data) => {
            const { chatId, message } = data;
            socket.to(chatId).emit('receive_message', { chatId, message });
        });

        // Typing indicator
        socket.on('typing', (data) => {
            socket.to(data.chatId).emit('user_typing', {
                chatId: data.chatId,
                userId: data.userId,
            });
        });

        socket.on('stop_typing', (data) => {
            socket.to(data.chatId).emit('user_stop_typing', {
                chatId: data.chatId,
                userId: data.userId,
            });
        });

        // Disconnect
        socket.on('disconnect', () => {
            // Remove from online users
            for (const [userId, socketId] of onlineUsers.entries()) {
                if (socketId === socket.id) {
                    onlineUsers.delete(userId);
                    break;
                }
            }
            io.emit('online_users', Array.from(onlineUsers.keys()));
            console.log('User disconnected:', socket.id);
        });
    });

    return io;
};

module.exports = initSocket;
