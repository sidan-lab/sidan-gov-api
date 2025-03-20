import cors from "cors";
import dotenv from "dotenv";
import express from "express";

// Load environment variables
dotenv.config({
  path: ".env",
});

console.log("Starting application...");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

export default app;
