import { Prisma, Vote } from "@prisma/client";
import prisma from "../../database";
import { voteToEnum } from "../../libs/vote";
import { getUserByDiscordId } from "../user";
import { getProposalIdByPostId } from "./proposal";

/**
 * Get Votes By Post Id
 *
 * Get vote count in the database of a proposal by post id.
 *
 * @param {String} postId - Post id of the proposal
 * @return {Object} result - Object containing votes count as in `{yes: Number, no: Number, abstain: Number}`
 */
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
    console.log("Error Getting vote: ", error.message);
    throw new Error("Error Getting vote: ", error.message);
  }

  return result;
};

/**
 * Handle Vote By Post Id
 *
 * Create or update a vote in the database by post id.
 *
 * @param {Object} voteData - Vote data object
 * @param {String} postId - Post id of the proposal
 * @param {String} discordId - Discord ID of the user
 * @return {Object} result - Vote object
 */
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
    console.log("Error creating vote: ", error.message);
    throw new Error("Error creating vote: ", error.message);
  }

  return result;
};
