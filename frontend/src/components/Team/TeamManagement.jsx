import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Users, Mail, Copy, Check, Crown, Shield, User } from 'lucide-react';

const TeamManagement = () => {
    const { id: spaceId } = useParams();
    const [members, setMembers] = useState([]);
    const [inviteLink, setInviteLink] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        fetchMembers();
        generateInviteLink();
    }, [spaceId]);

    const fetchMembers = async () => {
        // Mock data for now
        setMembers([
            { id: 1, name: 'John Doe', email: 'john@startup.com', role: 'OWNER', joinedAt: '2024-01-15' },
            { id: 2, name: 'Jane Smith', email: 'jane@startup.com', role: 'ADMIN', joinedAt: '2024-01-20' },
            { id: 3, name: 'Bob Johnson', email: 'bob@startup.com', role: 'MEMBER', joinedAt: '2024-02-01' },
        ]);
    };

    const generateInviteLink = () => {
        // In real app, fetch from backend
        setInviteLink(`${window.location.origin}/join/${spaceId}`);
    };

    const copyInviteLink = () => {
        navigator.clipboard.writeText(inviteLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getRoleIcon = (role) => {
        switch (role) {
            case 'OWNER': return <Crown size={16} className="text-yellow-400" />;
            case 'ADMIN': return <Shield size={16} className="text-blue-400" />;
            default: return <User size={16} className="text-slate-400" />;
        }
    };

    const getRoleBadge = (role) => {
        const colors = {
            OWNER: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
            ADMIN: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
            MEMBER: 'bg-slate-700 text-slate-300 border-slate-600'
        };
        return colors[role] || colors.MEMBER;
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">Team Members</h2>
                <p className="text-slate-400">Manage your startup's team and collaborators.</p>
            </div>

            {/* Invite Section */}
            <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-xl p-6 mb-8">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-500/20 rounded-lg">
                        <Mail className="text-blue-400" size={24} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">Invite Team Members</h3>
                        <p className="text-slate-400 mb-4">Share this link with your co-founders and team members</p>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={inviteLink}
                                readOnly
                                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-300"
                            />
                            <button
                                onClick={copyInviteLink}
                                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2 transition"
                            >
                                {copied ? <Check size={18} /> : <Copy size={18} />}
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Members List */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                <div className="p-4 border-b border-slate-700 flex items-center gap-2">
                    <Users size={20} className="text-slate-400" />
                    <h3 className="font-bold">{members.length} Team Members</h3>
                </div>

                <div className="divide-y divide-slate-700">
                    {members.map((member) => (
                        <div key={member.id} className="p-4 hover:bg-slate-700/50 transition flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                    {member.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-medium">{member.name}</h4>
                                        {getRoleIcon(member.role)}
                                    </div>
                                    <p className="text-sm text-slate-400">{member.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-xs text-slate-500">Joined</p>
                                    <p className="text-sm text-slate-300">{new Date(member.joinedAt).toLocaleDateString()}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadge(member.role)}`}>
                                    {member.role}
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
