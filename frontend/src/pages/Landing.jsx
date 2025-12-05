import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, CheckCircle2, Sparkles, BarChart3, Users } from 'lucide-react';

const Landing = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleGetStarted = () => {
        if (user) {
            navigate('/create-space');
        } else {
            navigate('/signup');
        }
    };

    const features = [
        {
            icon: Sparkles,
            title: 'AI-Powered Insights',
            description: 'Get intelligent feedback on your progress, identify blockers, and receive actionable recommendations.'
        },
        {
            icon: BarChart3,
            title: 'Track Your Progress',
            description: 'Journal your founder journey and visualize your momentum with AI-generated analytics.'
        },
        {
            icon: Users,
            title: 'Team Collaboration',
            description: 'Work seamlessly with co-founders, mentors, and advisors in real-time workspaces.'
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Navbar */}
            <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">F</span>
                        </div>
                        <span className="text-lg sm:text-xl font-semibold text-gray-900">FounderFlow</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <button
                            onClick={() => navigate('/login')}
                            className="text-gray-700 hover:text-gray-900 font-medium px-3 sm:px-4 py-2 text-sm sm:text-base transition"
                        >
                            Log in
                        </button>
                        <button
                            onClick={() => navigate('/signup')}
                            className="btn-primary text-sm sm:text-base px-4 sm:px-6"
                        >
                            Sign up
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 lg:pt-20 pb-12 sm:pb-16">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                        <Sparkles size={14} className="sm:w-4 sm:h-4" />
                        <span>AI-Powered Startup Platform</span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight px-2">
                        Your startup journey,
                        <br />
                        <span className="text-emerald-600">supercharged by AI</span>
                    </h1>

                    <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-8 sm:mb-10 max-w-2xl mx-auto px-4">
                        From idea to validation to growth. Manage your journal, tasks, and team in one intelligent workspace built for founders.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={handleGetStarted}
                            className="btn-accent inline-flex items-center gap-2 text-lg px-8 py-4 group"
                        >
                            Start your journey
                            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="btn-secondary text-lg px-8 py-4"
                        >
                            View demo
                        </button>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="card group hover:border-gray-300">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-50 transition-all duration-300 group-hover:scale-110">
                                <feature.icon className="text-gray-700 group-hover:text-emerald-600 transition-all duration-300" size={24} />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">{feature.title}</h3>
                            <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Social Proof */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 border-t border-gray-200">
                <div className="text-center">
                    <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wide font-medium mb-6 sm:mb-8">
                        Trusted by founders worldwide
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 opacity-40">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="w-32 h-8 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gray-50 border-t border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20 text-center">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Ready to build your startup?
                    </h2>
                    <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
                        Join thousands of founders using FounderFlow to turn their ideas into reality.
                    </p>
                    <button
                        onClick={handleGetStarted}
                        className="btn-accent inline-flex items-center gap-2 text-lg px-8 py-4"
                    >
                        Get started for free
                        <ArrowRight size={20} />
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-200 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gray-900 rounded flex items-center justify-center">
                                <span className="text-white font-bold text-xs">F</span>
                            </div>
                            <span className="font-semibold text-gray-900 text-sm sm:text-base">FounderFlow</span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-500">
                            © 2024 FounderFlow. Built for founders, by founders.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
