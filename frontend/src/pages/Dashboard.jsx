import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api';
import StatsBar from '../components/StatsBar';
import KanbanBoard from '../components/KanbanBoard';
import JobForm from '../components/JobForm';
import AIPanel from '../components/AIPanel';

const STATUSES = [
  { value: 'saved',        label: 'Saved',        dot: 'bg-gray-400'    },
  { value: 'applied',      label: 'Applied',       dot: 'bg-blue-500'    },
  { value: 'phone_screen', label: 'Phone Screen',  dot: 'bg-yellow-500'  },
  { value: 'interview',    label: 'Interview',     dot: 'bg-purple-500'  },
  { value: 'offer',        label: 'Offer',         dot: 'bg-emerald-500' },
  { value: 'rejected',     label: 'Rejected',      dot: 'bg-red-500'     },
  { value: 'ghosted',      label: 'Ghosted',       dot: 'bg-orange-400'  },
];

export default function Dashboard() {
  const [jobs, setJobs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editJob, setEditJob]   = useState(null);
  const [aiOpen, setAiOpen]   = useState(false);
  const [aiJob, setAiJob]     = useState(null);

  // Filters
  const [search, setSearch]           = useState('');
  const [activeStatus, setActiveStatus] = useState('');   // '' = all
  const [activeSource, setActiveSource] = useState('');   // '' = all

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

  // Unique sources from existing jobs for the source filter
  const sources = useMemo(() => (
    [...new Set(jobs.map((j) => j.jobSource).filter(Boolean))]
  ), [jobs]);

  // Filtered jobs passed to board
  const filteredJobs = useMemo(() => jobs.filter((j) => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      j.company.toLowerCase().includes(q) ||
      j.role.toLowerCase().includes(q) ||
      (j.location   && j.location.toLowerCase().includes(q)) ||
      (j.jobSource  && j.jobSource.toLowerCase().includes(q)) ||
      (j.notes      && j.notes.toLowerCase().includes(q));
    const matchStatus = !activeStatus || j.status === activeStatus;
    const matchSource = !activeSource || j.jobSource === activeSource;
    return matchSearch && matchStatus && matchSource;
  }), [jobs, search, activeStatus, activeSource]);

  const hasFilters = search || activeStatus || activeSource;
  const clearFilters = () => { setSearch(''); setActiveStatus(''); setActiveSource(''); };

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

          <button onClick={handleLogout} title="Logout"
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col gap-4 px-6 py-5 overflow-hidden">

        {/* Stats */}
        <StatsBar jobs={jobs} />

        {/* ── Filter bar ── */}
        <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl px-4 py-3 flex flex-wrap items-center gap-3 shadow-sm">

          {/* Search */}
          <div className="relative flex-1 min-w-[180px]">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search company or role…"
              className="w-full pl-9 pr-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
            />
          </div>

          {/* Status chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {STATUSES.map(({ value, label, dot }) => (
              <button
                key={value}
                onClick={() => setActiveStatus(activeStatus === value ? '' : value)}
                className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
                  activeStatus === value
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${activeStatus === value ? 'bg-white' : dot}`} />
                {label}
              </button>
            ))}
          </div>

          {/* Source dropdown */}
          {sources.length > 0 && (
            <select
              value={activeSource}
              onChange={(e) => setActiveSource(e.target.value)}
              className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            >
              <option value="">All sources</option>
              {sources.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          )}

          {/* Result count + clear */}
          <div className="flex items-center gap-2 ml-auto shrink-0">
            <span className="text-xs text-gray-400 whitespace-nowrap">
              {filteredJobs.length} / {jobs.length} jobs
            </span>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1 transition"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear
              </button>
            )}
          </div>
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
            jobs={filteredJobs}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAI={handleAI}
            search={search}
          />
        )}
      </main>

      {formOpen && <JobForm job={editJob} onClose={() => setFormOpen(false)} onSave={handleSave} />}
      {aiOpen   && <AIPanel job={aiJob} allJobs={jobs} onClose={() => setAiOpen(false)} />}
    </div>
  );
}
