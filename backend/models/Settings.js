import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'default', unique: true },
    storeName: { type: String, default: 'Flora Alchemy' },
    currency: { type: String, default: 'INR' },
    storeAvailability: { type: String, default: 'open' },
    acceptNewOrders: { type: Boolean, default: true },
    shippingConfiguration: {
      freeShippingThreshold: { type: Number, default: 1999 },
      standardRate: { type: Number, default: 150 },
      standardDays: { type: String, default: '3–5 business days' },
      expressRate: { type: Number, default: 250 },
      expressDays: { type: String, default: '1–2 business days' },
      panIndia: { type: Boolean, default: true },
    },
    customGiftConfiguration: {
      enabled: { type: Boolean, default: true },
      basePrice: { type: Number, default: 1850 },
      note: { type: String, default: '' },
    },
    isFixture: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;
