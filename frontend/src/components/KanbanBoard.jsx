import JobCard from './JobCard';

const COLUMNS = [
  { status: 'saved',        label: 'Saved',        dot: 'bg-gray-400'   },
  { status: 'cold_email',   label: 'Cold Email',   dot: 'bg-pink-500'   },
  { status: 'applied',      label: 'Applied',       dot: 'bg-blue-500'   },
  { status: 'phone_screen', label: 'Phone Screen',  dot: 'bg-yellow-500' },
  { status: 'interview',    label: 'Interview',     dot: 'bg-purple-500' },
  { status: 'offer',        label: 'Offer',         dot: 'bg-emerald-500'},
  { status: 'rejected',     label: 'Rejected',      dot: 'bg-red-500'    },
  { status: 'ghosted',      label: 'Ghosted',       dot: 'bg-orange-400' },
];

export default function KanbanBoard({ jobs, onEdit, onDelete, onAI, search }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-4 -mx-1 px-1">
      {COLUMNS.map(({ status, label, dot }) => {
        const columnJobs = jobs.filter((j) => j.status === status);

        return (
          <div key={status} className="flex-shrink-0 w-[272px] flex flex-col gap-2">
            {/* Column header */}
            <div className="flex items-center justify-between px-1 py-1">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${dot}`} />
                <span className="text-sm font-semibold text-gray-700">{label}</span>
              </div>
              <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {columnJobs.length}
              </span>
            </div>

            {/* Column body */}
            <div className="bg-white/40 rounded-2xl p-2 flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-280px)] min-h-[120px]">
              {columnJobs.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center h-24 rounded-xl border-2 border-dashed border-gray-200 text-gray-300 gap-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-xs">No jobs</span>
                </div>
              ) : (
                columnJobs.map((job) => (
                  <JobCard
                    key={job._id}
                    job={job}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onAI={onAI}
                    search={search}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
