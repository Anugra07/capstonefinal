import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { TrendingUp, Clock, CheckCircle2, Sparkles } from 'lucide-react';

const DashboardOverview = () => {
    const { space } = useOutletContext();

    const stats = [
        {
            label: 'Momentum Score',
            value: '85%',
            change: '+12% from last week',
            icon: TrendingUp,
            positive: true
        },
        {
            label: 'Pending Tasks',
            value: '12',
            change: '3 high priority',
            icon: Clock,
            positive: false
        },
        {
            label: 'Completed Milestones',
            value: '4',
            change: 'Validation phase complete',
            icon: CheckCircle2,
            positive: true
        }
    ];

    const activities = [
        { text: 'New journal entry added', time: '2 hours ago', user: 'You' },
        { text: 'Task "User interviews" completed', time: '5 hours ago', user: 'You' },
        { text: 'Document uploaded: Market Research', time: '1 day ago', user: 'You' }
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
                <p className="text-gray-600">Welcome back! Here's what's happening with {space?.name}.</p>
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
