import mongoose from 'mongoose';

export const ORDER_STATUSES = [
  'new',
  'confirmed',
  'in_production',
  'quality_check',
  'ready_to_dispatch',
  'shipped',
  'delivered',
];

// Valid forward-only transitions (the canonical lifecycle).
export const NEXT_STATUS = {};
for (let i = 0; i < ORDER_STATUSES.length - 1; i += 1) {
  NEXT_STATUS[ORDER_STATUSES[i]] = ORDER_STATUSES[i + 1];
}

const itemSchema = new mongoose.Schema(
  {
    // Product.slug for catalogue items; custom items may not have a slug.
    productSlug: { type: String, default: null },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String, default: '' },
    category: { type: String, default: '' },
    palette: { type: String, default: '' },
    ribbon: { type: String, default: '' },
    giftMessage: { type: String, default: '' },
    customDetails: { type: mongoose.Schema.Types.Mixed, default: null },
    // false → made-to-order custom gift, not stock-tracked
    isCatalogue: { type: Boolean, default: true },
    stockDeducted: { type: Boolean, default: false },
  },
  { _id: true }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
      index: true,
    },
    customerName: { type: String, default: '' },
    customerEmail: { type: String, default: '' },
    items: { type: [itemSchema], default: [] },
    subtotal: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Refunded', 'Sample'],
      default: 'Sample',
    },
    paymentMethod: { type: String, default: 'Sample' },
    // Razorpay (or future provider) payment metadata — the server is the only
    // writer. paymentStatus stays independent of orderStatus: a paid order can
    // still be 'new' in the fulfillment lifecycle.
    paymentProvider: { type: String, default: '' },
    paymentProviderOrderId: { type: String, default: '' },
    paymentProviderPaymentId: { type: String, default: '' },
    paymentReference: { type: String, default: '' },
    paymentSignatureVerified: { type: Boolean, default: false },
    paymentVerifiedAt: { type: Date, default: null },
    paymentFailureReason: { type: String, default: '' },
    // Canonical lifecycle value — customer-facing labels are derived on the
    // frontend via orderService.getCustomerFacingStatus().
    orderStatus: {
      type: String,
      enum: ORDER_STATUSES,
      default: 'new',
      index: true,
    },
    shippingAddress: {
      name: { type: String, default: '' },
      address: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      pincode: { type: String, default: '' },
      phone: { type: String, default: '' },
    },
    giftMessage: { type: String, default: '' },
    trackingNumber: { type: String, default: '' },
    statusHistory: [
      {
        status: { type: String, enum: ORDER_STATUSES },
        note: { type: String, default: '' },
        changedBy: { type: String, default: '' },
        at: { type: Date, default: Date.now },
      },
    ],
    isFixture: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        ret.id = ret.orderId;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

orderSchema.index({ createdAt: -1 });
orderSchema.index({ customerId: 1, createdAt: -1 });

const Order = mongoose.model('Order', orderSchema);
export default Order;
