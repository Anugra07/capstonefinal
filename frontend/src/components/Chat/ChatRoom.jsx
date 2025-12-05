import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Send, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SkeletonChatMessage } from '../Skeleton';

const API_URL = 'http://localhost:4000/api';

const ChatRoom = () => {
    const { id: spaceId } = useParams();
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 2000);
        return () => clearInterval(interval);
    }, [spaceId]);

    const fetchMessages = async () => {
        try {
            // For chat, we want the most recent messages, so get page 1 with limit 50
            const response = await fetch(`${API_URL}/messages/${spaceId}?page=1&limit=50`);
            if (response.ok) {
                const result = await response.json();
                // Handle both old format (array) and new format (object with data)
                const messagesData = result.data || result;
                // Reverse the array since backend returns newest first, but we want oldest first for display
                const reversedMessages = Array.isArray(messagesData) ? [...messagesData].reverse() : [];
                console.log('Fetched messages:', reversedMessages.length, 'messages with user data:', reversedMessages.map(m => ({ id: m.id, userId: m.userId, userName: m.user?.name, userEmail: m.user?.email })));
                setMessages(reversedMessages);
            } else {
                console.error('Failed to fetch messages:', response.statusText);
            }
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!newMessage.trim() || !user || sending) return;

        setSending(true);
        const messageToSend = newMessage.trim();
        setNewMessage(''); // Clear input immediately for better UX

        try {
            const response = await fetch(`${API_URL}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    spaceId,
                    userId: user.id,
                    content: messageToSend
                })
            });

            if (response.ok) {
                // Always refresh from server after sending message
                await fetchMessages(); // Fetch messages to get the new one with user data
            } else {
                // Restore message if send failed
                setNewMessage(messageToSend);
                const error = await response.json();
                alert('Failed to send message: ' + (error.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Failed to send message:', error);
            setNewMessage(messageToSend); // Restore message on error
            alert('Failed to send message. Please try again.');
        } finally {
            setSending(false);
        }
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="font-semibold text-gray-900">Team Chat</h2>
                        <p className="text-xs text-gray-500">Real-time collaboration</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full">
                        <Sparkles size={14} className="text-emerald-600" />
                        <span className="text-xs font-medium text-emerald-700">AI Monitoring</span>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gray-50">
                {loading ? (
                    <div className="space-y-4">
                        <SkeletonChatMessage />
                        <SkeletonChatMessage align="right" />
                        <SkeletonChatMessage />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <p className="text-gray-500 mb-2">No messages yet</p>
                            <p className="text-sm text-gray-400">Start the conversation!</p>
                        </div>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMe = user && msg.userId === user.id;
                        return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] sm:max-w-[70%] ${isMe ? 'bg-gray-900' : 'bg-white border border-gray-200'} rounded-2xl px-3 sm:px-4 py-2 sm:py-3 shadow-sm`}>
                                    {!isMe && (
                                        <p className="text-xs font-semibold text-gray-600 mb-1">
                                            {msg.user?.name || msg.user?.email || 'Unknown'}
                                        </p>
                                    )}
                                    <p className={`text-sm ${isMe ? 'text-white' : 'text-gray-900'} break-words`}>{msg.content}</p>
                                    <p className={`text-[10px] ${isMe ? 'text-gray-400' : 'text-gray-500'} mt-1 text-right`}>
                                        {formatTime(msg.createdAt)}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 sm:p-4 bg-white border-t border-gray-200">
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 p-2 rounded-xl focus-within:ring-2 focus-within:ring-gray-900 focus-within:border-transparent transition">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-400 px-2 text-sm sm:text-base"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!newMessage.trim() || sending || !user}
                        className="p-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatRoom;
