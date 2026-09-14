import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  Check,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Gift,
  Flower2,
  Palette,
  Ribbon,
  MessageSquareHeart,
  PackageCheck,
  RotateCcw,
  Star
} from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';

const STEPS = [
  { id: 'occasion', title: 'Choose Occasion', icon: Gift },
  { id: 'base', title: 'Choose Your Base', icon: PackageCheck },
  { id: 'flowers', title: 'Choose Your Flowers', icon: Flower2 },
  { id: 'colors', title: 'Choose Your Colors', icon: Palette },
  { id: 'wrapping', title: 'Choose Wrapping', icon: Ribbon },
  { id: 'message', title: 'Add a Personal Message', icon: MessageSquareHeart },
  { id: 'review', title: 'Review & Add to Bag', icon: ShoppingBag }
];

const OCCASIONS = [
  { id: 'birthday', name: 'Birthday', emoji: '🎂' },
  { id: 'anniversary', name: 'Anniversary', emoji: '💍' },
  { id: 'wedding', name: 'Wedding', emoji: '💐' },
  { id: 'thanks', name: 'Thank You', emoji: '🤍' },
  { id: 'sympathy', name: 'Sympathy', emoji: '🕊️' },
  { id: 'festival', name: 'Festival', emoji: '🪔' },
  { id: 'just-because', name: 'Just Because', emoji: '🌼' }
];

const BASES = [
  {
    id: 'keepsake-posy',
    title: 'Handcrafted Everlasting Posy',
    price: 1850,
    image: '/assets/images/flora-asset-03.jpg',
    desc: 'Hand-wrapped in deckled mulberry bark washi and raw silk.'
  },
  {
    id: 'heirloom-box',
    title: 'Solid Pine Sliding Hamper Box',
    price: 3450,
    image: '/assets/images/flora-asset-11.jpg',
    desc: 'Finished pine keepsake casket with brass shears & card.'
  },
  {
    id: 'ceramic-pot',
    title: 'Artisan Speckled Ceramic Vessel',
    price: 1250,
    image: '/assets/images/flora-asset-09.jpg',
    desc: 'Hand-thrown stoneware pottery with moss bedding.'
  }
];

const FLOWER_STEMS = [
  { id: 'rose', name: 'Velvet Dusty Rose', cost: 0 },
  { id: 'lavender', name: 'French Lavender Sprigs', cost: 0 },
  { id: 'chamomile', name: 'Sunny Chamomile Buds', cost: 0 },
  { id: 'peony', name: 'Blush Peony Bloom (+₹300)', cost: 300 },
  { id: 'eucalyptus', name: 'Sage Eucalyptus Leaves', cost: 0 }
];

const COLOR_PALETTES = [
  { id: 'mauve', name: 'Dusty Rose & Lavender', c1: '#c98e87', c2: '#9a7b9b' },
  { id: 'sage', name: 'Sage Leaf & Forest Olive', c1: '#82927c', c2: '#495b42' },
  { id: 'terracotta', name: 'Terracotta & Burnished Ochre', c1: '#ba6d5b', c2: '#dfb39d' },
  { id: 'cream', name: 'Parchment Cream & Gold Leaf', c1: '#e8dec8', c2: '#cca856' }
];

const RIBBONS = [
  { id: 'frayed-silk', name: 'Frayed Edge Plant-Dyed Silk', desc: 'Unhemmed organic drape' },
  { id: 'velvet-cord', name: 'French Olive Velvet Cord', desc: 'Plush texture' },
  { id: 'deckled-twine', name: 'Natural Cotton Jute Twine', desc: 'Minimalist rustic knot' }
];

const WAX_SEALS = [
  { id: 'terracotta', name: 'Terracotta Clay', hex: '#964735' },
  { id: 'sage', name: 'Dried Sage', hex: '#5B6D54' },
  { id: 'gold', name: 'Burnished Antique Gold', hex: '#B89746' }
];

