import express from "express";
import checkoutController from "../controllers/checkoutController.js";

const router = express.Router();

// POST /api/checkout
router.post("/", checkoutController.createCheckout);

export default router;
