import toast from 'react-hot-toast';
import api from '../api';

const STATUS_STYLES = {
  saved:        'bg-gray-100 text-gray-700',
  applied:      'bg-blue-100 text-blue-700',
  phone_screen: 'bg-yellow-100 text-yellow-700',
  interview:    'bg-purple-100 text-purple-700',
  offer:        'bg-green-100 text-green-700',
  rejected:     'bg-red-100 text-red-700',
  ghosted:      'bg-orange-100 text-orange-700',
};

function formatDate(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
}

function IconButton({ onClick, title, children, className = '' }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition ${className}`}
    >
      {children}
    </button>
  );
}

export default function JobCard({ job, onEdit, onDelete, onAI }) {
  const handleDelete = async () => {
    if (!window.confirm(`Delete ${job.company} – ${job.role}?`)) return;
    try {
      await api.delete(`/api/jobs/${job._id}`);
      onDelete();
    } catch {
      toast.error('Failed to delete job');
    }
  };

  const statusLabel = job.status.replace('_', ' ');
  const badgeClass = STATUS_STYLES[job.status] ?? STATUS_STYLES.saved;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-3 hover:shadow-md transition-shadow">
      {/* Top row: company + status badge */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-gray-900 leading-tight">{job.company}</p>
          <p className="text-sm text-gray-600 mt-0.5">{job.role}</p>
        </div>
        <span className={`shrink-0 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${badgeClass}`}>
          {statusLabel}
        </span>
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
        {job.location && (
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {job.location}
          </span>
        )}
        {job.salary && (
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {job.salary}
          </span>
        )}
        {job.appliedAt && (
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(job.appliedAt)}
          </span>
        )}
        {job.noticePeriod && (
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {job.noticePeriod}
          </span>
        )}
        {job.jobSource && (
          <span className="text-indigo-400 font-medium">{job.jobSource}</span>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-1 pt-1 border-t border-gray-100">
        <IconButton onClick={() => onAI(job)} title="AI tools">
          <span className="text-sm leading-none">✨</span>
        </IconButton>

        <IconButton onClick={() => onEdit(job)} title="Edit">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </IconButton>

        <IconButton onClick={handleDelete} title="Delete" className="hover:text-red-600 hover:bg-red-50">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </IconButton>
      </div>
    </div>
  );
}
