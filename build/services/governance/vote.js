"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleVoteByPostId = exports.getVotesByPostId = exports.getVotes = void 0;
const vote_1 = require("../../libs/vote");
const client_1 = require("@prisma/client");
const user_1 = require("../user");
const proposal_1 = require("./proposal");
const prisma = new client_1.PrismaClient();
const getVotes = async () => {
    let result = [];
    try {
        result = await prisma.vote.findMany();
    }
    catch (error) {
        console.log(error);
        throw new Error("Error fetching votes.");
    }
    return result;
};
exports.getVotes = getVotes;
const getVotesByPostId = async (postId) => {
    let result = {
        yes: 0,
        no: 0,
        abstain: 0,
    };
    try {
        const proposalId = await (0, proposal_1.getProposalIdByPostId)(postId);
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
                }
                else if (voteGroup.vote === "NO") {
                    result.no = voteGroup._count.vote;
                }
                else if (voteGroup.vote === "ABSTAIN") {
                    result.abstain = voteGroup._count.vote;
                }
            }
        }
    }
    catch (error) {
        console.log(error);
        throw new Error("Error Getting vote.");
    }
    return result;
};
exports.getVotesByPostId = getVotesByPostId;
const handleVoteByPostId = async (voteData, postId, discordId) => {
    let result = null;
    try {
        const data = client_1.Prisma.validator()(voteData);
        if (!data || !data.vote) {
            throw new Error("Invalid vote data.");
        }
        const vote = (0, vote_1.voteToEnum)(data.vote);
        const proposalId = await (0, proposal_1.getProposalIdByPostId)(postId);
        const findUser = await (0, user_1.getUserByDiscordId)(discordId);
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
            }
            else {
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
    }
    catch (error) {
        console.log(error);
        throw new Error("Error creating vote.");
    }
    return result;
};
exports.handleVoteByPostId = handleVoteByPostId;
//# sourceMappingURL=vote.js.map