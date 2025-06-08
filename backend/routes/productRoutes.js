import express from "express";
import productController from "../controllers/productController.js";

const router = express.Router();

router.get("/", productController.getAllProducts);
router.get("/:slug", productController.getSingleProduct);
router.get("/category/:category", productController.getProductsByCategory);

export default router;
