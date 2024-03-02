// @models/tasks.js
import mongoose from "mongoose";

const tasksSchema = new mongoose.Schema(
  {
    question: String,
    answer: [{ type: mongoose.Schema.Types.Mixed }], // Array of objects with dynamic keys
    imagePath: String,
    correct_answer: String, // Add a field to store the correct answer
    random: Number,
    type: String,
  },
  {
    timestamps: true,
  }
);

const itTask =
  mongoose.models.itTask || mongoose.model("it_tasks", tasksSchema);

export default itTask;