export default function CustomGiftsPage() {
  const navigate = useNavigate();
  const { addItemToCart } = useStore();

  const [step, setStep] = useState(0);
  const [selectedOccasion, setSelectedOccasion] = useState(OCCASIONS[0]);
  const [selectedBase, setSelectedBase] = useState(BASES[0]);
  const [selectedFlowers, setSelectedFlowers] = useState(['rose', 'lavender', 'eucalyptus']);
  const [selectedPalette, setSelectedPalette] = useState(COLOR_PALETTES[0]);
  const [selectedRibbon, setSelectedRibbon] = useState(RIBBONS[0]);
  const [selectedSeal, setSelectedSeal] = useState(WAX_SEALS[0]);
  const [recipientName, setRecipientName] = useState('');
  const [cardMessage, setCardMessage] = useState('');

  const toggleFlower = (id) => {
    if (selectedFlowers.includes(id)) {
      if (selectedFlowers.length > 1) {
        setSelectedFlowers(selectedFlowers.filter((f) => f !== id));
      }
    } else {
      setSelectedFlowers([...selectedFlowers, id]);
    }
  };

  const flowerExtraCost = selectedFlowers.reduce((acc, fId) => {
    const item = FLOWER_STEMS.find((f) => f.id === fId);
    return acc + (item ? item.cost : 0);
  }, 0);

  const totalPrice = selectedBase.price + flowerExtraCost;

  const goNext = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    if (step > 0) setStep(step - 1);
    else navigate('/collections');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const jumpTo = (idx) => {
    if (idx < STEPS.length - 1) setStep(idx);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = () => {
    // Send configuration IDs to the server; the server calculates the authoritative price.
    const customGiftConfig = {
      baseId: selectedBase.id,
      flowerIds: selectedFlowers,
      paletteId: selectedPalette.id,
      ribbonId: selectedRibbon.id,
      sealId: selectedSeal.id,
    };

    const customItem = {
      id: `custom-${Date.now()}`,
      name: `Custom ${selectedOccasion.name} Gift — ${selectedBase.title}`,
      // Frontend estimate for UX — server ignores this and recalculates
      price: totalPrice,
      images: [selectedBase.image],
      categoryLabel: 'Custom Gift Studio',
      category: 'custom'
    };

    addItemToCart(customItem, {
      customPrice: totalPrice,
      occasion: selectedOccasion.name,
      palette: selectedPalette.name,
      ribbon: selectedRibbon.name,
      giftMessage: `For: ${recipientName || 'Someone special'} — "${cardMessage || 'Thinking of you.'}" (Seal: ${selectedSeal.name})`,
      customDetails: {
        base: selectedBase.title,
        flowers: selectedFlowers.join(', '),
        seal: selectedSeal.name
      },
      customGiftConfig,
    });

    navigate('/cart');
  };

  const stepValid = () => {
    if (step === 2) return selectedFlowers.length > 0;
    return true;
  };

  return (
    <div className="w-full bg-[#fcf9f4] min-h-screen py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ffdad3]/50 text-[#964735] text-[11px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Custom Gift Studio</span>
          </div>
          <h1 className="font-serif text-[34px] sm:text-[44px] text-[#180f0a] tracking-tight font-normal">
            Build a Gift, Your Way
          </h1>
          <p className="text-[15px] text-[#4e4540]">
            Choose an occasion, pick your flowers, colors and wrapping — then add a personal message.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="max-w-3xl mx-auto mb-8 flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => i < step && jumpTo(i)}
              className={`flex items-center gap-1.5 shrink-0 px-2.5 py-1.5 rounded-full border text-[11px] font-semibold transition-all ${
                i === step
                  ? 'bg-[#180f0a] text-white border-[#180f0a]'
                  : i < step
                    ? 'bg-white text-[#5b6d54] border-[#cfe0c7] cursor-pointer hover:border-[#5b6d54]'
                    : 'bg-[#f6f3ee] text-[#a89c95] border-[#e5e2dd] cursor-default'
              }`}
              aria-current={i === step ? 'step' : undefined}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${i <= step ? 'bg-white/20' : 'bg-white/60'}`}>
                {i < step ? <Check className="w-2.5 h-2.5" /> : i + 1}
              </span>
              <span className="hidden sm:inline">{s.title}</span>
              <span className="sm:hidden">{s.icon && <s.icon className="w-3 h-3" />}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Active Step Panel */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-[#e5e2dd] p-5 sm:p-8 shadow-sm animate-fade-in">
              {/* STEP 0: Occasion */}
              {step === 0 && (
                <div className="space-y-5">
                  <StepHeading n={1} title="Who is it for — and what's the occasion?" />
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {OCCASIONS.map((occ) => (
                      <button
                        key={occ.id}
                        type="button"
                        onClick={() => setSelectedOccasion(occ)}
                        className={`p-4 rounded-2xl border text-center transition-all ${
                          selectedOccasion.id === occ.id
                            ? 'bg-[#faf4ee] border-[#180f0a] ring-1 ring-[#180f0a]'
                            : 'bg-[#f6f3ee] border-[#e5e2dd] hover:bg-white'
                        }`}
                      >
                        <span className="text-[22px] block mb-1.5">{occ.emoji}</span>
                        <span className="text-[13px] font-semibold text-[#180f0a]">{occ.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 1: Base */}
              {step === 1 && (
                <div className="space-y-5">
                  <StepHeading n={2} title="Choose your base" subtitle="The keepsake that holds your flowers." />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {BASES.map((base) => (
                      <div
                        key={base.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => setSelectedBase(base)}
                        onKeyDown={(e) => e.key === 'Enter' && setSelectedBase(base)}
                        className={`cursor-pointer rounded-2xl p-3 border transition-all flex flex-col justify-between ${
                          selectedBase.id === base.id
                            ? 'bg-white border-[#180f0a] shadow-sm ring-1 ring-[#180f0a]'
                            : 'bg-[#f6f3ee] border-[#e5e2dd] hover:bg-white'
                        }`}
                      >
                        <div className="aspect-square w-full rounded-xl overflow-hidden mb-2 bg-white">
                          <img
                            loading="lazy"
                            decoding="async" src={base.image} alt={base.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-serif text-[15px] font-medium text-[#180f0a] leading-tight">
                            {base.title}
                          </p>
                          <p className="text-[11px] text-[#80756f] leading-snug">{base.desc}</p>
                          <p className="text-[14px] font-bold text-[#964735]">
                            ₹{base.price.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: Flowers */}
              {step === 2 && (
                <div className="space-y-5">
                  <StepHeading n={3} title="Choose your flowers" subtitle="Pick at least one — mix and match freely." />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {FLOWER_STEMS.map((stem) => {
                      const isChecked = selectedFlowers.includes(stem.id);
                      return (
                        <button
                          key={stem.id}
                          type="button"
                          onClick={() => toggleFlower(stem.id)}
                          className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                            isChecked
                              ? 'bg-white border-[#180f0a] shadow-xs'
                              : 'bg-[#f6f3ee] border-[#e5e2dd] hover:bg-white'
                          }`}
                        >
                          <span className="text-[13px] font-medium text-[#1c1c19]">{stem.name}</span>
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                              isChecked ? 'bg-[#964735] text-white' : 'border border-[#d1c4bd]'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3" />}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 3: Colors */}
              {step === 3 && (
                <div className="space-y-5">
                  <StepHeading n={4} title="Choose your colors" subtitle="A harmonizing palette for the whole gift." />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {COLOR_PALETTES.map((pal) => (
                      <button
                        key={pal.id}
                        type="button"
                        onClick={() => setSelectedPalette(pal)}
                        className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                          selectedPalette.id === pal.id
                            ? 'bg-white border-[#180f0a] shadow-xs'
                            : 'bg-[#f6f3ee] border-[#e5e2dd] hover:bg-white'
                        }`}
                      >
                        <div className="flex -space-x-1.5 shrink-0">
                          <span style={{ backgroundColor: pal.c1 }} className="w-5 h-5 rounded-full border border-white" />
                          <span style={{ backgroundColor: pal.c2 }} className="w-5 h-5 rounded-full border border-white" />
                        </div>
                        <span className="text-[13px] font-medium text-[#1c1c19]">{pal.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4: Wrapping */}
              {step === 4 && (
                <div className="space-y-5">
                  <StepHeading n={5} title="Choose your wrapping" subtitle="Ribbon, tie and wax seal finish." />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {RIBBONS.map((rib) => (
                      <button
                        key={rib.id}
                        type="button"
                        onClick={() => setSelectedRibbon(rib)}
                        className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                          selectedRibbon.id === rib.id
                            ? 'bg-white border-[#180f0a] shadow-xs'
                            : 'bg-[#f6f3ee] border-[#e5e2dd] hover:bg-white'
                        }`}
                      >
                        <span className="text-[13px] font-semibold text-[#180f0a]">{rib.name}</span>
                        <span className="text-[11px] text-[#80756f] mt-1">{rib.desc}</span>
                      </button>
                    ))}
                  </div>
                  <div className="pt-2">
                    <span className="block text-[11px] uppercase font-bold text-[#4e4540] mb-2">Wax Seal</span>
                    <div className="flex items-center gap-2 flex-wrap">
                      {WAX_SEALS.map((ws) => (
                        <button
                          key={ws.id}
                          type="button"
                          onClick={() => setSelectedSeal(ws)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-semibold transition-all ${
                            selectedSeal.id === ws.id
                              ? 'bg-[#180f0a] text-white border-[#180f0a]'
                              : 'bg-[#f6f3ee] text-[#4e4540] border-[#e5e2dd]'
                          }`}
                        >
                          <span style={{ backgroundColor: ws.hex }} className="w-2.5 h-2.5 rounded-full inline-block" />
                          <span>{ws.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: Message */}
              {step === 5 && (
                <div className="space-y-5">
                  <StepHeading n={6} title="Add a personal message" subtitle="Handwritten on a botanical card inside your gift." />
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="recipient-name" className="block text-[11px] uppercase font-bold text-[#4e4540] mb-1.5">
                        Recipient Name
                      </label>
                      <input
                        id="recipient-name"
                        type="text"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        placeholder="Who is this gift for?"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#f6f3ee] text-[14px] text-[#1c1c19] border border-[#e5e2dd] focus:outline-none focus:ring-1 focus:ring-[#180f0a]"
                      />
                    </div>
                    <div>
                      <label htmlFor="card-message" className="block text-[11px] uppercase font-bold text-[#4e4540] mb-1.5">
                        Card Message
                      </label>
                      <textarea
                        id="card-message"
                        rows={4}
                        value={cardMessage}
                        onChange={(e) => setCardMessage(e.target.value)}
                        placeholder="Write something kind…"
                        className="w-full p-3 rounded-xl bg-[#f6f3ee] text-[13px] text-[#1c1c19] border border-[#e5e2dd] focus:outline-none focus:ring-1 focus:ring-[#180f0a] resize-none"
                      />
                    </div>
                    <div
                      style={{ backgroundColor: selectedSeal.hex }}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-white text-[11px] font-medium"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
                      Sealed with {selectedSeal.name}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 6: Review */}
              {step === 6 && (
                <div className="space-y-5">
                  <StepHeading n={7} title="Review your gift" subtitle="Everything below is exactly what will be crafted." />
                  <div className="space-y-3">
                    <ReviewRow label="Occasion" value={`${selectedOccasion.emoji} ${selectedOccasion.name}`} onEdit={() => jumpTo(0)} />
                    <ReviewRow label="Base" value={selectedBase.title} onEdit={() => jumpTo(1)} />
                    <ReviewRow label="Flowers" value={selectedFlowers.map((f) => FLOWER_STEMS.find((s) => s.id === f)?.name).join(', ')} onEdit={() => jumpTo(2)} />
                    <ReviewRow label="Colors" value={selectedPalette.name} onEdit={() => jumpTo(3)} />
                    <ReviewRow label="Wrapping" value={`${selectedRibbon.name} · ${selectedSeal.name} seal`} onEdit={() => jumpTo(4)} />
                    <ReviewRow
                      label="Message"
                      value={recipientName ? `For ${recipientName} — "${cardMessage || 'Thinking of you.'}"` : `"${cardMessage || 'Thinking of you.'}"`}
                      onEdit={() => jumpTo(5)}
                    />
                  </div>
                  {/* Trust badges */}
                  <div className="flex flex-wrap gap-2 pt-3">
                    {['Handcrafted', 'Personalized', 'Gift-ready'].map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#d8e7cd]/50 text-[10px] font-bold text-[#5b6d54] uppercase tracking-wider">
                        <Star className="w-2.5 h-2.5" /> {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Nav Buttons */}
              <div className="flex items-center justify-between gap-3 pt-6 mt-6 border-t border-[#e5e2dd]">
                <button
                  type="button"
                  onClick={goBack}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-[#e5e2dd] text-[#4e4540] text-[13px] font-semibold hover:bg-[#f6f3ee] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {step === 0 ? 'Back to Collections' : 'Back'}
                </button>

                {step < STEPS.length - 1 ? (
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={!stepValid()}
                    className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#180f0a] text-white text-[13px] font-semibold hover:bg-[#964735] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#964735] text-white text-[13px] font-semibold hover:bg-[#180f0a] transition-colors shadow-md"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Add to Bag · ₹{totalPrice.toLocaleString('en-IN')}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sticky Live Summary */}
          <div className="lg:col-span-5 sticky top-24 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-[#e5e2dd] shadow-lg space-y-5">
              <div className="flex items-center justify-between border-b border-[#e5e2dd] pb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#964735]">
                    Your Gift
                  </span>
                  <h3 className="font-serif text-[22px] text-[#180f0a]">
                    {selectedOccasion.name} Keepsake
                  </h3>
                </div>
                <span className="text-[24px] font-bold text-[#180f0a]">
                  ₹{totalPrice.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Live Preview Visual */}
              <div className="relative rounded-2xl bg-gradient-to-br from-[#faf7f2] to-[#f0ede9] border border-[#e5e2dd] overflow-hidden aspect-[4/3]">
                <img
                  loading="lazy"
                  decoding="async" src={selectedBase.image} alt={selectedBase.title} className="w-full h-full object-cover opacity-90" />
                {/* Palette overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1">
                      <span style={{ backgroundColor: selectedPalette.c1 }} className="w-4 h-4 rounded-full border-2 border-white" />
                      <span style={{ backgroundColor: selectedPalette.c2 }} className="w-4 h-4 rounded-full border-2 border-white" />
                    </div>
                    <span className="text-white text-[10px] font-medium drop-shadow">{selectedPalette.name}</span>
                  </div>
                </div>
                {/* Seal stamp */}
                <div
                  style={{ backgroundColor: selectedSeal.hex }}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full text-white text-[10px] font-serif flex items-center justify-center font-bold shadow-lg"
                >
                  FA
                </div>
                {/* Flowers count badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-white/90 backdrop-blur-sm">
                  <Flower2 className="w-3 h-3 text-[#964735]" />
                  <span className="text-[10px] font-bold text-[#180f0a]">{selectedFlowers.length} stems</span>
                </div>
              </div>

              <div className="space-y-2.5 text-[13px] text-[#4e4540]">
                <SummaryRow label="Occasion" value={selectedOccasion.name} onEdit={() => jumpTo(0)} />
                <SummaryRow label="Base" value={selectedBase.title} onEdit={() => jumpTo(1)} />
                <SummaryRow label="Flowers" value={`${selectedFlowers.length} selected`} onEdit={() => jumpTo(2)} />
                <SummaryRow label="Colors" value={selectedPalette.name} onEdit={() => jumpTo(3)} />
                <SummaryRow label="Wrapping" value={`${selectedRibbon.name} · ${selectedSeal.name}`} onEdit={() => jumpTo(4)} />
              </div>

              {step < STEPS.length - 1 && (
                <button
                  type="button"
                  onClick={() => jumpTo(STEPS.length - 1)}
                  className="w-full py-3 rounded-full bg-[#180f0a] hover:bg-[#964735] text-white text-[13px] font-semibold flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <PackageCheck className="w-4 h-4" />
                  Review Gift · ₹{totalPrice.toLocaleString('en-IN')}
                </button>
              )}

              {/* Quick restart */}
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => { setStep(0); setSelectedOccasion(OCCASIONS[0]); setSelectedBase(BASES[0]); setSelectedFlowers(['rose', 'lavender', 'eucalyptus']); setSelectedPalette(COLOR_PALETTES[0]); setSelectedRibbon(RIBBONS[0]); setSelectedSeal(WAX_SEALS[0]); setRecipientName(''); setCardMessage(''); }}
                  className="w-full py-2.5 rounded-full border border-[#e5e2dd] text-[#80756f] text-[12px] font-semibold hover:bg-[#f6f3ee] transition-colors flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Start Over
                </button>
              )}

              <div className="flex items-center justify-center gap-2 text-[12px] text-[#80756f]">
                <ShieldCheck className="w-4 h-4 text-[#5b6d54]" />
                <span>Crafted in 2–3 business days · Pan-India delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepHeading({ n, title, subtitle }) {
  return (
    <div className="flex items-start gap-3">
      <span className="w-8 h-8 rounded-full bg-[#180f0a] text-white flex items-center justify-center font-serif text-[15px] shrink-0 mt-0.5">
        {n}
      </span>
      <div>
        <h2 className="font-serif text-[24px] text-[#180f0a] leading-tight">{title}</h2>
        {subtitle && <p className="text-[13px] text-[#80756f] mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

function ReviewRow({ label, value, onEdit }) {
  return (
    <div className="flex items-center justify-between gap-3 bg-[#f6f3ee] rounded-xl px-4 py-3">
      <div className="min-w-0">
        <p className="text-[10px] uppercase font-bold text-[#80756f]">{label}</p>
        <p className="text-[13px] font-medium text-[#180f0a] truncate">{value}</p>
      </div>
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="shrink-0 text-[11px] font-semibold text-[#964735] hover:underline"
        >
          Change
        </button>
      )}
    </div>
  );
}

function SummaryRow({ label, value, onEdit }) {
  return (
    <div className="flex justify-between items-center gap-2">
      <div className="min-w-0">
        <span className="text-[#80756f] text-[11px] block">{label}</span>
        <span className="font-semibold text-[#180f0a] text-[12px] block truncate">{value}</span>
      </div>
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="shrink-0 text-[10px] font-bold uppercase tracking-wide text-[#964735] hover:underline"
        >
          Change
        </button>
      )}
    </div>
  );
}
