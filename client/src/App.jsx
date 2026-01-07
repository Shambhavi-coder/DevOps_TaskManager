'use client';

import { useState, useEffect } from 'react';
import TaskList from './components/TaskList';
import AddTaskDialog from './components/AddTaskDialog';
import LoadingSpinner from './components/LoadingSpinner';
import { taskService } from './services/taskService';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await taskService.getAllTasks();

      // ✅ IMPORTANT FIX
      // response = { success, count, data }
      setTasks(Array.isArray(response.data) ? response.data : []);

    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to fetch tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (taskData) => {
    try {
      const response = await taskService.createTask(taskData);

      // ✅ response.data contains the created task
      setTasks((prev) => [response.data, ...prev]);

      setIsDialogOpen(false);
      return { success: true };
    } catch (err) {
      console.error('Error creating task:', err);
      return { success: false, error: err.message };
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Task Manager Edited
            </h1>
            <p className="text-gray-600 mt-1">
              Simple task management for DevOps demo
            </p>
          </div>
          <button
            onClick={() => setIsDialogOpen(true)}
            className="bg-black text-white px-6 py-2 rounded-lg font-medium"
          >
            Add Task
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-lg font-medium text-red-800 mb-2">Error</h3>
              <p className="text-red-700 mb-4">{error}</p>
              <button
                onClick={fetchTasks}
                className="bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <TaskList tasks={tasks} onDeleteTask={handleDeleteTask} />
        )}
      </main>

      {isDialogOpen && (
        <AddTaskDialog
          onClose={() => setIsDialogOpen(false)}
          onSubmit={handleAddTask}
        />
      )}
    </div>
  );
}

export default App;
