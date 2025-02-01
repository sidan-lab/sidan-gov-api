import { NextFunction, Request, Response } from "express";
import { verifyAdminByDiscordId } from "../services/user";

export const verifyAdminAccess = async (
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
    console.log(error);
    return res.status(401).json({
      message: "Unauthorized",
      error: "Unauthorized Access",
    });
  }
};
