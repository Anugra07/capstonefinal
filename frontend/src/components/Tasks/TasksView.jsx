import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Zap } from 'lucide-react';

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
                setTasks(prev => [...newTasks.map(t => ({ ...t, id: Date.now(), status: 'TODO' })), ...prev]);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { id: 'TODO', title: 'To Do', color: 'gray' },
        { id: 'IN_PROGRESS', title: 'In Progress', color: 'emerald' },
        { id: 'DONE', title: 'Done', color: 'gray' }
    ];

    return (
        <div className="p-8 h-full overflow-auto bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Tasks & Milestones</h2>
                        <p className="text-gray-600 mt-1">Track your progress towards launch</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleGenerateTasks}
                            disabled={loading}
                            className="btn-accent inline-flex items-center gap-2"
                        >
                            <Zap size={18} /> {loading ? 'Generating...' : 'AI Generate'}
                        </button>
                        <button className="btn-secondary inline-flex items-center gap-2">
                            <Plus size={18} /> Add Task
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {columns.map((column) => (
                        <div key={column.id} className="bg-white border border-gray-200 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                                <h3 className="font-semibold text-gray-900">{column.title}</h3>
                                <span className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full font-medium">
                                    {tasks.filter(t => t.status === column.id).length}
                                </span>
                            </div>

                            <div className="space-y-3">
                                {tasks.filter(t => t.status === column.id).map((task) => (
                                    <div key={task.id} className="card-flat hover:border-gray-300 transition-colors cursor-pointer group">
                                        <div className="flex items-start justify-between mb-2">
                                            {task.category && (
                                                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
                                                    {task.category}
                                                </span>
                                            )}
                                            {task.isAiGenerated && (
                                                <Zap size={14} className="text-emerald-600" />
                                            )}
                                        </div>
                                        <h4 className="font-medium text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">
                                            {task.title}
                                        </h4>
                                        {task.description && (
                                            <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Tasks;
