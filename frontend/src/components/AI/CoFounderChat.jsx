
import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Bot, X, ChevronRight, ChevronLeft } from 'lucide-react';

const CoFounderChat = ({ isOpen, onClose, space }) => {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: `Hi! I'm your AI Co-founder. I'm monitoring everything happening in ${space?.name || 'your startup'}. Ask me anything about your progress, strategy, or team!`
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading || !space?.id) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:4000/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    spaceId: space.id,
                    query: userMessage.content
                })
            });

            const data = await response.json();

            if (response.ok) {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: data.answer,
                    context: data.context
                }]);
            } else {
                throw new Error('Failed to get response');
            }
        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "I'm having trouble connecting to my brain right now. Please try again later."
            }]);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed right-0 top-0 h-screen w-full sm:w-96 bg-white border-l border-gray-200 shadow-2xl flex flex-col z-50 animate-fade-in">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center border border-emerald-200">
                        <Bot size={20} className="text-emerald-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">AI Co-founder</h3>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                            <span className="text-xs text-gray-500 font-medium">Online & Monitoring</span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-500"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-white">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex flex - col ${msg.role === 'user' ? 'items-end' : 'items-start'} `}>
                        <div className={`max - w - [85 %] rounded - 2xl px - 4 py - 3 ${msg.role === 'user'
                            ? 'bg-gray-900 text-white rounded-tr-none'
                            : 'bg-gray-50 border border-gray-200 text-gray-800 rounded-tl-none'
                            } `}>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        </div>

                        {/* Context Sources */}
                        {msg.context && msg.context.length > 0 && (
                            <div className="mt-2 ml-2 max-w-[85%]">
                                <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                                    <Sparkles size={10} />
                                    Sources used:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {msg.context.slice(0, 3).map((ctx, i) => (
                                        <span key={i} className="text-[10px] px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full truncate max-w-[150px]">
                                            {ctx.type}: {ctx.content.substring(0, 20)}...
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {loading && (
                    <div className="flex items-start">
                        <div className="bg-gray-50 border border-gray-200 rounded-2xl rounded-tl-none px-4 py-3">
                            <div className="flex gap-1">
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="relative">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder="Ask for strategy, analysis, or advice..."
                        className="w-full bg-white border border-gray-300 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none h-[52px] scrollbar-hide"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || loading}
                        className="absolute right-2 top-2 p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        <Send size={16} className="transition-transform hover:translate-x-0.5" />
                    </button>
                </div>
                <p className="text-center text-[10px] text-gray-400 mt-2">
                    AI can make mistakes. Verify important information.
                </p>
            </div>
        </div>
    );
};

export default CoFounderChat;
