import { NextFunction, Request, Response } from "express";
import { verifyUserByDiscordId } from "../services/user";

/**
 * Middleware to verify if the user signed in, based on the discord id
 */

const verifyUserAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const discordId = req.headers["discord-id"];

  if (!discordId) {
    console.log("Missing discord-id header");
    res.status(401).json({
      message: "Unauthorized",
      error: "Unauthorized Access",
    });
  }

  try {
    console.log(`Verifying user with discord-id: ${discordId}`);
    await verifyUserByDiscordId(discordId as string);
    console.log("User verified successfully");
    next();
  } catch (error) {
    console.error("Error verifying user:", error);
    res.status(401).json({
      message: "Unauthorized",
      error: "Unauthorized Access",
    });
  }
};

export default verifyUserAccess;
