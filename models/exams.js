// @models/tasks.js
import mongoose from "mongoose";

const examsSchema = new mongoose.Schema(
  {
    sessionId: String,
    questions: Array,
    type: String,
    status: {
      type: Boolean,
      default: false,
    },
    timeTaken: {
      minutes: Number,
      seconds: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Exams = mongoose.models.Exams || mongoose.model("exams", examsSchema);

export default Exams;
