// import asyncHandler from "express-async-handler";
// import Checkout from "../models/Checkout.js";
// import CartItem from "../models/CartItem.js";
// import Product from "../models/Product.js";

// // POST /api/checkout
// export const createCheckout = asyncHandler(async (req, res) => {
//   const { sessionId, customer, payment, items } = req.body;

//   if (!sessionId || !customer || !payment || !items || items.length === 0) {
//     return res.status(400).json({ message: "Missing required checkout data" });
//   }

//   // Calculate totals
//   const subtotal = items.reduce(
//     (acc, item) => acc + item.price * item.quantity,
//     0
//   );
//   const shipping = 50; // Fixed or dynamic
//   const vat = Math.round(subtotal * 0.2); // 20% VAT example
//   const grandTotal = subtotal + vat + shipping;

//   const checkout = new Checkout({
//     sessionId,
//     customer,
//     payment,
//     items,
//     totals: {
//       total: subtotal,
//       vat,
//       shipping,
//       grandTotal,
//     },
//   });

//   await checkout.save();

//   // Optional: clear cart
//   await CartItem.deleteMany({ sessionId });

//   res.status(201).json({
//     message: "Checkout successful",
//     checkoutId: checkout._id,
//     grandTotal: checkout.totals.grandTotal,
//   });
// });

import asyncHandler from "express-async-handler";
import Checkout from "../models/Checkout.js";
import CartItem from "../models/CartItem.js";

// create checkout
export const createCheckout = asyncHandler(async (req, res) => {
  const { sessionId, customer, payment, items, totals } = req.body;

  if (!sessionId || !customer || !payment || !items || !totals) {
    return res.status(400).json({ message: "Missing required checkout data" });
  }

  const checkout = new Checkout({
    sessionId,
    customer,
    payment,
    items,
    totals,
  });

  await checkout.save();

  // Optional: Clear the user's cart after successful checkout
  await CartItem.deleteMany({ sessionId });

  res.status(201).json({
    message: "Checkout completed successfully",
    checkoutId: checkout._id,
  });
});

export default {
  createCheckout,
};
