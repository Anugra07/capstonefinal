import React, { useState, useEffect } from 'react';
import { useParams, Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, CheckSquare, MessageSquare, Users, FileText, Settings, Activity } from 'lucide-react';

const SpaceDashboard = () => {
    const { id } = useParams();
    const location = useLocation();
    const [space, setSpace] = useState(null);

    useEffect(() => {
        // Fetch space details
        // For now using mock data if fetch fails
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
                    description: 'Revolutionizing the world with AI.'
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

    return (
        <div className="flex h-screen bg-slate-900 text-white">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
                <div className="p-6 border-b border-slate-700">
                    <h1 className="text-xl font-bold truncate">{space?.name || 'Loading...'}</h1>
                    <p className="text-sm text-slate-400 truncate">{space?.description}</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname === `/space/${id}${item.path ? '/' + item.path : ''}`;
                        return (
                            <Link
                                key={item.label}
                                to={item.path}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${isActive
                                        ? 'bg-blue-600 text-white'
                                        : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                                    }`}
                            >
                                <item.icon size={20} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-700">
                    <button className="flex items-center space-x-3 px-4 py-3 text-slate-400 hover:text-white transition w-full">
                        <Settings size={20} />
                        <span>Settings</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <Outlet context={{ space }} />
            </main>
        </div>
    );
};

export default SpaceDashboard;
