import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Zap, Trash2, ChevronRight, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SkeletonTaskCard } from '../Skeleton';
import Pagination from '../Pagination';

const Tasks = () => {
    const { id: spaceId } = useParams();
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', category: '' });
    const [pagination, setPagination] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        if (spaceId) {
            fetchTasks();
        }
    }, [spaceId]);

    const fetchTasks = async (page = currentPage) => {
        setFetching(true);
        try {
            const res = await fetch(`http://localhost:4000/api/tasks/${spaceId}?page=${page}&limit=20`);
            if (res.ok) {
                const response = await res.json();
                setTasks(response.data || []);
                setPagination(response.pagination);
                setCurrentPage(page);
            } else {
                // Handle non-OK responses
                const errorData = await res.json().catch(() => ({ error: 'Failed to fetch tasks' }));
                console.error('Error fetching tasks:', errorData);
                setTasks([]);
                setPagination(null);
            }
        } catch (e) {
            console.error('Error fetching tasks:', e);
            setTasks([]);
            setPagination(null);
        } finally {
            setFetching(false);
        }
    };

    const handlePageChange = (newPage) => {
        fetchTasks(newPage);
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
                // Create tasks via API for each generated task
                const createPromises = newTasks.map(task => 
                    fetch('http://localhost:4000/api/tasks', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            spaceId,
                            title: task.title,
                            category: task.category || null,
                            userId: user?.id || null
                        })
                    })
                );
                
                const results = await Promise.allSettled(createPromises);
                const failed = results.filter(r => r.status === 'rejected').length;
                if (failed > 0) {
                    console.warn(`${failed} tasks failed to create`);
                }
                
                // Refresh tasks from server after creating all
                await fetchTasks(1); // Reset to page 1 to see new tasks
            }
        } catch (e) {
            console.error('Error generating tasks:', e);
            alert('Failed to generate tasks: ' + e.message);
        } finally {
            setLoading(false);
        }
    };

    const updateTaskStatus = async (taskId, newStatus) => {
        try {
            const res = await fetch(`http://localhost:4000/api/tasks/${taskId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                // Always refresh from server after update
                await fetchTasks(currentPage); // Refresh tasks from server
            } else {
                const error = await res.json();
                console.error('Failed to update task:', error);
                alert('Failed to update task: ' + (error.error || 'Unknown error'));
            }
        } catch (e) {
            console.error('Error updating task:', e);
            alert('Failed to update task. Please make sure the backend server is running.');
        }
    };

    const deleteTask = async (taskId) => {
        if (!confirm('Are you sure you want to delete this task?')) return;

        try {
            const res = await fetch(`http://localhost:4000/api/tasks/${taskId}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                // Always refresh from server after delete
                await fetchTasks(currentPage); // Refresh tasks from server
            }
        } catch (e) {
            console.error('Error deleting task:', e);
            alert('Failed to delete task: ' + e.message);
        }
    };

    const handleCreateTask = async () => {
        if (!newTask.title.trim()) {
            alert('Please enter a task title');
            return;
        }

        try {
            const res = await fetch('http://localhost:4000/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    spaceId,
                    title: newTask.title,
                    category: newTask.category || null,
                    userId: user?.id || null
                })
            });

            if (res.ok) {
                setNewTask({ title: '', category: '' });
                setIsCreating(false);
                // Always refresh from server after create
                await fetchTasks(1); // Reset to page 1 to see new task
            } else {
                const error = await res.json();
                alert('Failed to create task: ' + (error.error || 'Unknown error'));
            }
        } catch (e) {
            console.error('Error creating task:', e);
            alert('Failed to create task: ' + e.message);
        }
    };

    const columns = [
        { id: 'TODO', title: 'To Do', color: 'gray' },
        { id: 'IN_PROGRESS', title: 'In Progress', color: 'emerald' },
        { id: 'DONE', title: 'Done', color: 'gray' }
    ];

    return (
        <div className="p-4 sm:p-6 lg:p-8 h-full overflow-auto bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Tasks & Milestones</h2>
                        <p className="text-sm sm:text-base text-gray-600 mt-1">Track your progress towards launch</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <button
                            onClick={handleGenerateTasks}
                            disabled={loading}
                            className="btn-accent inline-flex items-center justify-center gap-2 w-full sm:w-auto"
                        >
                            <Zap size={18} /> {loading ? 'Generating...' : 'AI Generate'}
                        </button>
                        <button 
                            onClick={() => setIsCreating(true)}
                            className="btn-secondary inline-flex items-center justify-center gap-2 w-full sm:w-auto"
                        >
                            <Plus size={18} /> Add Task
                        </button>
                    </div>
                </div>

                {isCreating && (
                    <div className="card mb-8 animate-fade-in">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Create New Task</h3>
                            <button
                                onClick={() => {
                                    setIsCreating(false);
                                    setNewTask({ title: '', category: '' });
                                }}
                                className="p-1 hover:bg-gray-100 rounded-lg transition"
                            >
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Task Title *
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter task title"
                                    className="input-field"
                                    value={newTask.title}
                                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            handleCreateTask();
                                        }
                                    }}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category (Optional)
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., Validation, Product, Marketing"
                                    className="input-field"
                                    value={newTask.category}
                                    onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => {
                                        setIsCreating(false);
                                        setNewTask({ title: '', category: '' });
                                    }}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateTask}
                                    className="btn-primary"
                                >
                                    Create Task
                                </button>
                            </div>
                        </div>
                    </div>
                )}

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
                                {fetching ? (
                                    <>
                                        <SkeletonTaskCard />
                                        <SkeletonTaskCard />
                                    </>
                                ) : (
                                    tasks.filter(t => t.status === column.id).map((task) => (
                                    <div key={task.id} className="card-flat hover:border-gray-300 hover:shadow-md transition-all duration-300 ease-out cursor-pointer group hover:scale-[1.02]">
                                        <div className="flex items-start justify-between mb-2">
                                            {task.category && (
                                                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
                                                    {task.category}
                                                </span>
                                            )}
                                            <div className="flex gap-1">
                                                {task.isAiGenerated && (
                                                    <Zap size={14} className="text-emerald-600" />
                                                )}
                                                <button
                                                    onClick={() => deleteTask(task.id)}
                                                    className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-1 hover:bg-red-50 rounded hover:scale-110 active:scale-95"
                                                    title="Delete task"
                                                >
                                                    <Trash2 size={14} className="text-red-600" />
                                                </button>
                                            </div>
                                        </div>
                                        <h4 className="font-medium text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">
                                            {task.title}
                                        </h4>
                                        {task.description && (
                                            <p className="text-sm text-gray-600 line-clamp-2 mb-2">{task.description}</p>
                                        )}
                                        {/* Status change buttons */}
                                        <div className="flex gap-2 mt-2 pt-2 border-t border-gray-100">
                                            {column.id === 'TODO' && (
                                                <button
                                                    onClick={() => updateTaskStatus(task.id, 'IN_PROGRESS')}
                                                    className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 rounded hover:bg-emerald-100 transition flex items-center gap-1"
                                                >
                                                    Start <ChevronRight size={12} />
                                                </button>
                                            )}
                                            {column.id === 'IN_PROGRESS' && (
                                                <>
                                                    <button
                                                        onClick={() => updateTaskStatus(task.id, 'TODO')}
                                                        className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
                                                    >
                                                        Back to To Do
                                                    </button>
                                                    <button
                                                        onClick={() => updateTaskStatus(task.id, 'DONE')}
                                                        className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 rounded hover:bg-emerald-100 transition flex items-center gap-1"
                                                    >
                                                        Complete <ChevronRight size={12} />
                                                    </button>
                                                </>
                                            )}
                                            {column.id === 'DONE' && (
                                                <button
                                                    onClick={() => updateTaskStatus(task.id, 'IN_PROGRESS')}
                                                    className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
                                                >
                                                    Reopen
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    ))
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pagination */}
            {pagination && <Pagination pagination={pagination} onPageChange={handlePageChange} />}
        </div>
    );
};

export default Tasks;
