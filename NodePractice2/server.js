const express = require("express");
const mongoose = require("mongoose");
//const cors = require("cors");

const app = express();
app.use(express.json());
//app.use(cors());

// ✅ MongoDB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/taskDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Task Schema & Model
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending",
  },
});

const Task = mongoose.model("Task", taskSchema);

// ✅ GET /tasks - Fetch all tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// ✅ POST /tasks - Create a new task
app.post("/tasks", async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ error: "Title and description are required" });
    }

    const newTask = new Task({ title, description });
    await newTask.save();

    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to create task" });
  }
});

// ✅ PUT /tasks/:id - Update task status
app.put("/tasks/:id", async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to update task" });
  }
});

// ✅ DELETE /tasks/:id - Delete a task
app.delete("/tasks/:id", async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "Task deleted successfully", deletedTask });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task" });
  }
});

// ✅ Start Server
const PORT = 5000;
app.listen(PORT, () =>
  console.log(`🚀 Task Management API running at http://localhost:${PORT}`)
);
