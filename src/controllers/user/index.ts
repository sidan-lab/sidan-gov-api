import { Request, Response } from "express";
import { getUserByDiscordId, getUsers, signIn } from "../../services/user";

export const getUsersController = async (_: Request, res: Response) => {
  try {
    const result = await getUsers();
    res.json({
      message: "success",
      data: {
        users: result,
      },
    });
  } catch (error) {
    res.status(404).json({
      message: "error",
      error: error.message,
    });
  }
};

export const getUserByDiscordIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { discordId } = req.params;

  try {
    const result = await getUserByDiscordId(discordId);
    res.json({
      message: "success",
      data: {
        user: result,
      },
    });
  } catch (error) {
    res.status(404).json({
      message: "error",
      error: error.message,
    });
  }
};

export const userSignInController = async (req: Request, res: Response) => {
  const requestBody = req.body;

  try {
    const result = await signIn(requestBody);
    res.json({
      message: "success",
      data: {
        result,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "error",
      error: error.message,
    });
  }
};

export const verifyUserController = async (_: Request, res: Response) => {
  // (Leon) This does not matter as we are using the discord id from the header and the middleware will handle the rest
  try {
    res.json({
      message: "success",
      data: {
        verified: true,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "error",
      error: error.message,
    });
  }
};
