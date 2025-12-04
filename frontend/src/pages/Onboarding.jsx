import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, CheckCircle2 } from 'lucide-react';

const Onboarding = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        stage: '',
        lookingFor: [],
        idea: ''
    });

    const stages = ['Idea Phase', 'Validation', 'Building MVP', 'Growth'];
    const needs = ['Co-founder', 'Mentorship', 'Accountability', 'Funding', 'Tech Stack', 'Marketing'];

    const handleNext = () => {
        if (step < 3) {
            setStep(step + 1);
        } else {
            navigate('/create-space');
        }
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

    const canProceed = () => {
        if (step === 1) return formData.stage !== '';
        if (step === 2) return formData.lookingFor.length > 0;
        return true;
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="w-full max-w-2xl">
                {/* Progress */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-gray-600">Step {step} of 3</span>
                        <span className="text-sm text-gray-500">{Math.round((step / 3) * 100)}% complete</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div
                            className="bg-gray-900 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(step / 3) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                    {step === 1 && (
                        <div className="animate-fade-in">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">What stage is your startup?</h2>
                            <p className="text-gray-600 mb-8">This helps us personalize your experience</p>

                            <div className="space-y-3">
                                {stages.map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => setFormData({ ...formData, stage: option })}
                                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${formData.stage === option
                                                ? 'border-gray-900 bg-gray-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-gray-900">{option}</span>
                                            {formData.stage === option && (
                                                <CheckCircle2 className="text-gray-900" size={20} />
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-fade-in">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">What do you need help with?</h2>
                            <p className="text-gray-600 mb-8">Select all that apply</p>

                            <div className="grid grid-cols-2 gap-3">
                                {needs.map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => toggleSelection('lookingFor', option)}
                                        className={`p-4 rounded-xl border-2 text-center transition-all ${formData.lookingFor.includes(option)
                                                ? 'border-gray-900 bg-gray-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            <span className="font-medium text-gray-900">{option}</span>
                                            {formData.lookingFor.includes(option) && (
                                                <CheckCircle2 className="text-gray-900" size={16} />
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="animate-fade-in">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us about your idea</h2>
                            <p className="text-gray-600 mb-8">Optional, but helps our AI provide better insights</p>

                            <textarea
                                className="input-field h-40 resize-none"
                                placeholder="I'm building a platform that..."
                                value={formData.idea}
                                onChange={(e) => setFormData({ ...formData, idea: e.target.value })}
                            />
                        </div>
                    )}

                    <div className="mt-8 flex justify-between items-center">
                        {step > 1 && (
                            <button
                                onClick={() => setStep(step - 1)}
                                className="text-gray-600 hover:text-gray-900 font-medium transition"
                            >
                                Back
                            </button>
                        )}
                        <button
                            onClick={handleNext}
                            disabled={!canProceed()}
                            className="btn-primary ml-auto inline-flex items-center gap-2"
                        >
                            {step === 3 ? 'Complete' : 'Next'}
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
