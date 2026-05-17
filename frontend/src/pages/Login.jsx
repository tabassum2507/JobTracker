import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api';

const FEATURES = [
  { icon: '📋', label: 'Kanban Pipeline' },
  { icon: '✨', label: 'AI Cover Letters' },
  { icon: '🎯', label: 'Interview Prep' },
  { icon: '📊', label: 'Smart Insights' },
  { icon: '⏱️', label: 'Notice Period Tracker' },
  { icon: '🔗', label: 'Naukri · LinkedIn · Referral' },
];

export default function Login() {
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]       = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
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
      {/* ── Navbar ── */}
      <nav className="flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white text-sm">💼</div>
          <span className="font-display italic font-bold text-gray-900 text-lg">JobTracker</span>
        </div>
        <Link
          to="/register"
          className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1 transition"
        >
          Create account <span className="text-gray-400">→</span>
        </Link>
      </nav>

      {/* ── Hero ── */}
      <main className="flex-1 flex items-center justify-center px-6 lg:px-20 py-10">
        <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center gap-16 lg:gap-20">

          {/* Left: Copy */}
          <div className="flex-1 flex flex-col gap-8">
            {/* Badge */}
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              AI-Powered · Built for India
            </span>

            {/* Headline */}
            <div>
              <h1 className="font-display italic text-5xl lg:text-6xl font-bold text-gray-950 leading-[1.08]">
                Track every<br />
                application.<br />
                <span className="text-indigo-600">Land the offer.</span>
              </h1>
              <p className="mt-5 text-gray-500 text-lg leading-relaxed max-w-md">
                Stop juggling Naukri, LinkedIn, and WhatsApp referrals in your head.
                One Kanban board, AI-generated cover letters, and real interview prep — all in one place.
              </p>
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2">
              {FEATURES.map(({ icon, label }) => (
                <span
                  key={label}
                  className="flex items-center gap-1.5 text-xs font-medium bg-white text-gray-700 border border-gray-200 px-3 py-1.5 rounded-full shadow-sm"
                >
                  <span>{icon}</span>
                  {label}
                </span>
              ))}
            </div>

            {/* Social proof */}
            <p className="text-xs text-gray-400 flex items-center gap-2">
              <span className="flex -space-x-1.5">
                {['🧑‍💻','👩‍💼','👨‍🎓','👩‍🔬'].map((e, i) => (
                  <span key={i} className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[10px]">{e}</span>
                ))}
              </span>
              Join job seekers tracking their search smarter
            </p>
          </div>

          {/* Right: Login card with gradient glow */}
          <div className="w-full lg:w-auto lg:min-w-[380px] relative">
            {/* Gradient glow decoration */}
            <div className="absolute -inset-4 bg-gradient-to-br from-violet-400 via-indigo-500 to-orange-400 rounded-3xl opacity-20 blur-2xl pointer-events-none" />

            {/* Card */}
            <div className="relative bg-white rounded-2xl shadow-xl border border-gray-200/60 p-8">
              {/* Card header */}
              <div className="mb-6">
                <h2 className="font-display italic text-xl font-bold text-gray-900">Welcome back</h2>
                <p className="text-sm text-gray-400 mt-0.5">Sign in to your dashboard</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gray-950 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-800 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-2"
                >
                  {loading ? 'Signing in…' : 'Sign in →'}
                </button>
              </form>

              <div className="mt-5 pt-5 border-t border-gray-100 text-center">
                <p className="text-xs text-gray-400">
                  New here?{' '}
                  <Link to="/register" className="text-indigo-600 font-semibold hover:underline">
                    Create a free account
                  </Link>
                </p>
              </div>

              {/* Mini feature hints inside card */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                {['✨ AI Cover Letters', '📋 Kanban Board', '🎯 Interview Prep', '📊 Insights'].map((f) => (
                  <div key={f} className="text-[11px] text-gray-400 bg-gray-50 rounded-lg px-2.5 py-1.5 text-center border border-gray-100">
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="text-center text-xs text-gray-400 pb-6">
        Built for the Indian job market · Naukri · LinkedIn · Internshala · Campus Placements
      </footer>
    </div>
  );
}
