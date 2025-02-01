import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";

// Load environment variables
dotenv.config({
  path: ".env",
});

console.log("Starting application...");

const app = express();
app.use(bodyParser.json());
app.use(cors());

export default app;
