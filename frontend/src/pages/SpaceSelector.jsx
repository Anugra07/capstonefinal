import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, ArrowRight } from 'lucide-react';

const SpaceSelector = () => {
    const navigate = useNavigate();
    const [inviteCode, setInviteCode] = useState('');
    const [joining, setJoining] = useState(false);

    const handleJoin = async () => {
        if (!inviteCode.trim()) return;

        setJoining(true);
        try {
            const response = await fetch('http://localhost:4000/api/spaces/join', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ inviteToken: inviteCode })
            });

            if (response.ok) {
                const data = await response.json();
                navigate(`/space/${data.spaceId}`);
            } else {
                alert('Invalid invite code');
            }
        } catch (error) {
            console.error(error);
            alert('Failed to join space');
        } finally {
            setJoining(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="w-full max-w-4xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">Choose your path</h1>
                    <p className="text-lg text-gray-600">Join an existing team or start your own journey</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Join Existing */}
                    <div className="card hover:border-gray-300 transition-all group">
                        <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mb-6 group-hover:bg-emerald-50 transition-colors">
                            <Users className="text-gray-700 group-hover:text-emerald-600 transition-colors" size={32} />
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-3">Join a Team</h2>
                        <p className="text-gray-600 mb-6">
                            Have an invite code? Join your team's workspace and start collaborating.
                        </p>

                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="Enter invite code"
                                className="input-field"
                                value={inviteCode}
                                onChange={(e) => setInviteCode(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
                            />
                            <button
                                onClick={handleJoin}
                                disabled={joining || !inviteCode.trim()}
                                className="btn-secondary w-full inline-flex items-center justify-center gap-2"
                            >
                                {joining ? 'Joining...' : 'Join Team'}
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Create New */}
                    <div className="card bg-gradient-to-br from-gray-900 to-gray-800 text-white hover:shadow-xl transition-all group cursor-pointer"
                        onClick={() => navigate('/create-space')}>
                        <div className="flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-6 group-hover:bg-white/20 transition-colors">
                            <Plus className="text-white" size={32} />
                        </div>

                        <h2 className="text-2xl font-bold mb-3">Create New Space</h2>
                        <p className="text-gray-300 mb-6">
                            Start fresh with your own workspace. Perfect for new startup ideas.
                        </p>

                        <button className="bg-white text-gray-900 hover:bg-gray-100 font-medium px-6 py-3 rounded-lg transition-colors w-full inline-flex items-center justify-center gap-2">
                            Get Started
                            <ArrowRight size={18} />
                        </button>

                        <div className="mt-6 pt-6 border-t border-white/10">
                            <p className="text-sm text-gray-400">
                                ✓ AI-powered insights • ✓ Unlimited members • ✓ Free forever
                            </p>
                        </div>
                    </div>
                </div>

                <p className="text-center text-sm text-gray-500 mt-8">
                    You can always create or join more spaces later
                </p>
            </div>
        </div>
    );
};

export default SpaceSelector;
