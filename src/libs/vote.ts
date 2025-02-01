import { VoteType } from "@prisma/client";

export const voteToEnum = (vote: string): VoteType => {
  vote = vote.toUpperCase();

  switch (vote) {
    case "YES":
      return VoteType.YES;
    case "NO":
      return VoteType.NO;
    case "ABSTAIN":
      return VoteType.ABSTAIN;
    default:
      throw new Error("Invalid vote type.");
  }
};
