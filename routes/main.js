import express from "express";
import RandomTestInf02 from "#root/controllers/findRand.js";

const router = express.Router();

router.get("/:type/:number", RandomTestInf02);
export default router;
