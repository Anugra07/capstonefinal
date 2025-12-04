import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Rocket } from 'lucide-react';

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
                    userId: user.id
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
            navigate('/space/demo-space-id');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="w-full max-w-2xl">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 rounded-2xl mb-4">
                        <Rocket className="text-white" size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Create your workspace</h1>
                    <p className="text-gray-600">This will be the home for your startup journey</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Startup Name *
                            </label>
                            <input
                                type="text"
                                required
                                className="input-field"
                                placeholder="Acme Inc."
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                One-line Description *
                            </label>
                            <input
                                type="text"
                                required
                                className="input-field"
                                placeholder="We help founders build better products"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                            <p className="text-xs text-gray-500 mt-1">A brief description of what you're building</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Problem Statement (Optional)
                            </label>
                            <textarea
                                className="input-field h-32 resize-none"
                                placeholder="What problem are you solving?"
                                value={formData.problemStatement}
                                onChange={(e) => setFormData({ ...formData, problemStatement: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full"
                        >
                            {loading ? 'Creating workspace...' : 'Create workspace'}
                        </button>
                    </form>
                </div>

                <p className="text-center text-sm text-gray-500 mt-6">
                    You can always update these details later in settings
                </p>
            </div>
        </div>
    );
};

export default CreateSpace;
