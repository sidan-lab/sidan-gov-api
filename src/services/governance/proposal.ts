import { Prisma, Proposal } from "@prisma/client";
import prisma from "../../database";

/**
 * Get Proposal By TxHash and CertIndex
 *
 * Get a proposal in the database by txHash and certIndex. Used for getting proposal information and checking if a proposal exists in scheduled task.
 *
 * @param txHash - Transaction hash of the proposal
 * @param certIndex - Certificate index of the proposal
 * @return {Object} proposal - Proposal object
 */
export const getProposalByTxHashCertIndex = async (
  txHash: string,
  certIndex: string
) => {
  let result: Proposal | null = null;

  const proposal = await prisma.proposal.findUnique({
    where: {
      tx_hash: txHash,
      cert_index: certIndex,
    },
  });

  if (proposal) {
    result = proposal;
  }

  return result;
};

/**
 * Create or Update Proposal
 *
 * Create a new proposal in the database or update an existing proposal. Used in the scheduled task to store proposal information obtained from blockchain.
 *
 * @param {String} txHash - Transaction hash of the proposal
 * @param {String} certIndex - Certificate index of the proposal
 * @param {Object} proposal - Proposal object
 * @return {Object} proposal - Proposal object
 */

export const createOrUpdateProposal = async (
  txHash: string,
  certIndex: string,
  proposal: Prisma.ProposalCreateInput | Prisma.ProposalUpdateInput
) => {
  let result: Proposal | null = null;

  try {
    if (!proposal || Object.keys(proposal).length === 0) {
      throw new Error("Invalid data for proposal creation.");
    }

    const data = Prisma.validator<
      Prisma.ProposalCreateInput | Prisma.ProposalUpdateInput
    >()(proposal);

    const findProposal = await prisma.proposal.findUnique({
      where: {
        tx_hash: txHash,
        cert_index: certIndex,
      },
    });

    if (!findProposal) {
      result = await prisma.proposal.create({
        data,
      });
    } else {
      result = await prisma.proposal.update({
        where: {
          id: findProposal.id,
        },
        data,
      });
    }

    return result;
  } catch (error) {
    throw new Error("Error creating proposal:", error.message);
  }
};

/**
 * Get Proposal Id By Post Id
 *
 * Get a proposal id in the database by post id. Used for getting proposal id to create a vote.
 *
 * @param {String} postId - Post id of the proposal
 * @return {String} proposalId - Proposal id or null if not found
 */
export const getProposalIdByPostId = async (postId: string) => {
  let result: string | null = null;

  const proposal = await prisma.proposal.findUnique({
    where: {
      post_id: postId,
    },
  });

  if (proposal) {
    result = proposal.id;
  }

  return result;
};

module.exports = {
  getProposalByTxHashCertIndex,
  getProposalIdByPostId,
  createOrUpdateProposal,
};
