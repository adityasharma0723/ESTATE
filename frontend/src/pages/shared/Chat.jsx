import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchChats, setActiveChat, addMessage } from '../../store/slices/chatSlice';
import API from '../../api/axios';
import { io } from 'socket.io-client';
import { HiPaperAirplane } from 'react-icons/hi';

const Chat = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { chats, activeChat } = useSelector((state) => state.chat);
    const [message, setMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        dispatch(fetchChats());

        socketRef.current = io('http://localhost:5000');
        socketRef.current.emit('user-online', user?._id);

        socketRef.current.on('new-message', (msg) => {
            setChatMessages((prev) => [...prev, msg]);
        });

        return () => { socketRef.current?.disconnect(); };
    }, [dispatch, user]);

    useEffect(() => {
        if (activeChat) {
            const chat = chats.find(c => c._id === activeChat);
            setChatMessages(chat?.messages || []);
            socketRef.current?.emit('join-chat', activeChat);
        }
    }, [activeChat, chats]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!message.trim() || !activeChat) return;
        try {
            const { data } = await API.post(`/chat/${activeChat}/messages`, { content: message });
            setChatMessages((prev) => [...prev, data.message]);
            socketRef.current?.emit('send-message', { chatId: activeChat, message: data.message });
            setMessage('');
        } catch { }
    };

    const otherUser = (chat) => {
        const participants = chat.participants || [];
        return participants.find(p => p._id !== user?._id) || {};
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark pt-20">
            <div className="max-w-6xl mx-auto px-4 py-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Messages</h1>
                <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border overflow-hidden flex h-[70vh]">
                    {/* Sidebar */}
                    <div className="w-80 border-r border-gray-200 dark:border-dark-border flex-shrink-0 overflow-y-auto">
                        {chats.length === 0 ? (
                            <div className="p-6 text-center text-gray-500 dark:text-dark-text">
                                <p className="text-4xl mb-2">💬</p>
                                <p className="text-sm">No conversations yet</p>
                            </div>
                        ) : (
                            chats.map((chat) => {
                                const other = otherUser(chat);
                                const lastMsg = chat.messages?.[chat.messages.length - 1];
                                return (
                                    <button key={chat._id} onClick={() => dispatch(setActiveChat(chat._id))}
                                        className={`w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 dark:hover:bg-dark/50 border-b border-gray-100 dark:border-dark-border transition-colors ${activeChat === chat._id ? 'bg-primary/5' : ''}`}>
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold text-sm">
                                            {other.name?.charAt(0) || '?'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 dark:text-white text-sm">{other.name || 'User'}</p>
                                            {lastMsg && <p className="text-xs text-gray-500 dark:text-dark-text truncate">{lastMsg.content}</p>}
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>

                    {/* Chat area */}
                    <div className="flex-1 flex flex-col">
                        {!activeChat ? (
                            <div className="flex-1 flex items-center justify-center text-gray-400 dark:text-dark-text">
                                <div className="text-center">
                                    <p className="text-5xl mb-3">💬</p>
                                    <p>Select a conversation to start chatting</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Header */}
                                <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-border">
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        {otherUser(chats.find(c => c._id === activeChat) || {}).name || 'Chat'}
                                    </p>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                    {chatMessages.map((msg, i) => {
                                        const isMe = (msg.sender?._id || msg.sender) === user?._id;
                                        return (
                                            <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${isMe
                                                        ? 'bg-primary text-white rounded-br-md'
                                                        : 'bg-gray-100 dark:bg-dark text-gray-900 dark:text-white rounded-bl-md'
                                                    }`}>
                                                    {msg.content}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input */}
                                <form onSubmit={handleSend} className="px-6 py-4 border-t border-gray-200 dark:border-dark-border flex gap-3">
                                    <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message..."
                                        className="flex-1 px-4 py-3 bg-gray-50 dark:bg-dark border border-gray-200 dark:border-dark-border rounded-xl text-sm focus:outline-none focus:border-primary" />
                                    <button type="submit" className="px-4 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl transition-colors">
                                        <HiPaperAirplane className="w-5 h-5" />
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;
