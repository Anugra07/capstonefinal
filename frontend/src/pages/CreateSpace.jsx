import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CreateSpace = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        problemStatement: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('http://localhost:4000/api/spaces', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    userId: user?.id || 'test-user-id' // Fallback for dev without auth
                })
            });

            const data = await response.json();
            if (response.ok) {
                navigate(`/space/${data.id}`);
            } else {
                alert('Failed to create space');
            }
        } catch (error) {
            console.error(error);
            // For demo purposes if backend fails
            navigate('/space/demo-space-id');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-slate-800 p-8 rounded-2xl border border-slate-700">
                <h2 className="text-3xl font-bold mb-2">Create your Space</h2>
                <p className="text-slate-400 mb-8">This will be the home for your startup journey.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Startup Name</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">One-line Description</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Problem Statement (Optional)</label>
                        <textarea
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none h-24"
                            value={formData.problemStatement}
                            onChange={(e) => setFormData({ ...formData, problemStatement: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
                    >
                        {loading ? 'Creating...' : 'Launch Space'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateSpace;
