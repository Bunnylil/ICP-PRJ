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

// API to fetch home thumbnails
app.get("/api/home-thumbnails", async (req, res) => {
  try {
    const thumbnails = await Thumbnail.find();
    res.json(thumbnails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => console.log("✅ Server running on port 5000"));
