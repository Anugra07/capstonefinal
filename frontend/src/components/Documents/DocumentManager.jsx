import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Upload, FileText, Download, Trash2, Sparkles, Edit2, X, Save } from 'lucide-react';
import { SkeletonDocumentCard } from '../Skeleton';
import Pagination from '../Pagination';

const DocumentManager = () => {
    const { id: spaceId } = useParams();
    const [documents, setDocuments] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [aiInsight, setAiInsight] = useState(null);
    const [editingDoc, setEditingDoc] = useState(null);
    const [editForm, setEditForm] = useState({ title: '', summary: '' });
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        if (spaceId) {
            fetchDocuments();
        }
    }, [spaceId]);

    const fetchDocuments = async (page = currentPage) => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:4000/api/documents/${spaceId}?page=${page}&limit=10`);
            if (res.ok) {
                const response = await res.json();
                setDocuments(response.data || []);
                setPagination(response.pagination);
                setCurrentPage(page);
            } else {
                // Handle non-OK responses
                const errorData = await res.json().catch(() => ({ error: 'Failed to fetch documents' }));
                console.error('Error fetching documents:', errorData);
                setDocuments([]);
                setPagination(null);
            }
        } catch (error) {
            console.error('Error fetching documents:', error);
            setDocuments([]);
            setPagination(null);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        fetchDocuments(newPage);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (file.type !== 'application/pdf') {
            alert('Please upload a PDF file');
            return;
        }

        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            alert('File size must be less than 10MB');
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('spaceId', spaceId);

            const res = await fetch('http://localhost:4000/api/documents/upload', {
                method: 'POST',
                body: formData
                // Don't set Content-Type header - browser will set it with boundary
            });

            if (res.ok) {
                const data = await res.json();
                console.log(`PDF uploaded: ${data.extractedLength} characters extracted`);
                // Always refresh from server after upload
                await fetchDocuments(1); // Reset to page 1 to see new document
            } else {
                const error = await res.json();
                alert('Upload failed: ' + (error.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error uploading document:', error);
            alert('Upload failed: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const analyzeDocument = (doc) => {
        setSelectedDoc(doc);
        setAiInsight({
            strengths: [
                'Strong market validation data',
                'Clear target audience definition',
                'Competitive advantage identified'
            ],
            gaps: [
                'Missing pricing strategy',
                'No go-to-market timeline',
                'Limited competitor analysis'
            ],
            recommendations: [
                'Define pricing tiers based on customer segments',
                'Create a 6-month GTM roadmap',
                'Conduct deeper competitive research'
            ]
        });
    };

    const handleEditDocument = (doc) => {
        setEditingDoc(doc.id);
        setEditForm({ title: doc.title, summary: doc.summary || '' });
    };

    const handleCancelEdit = () => {
        setEditingDoc(null);
        setEditForm({ title: '', summary: '' });
    };

    const handleUpdateDocument = async (docId) => {
        try {
            const res = await fetch(`http://localhost:4000/api/documents/${docId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm)
            });

            if (res.ok) {
                setEditingDoc(null);
                setEditForm({ title: '', summary: '' });
                // Always refresh from server after update
                await fetchDocuments(currentPage); // Refresh documents list from server
            } else {
                const error = await res.json();
                alert('Failed to update document: ' + (error.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error updating document:', error);
            alert('Failed to update document: ' + error.message);
        }
    };

    const handleDeleteDocument = async (docId) => {
        if (!confirm('Are you sure you want to delete this document?')) return;

        try {
            const res = await fetch(`http://localhost:4000/api/documents/${docId}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                // Always refresh from server after delete
                await fetchDocuments(currentPage); // Refresh documents list from server
                // Clear selected doc if it was deleted
                if (selectedDoc?.id === docId) {
                    setSelectedDoc(null);
                    setAiInsight(null);
                }
            } else {
                const error = await res.json();
                alert('Failed to delete document: ' + (error.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error deleting document:', error);
            alert('Failed to delete document: ' + error.message);
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Documents</h2>
                    <p className="text-sm sm:text-base text-gray-600">Upload and analyze your research, plans, and notes</p>
                </div>
                <label className="btn-primary cursor-pointer inline-flex items-center gap-2 w-full sm:w-auto justify-center">
                    <Upload size={18} />
                    {uploading ? 'Uploading...' : 'Upload Document'}
                    <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                </label>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Documents List */}
                <div className="lg:col-span-2 space-y-4">
                    {loading ? (
                        <>
                            <SkeletonDocumentCard />
                            <SkeletonDocumentCard />
                            <SkeletonDocumentCard />
                        </>
                    ) : documents.length === 0 ? (
                        <div className="card text-center py-12">
                            <FileText className="mx-auto text-gray-400 mb-4" size={48} />
                            <p className="text-gray-600 mb-2">No documents yet</p>
                            <p className="text-sm text-gray-500">Upload your first document to get started</p>
                        </div>
                    ) : (
                        documents.map((doc) => (
                        <div key={doc.id} className="card hover:border-gray-300 group">
                            {editingDoc === doc.id ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Title
                                        </label>
                                        <input
                                            type="text"
                                            className="input-field"
                                            value={editForm.title}
                                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Summary
                                        </label>
                                        <textarea
                                            className="input-field h-32 resize-none"
                                            value={editForm.summary}
                                            onChange={(e) => setEditForm({ ...editForm, summary: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={handleCancelEdit}
                                            className="btn-secondary inline-flex items-center gap-2"
                                        >
                                            <X size={16} /> Cancel
                                        </button>
                                        <button
                                            onClick={() => handleUpdateDocument(doc.id)}
                                            className="btn-primary inline-flex items-center gap-2"
                                        >
                                            <Save size={16} /> Save
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                                    <div className="flex items-start gap-3 flex-1 min-w-0">
                                        <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0 group-hover:bg-emerald-50 transition-colors">
                                            <FileText className="text-gray-700 group-hover:text-emerald-600 transition-colors" size={20} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900 mb-1 truncate">{doc.title}</h3>
                                            <p className="text-sm text-gray-600 line-clamp-2">{doc.summary}</p>
                                            <p className="text-xs text-gray-500 mt-2">
                                                Uploaded {new Date(doc.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 flex-shrink-0">
                                        <button
                                            onClick={() => analyzeDocument(doc)}
                                            className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
                                            title="AI Analysis"
                                        >
                                            <Sparkles size={18} className="transition-transform hover:rotate-12" />
                                        </button>
                                        <button
                                            onClick={() => handleEditDocument(doc)}
                                            className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
                                            title="Edit document"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95">
                                            <Download size={18} className="transition-transform hover:translate-y-[-2px]" />
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteDocument(doc.id)}
                                            className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
                                            title="Delete document"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {pagination && <Pagination pagination={pagination} onPageChange={handlePageChange} />}

                {/* AI Insights Panel */}
                <div className="card bg-gradient-to-br from-emerald-50 to-white border-emerald-200">
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles size={20} className="text-emerald-600" />
                        <h3 className="font-semibold text-gray-900">AI Document Coach</h3>
                    </div>

                    {selectedDoc ? (
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-sm font-semibold text-emerald-700 mb-2">✓ Strengths</h4>
                                <ul className="text-sm text-gray-700 space-y-1">
                                    {aiInsight?.strengths.map((item, i) => (
                                        <li key={i} className="flex gap-2">
                                            <span className="text-emerald-600">•</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-sm font-semibold text-amber-600 mb-2">⚠ Gaps</h4>
                                <ul className="text-sm text-gray-700 space-y-1">
                                    {aiInsight?.gaps.map((item, i) => (
                                        <li key={i} className="flex gap-2">
                                            <span className="text-amber-600">•</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">💡 Recommendations</h4>
                                <ul className="text-sm text-gray-700 space-y-1">
                                    {aiInsight?.recommendations.map((item, i) => (
                                        <li key={i} className="flex gap-2">
                                            <span className="text-gray-600">•</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-600">
                            Click the <Sparkles size={14} className="inline text-emerald-600" /> icon on any document to get AI-powered insights.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DocumentManager;
