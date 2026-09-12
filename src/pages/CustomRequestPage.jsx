import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, Sparkles, CheckCircle, Clock, ImagePlus } from 'lucide-react';
import { getActiveCustomerId, getActiveCustomer } from '../services/customerService.js';
import { createCustomRequest } from '../services/customRequestService.js';

const OCCASIONS = ['Birthday', 'Anniversary', 'Wedding', 'Graduation', 'Thank You', 'Congratulations', 'Festival', 'Just Because', 'Other'];
const BUDGETS = ['Under ₹500', '₹500 – ₹1,000', '₹1,000 – ₹2,000', '₹2,000 – ₹5,000', '₹5,000+'];

export default function CustomRequestPage() {
  const user = getActiveCustomer();
  const navigate = useNavigate();

  const [description, setDescription] = useState('');
  const [occasion, setOccasion] = useState('');
  const [budget, setBudget] = useState('');
  const [colors, setColors] = useState('');
  const [desiredDate, setDesiredDate] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!getActiveCustomerId()) {
      navigate('/login', { state: { from: '/custom-request' } });
      return;
    }
    if (description.trim().length < 10) {
      setError('Please describe your idea in at least 10 characters.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await createCustomRequest({ description: description.trim(), occasion, budget, colors, desiredDate, imageUrl });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="w-full bg-[#fcf9f4] min-h-screen flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center space-y-6 bg-white rounded-3xl p-10 border border-[#e5e2dd] shadow-lg">
          <div className="w-16 h-16 rounded-full bg-[#d8e7cd]/50 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-[#5b6d54]" />
          </div>
          <h1 className="font-serif text-[28px] text-[#180f0a]">Request Received</h1>
          <p className="text-[14px] text-[#4e4540] leading-relaxed">
            Thank you — our team will review your custom creation request and get back to you within 1–2 business days.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#180f0a] text-white text-[13px] font-semibold hover:bg-[#964735] transition-colors">
              Browse Gifts
            </Link>
            <Link to="/account/orders" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#e5e2dd] text-[#180f0a] text-[13px] font-semibold hover:bg-[#f6f3ee] transition-colors">
              My Requests
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#fcf9f4] min-h-screen py-8 lg:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <Link to="/shop" className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#80756f] hover:text-[#180f0a] mb-6 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Shop
        </Link>

        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ffdad3]/50 text-[#964735] text-[11px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Custom Request</span>
          </div>
          <h1 className="font-serif text-[34px] sm:text-[44px] text-[#180f0a] tracking-tight">Have Something Specific in Mind?</h1>
          <p className="text-[15px] text-[#4e4540] leading-relaxed">
            Describe the gift you're envisioning and our team will create a custom quote for you.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-[#e5e2dd] p-6 sm:p-8 shadow-sm space-y-6">
          {/* Description */}
          <div>
            <label htmlFor="cr-desc" className="block text-[11px] uppercase font-bold text-[#4e4540] mb-1.5">
              Describe Your Idea *
            </label>
            <textarea
              id="cr-desc"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us about the gift you'd like — what it should feel like, who it's for, any references or ideas…"
              className="w-full p-3 rounded-xl bg-[#f6f3ee] text-[13px] text-[#1c1c19] border border-[#e5e2dd] focus:outline-none focus:ring-1 focus:ring-[#180f0a] resize-none"
              required
            />
            <p className="text-[11px] text-[#80756f] mt-1">{description.length} characters</p>
          </div>

          {/* Occasion */}
          <div>
            <label className="block text-[11px] uppercase font-bold text-[#4e4540] mb-2">Occasion</label>
            <div className="flex flex-wrap gap-2">
              {OCCASIONS.map((occ) => (
                <button
                  key={occ}
                  type="button"
                  onClick={() => setOccasion(occ === occasion ? '' : occ)}
                  className={`px-3 py-1.5 rounded-full border text-[12px] font-semibold transition-all ${
                    occasion === occ
                      ? 'bg-[#180f0a] text-white border-[#180f0a]'
                      : 'bg-[#f6f3ee] text-[#4e4540] border-[#e5e2dd] hover:bg-white'
                  }`}
                >
                  {occ}
                </button>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div>
            <label className="block text-[11px] uppercase font-bold text-[#4e4540] mb-2">Budget Range</label>
            <div className="flex flex-wrap gap-2">
              {BUDGETS.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBudget(b === budget ? '' : b)}
                  className={`px-3 py-1.5 rounded-full border text-[12px] font-semibold transition-all ${
                    budget === b
                      ? 'bg-[#180f0a] text-white border-[#180f0a]'
                      : 'bg-[#f6f3ee] text-[#4e4540] border-[#e5e2dd] hover:bg-white'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div>
            <label htmlFor="cr-colors" className="block text-[11px] uppercase font-bold text-[#4e4540] mb-1.5">
              Preferred Colors
            </label>
            <input
              id="cr-colors"
              type="text"
              value={colors}
              onChange={(e) => setColors(e.target.value)}
              placeholder="e.g. Dusty rose, sage, cream"
              className="w-full px-4 py-2.5 rounded-xl bg-[#f6f3ee] text-[13px] text-[#1c1c19] border border-[#e5e2dd] focus:outline-none focus:ring-1 focus:ring-[#180f0a]"
            />
          </div>

          {/* Desired Date */}
          <div>
            <label htmlFor="cr-date" className="block text-[11px] uppercase font-bold text-[#4e4540] mb-1.5">
              Desired Date
            </label>
            <input
              id="cr-date"
              type="date"
              value={desiredDate}
              onChange={(e) => setDesiredDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#f6f3ee] text-[13px] text-[#1c1c19] border border-[#e5e2dd] focus:outline-none focus:ring-1 focus:ring-[#180f0a]"
            />
          </div>

          {/* Image Reference */}
          <div>
            <label htmlFor="cr-image" className="block text-[11px] uppercase font-bold text-[#4e4540] mb-1.5">
              Inspiration Image URL (optional)
            </label>
            <div className="flex items-center gap-2">
              <ImagePlus className="w-4 h-4 text-[#80756f] shrink-0" />
              <input
                id="cr-image"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#f6f3ee] text-[13px] text-[#1c1c19] border border-[#e5e2dd] focus:outline-none focus:ring-1 focus:ring-[#180f0a]"
              />
            </div>
          </div>

          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-[13px] text-red-700">{error}</div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting || description.trim().length < 10}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#964735] text-white text-[13px] font-semibold hover:bg-[#180f0a] transition-colors shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Clock className="w-4 h-4 animate-spin" />
                Submitting…
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Request a Custom Creation
              </>
            )}
          </button>

          <p className="text-center text-[12px] text-[#80756f]">
            We'll review your request and respond within 1–2 business days.
          </p>
        </form>
      </div>
    </div>
  );
}
