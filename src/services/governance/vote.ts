import { voteToEnum } from "../../libs/vote";
import { Prisma, PrismaClient, Vote } from "@prisma/client";
import { getUserByDiscordId } from "../user";
import { getProposalIdByPostId } from "./proposal";

const prisma = new PrismaClient();

export const getVotes = async () => {
  let result: Vote[] = [];

  try {
    result = await prisma.vote.findMany();
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching votes.");
  }

  return result;
};

export const getVotesByPostId = async (postId: string) => {
  let result = {
    yes: 0,
    no: 0,
    abstain: 0,
  };

  try {
    const proposalId = await getProposalIdByPostId(postId);

    if (!proposalId) {
      throw new Error("Proposal not exist.");
    }

    const voteAggregation = await prisma.vote.groupBy({
      by: ["vote"],
      where: {
        proposal_id: proposalId,
      },
      _count: {
        vote: true,
      },
    });

    if (voteAggregation) {
      for (const voteGroup of voteAggregation) {
        if (voteGroup.vote === "YES") {
          result.yes = voteGroup._count.vote;
        } else if (voteGroup.vote === "NO") {
          result.no = voteGroup._count.vote;
        } else if (voteGroup.vote === "ABSTAIN") {
          result.abstain = voteGroup._count.vote;
        }
      }
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error Getting vote.");
  }

  return result;
};

export const handleVoteByPostId = async (
  voteData: Prisma.VoteCreateInput,
  postId: string,
  discordId: string
) => {
  let result: Vote | null = null;

  try {
    const data = Prisma.validator<Prisma.VoteCreateInput>()(voteData);

    if (!data || !data.vote) {
      throw new Error("Invalid vote data.");
    }

    const vote = voteToEnum(data.vote);

    const proposalId = await getProposalIdByPostId(postId);

    const findUser = await getUserByDiscordId(discordId);

    if (proposalId && findUser?.id) {
      const findVote = await prisma.vote.findUnique({
        where: {
          proposal_id_user_id: {
            proposal_id: proposalId,
            user_id: findUser.id,
          },
        },
      });

      if (!findVote) {
        result = await prisma.vote.create({
          data: {
            proposal_id: proposalId,
            user_id: findUser.id,
            vote,
          },
        });
      } else {
        result = await prisma.vote.update({
          data: {
            vote,
          },
          where: {
            proposal_id_user_id: {
              proposal_id: proposalId,
              user_id: findUser.id,
            },
          },
        });
      }
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error creating vote.");
  }

  return result;
};
