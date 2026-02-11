//Question--> Create a Simple Blog API Use Express and MongoDB to store blog posts.
//  Each post has: title, content, author, and date. Endpoints: 
// * GET /posts → Retrieve all posts * POST /posts → Create a new post


import express from "express";
import mongoose from "mongoose";
const app = express();

app.use(express.json());//parsing

mongoose
  .connect("mongodb://127.0.0.1:27017/ayushDb")
  .then(() => console.log("connected"))
  .catch((err) => console.error(" MongoDB connection error", err));

//create schema
const myschema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

//model
const Post = mongoose.model("Post", myschema);

app.post("/posts", async (req, res) => {
  try {
    const { title, content, author } = req.body;

    if (!title || !content || !author) {
      return res
        .status(400)
        .json({ error: "title, content, and author are required" });
    }

    const newPost = new Post({ title, content, author });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json({ error: "Failed to create post" });
  }
});


app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});


const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));





