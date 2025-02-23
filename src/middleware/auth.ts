import { NextFunction, Request, Response } from "express";
import { verifyUserByDiscordId } from "../services/user";

/**
 * Middleware to verify if the user signed in, based on the discord id
 */

const verifyUserAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const discordId = req.headers["discord-id"];

  if (!discordId) {
    return res.status(401).json({
      message: "Unauthorized",
      error: "Unauthorized Access",
    });
  }

  try {
    await verifyUserByDiscordId(discordId as string);

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized",
      error: "Unauthorized Access",
    });
  }
};

export default verifyUserAccess;
