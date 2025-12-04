import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Upload, FileText, Download, Trash2, Sparkles } from 'lucide-react';

const DocumentManager = () => {
    const { id: spaceId } = useParams();
    const [documents, setDocuments] = useState([
        {
            id: 1,
            title: 'Market Research - Q1 2024.pdf',
            url: '#',
            summary: 'Comprehensive market analysis showing 40% YoY growth in target segment.',
            createdAt: '2024-01-15'
        },
        {
            id: 2,
            title: 'User Interview Notes.docx',
            url: '#',
            summary: 'Key insights from 15 user interviews highlighting pain points.',
            createdAt: '2024-01-20'
        },
    ]);
    const [uploading, setUploading] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [aiInsight, setAiInsight] = useState(null);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setTimeout(() => {
            const newDoc = {
                id: Date.now(),
                title: file.name,
                url: '#',
                summary: 'Processing...',
                createdAt: new Date().toISOString()
            };
            setDocuments([newDoc, ...documents]);
            setUploading(false);
        }, 1500);
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

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Documents</h2>
                    <p className="text-gray-600">Upload and analyze your research, plans, and notes</p>
                </div>
                <label className="btn-primary cursor-pointer inline-flex items-center gap-2">
                    <Upload size={18} />
                    {uploading ? 'Uploading...' : 'Upload Document'}
                    <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                </label>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Documents List */}
                <div className="lg:col-span-2 space-y-4">
                    {documents.map((doc) => (
                        <div key={doc.id} className="card hover:border-gray-300 transition-colors">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-start gap-3 flex-1">
                                    <div className="p-2 bg-gray-100 rounded-lg">
                                        <FileText className="text-gray-700" size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 mb-1">{doc.title}</h3>
                                        <p className="text-sm text-gray-600">{doc.summary}</p>
                                        <p className="text-xs text-gray-500 mt-2">
                                            Uploaded {new Date(doc.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => analyzeDocument(doc)}
                                        className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition"
                                        title="AI Analysis"
                                    >
                                        <Sparkles size={18} />
                                    </button>
                                    <button className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition">
                                        <Download size={18} />
                                    </button>
                                    <button className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

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
