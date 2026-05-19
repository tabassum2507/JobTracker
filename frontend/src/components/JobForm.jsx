import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api';

const STATUS_OPTIONS = [
  { value: 'saved',        label: 'Saved' },
  { value: 'cold_email',   label: 'Cold Email' },
  { value: 'applied',      label: 'Applied' },
  { value: 'phone_screen', label: 'Phone Screen' },
  { value: 'interview',    label: 'Interview' },
  { value: 'offer',        label: 'Offer' },
  { value: 'rejected',     label: 'Rejected' },
  { value: 'ghosted',      label: 'Ghosted' },
];

const NOTICE_OPTIONS = [
  'Immediate',
  '15 days',
  '30 days',
  '60 days',
  '90 days',
  '3 months',
  '6 months',
];

const SOURCE_OPTIONS = [
  'Naukri',
  'LinkedIn',
  'Indeed',
  'Instahyre',
  'Referral',
  'Company Website',
  'Internshala',
  'AngelList / Wellfound',
  'Campus Placement',
  'Other',
];

const INPUT =
  'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition';

const Label = ({ children, required }) => (
  <label className="block text-xs font-medium text-gray-700 mb-1">
    {children}{required && <span className="text-red-500 ml-0.5">*</span>}
  </label>
);

function toDateValue(iso) {
  if (!iso) return '';
  return new Date(iso).toISOString().split('T')[0];
}

export default function JobForm({ job, onClose, onSave }) {
  const [form, setForm] = useState({
    company:      job?.company      || '',
    role:         job?.role         || '',
    location:     job?.location     || '',
    status:       job?.status       || 'saved',
    salary:       job?.salary       || '',
    jobUrl:       job?.jobUrl       || '',
    notes:        job?.notes        || '',
    appliedAt:    toDateValue(job?.appliedAt),
    interviewDate:toDateValue(job?.interviewDate),
    offer:        job?.offer        || '',
    noticePeriod: job?.noticePeriod || '',
    jobSource:    job?.jobSource    || '',
  });
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (job?._id) {
        await api.put(`/api/jobs/${job._id}`, form);
        toast.success('Job updated');
      } else {
        await api.post('/api/jobs', form);
        toast.success('Job added');
      }
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            {job?._id ? 'Edit job' : 'Add job'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition" aria-label="Close">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

          {/* Company + Role */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label required>Company</Label>
              <input type="text" required value={form.company} onChange={set('company')} className={INPUT} placeholder="e.g. Infosys, Swiggy" />
            </div>
            <div>
              <Label required>Role</Label>
              <input type="text" required value={form.role} onChange={set('role')} className={INPUT} placeholder="e.g. SDE-2, Product Manager" />
            </div>
          </div>

          {/* Location + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Location</Label>
              <input type="text" value={form.location} onChange={set('location')} className={INPUT} placeholder="Bengaluru / Remote / Hybrid" />
            </div>
            <div>
              <Label>Status</Label>
              <select value={form.status} onChange={set('status')} className={INPUT}>
                {STATUS_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* CTC + Notice Period */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Expected CTC</Label>
              <input type="text" value={form.salary} onChange={set('salary')} className={INPUT} placeholder="e.g. 12 LPA" />
            </div>
            <div>
              <Label>Notice Period</Label>
              <select value={form.noticePeriod} onChange={set('noticePeriod')} className={INPUT}>
                <option value="">— Select —</option>
                {NOTICE_OPTIONS.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Job Source + Job URL */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Job Source</Label>
              <select value={form.jobSource} onChange={set('jobSource')} className={INPUT}>
                <option value="">— Select —</option>
                {SOURCE_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Job URL</Label>
              <input type="url" value={form.jobUrl} onChange={set('jobUrl')} className={INPUT} placeholder="Naukri / LinkedIn link" />
            </div>
          </div>

          {/* Applied At + Interview Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Applied On</Label>
              <input type="date" value={form.appliedAt} onChange={set('appliedAt')} className={INPUT} />
            </div>
            <div>
              <Label>Interview Date</Label>
              <input type="date" value={form.interviewDate} onChange={set('interviewDate')} className={INPUT} />
            </div>
          </div>

          {/* Offer CTC */}
          <div>
            <Label>Offer CTC</Label>
            <input type="text" value={form.offer} onChange={set('offer')} className={INPUT} placeholder="e.g. ₹18 LPA + ESOPs + ₹1L joining bonus" />
          </div>

          {/* Notes */}
          <div>
            <Label>Notes</Label>
            <textarea
              value={form.notes}
              onChange={set('notes')}
              rows={3}
              className={INPUT}
              placeholder="Recruiter name, CTC breakup, bond period, ESOP vesting, next steps…"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Saving…' : job?._id ? 'Update job' : 'Add job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
