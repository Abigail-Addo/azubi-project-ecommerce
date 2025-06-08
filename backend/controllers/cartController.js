import CartItem from "../models/CartItem.js";
import Product from "../models/Product.js";
import asyncHandler from "express-async-handler";

// get cart item
const getCart = asyncHandler(async (req, res) => {
  const sessionId = req.headers["x-session-id"];

  if (!sessionId) {
    return res.status(400).json({ message: "Session ID is required" });
  }

  const cart = await CartItem.find({ sessionId }).populate("productId");
  // console.log(cart);
  res.status(200).json(cart);
});

// add to cart
const addToCart = asyncHandler(async (req, res) => {
  const { productId, sessionId } = req.body;

  if (!sessionId || !productId) {
    return res
      .status(400)
      .json({ message: "Session ID and Product ID are required" });
  }

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  let item = await CartItem.findOne({ productId, sessionId });

  if (item) {
    item.quantity += 1;
    await item.save();
  } else {
    item = new CartItem({
      sessionId,
      productId,
      quantity: 1,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.image,
    });
    await item.save();
  }

  res.status(201).json(item);
});

// remove cart item
const removeCartItem = asyncHandler(async (req, res) => {
  await CartItem.findByIdAndDelete(req.params._id);
  res.status(204).end();
});

// update cart item
const updateCartItem = asyncHandler(async (req, res) => {
  const { _id } = req.body;
  const { quantity } = req.body;

  if (!_id || _id === "undefined") {
    return res
      .status(400)
      .json({ message: "Cart item ID (_id) is missing or invalid in route." });
  }

  const item = await CartItem.findByIdAndUpdate(
    _id,
    { quantity },
    { new: true }
  ).populate("productId");

  if (!item) {
    return res.status(404).json({ message: "Cart item not found" });
  }

  const totalPrice = item.productId.price * item.quantity;
  console.log(item);
  res.status(200).json({
    ...item.toObject(),
    totalPrice,
  });
});

// remove all cart items for a session
const removeAllCartItems = asyncHandler(async (req, res) => {
  const sessionId = req.headers["x-session-id"];

  if (!sessionId) {
    return res.status(400).json({ message: "Session ID is required" });
  }

  await CartItem.deleteMany({ sessionId });
  res.status(204).end();
});

export default {
  getCart,
  addToCart,
  removeCartItem,
  updateCartItem,
  removeAllCartItems,
};
