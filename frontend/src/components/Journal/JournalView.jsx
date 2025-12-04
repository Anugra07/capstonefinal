import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Journal = () => {
    const { id: spaceId } = useParams();
    const { user } = useAuth();
    const [entries, setEntries] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newEntry, setNewEntry] = useState({ title: '', content: '' });
    const [analyzing, setAnalyzing] = useState(false);

    useEffect(() => {
        fetchEntries();
    }, [spaceId]);

    const fetchEntries = async () => {
        try {
            const res = await fetch(`http://localhost:4000/api/journal/${spaceId}`);
            if (res.ok) {
                const data = await res.json();
                setEntries(data);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleSave = async () => {
        try {
            const res = await fetch('http://localhost:4000/api/journal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    spaceId,
                    userId: user.id,
                    ...newEntry
                })
            });

            if (res.ok) {
                setNewEntry({ title: '', content: '' });
                setIsCreating(false);
                fetchEntries();
                setAnalyzing(true);
                setTimeout(() => setAnalyzing(false), 2000);
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="flex h-full bg-white">
            {/* Main Journal Area */}
            <div className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">Founder's Journal</h2>
                            <p className="text-gray-600 mt-1">Document your startup journey</p>
                        </div>
                        <button
                            onClick={() => setIsCreating(true)}
                            className="btn-primary inline-flex items-center gap-2"
                        >
                            <Plus size={20} /> New Entry
                        </button>
                    </div>

                    {isCreating && (
                        <div className="card mb-8 animate-fade-in">
                            <input
                                type="text"
                                placeholder="Entry Title"
                                className="w-full text-2xl font-bold mb-4 outline-none placeholder-gray-400 text-gray-900"
                                value={newEntry.title}
                                onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                            />
                            <textarea
                                placeholder="What's on your mind? Updates, blockers, or ideas..."
                                className="w-full bg-gray-50 border border-gray-200 p-4 rounded-lg min-h-[200px] outline-none resize-none mb-4 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                value={newEntry.content}
                                onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                            />
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setIsCreating(false)}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="btn-primary"
                                >
                                    Save Entry
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="space-y-6">
                        {entries.map((entry) => (
                            <div key={entry.id} className="card">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <span className="text-sm text-gray-500">{new Date(entry.createdAt).toLocaleDateString()}</span>
                                        <h3 className="text-xl font-bold text-gray-900 mt-1">{entry.title}</h3>
                                    </div>
                                </div>
                                <div className="prose prose-gray max-w-none text-gray-700">
                                    <p>{entry.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* AI Insights Panel */}
            <div className="w-80 bg-gray-50 border-l border-gray-200 p-6 hidden lg:block overflow-y-auto">
                <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="text-emerald-600" size={20} />
                    <h3 className="font-bold text-gray-900">AI Analysis</h3>
                </div>

                {analyzing ? (
                    <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="card-flat">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Summary</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                You've been focused on product development but haven't validated the new features with users yet.
                            </p>
                        </div>

                        <div className="card-flat">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Suggested Actions</h4>
                            <ul className="text-sm text-gray-600 space-y-2">
                                <li className="flex items-start gap-2">
                                    <span className="text-emerald-600 mt-0.5">•</span>
                                    <span>Schedule 3 user calls</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-emerald-600 mt-0.5">•</span>
                                    <span>Update validation metrics</span>
                                </li>
                            </ul>
                        </div>

                        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                            <p className="text-xs text-emerald-700">
                                <Sparkles size={12} className="inline mr-1" />
                                AI is monitoring your entries in real-time
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Journal;
