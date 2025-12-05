import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const JoinSpace = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [joining, setJoining] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (token && user) {
            handleJoin();
        }
    }, [token, user]);

    const handleJoin = async () => {
        if (!token) {
            setError('Invalid invite link');
            return;
        }

        if (!user) {
            setError('Please log in to join this space');
            return;
        }

        setJoining(true);
        setError('');
        try {
            const response = await fetch('http://localhost:4000/api/spaces/join', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    inviteToken: token,
                    userId: user.id
                })
            });

            if (response.ok) {
                const data = await response.json();
                setSuccess(true);
                setTimeout(() => {
                    navigate(`/space/${data.space.id}`);
                }, 1500);
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Failed to join space');
            }
        } catch (error) {
            console.error(error);
            setError('Failed to join space. Please try again.');
        } finally {
            setJoining(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-md">
                <div className="card text-center">
                    {success ? (
                        <>
                            <div className="flex justify-center mb-4">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                                    <CheckCircle2 className="text-emerald-600 w-6 h-6 sm:w-8 sm:h-8" />
                                </div>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Successfully Joined!</h2>
                            <p className="text-sm sm:text-base text-gray-600 mb-4">Redirecting to the workspace...</p>
                        </>
                    ) : error ? (
                        <>
                            <div className="flex justify-center mb-4">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center">
                                    <XCircle className="text-red-600 w-6 h-6 sm:w-8 sm:h-8" />
                                </div>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Unable to Join</h2>
                            <p className="text-sm sm:text-base text-gray-600 mb-4">{error}</p>
                            {!user && (
                                <button
                                    onClick={() => navigate('/login')}
                                    className="btn-primary"
                                >
                                    Go to Login
                                </button>
                            )}
                        </>
                    ) : (
                        <>
                            <div className="flex justify-center mb-4">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                    <Users className="text-gray-700 w-6 h-6 sm:w-8 sm:h-8" />
                                </div>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Joining Workspace...</h2>
                            <p className="text-sm sm:text-base text-gray-600 mb-4">Please wait while we add you to the team.</p>
                            {!user && (
                                <div className="mt-4">
                                    <p className="text-sm text-gray-500 mb-3">You need to be logged in to join</p>
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="btn-primary w-full"
                                    >
                                        Go to Login
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JoinSpace;

