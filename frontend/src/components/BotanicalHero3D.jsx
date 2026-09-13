import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const FLOWERS = [
  { x: 15, y: 20, size: 90, rotation: -12, depth: 0.3, src: '/assets/images/flora-asset-03.jpg', alt: 'Handcrafted botanical arrangement' },
  { x: 55, y: 35, size: 120, rotation: 8, depth: 0.6, src: '/assets/images/flora-asset-16.jpg', alt: 'Pressed botanical component' },
  { x: 78, y: 15, size: 80, rotation: -5, depth: 0.2, src: '/assets/images/flora-asset-06.jpg', alt: 'Wax sealed card' },
  { x: 35, y: 60, size: 100, rotation: 15, depth: 0.5, src: '/assets/images/flora-asset-09.jpg', alt: 'Ceramic vessel' },
  { x: 70, y: 55, size: 70, rotation: -8, depth: 0.4, src: '/assets/images/flora-asset-21.jpg', alt: 'Wrapped gift' },
];

export default function BotanicalHero3D() {
  const containerRef = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const rafRef = useRef(null);
  const targetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || !isVisible) return;

    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      targetRef.current = {
        x: (e.clientX - cx) / rect.width * 2,
        y: (e.clientY - cy) / rect.height * 2,
      };
    };

    const animate = () => {
      setOffset((prev) => ({
        x: prev.x + (targetRef.current.x - prev.x) * 0.08,
        y: prev.y + (targetRef.current.y - prev.y) * 0.08,
      }));
      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [prefersReducedMotion, isVisible]);

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden bg-gradient-to-b from-[#f6f3ee] to-[#fcf9f4]"
      style={{ minHeight: '480px' }}
    >
      {/* Background texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, #2e241e 1px, transparent 0)',
        backgroundSize: '24px 24px',
      }} />

      {/* Floating botanical elements */}
      {FLOWERS.map((flower, i) => {
        const tx = prefersReducedMotion ? 0 : offset.x * flower.depth * 30;
        const ty = prefersReducedMotion ? 0 : offset.y * flower.depth * 30;
        return (
          <div
            key={i}
            className="absolute rounded-2xl overflow-hidden shadow-lg border border-white/30 transition-transform duration-100"
            style={{
              left: `${flower.x}%`,
              top: `${flower.y}%`,
              width: `${flower.size}px`,
              height: `${flower.size}px`,
              transform: `translate(${tx}px, ${ty}px) rotate(${flower.rotation}deg)`,
              opacity: isVisible ? 0.85 : 0,
              transition: prefersReducedMotion ? 'opacity 0.6s ease' : 'transform 80ms linear, opacity 0.6s ease',
            }}
          >
            <img
              src={flower.src}
              alt={flower.alt}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        );
      })}

      {/* Central content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-24 lg:py-32 min-h-[480px]">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/60 backdrop-blur-sm text-[#964735] text-[11px] font-bold uppercase tracking-wider mb-5 border border-white/40">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Handcrafted with intention</span>
        </div>

        <h1 className="font-serif text-[42px] sm:text-[56px] lg:text-[68px] text-[#180f0a] tracking-tight font-normal leading-[1.05] max-w-3xl">
          Gifts That Feel<br />Like They Were Made for One Person
        </h1>

        <p className="text-[15px] sm:text-[17px] text-[#4e4540] leading-relaxed max-w-xl mt-5 mb-8">
          Botanical keepsakes, handcrafted cards, and bespoke arrangements — each one assembled by hand in our studio.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#180f0a] text-white text-[13px] font-semibold hover:bg-[#964735] transition-colors shadow-lg"
          >
            Shop Gifts
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/gift-finder"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/70 backdrop-blur-sm border border-[#e5e2dd] text-[#180f0a] text-[13px] font-semibold hover:bg-white transition-colors"
          >
            Find a Gift
          </Link>
          <Link
            to="/custom-gifts"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-[#e5e2dd] text-[#4e4540] text-[13px] font-semibold hover:bg-white/50 transition-colors"
          >
            Create a Custom Gift
          </Link>
        </div>
      </div>
    </section>
  );
}
