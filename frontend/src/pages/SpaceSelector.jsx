import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, ArrowRight, Search, Send, CheckCircle2, Clock, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SpaceSelector = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [inviteCode, setInviteCode] = useState('');
    const [joining, setJoining] = useState(false);
    const [error, setError] = useState('');
    const [spaces, setSpaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [selectedSpace, setSelectedSpace] = useState(null);
    const [applyReason, setApplyReason] = useState('');
    const [applying, setApplying] = useState(false);
    const [userSpaces, setUserSpaces] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);

    useEffect(() => {
        fetchSpaces();
        if (user) {
            fetchUserSpaces();
            fetchPendingRequests();
        }
    }, [user]);

    const fetchSpaces = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:4000/api/spaces');
            if (response.ok) {
                const data = await response.json();
                setSpaces(data);
            }
        } catch (error) {
            console.error('Error fetching spaces:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserSpaces = async () => {
        try {
            // Get user's spaces from auth context or make a separate call
            // For now, we'll check membership by comparing space IDs
        } catch (error) {
            console.error('Error fetching user spaces:', error);
        }
    };

    const fetchPendingRequests = async () => {
        if (!user) return;
        try {
            // We'll track pending requests locally for now
            // In a real app, you might want to fetch this from an endpoint
        } catch (error) {
            console.error('Error fetching pending requests:', error);
        }
    };

    const handleJoin = async () => {
        if (!inviteCode.trim()) {
            setError('Please enter an invite code');
            return;
        }

        if (!user) {
            setError('Please log in to join a space');
            return;
        }

        setJoining(true);
        setError('');
        try {
            const response = await fetch('http://localhost:4000/api/spaces/join', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    inviteToken: inviteCode.trim(),
                    userId: user.id
                })
            });

            if (response.ok) {
                const data = await response.json();
                navigate(`/space/${data.space.id}`);
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Invalid invite code');
            }
        } catch (error) {
            console.error(error);
            setError('Failed to join space. Please try again.');
        } finally {
            setJoining(false);
        }
    };

    const handleApply = (space) => {
        if (!user) {
            navigate('/login');
            return;
        }
        setSelectedSpace(space);
        setShowApplyModal(true);
        setApplyReason('');
    };

    const submitApplication = async () => {
        if (!selectedSpace || !user) return;

        setApplying(true);
        try {
            const response = await fetch(`http://localhost:4000/api/spaces/${selectedSpace.id}/request`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    reason: applyReason.trim() || null
                })
            });

            if (response.ok) {
                const requestData = await response.json();
                setPendingRequests([...pendingRequests, { spaceId: selectedSpace.id, requestId: requestData.id }]);
                setShowApplyModal(false);
                setSelectedSpace(null);
                setApplyReason('');
                alert('Application submitted! You will be notified when the admin reviews your request.');
            } else {
                const errorData = await response.json();
                alert(errorData.error || 'Failed to submit application');
            }
        } catch (error) {
            console.error('Error submitting application:', error);
            alert('Failed to submit application. Please try again.');
        } finally {
            setApplying(false);
        }
    };

    const isUserMember = (space) => {
        // Check if user is already a member
        return space.members?.some(m => m.user?.id === user?.id);
    };

    const hasPendingRequest = (space) => {
        // Check if user has a pending request for this space
        return pendingRequests.some(r => r.spaceId === space.id);
    };

    const filteredSpaces = spaces.filter(space => {
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            return space.name.toLowerCase().includes(term) ||
                   space.description?.toLowerCase().includes(term);
        }
        return true;
    });

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8 sm:mb-12">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Find Your Team</h1>
                    <p className="text-base sm:text-lg text-gray-600">Browse available spaces or create your own</p>
                </div>

                {/* Search and Create */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search spaces..."
                            className="input-field pl-10 w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => navigate('/create-space')}
                        className="btn-primary inline-flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                        <Plus size={20} />
                        Create Space
                    </button>
                </div>

                {/* Invite Code Section */}
                <div className="card mb-8 bg-gradient-to-r from-emerald-50 to-white border-emerald-200">
                    <h3 className="font-semibold text-gray-900 mb-3">Have an invite code?</h3>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="text"
                            placeholder="Enter invite code"
                            className="input-field flex-1"
                            value={inviteCode}
                            onChange={(e) => {
                                setInviteCode(e.target.value);
                                setError('');
                            }}
                            onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
                        />
                        <button
                            onClick={handleJoin}
                            disabled={joining || !inviteCode.trim() || !user}
                            className="btn-secondary inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                        >
                            {joining ? 'Joining...' : 'Join'}
                            <ArrowRight size={18} />
                        </button>
                    </div>
                    {error && (
                        <p className="text-sm text-red-600 mt-2">{error}</p>
                    )}
                    {!user && (
                        <p className="text-xs text-gray-500 mt-2">
                            Please <a href="/login" className="text-emerald-600 hover:underline">log in</a> to join
                        </p>
                    )}
                </div>

                {/* Spaces Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="card animate-pulse">
                                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            </div>
                        ))}
                    </div>
                ) : filteredSpaces.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 mb-4">No spaces found</p>
                        <button
                            onClick={() => navigate('/create-space')}
                            className="btn-primary inline-flex items-center gap-2"
                        >
                            <Plus size={20} />
                            Create the first space
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredSpaces.map((space) => {
                            const isMember = isUserMember(space);
                            const hasPending = hasPendingRequest(space);
                            const memberCount = space._count?.members || space.members?.length || 0;

                            return (
                                <div key={space.id} className="card hover:border-gray-300 transition-all">
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="text-lg font-semibold text-gray-900 flex-1">{space.name}</h3>
                                        {isMember && (
                                            <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                                                Member
                                            </span>
                                        )}
                                        {hasPending && (
                                            <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full flex items-center gap-1">
                                                <Clock size={12} />
                                                Pending
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                        {space.description || 'No description'}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                                        <Users size={14} />
                                        <span>{memberCount} {memberCount === 1 ? 'member' : 'members'}</span>
                                    </div>
                                    {!isMember && !hasPending && user && (
                                        <button
                                            onClick={() => handleApply(space)}
                                            className="btn-secondary w-full inline-flex items-center justify-center gap-2 text-sm"
                                        >
                                            <Send size={16} />
                                            Apply to Join
                                        </button>
                                    )}
                                    {isMember && (
                                        <button
                                            onClick={() => navigate(`/space/${space.id}`)}
                                            className="btn-primary w-full inline-flex items-center justify-center gap-2 text-sm"
                                        >
                                            Open Space
                                            <ArrowRight size={16} />
                                        </button>
                                    )}
                                    {!user && (
                                        <p className="text-xs text-gray-500 text-center mt-2">
                                            <a href="/login" className="text-emerald-600 hover:underline">Log in</a> to apply
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Apply Modal */}
                {showApplyModal && selectedSpace && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-gray-900">Apply to Join</h2>
                                <button
                                    onClick={() => {
                                        setShowApplyModal(false);
                                        setSelectedSpace(null);
                                        setApplyReason('');
                                    }}
                                    className="p-1 hover:bg-gray-100 rounded-lg transition"
                                >
                                    <X size={20} className="text-gray-500" />
                                </button>
                            </div>
                            <div className="mb-4">
                                <h3 className="font-semibold text-gray-900 mb-2">{selectedSpace.name}</h3>
                                <p className="text-sm text-gray-600">{selectedSpace.description || 'No description'}</p>
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Why do you want to join? (Optional)
                                </label>
                                <textarea
                                    className="input-field h-32 resize-none"
                                    placeholder="Tell the team why you'd like to join..."
                                    value={applyReason}
                                    onChange={(e) => setApplyReason(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowApplyModal(false);
                                        setSelectedSpace(null);
                                        setApplyReason('');
                                    }}
                                    className="btn-secondary flex-1"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={submitApplication}
                                    disabled={applying}
                                    className="btn-primary flex-1 inline-flex items-center justify-center gap-2"
                                >
                                    {applying ? 'Submitting...' : 'Submit Application'}
                                    <Send size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SpaceSelector;
