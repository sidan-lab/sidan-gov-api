import { Request, Response } from "express";
import {
  getVotesByPostId,
  handleVoteByPostId,
} from "../../services/governance/vote";

export const handleVoteByPostIdController = async (
  req: Request,
  res: Response
) => {
  const { postId } = req.params;
  const requestBody = req.body;

  let discordId = req.headers["discord-id"] as string;

  try {
    await handleVoteByPostId(requestBody, postId, discordId);
    const vote = await getVotesByPostId(postId);

    return res.json({
      message: "Success",
      vote,
    });
  } catch (error) {
    return res.status(500).json({ error: "Error handling votes" });
  }
};

export const getVotesByPostIdController = async (
  req: Request,
  res: Response
) => {
  const { postId } = req.params;
  const requestBody = req.body;

  let discordId = req.headers["discord-id"];

  if (!discordId) {
    return res.status(401).json({
      message: "Unauthorized",
      error: "Unauthorized Access",
    });
  }

  if (discordId instanceof Array) {
    discordId = discordId[0];
  }

  try {
    const vote = await getVotesByPostId(postId);

    return res.json({
      message: "Success",
      vote,
    });
  } catch (error) {
    return res.status(500).json({ error: "Error handling votes" });
  }
};
