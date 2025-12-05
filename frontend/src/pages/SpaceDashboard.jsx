import React, { useState, useEffect } from 'react';
import { useParams, Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, CheckSquare, MessageSquare, Users, FileText, Settings, LogOut, Bot, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CoFounderChat from '../components/AI/CoFounderChat';
import { Skeleton } from '../components/Skeleton';
import NotificationBell from '../components/Notifications/NotificationBell';

const SpaceDashboard = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { signOut } = useAuth();
    const [space, setSpace] = useState(null);
    const [isAiChatOpen, setIsAiChatOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const fetchSpace = async () => {
            setLoading(true);
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
            } finally {
                setLoading(false);
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
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
            >
                <Menu size={24} className="text-gray-700" />
            </button>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-white border-r border-gray-200 flex flex-col z-40 transform transition-transform duration-300 ease-in-out ${
                isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            }`}>
                {/* Logo */}
                <div className="p-4 lg:p-6 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">F</span>
                        </div>
                        <span className="font-semibold text-gray-900">FounderFlow</span>
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="lg:hidden p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={20} className="text-gray-600" />
                    </button>
                </div>

                {/* Space Info */}
                <div className="px-4 lg:px-6 py-4 border-b border-gray-200">
                    {loading ? (
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-4 w-48" />
                        </div>
                    ) : (
                        <>
                            <h2 className="font-semibold text-gray-900 truncate">{space?.name || 'My Startup'}</h2>
                            <p className="text-sm text-gray-500 truncate">{space?.description || 'Building the future'}</p>
                        </>
                    )}
                </div>

                {/* AI Co-founder Button */}
                <div className="px-4 pt-4">
                    <button
                        onClick={() => {
                            setIsAiChatOpen(true);
                            setIsMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 bg-gradient-to-r from-emerald-50 to-white border border-emerald-200 rounded-lg hover:shadow-md hover:border-emerald-300 hover:scale-[1.02] transition-all duration-300 ease-out group"
                    >
                        <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                            <Bot size={14} className="text-emerald-600 group-hover:scale-110 transition-transform" />
                        </div>
                        <span className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">AI Co-founder</span>
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = location.pathname === `/space/${id}${item.path ? '/' + item.path : ''}`;
                        return (
                            <Link
                                key={item.label}
                                to={item.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ease-out ${isActive
                                    ? 'bg-gray-900 text-white shadow-sm'
                                    : 'text-gray-700 hover:bg-gray-100 hover:scale-[1.02] active:scale-[0.98]'
                                    }`}
                            >
                                <item.icon size={20} className={isActive ? '' : 'transition-transform group-hover:scale-110'} />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 space-y-1">
                    <button className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98] w-full group">
                        <Settings size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                        <span className="font-medium">Settings</span>
                    </button>
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98] w-full group"
                    >
                        <LogOut size={20} className="group-hover:translate-x-1 transition-transform duration-200" />
                        <span className="font-medium">Sign out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-gray-50 pt-16 lg:pt-0">
                {/* Header with Notifications */}
                <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-end">
                    <NotificationBell />
                </div>
                <Outlet context={{ space }} />
            </main>

            {/* AI Chat Overlay */}
            <CoFounderChat isOpen={isAiChatOpen} onClose={() => setIsAiChatOpen(false)} space={space} />
        </div>
    );
};

export default SpaceDashboard;
