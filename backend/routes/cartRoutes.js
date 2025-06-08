import express from "express";
import cartController from "../controllers/cartController.js";

const router = express.Router();

router.get("/", cartController.getCart);
router.post("/", cartController.addToCart);
router.delete("/remove", cartController.removeAllCartItems);
router.patch("/:_id", cartController.updateCartItem);
router.delete("/:_id", cartController.removeCartItem);

export default router;
