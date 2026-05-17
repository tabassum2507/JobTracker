import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api';

const EXPERIENCE_OPTIONS = [
  'Fresher (no experience)',
  'Less than 1 year',
  '1–3 years',
  '3–5 years',
  '5–10 years',
  '10+ years',
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    currentRole: '',
    experience: '',
    skills: '',
    bio: '',
  });

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/api/profile', form);
      navigate('/dashboard');
    } catch {
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#f7f6f3] flex flex-col"
      style={{
        backgroundImage:
          'linear-gradient(rgba(0,0,0,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.045) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }}
    >
      <nav className="flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="font-display italic font-bold text-gray-900 text-lg">JobTracker</span>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-sm text-gray-400 hover:text-gray-600 transition"
        >
          Skip for now →
        </button>
      </nav>

      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-xl">

          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              Step 2 of 2 — Quick profile setup
            </div>
            <h1 className="font-display italic text-3xl font-bold text-gray-900">
              Tell us about yourself
            </h1>
            <p className="text-gray-400 text-sm mt-2">
              This helps the AI write cover letters and prep questions tailored to <em>you</em>.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -inset-3 bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 rounded-3xl opacity-15 blur-2xl pointer-events-none" />
            <form
              onSubmit={handleSubmit}
              className="relative bg-white rounded-2xl shadow-xl border border-gray-200/60 p-8 space-y-5"
            >
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Full name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={set('name')}
                  required
                  placeholder="e.g. Priya Sharma"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                />
              </div>

              {/* Current role */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Current / last role
                </label>
                <input
                  type="text"
                  value={form.currentRole}
                  onChange={set('currentRole')}
                  placeholder="e.g. Software Engineer at Infosys · or · Fresher"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                />
              </div>

              {/* Experience */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Years of experience
                </label>
                <select
                  value={form.experience}
                  onChange={set('experience')}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                >
                  <option value="">Select…</option>
                  {EXPERIENCE_OPTIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Key skills
                </label>
                <input
                  type="text"
                  value={form.skills}
                  onChange={set('skills')}
                  placeholder="e.g. React, Node.js, Python, SQL, AWS"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                />
                <p className="text-[11px] text-gray-400 mt-1">Comma-separated</p>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  About you <span className="text-gray-300 font-normal normal-case">(optional)</span>
                </label>
                <textarea
                  value={form.bio}
                  onChange={set('bio')}
                  rows={3}
                  placeholder="A brief intro — your strengths, what kind of roles you're targeting, anything the AI should know about you…"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {saving ? 'Saving…' : 'Save & go to dashboard →'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
