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
  const [formOpen, setFormOpen] = useState(false);
  const [editJob, setEditJob] = useState(null);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiJob, setAiJob] = useState(null);
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

  const handleAddJob   = () => { setEditJob(null); setFormOpen(true); };
  const handleEdit     = (job) => { setEditJob(job); setFormOpen(true); };
  const handleDelete   = () => fetchJobs();
  const handleSave     = () => { setFormOpen(false); fetchJobs(); };
  const handleAI       = (job) => { setAiJob(job); setAiOpen(true); };
  const handleInsights = () => { setAiJob(null); setAiOpen(true); };
  const handleLogout   = () => { localStorage.removeItem('token'); navigate('/login'); };

  return (
    <div
      className="min-h-screen bg-[#f7f6f3] flex flex-col"
      style={{
        backgroundImage:
          'linear-gradient(rgba(0,0,0,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.045) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }}
    >

      {/* ── Navbar ── */}
      <header className="bg-white border-b border-gray-200 shadow-sm px-6 h-14 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          <span className="font-display italic text-lg font-bold text-gray-900">JobTracker</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleInsights}
            className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 3v3m0 12v3M3 12h3m12 0h3m-2.636-6.364-2.122 2.122M8.757 15.243l-2.121 2.121m0-12.728 2.121 2.121M15.243 15.243l2.121 2.121" />
            </svg>
            <span className="hidden sm:inline">AI Insights</span>
          </button>

          <button
            onClick={handleAddJob}
            className="flex items-center gap-1.5 text-sm px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 active:scale-95 transition-all shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Job</span>
          </button>

          <button
            onClick={handleLogout}
            title="Logout"
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
          >
            <svg className="w-4.5 h-4.5 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col gap-4 px-6 py-5 overflow-hidden">

        {/* Stats */}
        <StatsBar jobs={jobs} />

        {/* Section label */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Pipeline · {jobs.length} job{jobs.length !== 1 ? 's' : ''}
          </h2>
        </div>

        {/* Board */}
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-gray-400">
            <svg className="animate-spin w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
            <span className="text-sm">Loading your pipeline…</span>
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-5 text-gray-400">
            <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center">
              <svg className="w-10 h-10 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-gray-700 font-semibold text-base">No jobs tracked yet</p>
              <p className="text-sm text-gray-400 mt-1">Add your first application to get started</p>
            </div>
            <button
              onClick={handleAddJob}
              className="flex items-center gap-2 text-sm px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-semibold shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Add your first job
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

      {formOpen && (
        <JobForm job={editJob} onClose={() => setFormOpen(false)} onSave={handleSave} />
      )}
      {aiOpen && (
        <AIPanel job={aiJob} allJobs={jobs} onClose={() => setAiOpen(false)} />
      )}
    </div>
  );
}
