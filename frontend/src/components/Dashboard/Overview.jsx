import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Activity, CheckCircle, Clock } from 'lucide-react';

const DashboardOverview = () => {
    const { space } = useOutletContext();

    return (
        <div className="p-8">
            <header className="mb-8">
                <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
                <p className="text-slate-400">Welcome back! Here's what's happening with {space?.name}.</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-slate-400 font-medium">Momentum Score</h3>
                        <Activity className="text-blue-500" />
                    </div>
                    <p className="text-3xl font-bold">85%</p>
                    <p className="text-sm text-green-400 mt-2">↑ 12% from last week</p>
                </div>

                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-slate-400 font-medium">Pending Tasks</h3>
                        <Clock className="text-orange-500" />
                    </div>
                    <p className="text-3xl font-bold">12</p>
                    <p className="text-sm text-slate-400 mt-2">3 high priority</p>
                </div>

                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-slate-400 font-medium">Completed Milestones</h3>
                        <CheckCircle className="text-green-500" />
                    </div>
                    <p className="text-3xl font-bold">4</p>
                    <p className="text-sm text-slate-400 mt-2">Validation phase complete</p>
                </div>
            </div>

            {/* Recent Activity & AI Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-slate-800 rounded-xl border border-slate-700 p-6">
                    <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-start space-x-4 p-4 bg-slate-900/50 rounded-lg">
                                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                                <div>
                                    <p className="font-medium">New journal entry added</p>
                                    <p className="text-sm text-slate-400">2 hours ago by You</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-xl border border-blue-500/30 p-6">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <span className="text-2xl">✨</span> AI Insight
                    </h3>
                    <p className="text-slate-300 mb-4">
                        Based on your recent journal entries, you seem to be stuck on <strong>customer validation</strong>.
                        Consider scheduling 5 user interviews this week.
                    </p>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition">
                        Generate Interview Plan
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
