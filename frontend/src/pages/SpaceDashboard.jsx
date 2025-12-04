import React, { useState, useEffect } from 'react';
import { useParams, Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, CheckSquare, MessageSquare, Users, FileText, Settings, LogOut, Bot } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CoFounderChat from '../components/AI/CoFounderChat';

const SpaceDashboard = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { signOut } = useAuth();
    const [space, setSpace] = useState(null);
    const [isAiChatOpen, setIsAiChatOpen] = useState(false);

    useEffect(() => {
        const fetchSpace = async () => {
            try {
                const res = await fetch(`http://localhost:4000/api/spaces/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setSpace(data);
                } else {
                    throw new Error('Failed');
                }
            } catch (e) {
                setSpace({
                    name: 'My Startup',
                    description: 'Building the future'
                });
            }
        };
        fetchSpace();
    }, [id]);

    const navItems = [
        { icon: LayoutDashboard, label: 'Overview', path: '' },
        { icon: BookOpen, label: 'Journal', path: 'journal' },
        { icon: CheckSquare, label: 'Tasks', path: 'tasks' },
        { icon: MessageSquare, label: 'Chat', path: 'chat' },
        { icon: FileText, label: 'Documents', path: 'docs' },
        { icon: Users, label: 'Team', path: 'team' },
    ];

    const handleSignOut = () => {
        signOut();
        navigate('/');
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
                {/* Logo */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">F</span>
                        </div>
                        <span className="font-semibold text-gray-900">FounderFlow</span>
                    </div>
                </div>

                {/* Space Info */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="font-semibold text-gray-900 truncate">{space?.name || 'Loading...'}</h2>
                    <p className="text-sm text-gray-500 truncate">{space?.description}</p>
                </div>

                {/* AI Co-founder Button */}
                <div className="px-4 pt-4">
                    <button
                        onClick={() => setIsAiChatOpen(true)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 bg-gradient-to-r from-emerald-50 to-white border border-emerald-200 rounded-lg hover:shadow-sm transition-all group"
                    >
                        <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                            <Bot size={14} className="text-emerald-600" />
                        </div>
                        <span className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">AI Co-founder</span>
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname === `/space/${id}${item.path ? '/' + item.path : ''}`;
                        return (
                            <Link
                                key={item.label}
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive
                                    ? 'bg-gray-900 text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <item.icon size={20} />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 space-y-1">
                    <button className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors w-full">
                        <Settings size={20} />
                        <span className="font-medium">Settings</span>
                    </button>
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors w-full"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Sign out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-gray-50">
                <Outlet context={{ space }} />
            </main>

            {/* AI Chat Overlay */}
            <CoFounderChat isOpen={isAiChatOpen} onClose={() => setIsAiChatOpen(false)} space={space} />
        </div>
    );
};

export default SpaceDashboard;
