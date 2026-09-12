/**
 * customGiftPricing — Server-authoritative pricing for the Custom Gift Studio.
 *
 * The frontend displays an estimate using the same values, but the backend
 * recalculates from these IDs on every order. A tampered client price is
 * ignored; only the configuration IDs matter.
 */

export const CUSTOM_GIFT_BASES = {
  'keepsake-posy': { price: 1850, name: 'Handcrafted Everlasting Posy' },
  'heirloom-box': { price: 3450, name: 'Solid Pine Sliding Hamper Box' },
  'ceramic-pot': { price: 1250, name: 'Artisan Speckled Ceramic Vessel' },
};

export const CUSTOM_GIFT_FLOWERS = {
  rose: { cost: 0, name: 'Velvet Dusty Rose' },
  lavender: { cost: 0, name: 'French Lavender Sprigs' },
  chamomile: { cost: 0, name: 'Sunny Chamomile Buds' },
  peony: { cost: 300, name: 'Blush Peony Bloom' },
  eucalyptus: { cost: 0, name: 'Sage Eucalyptus Leaves' },
};

export const CUSTOM_GIFT_PALETTES = {
  mauve: { name: 'Dusty Rose & Lavender' },
  sage: { name: 'Sage Leaf & Forest Olive' },
  terracotta: { name: 'Terracotta & Burnished Ochre' },
  cream: { name: 'Parchment Cream & Gold Leaf' },
};

export const CUSTOM_GIFT_RIBBONS = {
  'frayed-silk': { name: 'Frayed Edge Plant-Dyed Silk' },
  'velvet-cord': { name: 'French Olive Velvet Cord' },
  'deckled-twine': { name: 'Natural Cotton Jute Twine' },
};

export const CUSTOM_GIFT_SEALS = {
  terracotta: { name: 'Terracotta Clay' },
  sage: { name: 'Dried Sage' },
  gold: { name: 'Burnished Antique Gold' },
};

// ─── Add-on Pricing ──────────────────────────────────────────────────
// Server-authoritative add-on prices. Client sends addOnId; server resolves price.

export const ADD_ONS = {
  'studio-pine-casket': {
    id: 'studio-pine-casket',
    name: 'Studio Pine Keepsake Casket Upgrade',
    price: 450,
    category: 'Gift Packaging',
    description: 'Solid sliding pine casket with a brass wax seal.',
  },
};

/**
 * Resolve the authoritative price for an add-on by its ID.
 * @param {string} addOnId
 * @returns {{ price: number, name: string, errors: string[] }}
 */
export function resolveAddOnPrice(addOnId) {
  const errors = [];
  if (!addOnId) {
    errors.push('Missing addOnId.');
    return { price: 0, name: '', errors };
  }
  const addOn = ADD_ONS[addOnId];
  if (!addOn) {
    errors.push(`Unknown add-on: "${addOnId}"`);
    return { price: 0, name: '', errors };
  }
  return { price: addOn.price, name: addOn.name, errors };
}

/**
 * Calculate the authoritative price for a custom gift configuration.
 *
 * @param {Object} config - The custom gift configuration from the client.
 * @param {string} config.baseId - The base product ID.
 * @param {string[]} config.flowerIds - Array of selected flower IDs.
 * @param {string} config.paletteId - The selected palette ID.
 * @param {string} config.ribbonId - The selected ribbon ID.
 * @param {string} config.sealId - The selected seal ID.
 * @returns {{ price: number, breakdown: Object, errors: string[] }}
 */
export function calculateCustomGiftPrice(config) {
  const errors = [];
  let price = 0;
  const breakdown = {};

  // Base
  const base = CUSTOM_GIFT_BASES[config.baseId];
  if (!base) {
    errors.push(`Unknown base: "${config.baseId}"`);
  } else {
    price += base.price;
    breakdown.base = { id: config.baseId, name: base.name, price: base.price };
  }

  // Flowers
  if (Array.isArray(config.flowerIds)) {
    const flowerCosts = [];
    for (const flowerId of config.flowerIds) {
      const flower = CUSTOM_GIFT_FLOWERS[flowerId];
      if (!flower) {
        errors.push(`Unknown flower: "${flowerId}"`);
      } else {
        price += flower.cost;
        flowerCosts.push({ id: flowerId, name: flower.name, cost: flower.cost });
      }
    }
    breakdown.flowers = flowerCosts;
  }

  // Palette (no cost, but validate)
  if (config.paletteId && !CUSTOM_GIFT_PALETTES[config.paletteId]) {
    errors.push(`Unknown palette: "${config.paletteId}"`);
  }
  breakdown.palette = config.paletteId || null;

  // Ribbon (no cost, but validate)
  if (config.ribbonId && !CUSTOM_GIFT_RIBBONS[config.ribbonId]) {
    errors.push(`Unknown ribbon: "${config.ribbonId}"`);
  }
  breakdown.ribbon = config.ribbonId || null;

  // Seal (no cost, but validate)
  if (config.sealId && !CUSTOM_GIFT_SEALS[config.sealId]) {
    errors.push(`Unknown seal: "${config.sealId}"`);
  }
  breakdown.seal = config.sealId || null;

  return { price, breakdown, errors };
}
