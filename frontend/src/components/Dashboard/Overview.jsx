import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { TrendingUp, Clock, CheckCircle2, Sparkles, Database } from 'lucide-react';
import { SkeletonStatCard, SkeletonListItem } from '../Skeleton';
import { useAuth } from '../../context/AuthContext';

const DashboardOverview = () => {
    const { space } = useOutletContext();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState([]);
    const [activities, setActivities] = useState([]);
    const [seeding, setSeeding] = useState(false);

    useEffect(() => {
        fetchDashboardData();
    }, [space?.id]);

    const fetchDashboardData = async () => {
        if (!space?.id) return;

        try {
            // Fetch tasks
            const tasksRes = await fetch(`http://localhost:4000/api/tasks/${space.id}?page=1&limit=100`);
            const tasksData = tasksRes.ok ? await tasksRes.json() : { data: [] };
            const tasks = tasksData.data || tasksData;

            // Fetch journal entries
            const journalRes = await fetch(`http://localhost:4000/api/journal/${space.id}?page=1&limit=10`);
            const journalData = journalRes.ok ? await journalRes.json() : { data: [] };
            const journals = journalData.data || journalData;

            // Fetch documents
            const docsRes = await fetch(`http://localhost:4000/api/documents/${space.id}?page=1&limit=10`);
            const docsData = docsRes.ok ? await docsRes.json() : { data: [] };
            const docs = docsData.data || docsData;

            // Calculate real stats
            const pendingTasks = tasks.filter(t => t.status === 'TODO').length;
            const completedTasks = tasks.filter(t => t.status === 'DONE').length;
            const totalTasks = tasks.length;
            const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

            setStats([
                {
                    label: 'Task Completion',
                    value: `${completionRate}%`,
                    change: `${completedTasks}/${totalTasks} completed`,
                    icon: TrendingUp,
                    positive: completionRate > 50
                },
                {
                    label: 'Pending Tasks',
                    value: pendingTasks.toString(),
                    change: tasks.filter(t => t.status === 'IN_PROGRESS').length + ' in progress',
                    icon: Clock,
                    positive: false
                },
                {
                    label: 'Journal Entries',
                    value: journals.length.toString(),
                    change: 'Document your journey',
                    icon: CheckCircle2,
                    positive: true
                }
            ]);

            // Build activities
            const recentActivities = [];
            journals.slice(0, 2).forEach(entry => {
                recentActivities.push({
                    text: `New journal entry: "${entry.title}"`,
                    time: getTimeAgo(entry.createdAt),
                    user: entry.user?.name || 'Team member'
                });
            });
            tasks.filter(t => t.status === 'DONE').slice(0, 1).forEach(task => {
                recentActivities.push({
                    text: `Task completed: "${task.title}"`,
                    time: getTimeAgo(task.createdAt),
                    user: 'You'
                });
            });
            docs.slice(0, 1).forEach(doc => {
                recentActivities.push({
                    text: `Document uploaded: "${doc.title}"`,
                    time: getTimeAgo(doc.createdAt),
                    user: 'You'
                });
            });

            setActivities(recentActivities.slice(0, 5));
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        if (seconds < 60) return 'just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
        return `${Math.floor(seconds / 86400)} days ago`;
    };

    const handleSeedData = async () => {
        if (!space?.id || !user?.id) {
            alert('Space or user not found');
            return;
        }

        if (!confirm('This will create 25 documents, 35 tasks, 20 journal entries, and 50 messages. Continue?')) {
            return;
        }

        setSeeding(true);
        try {
            const res = await fetch('http://localhost:4000/api/seed/seed', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    spaceId: space.id,
                    userId: user.id
                })
            });

            if (res.ok) {
                const data = await res.json();
                alert(`Success! Created:\n- ${data.results.documents} documents\n- ${data.results.tasks} tasks\n- ${data.results.journalEntries} journal entries\n- ${data.results.messages} messages\n\nRefresh the page to see pagination!`);
                fetchDashboardData(); // Refresh dashboard
            } else {
                const error = await res.json();
                alert('Failed to seed data: ' + (error.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error seeding data:', error);
            alert('Failed to seed data: ' + error.message);
        } finally {
            setSeeding(false);
        }
    };

    if (loading) {
        return (
            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                <div className="mb-6 sm:mb-8">
                    <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-4 w-96 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 sm:mb-8">
                    <SkeletonStatCard />
                    <SkeletonStatCard />
                    <SkeletonStatCard />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 card">
                        <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-6" />
                        <div className="space-y-4">
                            <SkeletonListItem />
                            <SkeletonListItem />
                            <SkeletonListItem />
                        </div>
                    </div>
                    <div className="card">
                        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4" />
                        <div className="space-y-2">
                            <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                            <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
                            <div className="h-4 w-4/6 bg-gray-200 rounded animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
                    <p className="text-sm sm:text-base text-gray-600">Welcome back! Here's what's happening with {space?.name}.</p>
                </div>
                <button
                    onClick={handleSeedData}
                    disabled={seeding}
                    className="btn-secondary inline-flex items-center justify-center gap-2 text-sm w-full sm:w-auto"
                    title="Create dummy data for testing pagination"
                >
                    <Database size={18} />
                    {seeding ? 'Seeding...' : 'Seed Dummy Data'}
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="card">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-gray-600">{stat.label}</span>
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                <stat.icon className="text-gray-700" size={20} />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                        <div className={`text-sm ${stat.positive ? 'text-emerald-600' : 'text-gray-500'}`}>
                            {stat.change}
                        </div>
                    </div>
                ))}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2 card">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
                    <div className="space-y-4">
                        {activities.map((activity, index) => (
                            <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="w-2 h-2 mt-2 rounded-full bg-emerald-500"></div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">{activity.text}</p>
                                    <p className="text-sm text-gray-500 mt-1">{activity.time} by {activity.user}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI Insight */}
                <div className="card bg-gradient-to-br from-emerald-50 to-white border-emerald-200">
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="text-emerald-600" size={20} />
                        <h2 className="text-xl font-semibold text-gray-900">AI Insight</h2>
                    </div>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                        Based on your recent journal entries, you seem to be stuck on <strong>customer validation</strong>.
                        Consider scheduling 5 user interviews this week.
                    </p>
                    <button className="btn-accent w-full text-sm">
                        Generate Interview Plan
                    </button>
                    <div className="mt-4 pt-4 border-t border-emerald-200">
                        <p className="text-xs text-gray-500">
                            <Sparkles size={12} className="inline mr-1" />
                            AI is monitoring your progress across all features
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
