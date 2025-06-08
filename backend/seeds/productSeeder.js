import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Product from "../models/Product.js";
import products from "./products.json" assert { type: "json" };

dotenv.config();

async function seed() {
  try {
    const db = await connectDB();
    if (db) {
      // console.log("mongodb is connected successfully in seed file");
    }

    await Product.deleteMany({});
    const inserted = await Product.insertMany(products);
    // console.log(`Inserted ${inserted.length} products`);
    process.exit(0);
  } catch (error) {
    // console.error("Seeding error:", error);
    process.exit(1);
  }
}

seed();
