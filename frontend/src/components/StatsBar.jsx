const CARDS = [
  { key: 'totalApplied', label: 'Total Applied',  accent: 'border-l-blue-400',    num: 'text-blue-600'    },
  { key: 'interviews',   label: 'Interviews',      accent: 'border-l-purple-400',  num: 'text-purple-600'  },
  { key: 'offers',       label: 'Offers',          accent: 'border-l-emerald-400', num: 'text-emerald-600' },
  { key: 'rejected',     label: 'Rejected',        accent: 'border-l-red-400',     num: 'text-red-500'     },
  { key: 'ghosted',      label: 'Ghosted',         accent: 'border-l-orange-400',  num: 'text-orange-500'  },
  { key: 'responseRate', label: 'Response Rate',   accent: 'border-l-teal-400',    num: 'text-teal-600', suffix: '%' },
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
      {CARDS.map(({ key, label, accent, num, suffix = '' }) => (
        <div
          key={key}
          className={`bg-white rounded-xl border border-gray-100 border-l-4 ${accent} px-4 py-3.5 flex flex-col gap-1 shadow-sm hover:shadow-md transition-shadow`}
        >
          <p className={`text-2xl font-bold leading-none ${num}`}>
            {stats[key]}{suffix}
          </p>
          <p className="text-xs text-gray-400 font-medium mt-1">{label}</p>
        </div>
      ))}
    </div>
  );
}
