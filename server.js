const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt"); 

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(
    "mongodb+srv://buruklynx:1gliU3JyND0sQoKS@3legant-project.ybsdj.mongodb.net/",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ Failed to connect to MongoDB", err));

// Thumbnail Schema & Model
const thumbnailSchema = new mongoose.Schema({
  name: String,
  imageUrl: String, 
});

const Thumbnail = mongoose.model(
  "Thumbnail",
  thumbnailSchema,
  "thumbnailHomeImages"
);

// Create Product Schema
const productSchema = new mongoose.Schema({
  image: String,
  name: String,
  price: String,
  page: String,
});

const Product = mongoose.model("Product", productSchema, "home_images");

const milkSchema = new mongoose.Schema({
  image: String,
  name: String,
  price: String,
  link: String,
});

const Milk = mongoose.model("Milk", milkSchema, "milk_images");

// User Schema and Model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, unique: true, sparse: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional for Google signup
  googleId: { type: String, unique: true, sparse: true },
  profilePicture: { type: String }, // Optional
  signupMethod: { type: String, default: "email" },
});

const User = mongoose.model("User", userSchema);

// Define Schema and Model
const addressSchema = new mongoose.Schema({
  name: String,
  address: String,
  region: String,
  city: String,
  contact: String,
});

const Address = mongoose.model("Address", addressSchema);
// API Endpoints
// GET Route to Fetch Address
app.get("/get-address", async (req, res) => {
  try {
    const address = await Address.findOne().sort({ _id: -1 }); 
    if (address) {
      res.status(200).json(address);
    } else {
      res.status(404).send("No address found");
    }
  } catch (error) {
    res.status(500).send("Error fetching address");
  }
});

// Check if username exists
app.get("/api/auth/check-username", async (req, res) => {
  const { username } = req.query;

  try {
    const user = await User.findOne({ username });
    res.json({ exists: !!user });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Check if email exists
app.get("/api/auth/check-email", async (req, res) => {
  const { email } = req.query;

  try {
    const user = await User.findOne({ email });
    res.json({ exists: !!user });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Email Signup
app.post("/api/auth/signup", async (req, res) => {
  const { name, username, email, password } = req.body;

  try {
    const existingUsername = await User.findOne({ username });
    const existingEmail = await User.findOne({ email });

    if (existingUsername) {
      return res.status(400).json({ error: "Username already exists" });
    }

    if (existingEmail) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user
    const user = new User({ name, username, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Google Signup
app.post("/api/auth/google-signup", async (req, res) => {
  const { googleId, name, email, profilePicture } = req.body;

  try {
    const existingUser = await User.findOne({ googleId });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User already exists with this Google account." });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already exists." });
    }

    const user = new User({
      name,
      email,
      googleId,
      profilePicture: profilePicture || "",
      signupMethod: "google",
    });

    await user.save();

    res.status(201).json({ message: "Google signup successful!", user });
  } catch (error) {
    console.error("Error during Google signup:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// API Route to Get All Thumbnails
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

// API Route to Get All Milk Products
app.get("/api/milk-products", async (req, res) => {
  try {
    const products = await Milk.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({ message: "Sign-in successful", user });
  } catch (error) {
    console.error("Sign-In Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST Route to Save Address
app.post("/save-address", async (req, res) => {
  try {
    const { name, address, region, city, contact } = req.body;
    const newAddress = new Address({ name, address, region, city, contact });
    await newAddress.save();
    res.status(201).send("Address saved successfully");
  } catch (error) {
    res.status(500).send("Error saving address");
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
