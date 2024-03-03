import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import session from "express-session"; // Import express-session
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(compression());
app.use(helmet());
app.set("trust proxy", true); // Trust proxy for IP address handling

// Use express-session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret", // Use a secret for session encryption
    resave: false,
    saveUninitialized: true,
  })
);

// Routes
import main from "./routes/main.js";
app.use("/", main);

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log("Connected to database & listening on port", PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
