import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Sparkles } from 'lucide-react';

const Journal = () => {
    const { id: spaceId } = useParams();
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
                    userId: 'test-user-id', // Replace with real user
                    ...newEntry
                })
            });

            if (res.ok) {
                setNewEntry({ title: '', content: '' });
                setIsCreating(false);
                fetchEntries();
                // Trigger AI analysis (mock)
                setAnalyzing(true);
                setTimeout(() => setAnalyzing(false), 2000);
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="flex h-full">
            {/* Main Journal Area */}
            <div className="flex-1 p-8 overflow-y-auto">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold">Founder's Journal</h2>
                    <button
                        onClick={() => setIsCreating(true)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                    >
                        <Plus size={20} /> New Entry
                    </button>
                </div>

                {isCreating && (
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 mb-8 animate-fade-in">
                        <input
                            type="text"
                            placeholder="Entry Title"
                            className="w-full bg-transparent text-xl font-bold mb-4 outline-none placeholder-slate-500"
                            value={newEntry.title}
                            onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                        />
                        <textarea
                            placeholder="What's on your mind? Updates, blockers, or ideas..."
                            className="w-full bg-slate-900/50 p-4 rounded-lg min-h-[200px] outline-none resize-none mb-4"
                            value={newEntry.content}
                            onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                        />
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsCreating(false)}
                                className="px-4 py-2 text-slate-400 hover:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium"
                            >
                                Save Entry
                            </button>
                        </div>
                    </div>
                )}

                <div className="space-y-8">
                    {entries.map((entry) => (
                        <div key={entry.id} className="relative pl-8 border-l-2 border-slate-700">
                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-500 ring-4 ring-slate-900"></div>
                            <div className="mb-2">
                                <span className="text-sm text-slate-400">{new Date(entry.createdAt).toLocaleDateString()}</span>
                                <h3 className="text-xl font-bold mt-1">{entry.title}</h3>
                            </div>
                            <div className="prose prose-invert max-w-none text-slate-300">
                                <p>{entry.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* AI Insights Panel */}
            <div className="w-80 bg-slate-800 border-l border-slate-700 p-6 hidden lg:block">
                <div className="flex items-center gap-2 mb-6 text-purple-400">
                    <Sparkles size={20} />
                    <h3 className="font-bold uppercase tracking-wider text-sm">AI Analysis</h3>
                </div>

                {analyzing ? (
                    <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                        <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                            <h4 className="text-sm font-bold text-slate-400 mb-2">Summary</h4>
                            <p className="text-sm text-slate-300">
                                You've been focused on product development but haven't validated the new features with users yet.
                            </p>
                        </div>

                        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                            <h4 className="text-sm font-bold text-slate-400 mb-2">Suggested Actions</h4>
                            <ul className="text-sm text-slate-300 space-y-2 list-disc pl-4">
                                <li>Schedule 3 user calls</li>
                                <li>Update validation metrics</li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Journal;
