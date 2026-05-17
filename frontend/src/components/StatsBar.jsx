const CARDS = [
  {
    key: 'totalApplied',
    label: 'Applied',
    color: 'bg-blue-50 text-blue-700 border-blue-100',
    numColor: 'text-blue-700',
  },
  {
    key: 'interviews',
    label: 'Interviews',
    color: 'bg-purple-50 text-purple-700 border-purple-100',
    numColor: 'text-purple-700',
  },
  {
    key: 'offers',
    label: 'Offers',
    color: 'bg-green-50 text-green-700 border-green-100',
    numColor: 'text-green-700',
  },
  {
    key: 'rejected',
    label: 'Rejected',
    color: 'bg-red-50 text-red-700 border-red-100',
    numColor: 'text-red-700',
  },
  {
    key: 'ghosted',
    label: 'Ghosted',
    color: 'bg-orange-50 text-orange-700 border-orange-100',
    numColor: 'text-orange-700',
  },
  {
    key: 'responseRate',
    label: 'Response Rate',
    color: 'bg-teal-50 text-teal-700 border-teal-100',
    numColor: 'text-teal-700',
    suffix: '%',
  },
];

export default function StatsBar({ jobs }) {
  const totalApplied = jobs.filter((j) => j.status !== 'saved').length;
  const interviews   = jobs.filter((j) => j.status === 'interview').length;
  const offers       = jobs.filter((j) => j.status === 'offer').length;
  const rejected     = jobs.filter((j) => j.status === 'rejected').length;
  const ghosted      = jobs.filter((j) => j.status === 'ghosted').length;
  const responseRate =
    totalApplied > 0
      ? +((interviews + offers + rejected) / totalApplied * 100).toFixed(1)
      : 0;

  const stats = { totalApplied, interviews, offers, rejected, ghosted, responseRate };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {CARDS.map(({ key, label, color, numColor, suffix = '' }) => (
        <div
          key={key}
          className={`rounded-xl border px-4 py-3 flex flex-col gap-1 ${color}`}
        >
          <span className={`text-2xl font-bold leading-none ${numColor}`}>
            {stats[key]}{suffix}
          </span>
          <span className="text-xs font-medium opacity-80">{label}</span>
        </div>
      ))}
    </div>
  );
}
