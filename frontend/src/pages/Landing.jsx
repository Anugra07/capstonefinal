import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleGetStarted = () => {
        if (user) {
            navigate('/dashboard');
        } else {
            navigate('/signup');
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            {/* Navbar */}
            <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
                <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                    FounderFlow
                </div>
                <div className="space-x-4">
                    <button onClick={() => navigate('/login')} className="hover:text-blue-400 transition">Login</button>
                    <button
                        onClick={() => navigate('/signup')}
                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition"
                    >
                        Sign Up
                    </button>
                </div>
            </nav>

            {/* Hero */}
            <main className="flex flex-col items-center justify-center text-center mt-20 px-4">
                <h1 className="text-5xl md:text-7xl font-bold mb-6">
                    Your Founder Journey, <br />
                    <span className="text-blue-500">Supercharged by AI.</span>
                </h1>
                <p className="text-xl text-slate-400 max-w-2xl mb-10">
                    From idea to validation to growth. Manage your startup's journal, tasks, and team in one intelligent workspace.
                </p>
                <button
                    onClick={handleGetStarted}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg px-8 py-4 rounded-full font-semibold transition transform hover:scale-105"
                >
                    Start Your Founder Journey
                </button>

                {/* Features Preview */}
                <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <div className="p-6 bg-slate-800 rounded-xl border border-slate-700">
                        <h3 className="text-xl font-bold mb-2">AI Journaling</h3>
                        <p className="text-slate-400">Track your progress and get instant feedback and coaching from our AI.</p>
                    </div>
                    <div className="p-6 bg-slate-800 rounded-xl border border-slate-700">
                        <h3 className="text-xl font-bold mb-2">Smart Tasks</h3>
                        <p className="text-slate-400">Let AI generate your next milestones based on your current stage.</p>
                    </div>
                    <div className="p-6 bg-slate-800 rounded-xl border border-slate-700">
                        <h3 className="text-xl font-bold mb-2">Team Sync</h3>
                        <p className="text-slate-400">Collaborate with co-founders and mentors in real-time spaces.</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Landing;
