import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, Mail, User, Phone, Eye, EyeOff, ArrowRight, Info, AlertCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import { apiLogin, apiRegister } from '../services/customerService.js';

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast } = useStore();

  // Optional return destination (e.g. /checkout) so auth never strands the customer.
  const redirect = searchParams.get('redirect') || '/account';
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';

  const [mode, setMode] = useState(initialMode); // 'login' | 'register' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const goAfterAuth = () => navigate(redirect);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (mode === 'register') {
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        setIsSubmitting(false);
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        setIsSubmitting(false);
        return;
      }
      if (!name.trim()) {
        setError('Please provide your full name.');
        setIsSubmitting(false);
        return;
      }
      // Register against the backend — creates User + Customer (bcrypt + JWT)
      // and returns to checkout when that was the originating destination.
      const result = await apiRegister({ name, email, password, phone });
      if (result.error) {
        setError(result.error);
        setIsSubmitting(false);
        return;
      }
      showToast(result.created
        ? `Welcome to Flora Alchemy, ${result.customer.name}!`
        : 'Account already existed — signed you in.');
      setIsSubmitting(false);
      goAfterAuth();
      return;
    }

    // Login — the server validates credentials (bcrypt) and issues a JWT.
    const result = await apiLogin(email, password);
    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }
    const customer = result.customer;
    showToast(`Welcome back, ${customer.name}!`);
    setIsSubmitting(false);
    goAfterAuth();
  };

  const handleSendResetLink = (e) => {
    e.preventDefault();
    setResetSent(true);
    // Honest demo behavior: no email infrastructure exists yet.
  };

  const handleFillDemo = () => {
    setEmail('customer@example.com');
    setPassword('demo1234');
    setError('');
    showToast('Filled with Demo Customer credentials');
  };

  return (
    <div className="w-full bg-[#fcf9f4] min-h-[calc(100vh-64px)] py-12 lg:py-20 flex items-center justify-center">
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
              {mode === 'login' && 'Welcome Back'}
              {mode === 'register' && 'Create an Account'}
              {mode === 'forgot' && 'Reset Your Password'}
            </h1>
            <p className="text-[13px] text-[#4e4540]">
              {mode === 'forgot'
                ? 'Enter the email you use to shop with us.'
                : 'Access your orders, wishlist, and saved gift notes.'}
            </p>
          </div>

          {/* Tab Switcher (hidden in forgot mode) */}
          {mode !== 'forgot' && (
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#f6f3ee] text-[13px] font-semibold">
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); }}
                className={`py-2 rounded-xl transition-all ${
                  mode === 'login' ? 'bg-white text-[#180f0a] shadow-xs' : 'text-[#80756f] hover:text-[#180f0a]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setError(''); }}
                className={`py-2 rounded-xl transition-all ${
                  mode === 'register' ? 'bg-white text-[#180f0a] shadow-xs' : 'text-[#80756f] hover:text-[#180f0a]'
                }`}
              >
                Create Account
              </button>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-2xl bg-[#ffdad6]/60 border border-[#ffc9c2] text-[12px] text-[#8a2a18] flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          {mode === 'forgot' ? (
            <form onSubmit={handleSendResetLink} className="space-y-4">
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

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-[#180f0a] hover:bg-[#964735] text-white text-[13px] font-semibold tracking-wide shadow-md transition-all active:translate-y-0.5"
              >
                Send Reset Link
              </button>

              {resetSent && (
                <div className="p-3 rounded-2xl bg-[#f6f3ee] border border-[#e5e2dd] text-[12px] text-[#4e4540] flex items-start gap-2">
                  <Info className="w-4 h-4 text-[#964735] shrink-0 mt-0.5" />
                  <span>
                    Demo environment — no email is actually sent. Use the demo account
                    (customer@example.com / demo1234) to sign in.
                  </span>
                </div>
              )}

              <button
                type="button"
                onClick={() => { setMode('login'); setResetSent(false); setError(''); }}
                className="w-full text-center text-[12px] font-semibold text-[#964735] hover:underline"
              >
                Back to Sign In
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#f6f3ee] text-[14px] text-[#1c1c19] border border-[#e5e2dd] focus:outline-none focus:ring-1 focus:ring-[#180f0a]"
                    />
                    <Phone className="w-4 h-4 text-[#80756f] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] uppercase font-bold text-[#4e4540]">
                    Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => { setMode('forgot'); setError(''); }}
                      className="text-[11px] text-[#964735] hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-[#f6f3ee] text-[14px] text-[#1c1c19] border border-[#e5e2dd] focus:outline-none focus:ring-1 focus:ring-[#180f0a]"
                  />
                  <Lock className="w-4 h-4 text-[#80756f] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#80756f] hover:text-[#180f0a]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {mode === 'register' && (
                <div>
                  <label className="block text-[11px] uppercase font-bold text-[#4e4540] mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#f6f3ee] text-[14px] text-[#1c1c19] border border-[#e5e2dd] focus:outline-none focus:ring-1 focus:ring-[#180f0a]"
                    />
                    <Lock className="w-4 h-4 text-[#80756f] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-full bg-[#180f0a] hover:bg-[#964735] text-white text-[13px] font-semibold tracking-wide flex items-center justify-center gap-2 shadow-md transition-all active:translate-y-0.5 disabled:opacity-50"
              >
                <span>{mode === 'login' ? 'Sign In to Account' : 'Create My Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Demo Auto Fill (explicit helper — never silent) */}
          {mode !== 'forgot' && (
            <div className="pt-2 border-t border-[#e5e2dd] text-center">
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-[12px] font-semibold text-[#964735] hover:underline"
              >
                ⚡ Quick Fill with Demo Account (DEV ONLY)
              </button>
            </div>
          )}

          <div className="flex items-center justify-center gap-2 text-[11px] text-[#80756f] text-center">
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span>Prototype authentication · Sample data environment · Demo credentials never sign you in automatically</span>
          </div>
        </div>
      </div>
    </div>
  );
}