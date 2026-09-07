import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    occasion: { type: String, default: '' },
    productSlugs: [{ type: String }],
    visibility: {
      type: String,
      enum: ['Visible', 'Hidden'],
      default: 'Visible',
    },
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

const Collection = mongoose.model('Collection', collectionSchema);
export default Collection;
