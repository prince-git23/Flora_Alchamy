import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, User, ShieldCheck, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';

export default function LoginPage() {
  const navigate = useNavigate();
  const { showToast } = useStore();

  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [email, setEmail] = useState('customer@example.com');
  const [password, setPassword] = useState('demo1234');
  const [name, setName] = useState('Demo Customer');
  const [phone, setPhone] = useState('+91 98000 00000');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'login') {
      showToast('Signed in successfully as Demo Customer');
    } else {
      showToast('Welcome to Flora Alchemy! Keepsake account registered.');
    }
    navigate('/account');
  };

  const handleFillDemo = () => {
    setEmail('customer@example.com');
    setPassword('demo1234');
    setName('Demo Customer');
    setPhone('+91 98000 00000');
    showToast('Filled with Demo Customer credentials');
  };

  return (
    <div className="w-full bg-[#fcf9f4] min-h-screen py-12 lg:py-20 flex items-center justify-center">
      <div className="w-full max-w-md mx-auto px-4">
        <div className="bg-white rounded-3xl p-8 border border-[#e5e2dd] shadow-lg space-y-6">
          {/* Brand Emblem */}
          <div className="text-center space-y-2">
            <Link to="/" className="inline-block">
              <img
                src="/assets/images/flora-asset-27.jpg"
                alt="Flora Alchemy"
                className="h-8 w-auto mx-auto"
              />
            </Link>
            <h1 className="font-serif text-[28px] text-[#180f0a] font-medium">
              {mode === 'login' ? 'Welcome Back to the Atelier' : 'Create a Keepsake Account'}
            </h1>
            <p className="text-[13px] text-[#4e4540]">
              Access saved floral notes, order tracking, and curated wishlist archives.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#f6f3ee] text-[13px] font-semibold">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`py-2 rounded-xl transition-all ${
                mode === 'login' ? 'bg-white text-[#180f0a] shadow-xs' : 'text-[#80756f] hover:text-[#180f0a]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`py-2 rounded-xl transition-all ${
                mode === 'register' ? 'bg-white text-[#180f0a] shadow-xs' : 'text-[#80756f] hover:text-[#180f0a]'
              }`}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-[11px] uppercase font-bold text-[#4e4540] mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#f6f3ee] text-[14px] text-[#1c1c19] border border-[#e5e2dd] focus:outline-none focus:ring-1 focus:ring-[#180f0a]"
                  />
                  <User className="w-4 h-4 text-[#80756f] absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] uppercase font-bold text-[#4e4540] mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#f6f3ee] text-[14px] text-[#1c1c19] border border-[#e5e2dd] focus:outline-none focus:ring-1 focus:ring-[#180f0a]"
                />
                <Mail className="w-4 h-4 text-[#80756f] absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-[11px] uppercase font-bold text-[#4e4540] mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f6f3ee] text-[14px] text-[#1c1c19] border border-[#e5e2dd] focus:outline-none focus:ring-1 focus:ring-[#180f0a]"
                />
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] uppercase font-bold text-[#4e4540]">
                  Password
                </label>
                {mode === 'login' && (
                  <span className="text-[11px] text-[#964735] hover:underline cursor-pointer">
                    Forgot?
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#f6f3ee] text-[14px] text-[#1c1c19] border border-[#e5e2dd] focus:outline-none focus:ring-1 focus:ring-[#180f0a]"
                />
                <Lock className="w-4 h-4 text-[#80756f] absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-[#180f0a] hover:bg-[#964735] text-white text-[13px] font-semibold tracking-wide flex items-center justify-center gap-2 shadow-md transition-all active:translate-y-0.5"
            >
              <span>{mode === 'login' ? 'Sign In to Account' : 'Create My Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Demo Auto Fill */}
          <div className="pt-2 border-t border-[#e5e2dd] text-center">
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[12px] font-semibold text-[#964735] hover:underline"
            >
              ⚡ Quick Fill with Demo Account
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-[11px] text-[#80756f] text-center">
            <ShieldCheck className="w-4 h-4 text-[#5b6d54]" />
            <span>Encrypted & secure customer account session.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
