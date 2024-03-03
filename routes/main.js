import express from "express";
import RandomTestInf02 from "#root/controllers/findRand.js";

const router = express.Router();
router.get("/", (req, res) => {
  res.json("Hello server");
});
router.post("/:type/:number", RandomTestInf02);
export default router;
