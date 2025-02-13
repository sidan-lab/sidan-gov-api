import { Prisma, Proposal } from "@prisma/client";
import prisma from "../../database";

export const getProposalByTxHashCertIndex = async (
  txHash: string,
  certIndex: string
) => {
  let result: Proposal | null = null;

  try {
    const result = await prisma.proposal.findUnique({
      where: {
        tx_hash: txHash,
        cert_index: certIndex,
      },
    });

    if (!result) {
      throw new Error("Proposal not exist.");
    }
  } catch (error) {
    throw new Error("Proposal not exist.");
  }

  return result;
};

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
