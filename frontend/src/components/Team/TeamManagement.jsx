import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { UserPlus, Copy, Check, Crown, Shield } from 'lucide-react';

const TeamManagement = () => {
    const { id: spaceId } = useParams();
    const [members, setMembers] = useState([
        {
            id: 1,
            name: 'You',
            email: 'you@startup.com',
            role: 'OWNER',
            joinedAt: new Date().toISOString()
        }
    ]);
    const [copied, setCopied] = useState(false);
    const inviteLink = `https://founderflow.app/join/${spaceId}`;

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
        <div className="p-8 max-w-5xl mx-auto">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Team</h2>
                <p className="text-gray-600">Manage your team members and invite collaborators</p>
            </div>

            {/* Invite Section */}
            <div className="card mb-8 bg-gradient-to-br from-emerald-50 to-white border-emerald-200">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">Invite team members</h3>
                        <p className="text-sm text-gray-600 mb-4">Share this link with your co-founders and team</p>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={inviteLink}
                                readOnly
                                className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700"
                            />
                            <button
                                onClick={copyInviteLink}
                                className="btn-primary inline-flex items-center gap-2"
                            >
                                {copied ? <Check size={18} /> : <Copy size={18} />}
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Members List */}
            <div className="card">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">Team Members ({members.length})</h3>
                    <button className="btn-secondary inline-flex items-center gap-2 text-sm">
                        <UserPlus size={16} />
                        Add Member
                    </button>
                </div>

                <div className="space-y-3">
                    {members.map((member) => (
                        <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                    <span className="text-gray-700 font-semibold text-lg">
                                        {member.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-medium text-gray-900">{member.name}</h4>
                                        {getRoleIcon(member.role)}
                                    </div>
                                    <p className="text-sm text-gray-500">{member.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`text-xs px-3 py-1 rounded-full border font-medium ${getRoleBadge(member.role)}`}>
                                    {member.role}
                                </span>
                                <span className="text-xs text-gray-500">
                                    Joined {new Date(member.joinedAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TeamManagement;
