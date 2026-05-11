import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Loader2, Sparkles } from 'lucide-react';
import { login, signup } from '../api/authApi';

export default function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSignup = mode === 'signup';

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const payload = isSignup
        ? form
        : {
            email: form.email,
            password: form.password
          };
      const response = isSignup ? await signup(payload) : await login(payload);

      localStorage.setItem('datastory_token', response.token);
      localStorage.setItem('datastory_user', JSON.stringify(response.user));
      navigate('/');
    } catch (authError) {
      setError(authError.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-slate-950 text-white lg:grid-cols-[1.05fr_0.95fr]">
      <section className="hidden px-10 py-10 lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-emerald-500 text-slate-950">
            <Sparkles size={22} aria-hidden="true" />
          </div>
          <div>
            <p className="text-lg font-semibold">DataStory AI</p>
            <p className="text-sm text-slate-400">AI analytics workspace</p>
          </div>
        </div>

        <div className="max-w-xl">
          <p className="text-sm font-medium text-emerald-300">Secure workspace</p>
          <h1 className="mt-3 text-5xl font-semibold tracking-normal">
            Turn files into dashboards, answers, and business insight.
          </h1>
          <p className="mt-5 text-base leading-7 text-slate-300">
            Upload CSV, Excel, and PDF files, then ask questions in natural language as the platform grows phase by phase.
          </p>
        </div>

        <div className="grid max-w-xl grid-cols-3 gap-3">
          {['JWT auth', 'Private files', 'AI-ready'].map((item) => (
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-4" key={item}>
              <BarChart3 className="text-emerald-300" size={20} aria-hidden="true" />
              <p className="mt-3 text-sm font-medium text-slate-200">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-md rounded-lg border border-slate-800 bg-white p-6 text-slate-950 shadow-soft">
          <div>
            <p className="text-sm font-medium text-emerald-700">{isSignup ? 'Create account' : 'Welcome back'}</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-normal">
              {isSignup ? 'Start using DataStory AI' : 'Log in to DataStory AI'}
            </h2>
          </div>

          <div className="mt-6 grid grid-cols-2 rounded-md bg-slate-100 p-1">
            <button
              className={`rounded px-3 py-2 text-sm font-semibold ${!isSignup ? 'bg-white shadow-sm' : 'text-slate-600'}`}
              onClick={() => setMode('login')}
              type="button"
            >
              Login
            </button>
            <button
              className={`rounded px-3 py-2 text-sm font-semibold ${isSignup ? 'bg-white shadow-sm' : 'text-slate-600'}`}
              onClick={() => setMode('signup')}
              type="button"
            >
              Signup
            </button>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {isSignup ? (
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Full name</span>
                <input
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  name="fullName"
                  onChange={handleChange}
                  placeholder="Sanjai Kumar"
                  required
                  type="text"
                  value={form.fullName}
                />
              </label>
            ) : null}

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Email</span>
              <input
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                name="email"
                onChange={handleChange}
                placeholder="you@example.com"
                required
                type="email"
                value={form.email}
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Password</span>
              <input
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                minLength={8}
                name="password"
                onChange={handleChange}
                placeholder="Minimum 8 characters"
                required
                type="password"
                value={form.password}
              />
            </label>

            {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

            <button
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={18} aria-hidden="true" /> : null}
              {isSignup ? 'Create account' : 'Login'}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
