import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Send, Paperclip, Smile } from 'lucide-react';
import { supabase } from '../../supabaseClient';

const ChatRoom = () => {
    const { id: spaceId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Initial fetch (mock for now as backend route not fully connected to DB for messages yet)
        // In real implementation: fetch from /api/messages/:spaceId
        setMessages([
            { id: 1, user: 'Alice', content: 'Hey team, did we finish the user interviews?', time: '10:00 AM', isMe: false },
            { id: 2, user: 'Bob', content: 'Yes, I uploaded the notes to the Docs section.', time: '10:05 AM', isMe: false },
        ]);

        // Realtime subscription
        const channel = supabase
            .channel(`space-${spaceId}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'Message', filter: `spaceId=eq.${spaceId}` }, (payload) => {
                setMessages(prev => [...prev, payload.new]);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [spaceId]);

    const handleSend = () => {
        if (!newMessage.trim()) return;

        // Optimistic update
        const msg = {
            id: Date.now(),
            user: 'Me',
            content: newMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: true
        };
        setMessages([...messages, msg]);
        setNewMessage('');

        // Scroll to bottom
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    };

    return (
        <div className="flex flex-col h-full bg-slate-900">
            <div className="p-4 border-b border-slate-700 bg-slate-800">
                <h2 className="font-bold">Team Chat</h2>
                <p className="text-xs text-slate-400">3 members online</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] ${msg.isMe ? 'bg-blue-600' : 'bg-slate-700'} rounded-xl p-3`}>
                            {!msg.isMe && <p className="text-xs font-bold text-slate-300 mb-1">{msg.user}</p>}
                            <p className="text-sm">{msg.content}</p>
                            <p className="text-[10px] text-slate-300/70 mt-1 text-right">{msg.time}</p>
                        </div>
                    </div>
                ))}
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
