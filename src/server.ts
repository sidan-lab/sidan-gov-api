import { NextFunction, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import app from "./app";
import proposalRouter from "./routes/governance/proposal";
import voteRouter from "./routes/governance/vote";
import userRouter from "./routes/user";

import swaggerSpec from "../swaggerConfig";

console.log("Setting up routes...");

app.use("/user", userRouter);
app.use("/governance/proposal", proposalRouter);
app.use("/governance/vote", voteRouter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = res.statusCode || 500;
  console.error(err.stack);
  res.status(statusCode).json({ error: err.message });
});

// Start the server
const port = parseInt(process.env.PORT || "3002");
const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default server;
