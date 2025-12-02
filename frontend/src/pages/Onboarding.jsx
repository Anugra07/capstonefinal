import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Onboarding = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        stage: '',
        lookingFor: [],
        idea: ''
    });

    const handleNext = () => {
        if (step < 3) setStep(step + 1);
        else navigate('/create-space'); // Proceed to space creation
    };

    const toggleSelection = (field, value) => {
        setFormData(prev => {
            const list = prev[field];
            if (list.includes(value)) {
                return { ...prev, [field]: list.filter(item => item !== value) };
            } else {
                return { ...prev, [field]: [...list, value] };
            }
        });
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
            <div className="max-w-xl w-full bg-slate-800 p-8 rounded-2xl border border-slate-700">

                {/* Progress Bar */}
                <div className="w-full bg-slate-700 h-2 rounded-full mb-8">
                    <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(step / 3) * 100}%` }}
                    ></div>
                </div>

                {step === 1 && (
                    <div>
                        <h2 className="text-3xl font-bold mb-6">What stage is your startup?</h2>
                        <div className="space-y-4">
                            {['Idea Phase', 'Validation', 'Building MVP', 'Growth'].map((option) => (
                                <button
                                    key={option}
                                    onClick={() => setFormData({ ...formData, stage: option })}
                                    className={`w-full p-4 rounded-xl border text-left transition ${formData.stage === option
                                            ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                                            : 'border-slate-600 hover:border-slate-500'
                                        }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <h2 className="text-3xl font-bold mb-6">What do you need help with?</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {['Co-founder', 'Mentorship', 'Accountability', 'Funding', 'Tech Stack', 'Marketing'].map((option) => (
                                <button
                                    key={option}
                                    onClick={() => toggleSelection('lookingFor', option)}
                                    className={`p-4 rounded-xl border text-center transition ${formData.lookingFor.includes(option)
                                            ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                                            : 'border-slate-600 hover:border-slate-500'
                                        }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div>
                        <h2 className="text-3xl font-bold mb-6">Describe your idea (Optional)</h2>
                        <textarea
                            className="w-full h-40 bg-slate-900 border border-slate-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="I'm building a..."
                            value={formData.idea}
                            onChange={(e) => setFormData({ ...formData, idea: e.target.value })}
                        ></textarea>
                    </div>
                )}

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={handleNext}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                    >
                        {step === 3 ? 'Finish' : 'Next'}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Onboarding;
