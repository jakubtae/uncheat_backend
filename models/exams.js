// @models/tasks.js
import mongoose from "mongoose";

const examsSchema = new mongoose.Schema(
  {
    userIP: String,
    questions: Array,
    type: String,
    status: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Exams = mongoose.models.Exams || mongoose.model("exams", examsSchema);

export default Exams;
