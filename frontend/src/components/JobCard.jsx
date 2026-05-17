import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api';

// Each status gets a pastel paper colour + a slight resting rotation
const STATUS_NOTE = {
  saved:        { bg: '#fef9c3', rot: -1.2 },
  applied:      { bg: '#dbeafe', rot:  0.8 },
  phone_screen: { bg: '#fed7aa', rot: -0.6 },
  interview:    { bg: '#ede9fe', rot:  1.2 },
  offer:        { bg: '#d1fae5', rot: -0.8 },
  rejected:     { bg: '#fee2e2', rot:  0.6 },
  ghosted:      { bg: '#e2e8f0', rot: -1.0 },
};

function formatDate(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
}

function SparkleIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v3m0 12v3M3 12h3m12 0h3m-2.636-6.364-2.122 2.122M8.757 15.243l-2.121 2.121m0-12.728 2.121 2.121M15.243 15.243l2.121 2.121" />
    </svg>
  );
}

export default function JobCard({ job, onEdit, onDelete, onAI }) {
  const [hovered, setHovered] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Delete ${job.company} – ${job.role}?`)) return;
    try {
      await api.delete(`/api/jobs/${job._id}`);
      onDelete();
    } catch {
      toast.error('Failed to delete job');
    }
  };

  const { bg, rot } = STATUS_NOTE[job.status] ?? STATUS_NOTE.saved;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: bg,
        transform: hovered ? 'rotate(0deg) translateY(-3px)' : `rotate(${rot}deg)`,
        boxShadow: hovered
          ? '4px 8px 24px rgba(0,0,0,0.18)'
          : '2px 4px 10px rgba(0,0,0,0.13)',
        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
      }}
      className="relative rounded-sm p-3.5 flex flex-col gap-3 cursor-default"
    >
      {/* Adhesive strip at top */}
      <div
        className="absolute top-0 left-0 right-0 h-1.5 rounded-t-sm"
        style={{ backgroundColor: 'rgba(0,0,0,0.07)' }}
      />

      {/* Company + Role */}
      <div className="pt-1">
        <p className="font-bold text-gray-800 text-sm leading-tight">{job.company}</p>
        <p className="text-xs text-gray-500 mt-0.5">{job.role}</p>
      </div>

      {/* Meta */}
      <div className="flex flex-col gap-1">
        {job.location && (
          <span className="flex items-center gap-1.5 text-[11px] text-gray-600">
            <svg className="w-3 h-3 shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {job.location}
          </span>
        )}
        {job.salary && (
          <span className="text-[11px] text-gray-600">{job.salary}</span>
        )}
        {job.noticePeriod && (
          <span className="flex items-center gap-1.5 text-[11px] text-gray-600">
            <svg className="w-3 h-3 shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {job.noticePeriod}
          </span>
        )}
        {job.jobSource && (
          <span className="text-[11px] text-indigo-600 font-medium">{job.jobSource}</span>
        )}
        {job.appliedAt && (
          <span className="text-[11px] text-gray-400">{formatDate(job.appliedAt)}</span>
        )}
      </div>

      {/* Actions */}
      <div
        className="flex items-center justify-between pt-2 border-t"
        style={{ borderColor: 'rgba(0,0,0,0.08)' }}
      >
        <button
          onClick={() => onAI(job)}
          className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition"
        >
          <SparkleIcon /> AI Assist
        </button>
        <div
          className="flex items-center gap-0.5 transition-opacity duration-150"
          style={{ opacity: hovered ? 1 : 0 }}
        >
          <button
            onClick={() => onEdit(job)}
            title="Edit"
            className="p-1.5 rounded text-gray-400 hover:text-gray-700 hover:bg-black/5 transition"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            title="Delete"
            className="p-1.5 rounded text-gray-400 hover:text-red-500 hover:bg-red-100/60 transition"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
