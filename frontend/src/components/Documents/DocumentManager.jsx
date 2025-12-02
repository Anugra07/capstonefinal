import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Upload, FileText, Download, Trash2, Sparkles } from 'lucide-react';
import { supabase } from '../../supabaseClient';

const DocumentManager = () => {
    const { id: spaceId } = useParams();
    const [documents, setDocuments] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [aiInsight, setAiInsight] = useState(null);

    useEffect(() => {
        fetchDocuments();
    }, [spaceId]);

    const fetchDocuments = async () => {
        // Mock data for now
        setDocuments([
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
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            // In real app: upload to Supabase Storage
            // const { data, error } = await supabase.storage.from('documents').upload(`${spaceId}/${file.name}`, file);

            // Mock upload
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
        } catch (error) {
            console.error(error);
            setUploading(false);
        }
    };

    const analyzeDocument = (doc) => {
        setSelectedDoc(doc);
        // Mock AI analysis
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
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold mb-2">Documents</h2>
                    <p className="text-slate-400">Upload and analyze your research, plans, and notes.</p>
                </div>
                <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2 transition">
                    <Upload size={18} />
                    {uploading ? 'Uploading...' : 'Upload Document'}
                    <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                </label>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Documents List */}
                <div className="lg:col-span-2 space-y-4">
                    {documents.map((doc) => (
                        <div key={doc.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-slate-600 transition">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-start gap-3 flex-1">
                                    <div className="p-2 bg-blue-500/20 rounded-lg">
                                        <FileText className="text-blue-400" size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium mb-1">{doc.title}</h3>
                                        <p className="text-sm text-slate-400">{doc.summary}</p>
                                        <p className="text-xs text-slate-500 mt-2">
                                            Uploaded {new Date(doc.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => analyzeDocument(doc)}
                                        className="p-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition"
                                        title="AI Analysis"
                                    >
                                        <Sparkles size={18} />
                                    </button>
                                    <button className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition">
                                        <Download size={18} />
                                    </button>
                                    <button className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* AI Insights Panel */}
                <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4 text-purple-400">
                        <Sparkles size={20} />
                        <h3 className="font-bold">AI Document Coach</h3>
                    </div>

                    {selectedDoc ? (
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-sm font-bold text-green-400 mb-2">✓ Strengths</h4>
                                <ul className="text-sm text-slate-300 space-y-1">
                                    {aiInsight?.strengths.map((item, i) => (
                                        <li key={i} className="flex gap-2">
                                            <span>•</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-sm font-bold text-orange-400 mb-2">⚠ Gaps</h4>
                                <ul className="text-sm text-slate-300 space-y-1">
                                    {aiInsight?.gaps.map((item, i) => (
                                        <li key={i} className="flex gap-2">
                                            <span>•</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-sm font-bold text-blue-400 mb-2">💡 Recommendations</h4>
                                <ul className="text-sm text-slate-300 space-y-1">
                                    {aiInsight?.recommendations.map((item, i) => (
                                        <li key={i} className="flex gap-2">
                                            <span>•</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-slate-400">
                            Click the <Sparkles size={14} className="inline" /> icon on any document to get AI-powered insights.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DocumentManager;
