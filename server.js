const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb+srv://buruklynx:1gliU3JyND0sQoKS@3legant-project.ybsdj.mongodb.net/", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ Failed to connect to MongoDB", err));

// Thumbnail Schema & Model
const thumbnailSchema = new mongoose.Schema({
  name: String,
  imageUrl: String, // URL of the image
});

const Thumbnail = mongoose.model("Thumbnail", thumbnailSchema, "thumbnailHomeImages");

// Create Product Schema
const productSchema = new mongoose.Schema({
  image: String,
  name: String,
  price: String,
  page: String
});

const Product = mongoose.model("Product", productSchema, "home_images");

const milkSchema = new mongoose.Schema({
  image: String,
  name: String,
  price: String,
  link: String,
});

const Milk = mongoose.model("Milk", milkSchema, "milk_images");



// API to fetch home thumbnails
app.get("/api/home-thumbnails", async (req, res) => {
  try {
    const thumbnails = await Thumbnail.find();
    res.json(thumbnails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API Route to Get All Products
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
});

app.get("/api/milk-products", async (req, res) => {
  try {
    const products = await Milk.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});



// Start the server
app.listen(5000, () => console.log("✅ Server running on port 5000"));