import { NextFunction, Request, Response } from "express";
import { resetUserAccess, verifyUserByDiscordId } from "../services/user";

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
    const verifyUser = await verifyUserByDiscordId(discordId as string);

    if (!verifyUser) {
      throw new Error("User not verified");
    }

    next();
  } catch (error) {
    console.log(error);
    try {
      await resetUserAccess(discordId as string);
    } catch (error) {
      console.log("Error resetting user: ", error);
    }
    return res.status(401).json({
      message: "Unauthorized",
      error: "Unauthorized Access",
    });
  }
};

export default verifyUserAccess;
