import { Prisma, PrismaClient, Proposal } from "@prisma/client";

const prisma = new PrismaClient();

export const getProposals = async () => {
  let result: Proposal[] = [];

  try {
    result = await prisma.proposal.findMany();
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching proposals.");
  }

  return result;
};

export const getProposalByTxHashCertIndex = async (
  txHash: string,
  certIndex: string
) => {
  let result: Proposal | null = null;

  try {
    result = await prisma.proposal.findUnique({
      where: {
        tx_hash: txHash,
        cert_index: certIndex,
      },
    });
  } catch (error) {
    console.log(error);
    throw new Error("Proposal not exist.");
  }

  return result;
};

export const createOrUpdateProposal = async (
  txHash: string,
  certIndex: string,
  Proposal: Prisma.ProposalCreateInput | Prisma.ProposalUpdateInput
) => {
  let result: Proposal | null = null;

  try {
    const data = Prisma.validator<
      Prisma.ProposalCreateInput | Prisma.ProposalUpdateInput
    >()(Proposal);

    if (!data) {
      throw new Error("Invalid proposal data.");
    }

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
    console.log(error);
    throw new Error("Error creating proposal.");
  }
};

export const getProposalIdByPostId = async (postId: string) => {
  let result: string | null = null;

  try {
    const proposal = await prisma.proposal.findUnique({
      where: {
        post_id: postId,
      },
    });

    if (proposal) {
      result = proposal.id;
    }
  } catch (error) {
    console.log(error);
    throw new Error("Proposal not exist.");
  }

  return result;
};

module.exports = {
  getProposals,
  getProposalByTxHashCertIndex,
  getProposalIdByPostId,
  createOrUpdateProposal,
};
