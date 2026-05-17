import JobCard from './JobCard';

const COLUMNS = [
  { status: 'saved',        label: 'Saved',        header: 'bg-gray-100 text-gray-700',   badge: 'bg-gray-200 text-gray-700' },
  { status: 'applied',      label: 'Applied',       header: 'bg-blue-50 text-blue-700',    badge: 'bg-blue-100 text-blue-700' },
  { status: 'phone_screen', label: 'Phone Screen',  header: 'bg-yellow-50 text-yellow-700',badge: 'bg-yellow-100 text-yellow-700' },
  { status: 'interview',    label: 'Interview',     header: 'bg-purple-50 text-purple-700', badge: 'bg-purple-100 text-purple-700' },
  { status: 'offer',        label: 'Offer',         header: 'bg-green-50 text-green-700',  badge: 'bg-green-100 text-green-700' },
  { status: 'rejected',     label: 'Rejected',      header: 'bg-red-50 text-red-700',      badge: 'bg-red-100 text-red-700' },
  { status: 'ghosted',      label: 'Ghosted',       header: 'bg-orange-50 text-orange-700',badge: 'bg-orange-100 text-orange-700' },
];

export default function KanbanBoard({ jobs, onEdit, onDelete, onAI }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {COLUMNS.map(({ status, label, header, badge }) => {
        const columnJobs = jobs.filter((j) => j.status === status);

        return (
          <div key={status} className="flex-shrink-0 w-72 flex flex-col gap-2">
            {/* Column header */}
            <div className={`flex items-center justify-between px-3 py-2 rounded-lg ${header}`}>
              <span className="text-sm font-semibold">{label}</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${badge}`}>
                {columnJobs.length}
              </span>
            </div>

            {/* Cards */}
            <div className="flex flex-col gap-2 overflow-y-auto max-h-[calc(100vh-260px)]">
              {columnJobs.length === 0 ? (
                <div className="flex items-center justify-center h-20 rounded-xl border-2 border-dashed border-gray-200 text-xs text-gray-400">
                  No jobs
                </div>
              ) : (
                columnJobs.map((job) => (
                  <JobCard
                    key={job._id}
                    job={job}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onAI={onAI}
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
