import mongoose, { Schema, model } from "mongoose";

// Embedded product snapshot schema
const imageSchema = new Schema(
  {
    mobile: String,
    tablet: String,
    desktop: String,
  },
  { _id: false }
);

const cartItemSchema = new Schema(
  {
    sessionId: {
      type: String,
      required: true, // You can remove `required` if not used yet
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },

    // Snapshot of product data at time of add-to-cart
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: imageSchema,
  },
  { timestamps: true }
);

const CartItem = model("CartItem", cartItemSchema);
export default CartItem;
