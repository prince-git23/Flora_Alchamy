import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    number: '01',
    title: 'Materials',
    desc: 'We source pipe-cleaner stems, deckled mulberry bark, raw silk, and hand-thrown stoneware from trusted artisan suppliers.',
    image: '/assets/images/flora-asset-09.jpg',
  },
  {
    number: '02',
    title: 'Petal & Component',
    desc: 'Each petal is individually shaped, twisted, and colored by hand. No two are identical — and that\'s the point.',
    image: '/assets/images/flora-asset-16.jpg',
  },
  {
    number: '03',
    title: 'Assembly',
    desc: 'A single craftsperson builds each arrangement from start to finish, ensuring coherence and care in every detail.',
    image: '/assets/images/flora-asset-26.jpg',
  },
  {
    number: '04',
    title: 'Arrangement',
    desc: 'Stems are composed into a balanced posy, bouquet, or vessel arrangement — adjusted until it feels right.',
    image: '/assets/images/flora-asset-03.jpg',
  },
  {
    number: '05',
    title: 'Finishing',
    desc: 'Wax seals, ribbon ties, and botanical card messages are added by hand — the final personal touch.',
    image: '/assets/images/flora-asset-06.jpg',
  },
  {
    number: '06',
    title: 'Wrapping',
    desc: 'Wrapped in deckled bark, tissue, or keepsake packaging — presented as a gift from the moment it arrives.',
    image: '/assets/images/flora-asset-11.jpg',
  },
  {
    number: '07',
    title: 'Your Gift',
    desc: 'Packed securely and dispatched with tracking. Your handcrafted creation arrives ready to give.',
    image: '/assets/images/flora-asset-21.jpg',
  },
];

export default function HowItsMadePage() {
  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const stepsRef = useRef([]);
  const ctaRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      // Hero entrance
      gsap.fromTo(heroRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' });

      // Step reveals with stagger
      stepsRef.current.forEach((step, i) => {
        if (!step) return;
        const isEven = i % 2 === 1;
        gsap.fromTo(step, { opacity: 0, x: isEven ? 50 : -50 }, {
          opacity: 1, x: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: step, start: 'top 85%', once: true }
        });
      });

      // CTA reveal
      if (ctaRef.current) {
        gsap.fromTo(ctaRef.current, { opacity: 0, y: 30 }, {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: ctaRef.current, start: 'top 85%', once: true }
        });
      }
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const addStepRef = (el) => {
    if (el && !stepsRef.current.includes(el)) {
      stepsRef.current.push(el);
    }
  };

  return (
    <div ref={pageRef} className="w-full bg-[#fcf9f4] min-h-screen">
      {/* Hero */}
      <section ref={heroRef} className="relative py-20 lg:py-28 overflow-hidden">
        {/* Ambient glow orbs */}
        <div className="absolute top-10 left-1/3 w-64 h-64 bg-[#964735]/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 right-1/3 w-48 h-48 bg-[#c17c74]/8 rounded-full blur-[100px]" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ebe8e3] text-[#4e4540] text-[11px] font-bold uppercase tracking-wider">
            <span>Process</span>
          </div>
          <h1 className="font-serif text-[42px] sm:text-[56px] text-[#180f0a] tracking-tight font-normal leading-[1.1]">
            How It's Made
          </h1>
          <p className="text-[16px] text-[#4e4540] leading-relaxed max-w-xl mx-auto">
            From raw material to finished gift — every Flora Alchemy creation passes through seven deliberate stages of handcraft.
          </p>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-12 lg:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16 lg:space-y-24">
            {STEPS.map((step, idx) => (
              <div
                key={step.number}
                ref={addStepRef}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
                  idx % 2 === 1 ? 'lg:direction-rtl' : ''
                }`}
              >
                <div className={`${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-[#f6f3ee] border border-[#e5e2dd] group">
                    <img
                      loading="lazy"
                      decoding="async" src={step.image} alt={step.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                </div>
                <div className={`space-y-4 ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-[48px] font-bold text-[#e5e2dd] leading-none">{step.number}</span>
                    <div className="h-px flex-1 bg-[#e5e2dd]" />
                  </div>
                  <h2 className="font-serif text-[28px] sm:text-[32px] text-[#180f0a]">{step.title}</h2>
                  <p className="text-[15px] text-[#4e4540] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section ref={ctaRef} className="py-16 lg:py-24 bg-white relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 right-1/4 w-56 h-56 bg-[#964735]/8 rounded-full blur-[100px]" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="font-serif text-[32px] sm:text-[38px] text-[#180f0a]">Ready to Create Something?</h2>
          <p className="text-[15px] text-[#4e4540]">
            Now that you understand the craft, explore our collection or build a custom gift yourself.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/custom-gifts"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#180f0a] text-white text-[13px] font-semibold hover:bg-[#964735] transition-colors shadow-md"
            >
              Build a Custom Gift
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-[#e5e2dd] text-[#180f0a] text-[13px] font-semibold hover:bg-[#f6f3ee] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Browse All Gifts
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
