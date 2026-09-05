import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminSession } from '../../context/AdminSessionContext.jsx';
import { Lock, Mail, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { login } = useAdminSession();
  const [email, setEmail] = useState('handler.admin@flora-alchemy.demo');
  const [password, setPassword] = useState('handler1234');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = login(email, password);

    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setError(result.error || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#fcf9f4] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Top brand */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-[#180f0a] text-white flex items-center justify-center font-bold text-[14px] shadow-sm">
            HA
          </div>
          <div>
            <span className="font-serif text-[18px] text-[#180f0a] font-medium">Flora Alchemy</span>
            <span className="block text-[9px] uppercase tracking-widest text-[#964735] font-bold mt-0.5">Handler Portal</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-[#e5e2dd] shadow-lg space-y-6">
          <div className="text-center space-y-2">
            <h1 className="font-serif text-2xl text-[#180f0a] font-medium">Handler Sign In</h1>
            <p className="text-[13px] text-[#80756f]">Access the Flora Alchemy operations console</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-[#ffdad3]/70 border border-[#ffdad3] text-[#783020] text-[13px]">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase font-bold text-[#4e4540] mb-1.5">Handler Email</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#f6f3ee] text-[14px] text-[#1c1c19] border border-[#e5e2dd] focus:outline-none focus:ring-1 focus:ring-[#180f0a]"
                />
                <Mail className="w-4 h-4 text-[#80756f] absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase font-bold text-[#4e4540] mb-1.5">Portal Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#f6f3ee] text-[14px] text-[#1c1c19] border border-[#e5e2dd] focus:outline-none focus:ring-1 focus:ring-[#180f0a]"
                />
                <Lock className="w-4 h-4 text-[#80756f] absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-[#180f0a] hover:bg-[#964735] disabled:opacity-50 text-white text-[13px] font-semibold tracking-wide flex items-center justify-center gap-2 transition-all"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  Sign In to Portal
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 border-t border-[#e5e2dd] text-center space-y-1">
            <button
              type="button"
              onClick={() => { setEmail('handler.admin@flora-alchemy.demo'); setPassword('handler1234'); setError(''); }}
              className="text-[12px] font-semibold text-[#964735] hover:underline"
            >
              Quick Fill Demo Credentials
            </button>
            <p className="text-[11px] text-[#80756f]">Demo: handler.admin@flora-alchemy.demo / handler1234</p>
          </div>

          <div className="flex items-center justify-center gap-2 text-[11px] text-[#80756f]">
            <ShieldCheck className="w-4 h-4 text-[#5b6d54]" />
            <span>Sample Data Environment · Prototype Authentication</span>
          </div>
        </div>

        <p className="text-center text-[12px] text-[#80756f] mt-6">
          Still building gifts?{' '}
          <Link to="/" className="text-[#964735] hover:underline font-semibold">Open the storefront</Link>
        </p>
      </div>
    </div>
  );
}
