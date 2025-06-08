import Product from "../models/Product.js";
import asyncHandler from "express-async-handler";

// get all products
const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();
  res.status(200).send(products);
});

// get a single product by slug
const getSingleProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.status(200).send(product);
  // console.log(product);
});

// get products by category
const getProductsByCategory = asyncHandler(async (req, res) => {
  const category = req.params.category;
  const products = await Product.find({ category }).sort({ new: -1 });
  if (!products || products.length === 0) {
    return res
      .status(404)
      .json({ message: `No products found for category: ${category}` });
  }

  const sorted = [
    ...products.filter((p) => p.name.includes("Mark")),
    ...products.filter((p) => !p.name.includes("Mark")),
  ];

  res.status(200).json(sorted);
});

export default {
  getAllProducts,
  getSingleProduct,
  getProductsByCategory,
};
