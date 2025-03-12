import { NextFunction, Request, Response } from "express";
import { verifyAdminByDiscordId } from "../services/user";

/**
 * Middleware to verify if the user is an admin, based on the wallet address associated with the discord id
 */

const verifyAdminAccess = async (
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
    const isAdmin = await verifyAdminByDiscordId(discordId as string);

    if (!isAdmin) {
      throw new Error("User not a admin");
    }

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized",
      error: "Unauthorized Access",
    });
  }
};

export default verifyAdminAccess;
