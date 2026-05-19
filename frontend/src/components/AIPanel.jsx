import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../api';

const ALL_TABS = [
  { id: 'cover-letter',   label: 'Cover Letter' },
  { id: 'cold-email',     label: 'Cold Email' },
  { id: 'interview-prep', label: 'Interview Prep' },
  { id: 'insights',       label: 'Insights' },
];

const INITIAL_TAB_STATE = { loading: false, result: '' };

function Spinner() {
  return (
    <svg className="animate-spin h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}

const GENERATE_LABELS = {
  'cover-letter':   ['Generate Cover Letter',      'Regenerate Cover Letter'],
  'cold-email':     ['Write Cold Message',         'Rewrite Cold Message'],
  'interview-prep': ['Generate Interview Questions','Regenerate Questions'],
  insights:         ['Analyze My Job Search',       'Re-analyze'],
};

export default function AIPanel({ job, allJobs, onClose }) {
  const tabs = job ? ALL_TABS : ALL_TABS.filter((t) => t.id === 'insights');

  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [tabState, setTabState] = useState({
    'cover-letter':   { ...INITIAL_TAB_STATE },
    'cold-email':     { ...INITIAL_TAB_STATE },
    'interview-prep': { ...INITIAL_TAB_STATE },
    insights:         { ...INITIAL_TAB_STATE },
  });
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);

  // Trigger slide-in on mount
  useEffect(() => { setVisible(true); }, []);

  const patch = (tab, update) =>
    setTabState((prev) => ({ ...prev, [tab]: { ...prev[tab], ...update } }));

  const generate = async (tab) => {
    patch(tab, { loading: true, result: '' });
    try {
      let data;
      if (tab === 'cover-letter') {
        ({ data } = await api.post('/api/ai/cover-letter', {
          company: job.company, role: job.role, notes: job.notes || '',
        }));
      } else if (tab === 'cold-email') {
        ({ data } = await api.post('/api/ai/cold-email', {
          company: job.company, role: job.role, notes: job.notes || '',
        }));
      } else if (tab === 'interview-prep') {
        ({ data } = await api.post('/api/ai/interview-prep', {
          company: job.company, role: job.role, notes: job.notes || '',
        }));
      } else {
        ({ data } = await api.post('/api/ai/insights', { jobs: allJobs }));
      }
      patch(tab, { loading: false, result: data.result });
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI request failed');
      patch(tab, { loading: false });
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result);
    toast.success('Copied!');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const { loading, result } = tabState[activeTab];
  const [generateLabel, regenerateLabel] = GENERATE_LABELS[activeTab];

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col
          transform transition-transform duration-300 ease-out
          ${visible ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <h2 className="text-base font-semibold text-gray-900">AI Assistant ✨</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab nav */}
        <div className="flex border-b border-gray-100 px-5 shrink-0">
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`py-3 px-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                ${activeTab === id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
          {/* Job context chip */}
          {job && activeTab !== 'insights' && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
              <p className="text-sm font-semibold text-gray-800">{job.company}</p>
              <p className="text-xs text-gray-500 mt-0.5">{job.role}</p>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="flex flex-col items-center justify-center flex-1 py-16 gap-3 text-gray-400">
              <Spinner />
              <span className="text-sm">Generating…</span>
            </div>
          )}

          {/* Result: Cover Letter / Cold Email — readonly textarea + copy */}
          {!loading && result && (activeTab === 'cover-letter' || activeTab === 'cold-email') && (
            <div className="flex flex-col gap-2">
              <textarea
                readOnly
                value={result}
                rows={activeTab === 'cold-email' ? 7 : 14}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 bg-gray-50 resize-none focus:outline-none leading-relaxed"
              />
              <button
                onClick={handleCopy}
                className="self-end text-sm px-4 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700"
              >
                {copied ? 'Copied!' : 'Copy to clipboard'}
              </button>
            </div>
          )}

          {/* Result: Interview Prep / Insights — pre-wrap text */}
          {!loading && result && activeTab !== 'cover-letter' && activeTab !== 'cold-email' && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
              {result}
            </div>
          )}

          {/* Generate / Regenerate button — always shown when not loading */}
          {!loading && (
            <button
              onClick={() => generate(activeTab)}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 active:scale-95 transition-all mt-auto"
            >
              {result ? regenerateLabel : generateLabel}
            </button>
          )}
        </div>
      </div>
    </>
  );
}
