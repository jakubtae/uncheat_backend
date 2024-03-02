import mongoose from "mongoose";
import Tasks from "../models/tasks.js";
const mongoURI = "mongodb://localhost:27017/Uncheatable";

async function updateDocs() {
  try {
    await mongoose.connect(mongoURI);

    const tasks = await Tasks.find();
    for (const task of tasks) {
      // Generate a random value between 0 and 1
      const randomValue = Math.random();

      // Update the document with the random field
      task.random = randomValue;

      // Save the updated document
      await task.save();

      console.log(`Added random value ${randomValue} to task ${task._id}`);
    }
  } catch (error) {
    console.error(error);
  }
}

export default async function findRandom(req, res) {
  try {
    await mongoose.connect(mongoURI);
    const result = await Tasks.aggregate([
      // Sample one random document from the collection
      { $sample: { size: 40 } },
      {
        $project: {
          _id: 0, // Exclude the _id field
          question: 1,
          answers: 1,
        },
      },
    ]);

    res.json(result);
  } catch (error) {
    console.error(error);
  }
}
