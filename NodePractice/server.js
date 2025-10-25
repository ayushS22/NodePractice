const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();

dotenv.config();

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));

// Student Schema
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  course: { type: String, required: true },
});

// Student Model
const Student = mongoose.model("Student", studentSchema);

// ---------------- ROUTES ----------------

// ✅ GET /students → Retrieve all students
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving students" });
  }
});

// ✅ POST /students → Add a new student
app.post("/students", async (req, res) => {
  try {
    const { name, age, course } = req.body;
    if (!name || !age || !course) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newStudent = new Student({ name, age, course });
    await newStudent.save();
    res.status(201).json({ message: "Student added successfully", newStudent });
  } catch (err) {
    res.status(500).json({ message: "Error adding student" });
  }
});

// ✅ DELETE /students/:id → Delete a student by ID
app.delete("/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting student" });
  }
});

// -----------------------------------------

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
