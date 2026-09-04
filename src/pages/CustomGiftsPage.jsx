import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Check, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';

export default function CustomGiftsPage() {
  const navigate = useNavigate();
  const { addItemToCart } = useStore();

  const bases = [
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

  const flowerStems = [
    { id: 'rose', name: 'Velvet Dusty Rose', cost: 0 },
    { id: 'lavender', name: 'French Lavender Sprigs', cost: 0 },
    { id: 'chamomile', name: 'Sunny Chamomile Buds', cost: 0 },
    { id: 'peony', name: 'Blush Peony Bloom (+₹300)', cost: 300 },
    { id: 'eucalyptus', name: 'Sage Eucalyptus Leaves', cost: 0 }
  ];

  const colorPalettes = [
    { id: 'mauve', name: 'Dusty Rose & Lavender', c1: '#c98e87', c2: '#9a7b9b' },
    { id: 'sage', name: 'Sage Leaf & Forest Olive', c1: '#82927c', c2: '#495b42' },
    { id: 'terracotta', name: 'Terracotta & Burnished Ochre', c1: '#ba6d5b', c2: '#dfb39d' },
    { id: 'cream', name: 'Parchment Cream & Gold Leaf', c1: '#e8dec8', c2: '#cca856' }
  ];

  const ribbons = [
    { id: 'frayed-silk', name: 'Frayed Edge Plant-Dyed Silk', desc: 'Unhemmed organic drape' },
    { id: 'velvet-cord', name: 'French Olive Velvet Cord', desc: 'Plush texture' },
    { id: 'deckled-twine', name: 'Natural Cotton Jute Twine', desc: 'Minimalist rustic knot' }
  ];

  const waxSeals = [
    { id: 'terracotta', name: 'Terracotta Clay', hex: '#964735' },
    { id: 'sage', name: 'Dried Sage', hex: '#5B6D54' },
    { id: 'gold', name: 'Burnished Antique Gold', hex: '#B89746' }
  ];

  const [selectedBase, setSelectedBase] = useState(bases[0]);
  const [selectedFlowers, setSelectedFlowers] = useState(['rose', 'lavender', 'eucalyptus']);
  const [selectedPalette, setSelectedPalette] = useState(colorPalettes[0]);
  const [selectedRibbon, setSelectedRibbon] = useState(ribbons[0]);
  const [selectedSeal, setSelectedSeal] = useState(waxSeals[0]);
  const [recipientName, setRecipientName] = useState('Demo Customer');
  const [cardMessage, setCardMessage] = useState(
    'May these flowers never fade, just like our quiet and lasting friendship.'
  );

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
    const item = flowerStems.find((f) => f.id === fId);
    return acc + (item ? item.cost : 0);
  }, 0);

  const totalPrice = selectedBase.price + flowerExtraCost;

  const handleCreateAndAddToCart = () => {
    const customItem = {
      id: `custom-${Date.now()}`,
      name: `Bespoke Creation (${selectedBase.title})`,
      price: totalPrice,
      images: [selectedBase.image],
      categoryLabel: 'Custom Gift Studio',
      category: 'custom'
    };

    addItemToCart(customItem, {
      customPrice: totalPrice,
      palette: selectedPalette.name,
      ribbon: selectedRibbon.name,
      giftMessage: `For: ${recipientName} — "${cardMessage}" (Seal: ${selectedSeal.name})`,
      customDetails: {
        base: selectedBase.title,
        flowers: selectedFlowers.join(', '),
        seal: selectedSeal.name
      }
    });

    navigate('/cart');
  };

  return (
    <div className="w-full bg-[#fcf9f4] min-h-screen py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ffdad3]/50 text-[#964735] text-[11px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Custom Gift Studio</span>
          </div>
          <h1 className="font-serif text-[38px] sm:text-[48px] text-[#180f0a] tracking-tight font-normal">
            Bespoke Botanical Keepsakes
          </h1>
          <p className="text-[15px] text-[#4e4540]">
            Customize every floral detail, palette, wrapping, and personalized calligraphy note.
          </p>
        </div>

        {/* 2-Column Atelier Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Configurator Steps (7 Cols) */}
          <div className="lg:col-span-7 space-y-10">
            {/* Step 1: Base */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-[#180f0a] text-white flex items-center justify-center font-serif text-[14px]">
                  1
                </span>
                <h2 className="font-serif text-[22px] text-[#180f0a]">Choose Your Vessel or Base</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {bases.map((base) => (
                  <div
                    key={base.id}
                    onClick={() => setSelectedBase(base)}
                    className={`cursor-pointer rounded-2xl p-3 border transition-all flex flex-col justify-between ${
                      selectedBase.id === base.id
                        ? 'bg-white border-[#180f0a] shadow-sm ring-1 ring-[#180f0a]'
                        : 'bg-[#f6f3ee] border-[#e5e2dd] hover:bg-white'
                    }`}
                  >
                    <div className="aspect-square w-full rounded-xl overflow-hidden mb-2 bg-white">
                      <img src={base.image} alt={base.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-serif text-[15px] font-medium text-[#180f0a] leading-tight">
                        {base.title}
                      </p>
                      <p className="text-[14px] font-bold text-[#964735]">
                        ₹{base.price.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2: Flower Stems */}
            <div className="space-y-4 pt-4 border-t border-[#e5e2dd]">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-[#180f0a] text-white flex items-center justify-center font-serif text-[14px]">
                  2
                </span>
                <h2 className="font-serif text-[22px] text-[#180f0a]">Select Botanical Stems</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {flowerStems.map((stem) => {
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

            {/* Step 3: Color Palette */}
            <div className="space-y-4 pt-4 border-t border-[#e5e2dd]">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-[#180f0a] text-white flex items-center justify-center font-serif text-[14px]">
                  3
                </span>
                <h2 className="font-serif text-[22px] text-[#180f0a]">Harmonizing Palette</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {colorPalettes.map((pal) => (
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

            {/* Step 4: Ribbon */}
            <div className="space-y-4 pt-4 border-t border-[#e5e2dd]">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-[#180f0a] text-white flex items-center justify-center font-serif text-[14px]">
                  4
                </span>
                <h2 className="font-serif text-[22px] text-[#180f0a]">Ribbon & Stem Tie</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {ribbons.map((rib) => (
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
            </div>

            {/* Step 5: Personalized Letter & Wax Seal */}
            <div className="space-y-4 pt-4 border-t border-[#e5e2dd]">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-[#180f0a] text-white flex items-center justify-center font-serif text-[14px]">
                  5
                </span>
                <h2 className="font-serif text-[22px] text-[#180f0a]">Personalized Card & Wax Seal</h2>
              </div>

              <div className="space-y-3 bg-white p-5 rounded-3xl border border-[#e5e2dd]">
                <div>
                  <label className="block text-[11px] uppercase font-bold text-[#4e4540] mb-1">
                    Recipient Name
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-[#f6f3ee] text-[14px] text-[#1c1c19] border border-[#e5e2dd] focus:outline-none focus:ring-1 focus:ring-[#180f0a]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase font-bold text-[#4e4540] mb-1">
                    Handwritten Botanical Card Message
                  </label>
                  <textarea
                    rows={3}
                    value={cardMessage}
                    onChange={(e) => setCardMessage(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[#f6f3ee] text-[13px] text-[#1c1c19] border border-[#e5e2dd] focus:outline-none focus:ring-1 focus:ring-[#180f0a] resize-none"
                  />
                </div>
                <div className="flex items-center gap-3 pt-1">
                  <span className="text-[11px] uppercase font-bold text-[#4e4540]">Wax Seal:</span>
                  {waxSeals.map((ws) => (
                    <button
                      key={ws.id}
                      type="button"
                      onClick={() => setSelectedSeal(ws)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-semibold transition-all ${
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
          </div>

          {/* Right Live Summary & Checkout (5 Cols) */}
          <div className="lg:col-span-5 sticky top-24 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-[#e5e2dd] shadow-lg space-y-6">
              <div className="flex items-center justify-between border-b border-[#e5e2dd] pb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#964735]">
                    Studio Configuration
                  </span>
                  <h3 className="font-serif text-[22px] text-[#180f0a]">Bespoke Keepsake</h3>
                </div>
                <span className="text-[24px] font-bold text-[#180f0a]">
                  ₹{totalPrice.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Selected Visual Spec */}
              <div className="space-y-3 text-[13px] text-[#4e4540]">
                <div className="flex justify-between">
                  <span className="text-[#80756f]">Selected Base:</span>
                  <span className="font-semibold text-[#180f0a]">{selectedBase.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#80756f]">Palette:</span>
                  <span className="font-semibold text-[#180f0a]">{selectedPalette.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#80756f]">Ribbon Tie:</span>
                  <span className="font-semibold text-[#180f0a]">{selectedRibbon.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#80756f]">Wax Seal:</span>
                  <span className="font-semibold text-[#180f0a]">{selectedSeal.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#80756f]">Recipient:</span>
                  <span className="font-semibold text-[#180f0a]">{recipientName}</span>
                </div>
              </div>

              {/* Live Card Cardlet Preview */}
              <div className="p-4 rounded-2xl bg-[#faf7f2] border border-[#e5e2dd] space-y-2 relative overflow-hidden">
                <div
                  style={{ backgroundColor: selectedSeal.hex }}
                  className="absolute top-3 right-3 w-7 h-7 rounded-full text-white text-[9px] font-serif flex items-center justify-center font-bold"
                >
                  FA
                </div>
                <p className="text-[10px] uppercase font-bold text-[#964735]">Calligraphy Note Preview</p>
                <p className="font-serif italic text-[14px] text-[#180f0a]">
                  "{cardMessage || 'Fond thoughts and lasting flowers.'}"
                </p>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleCreateAndAddToCart}
                className="w-full py-4 rounded-full bg-[#180f0a] hover:bg-[#964735] text-white text-[13px] font-semibold tracking-wide flex items-center justify-center gap-2 shadow-md transition-all active:translate-y-0.5"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add Custom Keepsake to Bag · ₹{totalPrice.toLocaleString('en-IN')}</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[12px] text-[#80756f]">
                <ShieldCheck className="w-4 h-4 text-[#5b6d54]" />
                <span>Crafted in 2–3 business days with Pan-India delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
