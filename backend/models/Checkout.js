import mongoose, { Schema, model } from "mongoose";

// Reuse image snapshot schema
const imageSchema = new Schema(
  {
    mobile: String,
    tablet: String,
    desktop: String,
  },
  { _id: false }
);

// Snapshot of cart item at time of checkout
const orderItemSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: String,
    slug: String,
    price: Number,
    quantity: Number,
    image: imageSchema,
  },
  { _id: false }
);

// Checkout schema
const checkoutSchema = new Schema(
  {
    sessionId: {
      type: String,
      required: true,
    },

    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      zip: { type: String, required: false },
      country: { type: String, required: true },
    },

    payment: {
      method: {
        type: String,
        enum: ["eMoney", "cash"],
        required: true,
      },
      eMoneyNumber: { type: String },
      eMoneyPin: { type: String },
    },

    items: [orderItemSchema],

    totals: {
      total: { type: Number, required: true },
      vat: { type: Number, required: true },
      shipping: { type: Number, required: true },
      grandTotal: { type: Number, required: true },
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Checkout = model("Checkout", checkoutSchema);
export default Checkout;
