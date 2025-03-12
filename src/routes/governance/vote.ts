import express from "express";
import {
  getVotesByPostIdController,
  handleVoteByPostIdController,
} from "../../controllers/governance/vote";
import verifyUserAccess from "../../middleware/auth";
import verifyAdminAccess from "../../middleware/admin";

export const voteRouter = express.Router();

/**
 * @swagger
 * /governance/vote/{postId}:
 *   get:
 *     summary: Get vote result for a proposal
 *     description: Get vote result for a proposal with a postId, returns vote count
 *     parameters:
 *      - in: header
 *        name: discord-id
 *        required: true
 *        description: discord id of the admin user
 *        type: string
 *      - in: path
 *        name: postId
 *        required: true
 *        description: The id of the proposal to get vote result
 *        type: string
 *     responses:
 *        200:
 *          description: Successfully retrieved vote result for proposal
 *          content:
 *            application/json:
 *              schema:
 *                  $ref: '#/components/schemas/VoteCount'
 *        400:
 *          description: Bad request
 */
voteRouter.get("/:postId", verifyAdminAccess, getVotesByPostIdController);

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
