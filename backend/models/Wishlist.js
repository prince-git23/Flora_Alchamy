import mongoose from 'mongoose';

/**
 * Customer wishlist — one document per customer. productIds are product refs
 * (deduplicated). Ownership is always derived from the authenticated user on
 * the backend; the browser never supplies an owner id.
 */
const wishlistSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
      unique: true,
      index: true,
    },
    productIds: {
      // Product slugs (the storefront's public product ids).
      type: [String],
      default: [],
    },
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

const Wishlist = mongoose.model('Wishlist', wishlistSchema);
export default Wishlist;