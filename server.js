const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://buruklynx:1gliU3JyND0sQoKS@3legant-project.ybsdj.mongodb.net/", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const thumbnailSchema = new mongoose.Schema({
  name: String,
  imageUrl: String, // URL of the image
});

const Thumbnail = mongoose.model("Thumbnail", thumbnailSchema, "thumbnailHomeImages");

// Define Mongoose Schema & Model
const productSchema = new mongoose.Schema({
  name: String,
  image: String,
  price: String
}, { collection: "fruit_juice_images" });

const Product = mongoose.model("Product", productSchema);

// API to fetch home thumbnails
app.get("/api/home-thumbnails", async (req, res) => {
  try {
    const thumbnails = await Thumbnail.find();
    res.json(thumbnails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API to Fetch Products
app.get("/api/products", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch products" });
    }
});
app.listen(5000, () => console.log("✅ Server running on port 5000"));