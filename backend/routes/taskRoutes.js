const express = require("express");
const Task = require("../models/Task");

const router = express.Router();

// ✅ Create a new task
router.post("/add", async (req, res) => {
    try {
        const { title } = req.body;
        const newTask = new Task({ title });
        await newTask.save();
        res.status(201).json({ message: "Task added successfully!", task: newTask });
    } catch (error) {
        res.status(500).json({ message: "Failed to add task", error });
    }
});

// ✅ Get all tasks
router.get("/", async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch tasks", error });
    }
});

// ✅ Update task status
router.put("/update/:id", async (req, res) => {
    try {
        const { completed } = req.body;
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            { completed },
            { new: true }
        );
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: "Failed to update task", error });
    }
});

// ✅ Delete a task
router.delete("/delete/:id", async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete task", error });
    }
});

module.exports = router;
