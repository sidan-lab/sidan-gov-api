"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProposalIdByPostId = exports.createOrUpdateProposal = exports.getProposalByTxHashCertIndex = exports.getProposals = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getProposals = async () => {
    let result = [];
    try {
        result = await prisma.proposal.findMany();
    }
    catch (error) {
        console.log(error);
        throw new Error("Error fetching proposals.");
    }
    return result;
};
exports.getProposals = getProposals;
const getProposalByTxHashCertIndex = async (txHash, certIndex) => {
    let result = null;
    try {
        result = await prisma.proposal.findUnique({
            where: {
                tx_hash: txHash,
                cert_index: certIndex,
            },
        });
    }
    catch (error) {
        console.log(error);
        throw new Error("Proposal not exist.");
    }
    return result;
};
exports.getProposalByTxHashCertIndex = getProposalByTxHashCertIndex;
const createOrUpdateProposal = async (txHash, certIndex, Proposal) => {
    let result = null;
    try {
        const data = client_1.Prisma.validator()(Proposal);
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
        }
        else {
            result = await prisma.proposal.update({
                where: {
                    id: findProposal.id,
                },
                data,
            });
        }
        return result;
    }
    catch (error) {
        console.log(error);
        throw new Error("Error creating proposal.");
    }
};
exports.createOrUpdateProposal = createOrUpdateProposal;
const getProposalIdByPostId = async (postId) => {
    let result = null;
    try {
        const proposal = await prisma.proposal.findUnique({
            where: {
                post_id: postId,
            },
        });
        if (proposal) {
            result = proposal.id;
        }
    }
    catch (error) {
        console.log(error);
        throw new Error("Proposal not exist.");
    }
    return result;
};
exports.getProposalIdByPostId = getProposalIdByPostId;
module.exports = {
    getProposals: exports.getProposals,
    getProposalByTxHashCertIndex: exports.getProposalByTxHashCertIndex,
    getProposalIdByPostId: exports.getProposalIdByPostId,
    createOrUpdateProposal: exports.createOrUpdateProposal,
};
//# sourceMappingURL=proposal.js.map