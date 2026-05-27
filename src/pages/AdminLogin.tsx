import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, Eye, EyeOff, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const AdminLogin = () => {
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading]       = useState(false);
  const [error, setError]               = useState('');

  const { signIn, isAdmin, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && isAdmin) navigate('/admin');
  }, [user, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const { error: err } = await signIn(email, password);

    if (err) {
      setError('Invalid email or password. Please try again.');
      setIsLoading(false);
      return;
    }

    // Small delay so auth state updates
    setTimeout(() => {
      setIsLoading(false);
      navigate('/admin');
    }, 500);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #e8edf5 0%, #dce4f0 100%)' }}
    >
      {/* Back to website */}
      <a
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Website
      </a>

      <div className="w-full max-w-md">

        {/* Icon + Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-5 shadow-lg"
            style={{ background: 'hsl(222 65% 22%)' }}>
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-800 mb-2">
            Admin Portal
          </h1>
          <p className="text-slate-500 text-base">
            Sign in to access the admin dashboard
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8">

          {/* Error banner */}
          {error && (
            <div className="flex items-center gap-3 p-4 mb-6 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@school.edu.np"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-100 border border-transparent
                             text-slate-800 placeholder:text-slate-400
                             focus:outline-none focus:border-blue-900/40 focus:ring-2 focus:ring-blue-900/10
                             focus:bg-white transition-all duration-200"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-slate-100 border border-transparent
                             text-slate-800 placeholder:text-slate-400
                             focus:outline-none focus:border-blue-900/40 focus:ring-2 focus:ring-blue-900/10
                             focus:bg-white transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl text-white font-semibold text-base
                         transition-all duration-200 active:scale-[0.98] disabled:opacity-70
                         flex items-center justify-center gap-2 mt-2"
              style={{ background: isLoading ? 'hsl(222 65% 30%)' : 'hsl(222 65% 22%)' }}
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing In…
                </>
              ) : 'Sign In'}
            </button>
          </form>

          {/* Footer note */}
          <p className="text-center text-sm text-slate-400 mt-6">
            Contact IT support if you need admin access.
          </p>
        </div>

        {/* Credentials hint (remove in production) */}
        <div className="mt-5 p-4 rounded-2xl bg-white/60 border border-white/80 text-center text-sm text-slate-500">
          <span className="font-semibold text-slate-600">Default credentials</span>
          <br />
          📧 admin@school.edu.np &nbsp;|&nbsp; 🔑 Admin@1234
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;
