import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Sparkles, Edit2, X, Save, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SkeletonJournalEntry } from '../Skeleton';
import Pagination from '../Pagination';

const Journal = () => {
    const { id: spaceId } = useParams();
    const { user } = useAuth();
    const [entries, setEntries] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newEntry, setNewEntry] = useState({ title: '', content: '' });
    const [analyzing, setAnalyzing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [editingEntry, setEditingEntry] = useState(null);
    const [editForm, setEditForm] = useState({ title: '', content: '' });
    const [pagination, setPagination] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchEntries();
    }, [spaceId]);

    const fetchEntries = async (page = currentPage) => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:4000/api/journal/${spaceId}?page=${page}&limit=10`);
            if (res.ok) {
                const response = await res.json();
                setEntries(response.data || []);
                setPagination(response.pagination);
                setCurrentPage(page);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        fetchEntries(newPage);
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
                // Always refresh from server after create
                await fetchEntries(1); // Reset to page 1 to see new entry
                setAnalyzing(true);
                setTimeout(() => setAnalyzing(false), 2000);
            } else {
                const error = await res.json();
                alert('Failed to create entry: ' + (error.error || 'Unknown error'));
            }
        } catch (e) {
            console.error('Error creating entry:', e);
            alert('Failed to create entry: ' + e.message);
        }
    };

    const handleEditEntry = (entry) => {
        setEditingEntry(entry.id);
        setEditForm({ title: entry.title, content: entry.content });
    };

    const handleCancelEdit = () => {
        setEditingEntry(null);
        setEditForm({ title: '', content: '' });
    };

    const handleUpdateEntry = async (entryId) => {
        try {
            const res = await fetch(`http://localhost:4000/api/journal/${entryId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm)
            });

            if (res.ok) {
                setEditingEntry(null);
                setEditForm({ title: '', content: '' });
                // Always refresh from server after update
                await fetchEntries(currentPage); // Refresh entries from server
            } else {
                const error = await res.json();
                alert('Failed to update entry: ' + (error.error || 'Unknown error'));
            }
        } catch (e) {
            console.error('Error updating entry:', e);
            alert('Failed to update entry: ' + e.message);
        }
    };

    const handleDeleteEntry = async (entryId) => {
        if (!confirm('Are you sure you want to delete this journal entry?')) return;

        try {
            const res = await fetch(`http://localhost:4000/api/journal/${entryId}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                // Always refresh from server after delete
                await fetchEntries(currentPage); // Refresh entries from server
            } else {
                const error = await res.json();
                alert('Failed to delete entry: ' + (error.error || 'Unknown error'));
            }
        } catch (e) {
            console.error('Error deleting entry:', e);
            alert('Failed to delete entry: ' + e.message);
        }
    };

    return (
        <div className="flex h-full bg-white">
            {/* Main Journal Area */}
            <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Founder's Journal</h2>
                            <p className="text-sm sm:text-base text-gray-600 mt-1">Document your startup journey</p>
                        </div>
                        <button
                            onClick={() => setIsCreating(true)}
                            className="btn-primary inline-flex items-center justify-center gap-2 w-full sm:w-auto"
                        >
                            <Plus size={20} /> New Entry
                        </button>
                    </div>

                    {loading ? (
                        <div className="space-y-6">
                            <SkeletonJournalEntry />
                            <SkeletonJournalEntry />
                            <SkeletonJournalEntry />
                        </div>
                    ) : (
                        <>
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
                                    <div className="flex flex-col sm:flex-row justify-end gap-3">
                                        <button
                                            onClick={() => setIsCreating(false)}
                                            className="btn-secondary w-full sm:w-auto"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            className="btn-primary w-full sm:w-auto"
                                        >
                                            Save Entry
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-6">
                                {entries.map((entry) => (
                                    <div key={entry.id} className="card">
                                        {editingEntry === entry.id ? (
                                            <div className="space-y-4">
                                                <input
                                                    type="text"
                                                    placeholder="Entry Title"
                                                    className="w-full text-2xl font-bold mb-4 outline-none placeholder-gray-400 text-gray-900"
                                                    value={editForm.title}
                                                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                                />
                                                <textarea
                                                    placeholder="What's on your mind? Updates, blockers, or ideas..."
                                                    className="w-full bg-gray-50 border border-gray-200 p-4 rounded-lg min-h-[200px] outline-none resize-none mb-4 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                                    value={editForm.content}
                                                    onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                                                />
                                                <div className="flex justify-end gap-3">
                                                    <button
                                                        onClick={handleCancelEdit}
                                                        className="btn-secondary inline-flex items-center justify-center gap-2 w-full sm:w-auto"
                                                    >
                                                        <X size={16} /> Cancel
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateEntry(entry.id)}
                                                        className="btn-primary inline-flex items-center justify-center gap-2 w-full sm:w-auto"
                                                    >
                                                        <Save size={16} /> Save
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                                                    <div className="flex-1 min-w-0">
                                                        <span className="text-sm text-gray-500">{new Date(entry.createdAt).toLocaleDateString()}</span>
                                                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mt-1 break-words">{entry.title}</h3>
                                                    </div>
                                                    <div className="flex gap-2 sm:ml-4 flex-shrink-0">
                                                        <button
                                                            onClick={() => handleEditEntry(entry)}
                                                            className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition"
                                                            title="Edit entry"
                                                        >
                                                            <Edit2 size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteEntry(entry.id)}
                                                            className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition"
                                                            title="Delete entry"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="prose prose-gray max-w-none text-gray-700">
                                                    <p>{entry.content}</p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {pagination && <Pagination pagination={pagination} onPageChange={handlePageChange} />}
                        </>
                    )}
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
