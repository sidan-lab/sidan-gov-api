import { UpdateUserDto } from "@models/users";
import { Request, Response } from "express";
import { getUserByDiscordId, getUsers, signIn } from "../../services/user";

export const getUsersController = async (_: Request, res: Response) => {
  try {
    const result = await getUsers();
    return res.json({
      message: "success",
      data: {
        users: result,
      },
    });
  } catch (error) {
    return res.status(404).json({
      message: "error",
      error: error.message,
    });
  }
};

export const getUserByDiscordIdController = async (
  req: Request,
  res: Response
) => {
  const { discordId } = req.params;

  try {
    const result = await getUserByDiscordId(discordId);
    return res.json({
      message: "success",
      data: {
        user: result,
      },
    });
  } catch (error) {
    return res.status(404).json({
      message: "error",
      error: error.message,
    });
  }
};

export const userSignInController = async (
  req: Request<UpdateUserDto>,
  res: Response
) => {
  const requestBody = req.body;

  try {
    const result = await signIn(requestBody);
    return res.json({
      message: "success",
      data: {
        result,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "error",
      error: error.message,
    });
  }
};

export const verifyUserController = async (_: Request, res: Response) => {
  // (Leon) This does not matter as we are using the discord id from the header and the middleware will handle the rest
  try {
    return res.json({
      message: "success",
      data: {
        verified: true,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "error",
      error: error.message,
    });
  }
};
