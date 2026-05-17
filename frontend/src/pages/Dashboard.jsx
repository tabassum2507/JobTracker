import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api';
import StatsBar from '../components/StatsBar';
import KanbanBoard from '../components/KanbanBoard';
import JobForm from '../components/JobForm';
import AIPanel from '../components/AIPanel';

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // JobForm modal state
  const [formOpen, setFormOpen] = useState(false);
  const [editJob, setEditJob] = useState(null);   // null = new job

  // AI drawer state
  const [aiOpen, setAiOpen] = useState(false);
  const [aiJob, setAiJob] = useState(null);       // null = insights-only mode

  const navigate = useNavigate();

  const fetchJobs = useCallback(async () => {
    try {
      const { data } = await api.get('/api/jobs');
      setJobs(data);
    } catch {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  // --- handlers ---

  const handleAddJob = () => {
    setEditJob(null);
    setFormOpen(true);
  };

  const handleEdit = (job) => {
    setEditJob(job);
    setFormOpen(true);
  };

  const handleDelete = () => {
    fetchJobs();
  };

  const handleSave = () => {
    setFormOpen(false);
    fetchJobs();
  };

  const handleAI = (job) => {
    setAiJob(job);
    setAiOpen(true);
  };

  const handleInsights = () => {
    setAiJob(null);
    setAiOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // --- render ---

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-indigo-600">JobTracker</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleInsights}
            className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
          >
            <span>✨</span> AI Insights
          </button>
          <button
            onClick={handleAddJob}
            className="flex items-center gap-1.5 text-sm px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Job
          </button>
          <button
            onClick={handleLogout}
            title="Logout"
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col gap-5 px-6 py-5 overflow-hidden">
        {/* Stats */}
        <StatsBar jobs={jobs} />

        {/* Board */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
            Loading jobs…
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-gray-400">
            <svg className="w-16 h-16 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-sm">No jobs yet — add your first one!</p>
            <button
              onClick={handleAddJob}
              className="text-sm px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
            >
              Add Job
            </button>
          </div>
        ) : (
          <KanbanBoard
            jobs={jobs}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAI={handleAI}
          />
        )}
      </main>

      {/* Job Form Modal */}
      {formOpen && (
        <JobForm
          job={editJob}
          onClose={() => setFormOpen(false)}
          onSave={handleSave}
        />
      )}

      {/* AI Drawer */}
      {aiOpen && (
        <AIPanel
          job={aiJob}
          allJobs={jobs}
          onClose={() => setAiOpen(false)}
        />
      )}
    </div>
  );
}
