import { Request, Response } from "express";
import {
  getVotesByPostId,
  handleVoteByPostId,
} from "../../services/governance/vote";

export const handleVoteByPostIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { postId } = req.params;
  const requestBody = req.body;

  let discordId = req.headers["discord-id"] as string;

  try {
    await handleVoteByPostId(requestBody, postId, discordId);
    const vote = await getVotesByPostId(postId);

    res.json({
      message: "success",
      vote,
    });
  } catch (error) {
    res.status(500).json({ error: "Error handling votes" });
  }
};

export const getVotesByPostIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { postId } = req.params;

  try {
    const vote = await getVotesByPostId(postId);

    res.json({
      message: "success",
      vote,
    });
  } catch (error) {
    res.status(404).json({ error: "Error getting votes" });
  }
};
