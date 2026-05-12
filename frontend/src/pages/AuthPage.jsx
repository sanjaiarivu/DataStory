
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Sparkles, Eye, EyeOff } from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);

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
    <main className="min-h-screen w-full bg-slate-900 flex items-center justify-center px-4 py-10">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      </div>

      {/* Main container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-emerald-600 rounded-lg text-white">
              <Sparkles size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">DataStory AI</h1>
              <p className="text-sm text-emerald-200">AI-powered Analytics</p>
            </div>
          </div>
          <p className="text-sm font-medium text-emerald-300 mb-2">{isSignup ? 'Create account' : 'Welcome back'}</p>
          <h2 className="text-3xl font-bold text-white">
            {isSignup ? 'Start your journey' : 'Sign in to DataStory'}
          </h2>
        </div>

        {/* Auth Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 shadow-2xl">
          {/* Mode toggle */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <button
              onClick={() => setMode('login')}
              className={`py-2.5 px-4 rounded-lg font-semibold transition-all duration-200 ${
                !isSignup
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
              type="button"
            >
              Login
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`py-2.5 px-4 rounded-lg font-semibold transition-all duration-200 ${
                isSignup
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
              type="button"
            >
              Signup
            </button>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit} autoComplete="off">
            {isSignup && (
              <div>
                <label className="block text-sm font-medium text-white mb-2">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 transition"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-white mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Minimum 8 characters"
                  minLength={8}
                  className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 transition"
                  required
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-100 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600/50 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
            >
              {isSubmitting && <Loader2 className="animate-spin" size={18} />}
              {isSignup ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          {/* Footer */}
          <p className="text-xs text-white/40 text-center mt-6">
            &copy; {new Date().getFullYear()} DataStory AI. All rights reserved.
          </p>
        </div>
      </div>
    </main>
  );
}
