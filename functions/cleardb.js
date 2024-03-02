import mongoose from "mongoose";
import Tasks from "../models/tasks.js"; // Import your Mongoose model

async function simplifyAnswersAndAssignCorrectAnswer() {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb://localhost:27017/Uncheatable");

    // Iterate over each document in the collection
    const cursor = Tasks.find().cursor();
    for (
      let doc = await cursor.next();
      doc != null;
      doc = await cursor.next()
    ) {
      // Simplify the 'answer' field to just an array of strings
      const simplifiedAnswers = doc.answer
        .map((obj) => obj.W || obj.C)
        .filter(Boolean);

      // Find the object with key 'C' and assign it to 'correct_answer' field
      const correctAnswerObj = doc.answer.find((obj) => obj.C);
      const correctAnswer = correctAnswerObj ? correctAnswerObj.C : null;

      // Update the document
      doc.answer = simplifiedAnswers;
      doc.correct_answer = correctAnswer;
      await doc.save();
    }

    console.log("All documents updated successfully.");
  } catch (error) {
    console.error("Error updating documents:", error);
  } finally {
    // Close the MongoDB connection
    mongoose.disconnect();
  }
}

// Call the function to execute the script
simplifyAnswersAndAssignCorrectAnswer();
