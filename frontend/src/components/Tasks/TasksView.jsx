import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Zap, CheckCircle, Circle } from 'lucide-react';

const Tasks = () => {
    const { id: spaceId } = useParams();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTasks();
    }, [spaceId]);

    const fetchTasks = async () => {
        try {
            const res = await fetch(`http://localhost:4000/api/tasks/${spaceId}`);
            if (res.ok) {
                const data = await res.json();
                setTasks(data);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleGenerateTasks = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:4000/api/tasks/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ spaceId })
            });

            if (res.ok) {
                const newTasks = await res.json();
                // Optimistically add them (in real app, would save to DB first)
                setTasks(prev => [...newTasks.map(t => ({ ...t, id: Date.now(), status: 'TODO' })), ...prev]);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold">Milestones & Tasks</h2>
                    <p className="text-slate-400">Track your progress towards launch.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleGenerateTasks}
                        disabled={loading}
                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
                    >
                        <Zap size={18} /> {loading ? 'Thinking...' : 'AI Generate'}
                    </button>
                    <button className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition">
                        <Plus size={18} /> Add Task
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['TODO', 'IN_PROGRESS', 'DONE'].map((status) => (
                    <div key={status} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 min-h-[500px]">
                        <h3 className="font-bold text-slate-400 mb-4 px-2 flex justify-between">
                            {status.replace('_', ' ')}
                            <span className="bg-slate-700 text-xs px-2 py-1 rounded-full">
                                {tasks.filter(t => t.status === status).length}
                            </span>
                        </h3>

                        <div className="space-y-3">
                            {tasks.filter(t => t.status === status).map((task) => (
                                <div key={task.id} className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-slate-600 transition group cursor-pointer">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-xs px-2 py-1 rounded-full ${task.category === 'Validation' ? 'bg-orange-500/20 text-orange-400' :
                                                task.category === 'Product' ? 'bg-blue-500/20 text-blue-400' :
                                                    'bg-slate-700 text-slate-400'
                                            }`}>
                                            {task.category || 'General'}
                                        </span>
                                        {task.isAiGenerated && <Zap size={14} className="text-purple-400" />}
                                    </div>
                                    <h4 className="font-medium text-slate-200 mb-1">{task.title}</h4>
                                    {task.description && <p className="text-sm text-slate-500 line-clamp-2">{task.description}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Tasks;
