import itTask from "#root/models/itTask.js";
import Exams from "#root/models/exams.js";

export default async function findRandom(req, res) {
  try {
    var ip = req.headers["x-real-ip"] || req.connection.remoteAddress;
    console.log(ip);

    const currentExam = await Exams.findOne({
      userIP: ip,
      status: false,
      questions: { $size: req.params.number },
    });
    if (!currentExam) {
      const result = await itTask.aggregate([
        { $match: { type: req.params.type } },
        // Sample one random document from the collection
        { $sample: { size: parseInt(req.params.number) || 1 } },
        {
          $project: {
            _id: 0, // Exclude the _id field
            question: 1,
            imagePath: 1,
            answer: 1,
            correct_answer: 1,
          },
        },
      ]);
      console.log(`Fetched ${result.length} questions`);

      const Exam = await Exams.create({
        userIP: ip,
        type: req.params.type,
        questions: result,
      });

      return res.json({ success: true, data: Exam });
    } else {
      const startTime = currentExam.createdAt.getTime(); // Get the exam start time
      const currentTime = Date.now(); // Get the current time
      const elapsedTime = currentTime - startTime; // Calculate the elapsed time
      const totalTime = currentExam.questions.length * 60 * 1000; // Total time in milliseconds (60 minutes)

      // Calculate the time left in milliseconds
      const timeLeft = Math.max(totalTime - elapsedTime, 0);
      const minutesLeft = Math.floor(timeLeft / (60 * 1000)); // Convert milliseconds to minutes
      const secondsLeft = Math.floor((timeLeft % (60 * 1000)) / 1000); // Convert remaining milliseconds to seconds

      if (timeLeft === 0) {
        // If time is finished, set status to true
        await Exams.findByIdAndUpdate(currentExam._id, { status: true });
        return res.json({
          success: true,
          timeFinished: true,
          message: "Time's up!",
        });
      }

      return res.json({
        success: true,
        timeleft: { minutes: minutesLeft, seconds: secondsLeft },
      });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
}
