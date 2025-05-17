import express from "express";
import {
  createOrUpdateProposalController,
  getProposalByTxHashCertIndexController,
} from "../../controllers/governance/proposal";
import verifyAdminAccess from "../../middleware/admin";

export const proposalRouter = express.Router();

/**
 * @swagger
 * /governance/proposal/{txHash}/{certIndex}:
 *   get:
 *     summary: Get proposal by txHash and certIndex
 *     description: Get proposal by txHash and certIndex from the database
 *     parameters:
 *        - in: path
 *          name: txHash
 *          schema:
 *              type: string
 *          required: true
 *          description: The txHash of the proposal to get
 *        - in: path
 *          name: certIndex
 *          schema:
 *             type: string
 *          required: true
 *          description: The certIndex of the proposal to get
 *     responses:
 *       200:
 *         description: Successfully retrieved proposal by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SingleProposal'
 *       400:
 *         description: Bad request
 */
proposalRouter.get(
  "/:txHash/:certIndex",
  getProposalByTxHashCertIndexController
);

/**
 * @swagger
 * /governance/proposal/{txHash}/{certIndex}:
 *   post:
 *     summary: Create or update proposal
 *     description: Create or update proposal in the database
 *     parameters:
 *        - name: discord-id
 *          in: header
 *          required: true
 *          description: discord id of the admin
 *          type: string
 *     requestBody:
 *        descriptions: Proposal Create or Update object
 *        required: true
 *        content:
 *          application/json:
 *           schema:
 *            $ref: '#/components/schemas/ProposalCreateOrUpdateDto'
 *     responses:
 *       200:
 *         description: Successfully created or updated proposal, returns the proposal
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SingleProposal'
 *       400:
 *         description: Bad request
 */

proposalRouter
  .use(verifyAdminAccess)
  .post("/:txHash/:certIndex/", createOrUpdateProposalController);

export default proposalRouter;
