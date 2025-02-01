import express from "express";
import { handleVoteByPostIdController } from "../../controllers/governance/vote";
import { verifyUserAccess } from "../../middleware/auth";

const voteRouter = express.Router();

/**
 * @swagger
 * /governance/vote/{postId}:
 *   post:
 *     summary: Submit vote for proposal
 *     description: Submit vote for proposal, returns vote count
 *     parameters:
 *        - in: header
 *          name: discord-id
 *          required: true
 *          description: discord id of the user
 *          type: string
 *        - in: path
 *          name: postId
 *          required: true
 *          description: The id of the proposal to vote for
 *          type: string
 *     requestBody:
 *        descriptions: Vote object
 *        required: true
 *        content:
 *          application/json:
 *           schema:
 *            $ref: '#/components/schemas/VoteDto'
 *     responses:
 *       200:
 *         description: Successfully submitted vote for proposal
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VoteCount'
 *       400:
 *         description: Bad request
 */
voteRouter.post("/:postId", verifyUserAccess, handleVoteByPostIdController);

export default voteRouter;
