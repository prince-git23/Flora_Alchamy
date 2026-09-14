import mongoose from 'mongoose';

const customRequestSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
      // compound { customerId, createdAt: -1 } below covers the 'mine' query;
      // no separate single-field index needed (Phase 17 dedup).
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    occasion: {
      type: String,
      default: '',
    },
    budget: {
      type: String,
      default: '',
    },
    colors: {
      type: String,
      default: '',
    },
    desiredDate: {
      type: Date,
    },
    imageUrl: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'reviewing', 'quoted', 'accepted', 'declined'],
      default: 'pending',
    },
    adminNotes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

customRequestSchema.index({ status: 1, createdAt: -1 });
// Customer's own request list (GET /custom-requests/mine).
customRequestSchema.index({ customerId: 1, createdAt: -1 });

const CustomRequest = mongoose.model('CustomRequest', customRequestSchema);

export default CustomRequest;
