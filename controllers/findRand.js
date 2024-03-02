import itTask from "#root/models/itTask.js";
import Exams from "#root/models/exams.js";

export default async function findRandom(req, res) {
  try {
    // Get session ID
    const sessionId = req.session.id;

    console.log(`Received request from Session ID: ${sessionId}`);

    // Log request parameters for debugging
    console.log("Request Parameters:", req.params);

    const currentExam = await Exams.findOne({
      sessionId, // Look for exams associated with the session ID
      status: false,
      questions: { $size: req.params.number },
    });

    if (!currentExam) {
      console.log("No ongoing exam found for user.");

      // Fetch questions for the exam
      const result = await itTask.aggregate([
        { $match: { type: req.params.type } },
        { $sample: { size: parseInt(req.params.number) || 1 } },
        {
          $project: {
            _id: 0,
            question: 1,
            imagePath: 1,
            answer: 1,
            correct_answer: 1,
          },
        },
      ]);

      console.log(`Fetched ${result.length} questions`);

      // Create a new exam document associated with the session ID
      const newExam = await Exams.create({
        sessionId,
        type: req.params.type,
        questions: result,
      });

      console.log("Created new exam document:", newExam._id);

      return res.json({ success: true, data: newExam });
    } else {
      console.log("Found ongoing exam for user:", currentExam._id);

      const startTime = currentExam.createdAt.getTime();
      const currentTime = Date.now();
      const elapsedTime = currentTime - startTime;
      const totalTime = currentExam.questions.length * 60 * 1000;

      const timeLeft = Math.max(totalTime - elapsedTime, 0);
      const minutesLeft = Math.floor(timeLeft / (60 * 1000));
      const secondsLeft = Math.floor((timeLeft % (60 * 1000)) / 1000);

      if (timeLeft === 0) {
        console.log("Time's up for the ongoing exam. Setting status to true.");
        await Exams.findByIdAndUpdate(currentExam._id, { status: true });
        return res.json({
          success: true,
          timeFinished: true,
          message: "Time's up!",
        });
      }

      console.log("Time left for the ongoing exam:", {
        minutesLeft,
        secondsLeft,
      });

      return res.json({
        success: true,
        timeleft: { minutes: minutesLeft, seconds: secondsLeft },
      });
    }
  } catch (error) {
    console.error("Error occurred:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
}
