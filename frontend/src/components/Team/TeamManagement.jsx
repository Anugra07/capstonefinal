import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { UserPlus, Copy, Check, Crown, Shield, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { SkeletonTeamMember, Skeleton } from '../Skeleton';
import { useAuth } from '../../context/AuthContext';

const TeamManagement = () => {
    const { id: spaceId } = useParams();
    const { user } = useAuth();
    const [members, setMembers] = useState([]);
    const [space, setSpace] = useState(null);
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(true);
    const [joinRequests, setJoinRequests] = useState([]);
    const [loadingRequests, setLoadingRequests] = useState(false);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        fetchSpaceAndMembers();
    }, [spaceId]);

    useEffect(() => {
        if (user && userRole && ['OWNER', 'ADMIN'].includes(userRole)) {
            fetchJoinRequests();
        }
    }, [user, userRole, spaceId]);

    const fetchSpaceAndMembers = async () => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:4000/api/spaces/${spaceId}`);
            if (res.ok) {
                const data = await res.json();
                setSpace(data);
                setMembers(data.members || []);
                
                // Find current user's role
                if (user) {
                    const userMember = data.members?.find(m => m.user?.id === user.id);
                    setUserRole(userMember?.role || null);
                }
            }
        } catch (error) {
            console.error('Error fetching space data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchJoinRequests = async () => {
        if (!user) return;
        setLoadingRequests(true);
        try {
            const res = await fetch(`http://localhost:4000/api/spaces/${spaceId}/requests?userId=${user.id}`);
            if (res.ok) {
                const data = await res.json();
                setJoinRequests(data.filter(r => r.status === 'PENDING'));
            }
        } catch (error) {
            console.error('Error fetching join requests:', error);
        } finally {
            setLoadingRequests(false);
        }
    };

    const handleApprove = async (requestId) => {
        if (!user) return;
        try {
            const res = await fetch(`http://localhost:4000/api/spaces/requests/${requestId}/approve`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id })
            });

            if (res.ok) {
                await fetchJoinRequests();
                await fetchSpaceAndMembers(); // Refresh members list
            } else {
                const error = await res.json();
                alert(error.error || 'Failed to approve request');
            }
        } catch (error) {
            console.error('Error approving request:', error);
            alert('Failed to approve request');
        }
    };

    const handleReject = async (requestId) => {
        if (!user) return;
        if (!confirm('Are you sure you want to reject this request?')) return;

        try {
            const res = await fetch(`http://localhost:4000/api/spaces/requests/${requestId}/reject`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id })
            });

            if (res.ok) {
                await fetchJoinRequests();
            } else {
                const error = await res.json();
                alert(error.error || 'Failed to reject request');
            }
        } catch (error) {
            console.error('Error rejecting request:', error);
            alert('Failed to reject request');
        }
    };

    const inviteLink = space?.inviteToken ? `${window.location.origin}/join/${space.inviteToken}` : '';

    const copyInviteLink = () => {
        navigator.clipboard.writeText(inviteLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getRoleIcon = (role) => {
        if (role === 'OWNER') return <Crown size={16} className="text-amber-500" />;
        if (role === 'ADMIN') return <Shield size={16} className="text-gray-600" />;
        return null;
    };

    const getRoleBadge = (role) => {
        const colors = {
            OWNER: 'bg-amber-50 text-amber-700 border-amber-200',
            ADMIN: 'bg-gray-100 text-gray-700 border-gray-200',
            MEMBER: 'bg-gray-50 text-gray-600 border-gray-200'
        };
        return colors[role] || colors.MEMBER;
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
            <div className="mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Team</h2>
                <p className="text-sm sm:text-base text-gray-600">Manage your team members and invite collaborators</p>
            </div>

            {/* Invite Section */}
            <div className="card mb-8 bg-gradient-to-br from-emerald-50 to-white border-emerald-200">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">Invite team members</h3>
                        <p className="text-sm text-gray-600 mb-4">Share this link or invite code with your co-founders and team</p>
                        
                        {/* Invite Link */}
                        <div className="mb-4">
                            <label className="block text-xs font-medium text-gray-700 mb-2">Invite Link</label>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                    type="text"
                                    value={inviteLink}
                                    readOnly
                                    className="flex-1 px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm text-gray-700"
                                />
                                <button
                                    onClick={copyInviteLink}
                                    className="btn-primary inline-flex items-center justify-center gap-2 w-full sm:w-auto"
                                >
                                    {copied ? <Check size={18} /> : <Copy size={18} />}
                                    {copied ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
                        </div>

                        {/* Invite Code */}
                        {space?.inviteToken && (
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-2">Invite Code</label>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <input
                                        type="text"
                                        value={space.inviteToken}
                                        readOnly
                                        className="flex-1 px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm text-gray-700 font-mono"
                                    />
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(space.inviteToken);
                                            setCopied(true);
                                            setTimeout(() => setCopied(false), 2000);
                                        }}
                                        className="btn-secondary inline-flex items-center justify-center gap-2 w-full sm:w-auto"
                                    >
                                        {copied ? <Check size={18} /> : <Copy size={18} />}
                                        {copied ? 'Copied!' : 'Copy'}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    Users can enter this code on the Space Selector page to join
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Join Requests (Admin/Owner only) */}
            {userRole && ['OWNER', 'ADMIN'].includes(userRole) && (
                <div className="card mb-8">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900">
                            Join Requests {joinRequests.length > 0 && `(${joinRequests.length})`}
                        </h3>
                    </div>

                    {loadingRequests ? (
                        <div className="space-y-3">
                            <SkeletonTeamMember />
                            <SkeletonTeamMember />
                        </div>
                    ) : joinRequests.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">No pending join requests</p>
                    ) : (
                        <div className="space-y-3">
                            {joinRequests.map((request) => {
                                const requesterName = request.user?.name || request.user?.email?.split('@')[0] || 'U';
                                const requesterInitial = requesterName.charAt(0).toUpperCase();
                                return (
                                    <div key={request.id} className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                                        <div className="flex items-start gap-3 sm:gap-4 mb-3">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                                                <span className="text-gray-700 font-semibold text-base sm:text-lg">
                                                    {requesterInitial}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-medium text-gray-900 truncate">
                                                        {request.user?.name || request.user?.email || 'Unknown'}
                                                    </h4>
                                                    <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full flex items-center gap-1">
                                                        <Clock size={12} />
                                                        Pending
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-500 truncate">{request.user?.email}</p>
                                                {request.reason && (
                                                    <p className="text-sm text-gray-600 mt-2 p-2 bg-white rounded border border-gray-200">
                                                        "{request.reason}"
                                                    </p>
                                                )}
                                                <p className="text-xs text-gray-500 mt-2">
                                                    Requested {new Date(request.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 mt-3">
                                            <button
                                                onClick={() => handleApprove(request.id)}
                                                className="btn-primary flex-1 inline-flex items-center justify-center gap-2 text-sm"
                                            >
                                                <CheckCircle2 size={16} />
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleReject(request.id)}
                                                className="btn-secondary flex-1 inline-flex items-center justify-center gap-2 text-sm border-red-200 text-red-700 hover:bg-red-50"
                                            >
                                                <XCircle size={16} />
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* Members List */}
            <div className="card">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
                    {loading ? (
                        <Skeleton className="h-6 w-48" />
                    ) : (
                        <h3 className="font-semibold text-gray-900">Team Members ({members.length})</h3>
                    )}
                    <button className="btn-secondary inline-flex items-center justify-center gap-2 text-sm w-full sm:w-auto">
                        <UserPlus size={16} />
                        Add Member
                    </button>
                </div>

                <div className="space-y-3">
                    {loading ? (
                        <>
                            <SkeletonTeamMember />
                            <SkeletonTeamMember />
                            <SkeletonTeamMember />
                        </>
                    ) : members.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">No team members yet</p>
                    ) : (
                        members.map((member) => {
                            const memberName = member.name || member.email?.split('@')[0] || 'U';
                            const memberInitial = memberName.charAt(0).toUpperCase();
                            return (
                            <div key={member.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-gray-700 font-semibold text-base sm:text-lg">
                                            {memberInitial}
                                        </span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-medium text-gray-900 truncate">{memberName}</h4>
                                            {getRoleIcon(member.role)}
                                        </div>
                                        <p className="text-sm text-gray-500 truncate">{member.email || 'No email'}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                                    <span className={`text-xs px-3 py-1 rounded-full border font-medium ${getRoleBadge(member.role)} w-fit`}>
                                        {member.role || 'MEMBER'}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        Joined {member.joinedAt ? new Date(member.joinedAt).toLocaleDateString() : 'Unknown'}
                                    </span>
                                </div>
                            </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeamManagement;
