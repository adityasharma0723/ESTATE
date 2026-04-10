import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, Link } from 'react-router-dom';
import { fetchChats, setActiveChat, addMessage } from '../../store/slices/chatSlice';
import API from '../../api/axios';
import { io } from 'socket.io-client';
import { HiPaperAirplane, HiSparkles, HiExternalLink } from 'react-icons/hi';

const AI_CHAT_ID = '__ai_assistant__';

const Chat = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { user } = useSelector((state) => state.auth);
    const { chats, activeChat } = useSelector((state) => state.chat);
    const [message, setMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [aiMessages, setAiMessages] = useState([
        {
            _id: 'welcome',
            sender: 'ai',
            text: "Hello! 👋 I'm the EstateX AI Assistant. I can help you:\n\n🔍 **Search properties** — Try: \"Show me apartments in Mumbai\"\n💰 **Filter by budget** — Try: \"Villas under 2 Cr\"\n🏠 **Find by type** — Try: \"3 BHK flats for rent in Pune\"\n📊 **Get market insights** — Ask about any city\n\nHow can I help you today?",
            timestamp: new Date().toISOString(),
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const [isAiMode, setIsAiMode] = useState(false);
    const socketRef = useRef(null);
    const skipNextChatsUpdate = useRef(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        dispatch(fetchChats());

        socketRef.current = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');
        socketRef.current.emit('user_online', user?._id);

        socketRef.current.on('receive_message', (data) => {
            if (data.chatId) {
                dispatch(addMessage({ chatId: data.chatId, message: data.message }));
            }
            setChatMessages((prev) => [...prev, data.message]);
            setIsTyping(false);
        });

        return () => { socketRef.current?.disconnect(); };
    }, [dispatch, user]);

    // Auto-select chat if navigated from property details
    useEffect(() => {
        if (location.state?.activeChatId && chats.length > 0) {
            dispatch(setActiveChat(location.state.activeChatId));
            setIsAiMode(false);
        }
    }, [location.state, chats, dispatch]);

    useEffect(() => {
        if (activeChat && !isAiMode) {
            if (skipNextChatsUpdate.current) {
                skipNextChatsUpdate.current = false;
                return;
            }
            const chat = chats.find(c => c._id === activeChat);
            setChatMessages(chat?.messages || []);
            socketRef.current?.emit('join_chat', activeChat);
        }
    }, [activeChat, chats, isAiMode]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages, aiMessages, isTyping]);

    const selectAiChat = () => {
        setIsAiMode(true);
        dispatch(setActiveChat(AI_CHAT_ID));
    };

    const selectAgentChat = (chatId) => {
        setIsAiMode(false);
        dispatch(setActiveChat(chatId));
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        const msgText = message;
        setMessage('');

        if (isAiMode) {
            // AI Assistant mode
            const userMsg = {
                _id: `user-${Date.now()}`,
                sender: user?._id,
                text: msgText,
                timestamp: new Date().toISOString(),
            };
            setAiMessages((prev) => [...prev, userMsg]);
            setIsTyping(true);

            try {
                const { data } = await API.post('/chat/ai-assistant', { text: msgText });
                setTimeout(() => {
                    const aiReply = {
                        _id: `ai-${Date.now()}`,
                        sender: 'ai',
                        text: data.reply,
                        timestamp: new Date().toISOString(),
                    };
                    setAiMessages((prev) => [...prev, aiReply]);
                    setIsTyping(false);
                }, 1200);
            } catch {
                setIsTyping(false);
                const errorMsg = {
                    _id: `ai-err-${Date.now()}`,
                    sender: 'ai',
                    text: "Sorry, I couldn't process that. Please try again!",
                    timestamp: new Date().toISOString(),
                };
                setAiMessages((prev) => [...prev, errorMsg]);
            }
        } else {
            // Agent chat mode
            if (!activeChat) return;
            try {
                const { data } = await API.post(`/chat/${activeChat}/message`, { text: msgText });
                setChatMessages((prev) => [...prev, data.message]);
                socketRef.current?.emit('send_message', { chatId: activeChat, message: data.message });

                if (data.autoReply) {
                    setIsTyping(true);
                    skipNextChatsUpdate.current = true;
                    setTimeout(() => {
                        setChatMessages((prev) => [...prev, data.autoReply]);
                        setIsTyping(false);
                    }, 1500);
                }
            } catch (err) {
                setMessage(msgText);
            }
        }
    };

    const otherUser = (chat) => {
        const participants = chat.participants || [];
        return participants.find(p => p._id !== user?._id) || {};
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    };

    // Render message text with markdown-style bold and property links
    const renderMessageText = (text) => {
        if (!text) return null;
        const parts = text.split(/(\*\*[^*]+\*\*|🔗\s*\/properties\/[a-f0-9]+)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
            }
            if (part.startsWith('🔗')) {
                const url = part.replace('🔗', '').trim();
                return (
                    <Link key={i} to={url} className="inline-flex items-center gap-1 text-primary hover:underline font-medium">
                        <HiExternalLink className="w-3.5 h-3.5" /> View Property
                    </Link>
                );
            }
            return <span key={i}>{part}</span>;
        });
    };

    const currentMessages = isAiMode ? aiMessages : chatMessages;
    const showInput = isAiMode || activeChat;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark pt-20">
            <div className="max-w-6xl mx-auto px-4 py-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Messages</h1>
                <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border overflow-hidden flex h-[70vh]">
                    {/* Sidebar */}
                    <div className="w-80 border-r border-gray-200 dark:border-dark-border flex-shrink-0 overflow-y-auto">
                        {/* AI Assistant — always at top */}
                        <button
                            onClick={selectAiChat}
                            className={`w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 dark:hover:bg-dark/50 border-b border-gray-100 dark:border-dark-border transition-colors ${isAiMode ? 'bg-primary/5 border-l-2 border-l-primary' : ''}`}
                        >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 via-primary to-secondary flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-primary/20">
                                <HiSparkles className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <p className="font-medium text-gray-900 dark:text-white text-sm">AI Assistant</p>
                                    <span className="px-1.5 py-0.5 text-[10px] font-bold bg-primary/10 text-primary rounded-full uppercase tracking-wider">AI</span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-dark-text truncate">Ask me about properties, trends...</p>
                            </div>
                            <span className="w-2.5 h-2.5 bg-green-400 rounded-full flex-shrink-0 animate-pulse" />
                        </button>

                        {/* Agent chats */}
                        {chats.length === 0 ? (
                            <div className="p-6 text-center text-gray-500 dark:text-dark-text">
                                <p className="text-sm">No agent conversations yet</p>
                                <p className="text-xs mt-2 text-gray-400">Visit a property to chat with its agent</p>
                            </div>
                        ) : (
                            chats.map((chat) => {
                                const other = otherUser(chat);
                                return (
                                    <button key={chat._id} onClick={() => selectAgentChat(chat._id)}
                                        className={`w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 dark:hover:bg-dark/50 border-b border-gray-100 dark:border-dark-border transition-colors ${!isAiMode && activeChat === chat._id ? 'bg-primary/5 border-l-2 border-l-primary' : ''}`}>
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold text-sm">
                                            {other.name?.charAt(0) || '?'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 dark:text-white text-sm">{other.name || 'User'}</p>
                                            {chat.lastMessage && <p className="text-xs text-gray-500 dark:text-dark-text truncate">{chat.lastMessage}</p>}
                                            {chat.property && <p className="text-xs text-primary truncate mt-0.5">🏠 {chat.property.title}</p>}
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>

                    {/* Chat area */}
                    <div className="flex-1 flex flex-col">
                        {!showInput ? (
                            <div className="flex-1 flex items-center justify-center text-gray-400 dark:text-dark-text">
                                <div className="text-center">
                                    <p className="text-5xl mb-3">💬</p>
                                    <p>Select a conversation to start chatting</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Header */}
                                <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-border flex items-center gap-3">
                                    {isAiMode ? (
                                        <>
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 via-primary to-secondary flex items-center justify-center text-white shadow-md">
                                                <HiSparkles className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-semibold text-gray-900 dark:text-white text-sm">EstateX AI Assistant</p>
                                                    <span className="px-1.5 py-0.5 text-[9px] font-bold bg-primary/10 text-primary rounded-full uppercase tracking-wider">AI</span>
                                                </div>
                                                <p className="text-xs text-green-500">Always online</p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold text-xs">
                                                {otherUser(chats.find(c => c._id === activeChat) || {}).name?.charAt(0) || '?'}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-white text-sm">
                                                    {otherUser(chats.find(c => c._id === activeChat) || {}).name || 'Chat'}
                                                </p>
                                                <p className="text-xs text-green-500">Online</p>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                    {currentMessages.length === 0 && (
                                        <div className="text-center text-gray-400 dark:text-dark-text py-10">
                                            <p className="text-sm">No messages yet. Say hello! 👋</p>
                                        </div>
                                    )}
                                    {currentMessages.map((msg, i) => {
                                        const isMe = isAiMode
                                            ? msg.sender !== 'ai'
                                            : (msg.sender?._id || msg.sender) === user?._id;
                                        const isAiMsg = isAiMode && msg.sender === 'ai';
                                        return (
                                            <div key={msg._id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[70%] ${isMe ? '' : 'flex gap-2'}`}>
                                                    {!isMe && (
                                                        <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-semibold mt-1 ${isAiMsg
                                                            ? 'bg-gradient-to-br from-amber-400 via-primary to-secondary'
                                                            : 'bg-gradient-to-br from-primary to-secondary'
                                                            }`}>
                                                            {isAiMsg
                                                                ? <HiSparkles className="w-3.5 h-3.5" />
                                                                : (otherUser(chats.find(c => c._id === activeChat) || {}).name?.charAt(0) || '?')
                                                            }
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className={`px-4 py-2.5 rounded-2xl text-sm whitespace-pre-line ${isMe
                                                            ? 'bg-primary text-white rounded-br-md'
                                                            : 'bg-gray-100 dark:bg-dark text-gray-900 dark:text-white rounded-bl-md'
                                                            }`}>
                                                            {renderMessageText(msg.text)}
                                                        </div>
                                                        <p className={`text-[10px] text-gray-400 mt-1 ${isMe ? 'text-right' : 'text-left'}`}>
                                                            {formatTime(msg.timestamp)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {/* Typing indicator */}
                                    {isTyping && (
                                        <div className="flex justify-start">
                                            <div className="flex gap-2">
                                                <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-semibold ${isAiMode
                                                    ? 'bg-gradient-to-br from-amber-400 via-primary to-secondary'
                                                    : 'bg-gradient-to-br from-primary to-secondary'
                                                    }`}>
                                                    {isAiMode
                                                        ? <HiSparkles className="w-3.5 h-3.5" />
                                                        : (otherUser(chats.find(c => c._id === activeChat) || {}).name?.charAt(0) || '?')
                                                    }
                                                </div>
                                                <div className="px-4 py-3 bg-gray-100 dark:bg-dark rounded-2xl rounded-bl-md">
                                                    <div className="flex gap-1">
                                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input */}
                                <form onSubmit={handleSend} className="px-6 py-4 border-t border-gray-200 dark:border-dark-border flex gap-3">
                                    <input type="text" value={message} onChange={(e) => setMessage(e.target.value)}
                                        placeholder={isAiMode ? "Ask about properties, trends, tips..." : "Type a message..."}
                                        className="flex-1 px-4 py-3 bg-gray-50 dark:bg-dark border border-gray-200 dark:border-dark-border rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary" />
                                    <button type="submit" disabled={!message.trim()} className="px-4 py-3 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white rounded-xl transition-colors">
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
