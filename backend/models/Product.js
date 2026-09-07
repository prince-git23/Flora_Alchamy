import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    // Public URL / storefront identifier (e.g. "dusty-rose-lavender-posy")
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    sku: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, default: 'Flowers & Bouquets' },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    palette: { type: String, default: '' },
    ribbon: { type: String, default: '' },
    occasion: { type: String, default: '' },
    // Catalogue items are stock-tracked; made-to-order custom gifts are not.
    stockTracked: { type: Boolean, default: true },
    visibility: {
      type: String,
      enum: ['Visible', 'Hidden'],
      default: 'Visible',
    },
    collections: [{ type: String }],
    isFixture: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        ret.id = ret.slug;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

productSchema.index({ name: 'text', category: 'text' });

const Product = mongoose.model('Product', productSchema);
export default Product;
