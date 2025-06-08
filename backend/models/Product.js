import mongoose, { Schema, model } from "mongoose";

const imageSchema = new Schema(
  {
    mobile: String,
    tablet: String,
    desktop: String,
  },
  { _id: false }
);

const includeSchema = new Schema(
  {
    quantity: Number,
    item: String,
  },
  { _id: false }
);

const otherProductSchema = new Schema(
  {
    slug: String,
    name: String,
    image: imageSchema,
  },
  { _id: false }
);

const productSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    image: imageSchema,
    category: String,
    categoryImage: imageSchema,
    new: Boolean,
    price: Number,
    description: String,
    features: String,
    includes: [includeSchema],
    gallery: {
      first: imageSchema,
      second: imageSchema,
      third: imageSchema,
    },
    others: [otherProductSchema],
  },
  {
    timestamps: true,
  }
);

const Product = model("Product", productSchema);
export default Product;
