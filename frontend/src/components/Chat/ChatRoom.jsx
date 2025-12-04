import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Send, Paperclip, Smile } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const API_URL = 'http://localhost:4000/api';

const ChatRoom = () => {
    const { id: spaceId } = useParams();
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchMessages();

        // Poll for new messages every 2 seconds
        const interval = setInterval(fetchMessages, 2000);

        return () => clearInterval(interval);
    }, [spaceId]);

    const fetchMessages = async () => {
        try {
            const response = await fetch(`${API_URL}/messages/${spaceId}`);
            if (response.ok) {
                const data = await response.json();
                setMessages(data);
            }
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        }
    };

    const handleSend = async () => {
        if (!newMessage.trim() || !user) return;

        try {
            const response = await fetch(`${API_URL}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    spaceId,
                    userId: user.id,
                    content: newMessage
                })
            });

            if (response.ok) {
                setNewMessage('');
                fetchMessages(); // Refresh messages immediately
                setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
            }
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="flex flex-col h-full bg-slate-900">
            <div className="p-4 border-b border-slate-700 bg-slate-800">
                <h2 className="font-bold">Team Chat</h2>
                <p className="text-xs text-slate-400">Real-time collaboration</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => {
                    const isMe = user && msg.userId === user.id;
                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] ${isMe ? 'bg-blue-600' : 'bg-slate-700'} rounded-xl p-3`}>
                                {!isMe && (
                                    <p className="text-xs font-bold text-slate-300 mb-1">
                                        {msg.user?.name || msg.user?.email || 'Unknown'}
                                    </p>
                                )}
                                <p className="text-sm">{msg.content}</p>
                                <p className="text-[10px] text-slate-300/70 mt-1 text-right">
                                    {formatTime(msg.createdAt)}
                                </p>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-slate-800 border-t border-slate-700">
                <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-lg border border-slate-700">
                    <button className="p-2 text-slate-400 hover:text-white transition">
                        <Paperclip size={20} />
                    </button>
                    <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 bg-transparent outline-none text-white"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button className="p-2 text-slate-400 hover:text-white transition">
                        <Smile size={20} />
                    </button>
                    <button
                        onClick={handleSend}
                        className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatRoom;
