import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Sparkles, Leaf, Shield } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function OurStoryPage() {
  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const sectionsRef = useRef([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      // Hero entrance
      gsap.fromTo(heroRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' });

      // Section reveals
      sectionsRef.current.forEach((section, i) => {
        if (!section) return;
        gsap.fromTo(section, { opacity: 0, y: 50 }, {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 85%', once: true }
        });
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const addSectionRef = (el) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  return (
    <div ref={pageRef} className="w-full bg-[#fcf9f4] min-h-screen">
      {/* Hero */}
      <section ref={heroRef} className="relative py-20 lg:py-28 overflow-hidden">
        {/* Ambient glow orbs */}
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-[#964735]/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 right-1/4 w-56 h-56 bg-[#c17c74]/8 rounded-full blur-[100px]" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ffdad3]/50 text-[#964735] text-[11px] font-bold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5" />
            <span>Our Story</span>
          </div>
          <h1 className="font-serif text-[42px] sm:text-[56px] lg:text-[64px] text-[#180f0a] tracking-tight font-normal leading-[1.1]">
            Gifts Made by Hand,<br />Meant to Endure
          </h1>
          <p className="text-[16px] sm:text-[18px] text-[#4e4540] leading-relaxed max-w-2xl mx-auto">
            Flora Alchemy began with a simple conviction: the most meaningful gifts are the ones someone actually made — petal by petal, fold by fold, with care you can feel.
          </p>
        </div>
      </section>

      {/* Why Flora Alchemy */}
      <section ref={addSectionRef} className="py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-6">
              <h2 className="font-serif text-[32px] sm:text-[38px] text-[#180f0a] leading-tight">
                Why Flora Alchemy Exists
              </h2>
              <div className="space-y-4 text-[15px] text-[#4e4540] leading-relaxed">
                <p>
                  We noticed something strange about gifting: the more connected we became, the more generic our gifts felt. Pre-bundled bouquets. Mass-printed cards. Same-day delivery of the same things everyone else orders.
                </p>
                <p>
                  Flora Alchemy exists to offer an alternative — gifts that feel like they were made for one specific person, because they were. Every posy, every card, every keepsake is assembled by hand in our studio, using materials we'd be proud to gift ourselves.
                </p>
                <p className="font-medium text-[#180f0a]">
                  We don't do volume. We do intention.
                </p>
              </div>
            </div>
            <div className="relative group">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-[#f6f3ee] border border-[#e5e2dd] transition-shadow duration-500 group-hover:shadow-xl">
                <img
                  loading="lazy"
                  decoding="async" src="/assets/images/flora-asset-03.jpg" alt="Handcrafted botanical arrangement" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-lg border border-[#e5e2dd]">
                <p className="text-[12px] font-bold text-[#964735] uppercase tracking-wider">Since 2024</p>
                <p className="text-[13px] text-[#4e4540]">Handmade in India</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section ref={addSectionRef} className="py-16 lg:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <h2 className="font-serif text-[32px] sm:text-[38px] text-[#180f0a]">What Makes Our Gifts Different</h2>
            <p className="text-[15px] text-[#4e4540]">Every choice we make serves one goal: a gift that feels genuinely personal.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Leaf, title: 'Real Materials', desc: 'Pipe-cleaner petals, deckled mulberry bark, hand-thrown stoneware — nothing plastic, nothing mass-produced.' },
              { icon: Heart, title: 'Made by Hand', desc: 'Every arrangement is assembled by a single craftsperson. No assembly lines. No shortcuts.' },
              { icon: Sparkles, title: 'Genuinely Personal', desc: 'Palette, ribbon, card message, wax seal — your gift reflects the person receiving it.' },
              { icon: Shield, title: 'Built to Endure', desc: 'Our botanicals don\'t wilt. Our keepsakes don\'t discard. A Flora gift stays long after the occasion.' },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-2xl bg-[#f6f3ee] border border-[#e5e2dd] space-y-3 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="w-10 h-10 rounded-full bg-[#180f0a] flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-serif text-[18px] text-[#180f0a]">{item.title}</h3>
                <p className="text-[13px] text-[#4e4540] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The People */}
      <section ref={addSectionRef} className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="font-serif text-[32px] sm:text-[38px] text-[#180f0a]">The People Behind the Petals</h2>
          <p className="text-[15px] text-[#4e4540] leading-relaxed max-w-2xl mx-auto">
            Flora Alchemy is a small studio of makers who believe that the act of creating something by hand is itself a form of care. We work slowly, deliberately, and with materials we trust. Every gift that leaves our studio carries that intention with it.
          </p>
          <div className="flex items-center justify-center gap-3 pt-4">
            <Link
              to="/how-its-made"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#180f0a] text-white text-[13px] font-semibold hover:bg-[#964735] transition-colors shadow-md"
            >
              See How It's Made
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#e5e2dd] text-[#180f0a] text-[13px] font-semibold hover:bg-[#f6f3ee] transition-colors"
            >
              Explore the Creations
            </Link>
          </div>
        </div>
      </section>

      {/* Why Personalized Gifts Matter */}
      <section ref={addSectionRef} className="py-16 lg:py-24 bg-[#180f0a] relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#964735]/20 rounded-full blur-[100px]" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="font-serif text-[32px] sm:text-[38px] text-white leading-tight">Why Personalized Gifts Matter</h2>
          <p className="text-[15px] text-white/70 leading-relaxed max-w-xl mx-auto">
            A personalized gift says: I thought about you. I chose this for you. I made this for you. In a world of one-click purchases, that kind of attention is rare — and unmistakable.
          </p>
          <div className="flex items-center justify-center gap-3 pt-4">
            <Link
              to="/custom-gifts"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#964735] text-white text-[13px] font-semibold hover:bg-[#c17c74] transition-colors shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              Build a Custom Gift
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
