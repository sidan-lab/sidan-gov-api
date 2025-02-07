"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrUpdateProposalController = exports.getProposalByTxHashCertIndexController = exports.getProposalsController = void 0;
const proposal_1 = require("../../services/governance/proposal");
const getProposalsController = async (_, res) => {
    try {
        const proposals = await (0, proposal_1.getProposals)();
        return res.json({
            message: "success",
            proposals,
        });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
exports.getProposalsController = getProposalsController;
const getProposalByTxHashCertIndexController = async (req, res) => {
    const { txHash, certIndex } = req.params;
    try {
        const proposal = await (0, proposal_1.getProposalByTxHashCertIndex)(txHash, certIndex);
        return res.json({
            message: "success",
            proposal,
        });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
exports.getProposalByTxHashCertIndexController = getProposalByTxHashCertIndexController;
const createOrUpdateProposalController = async (req, res) => {
    const { txHash, certIndex } = req.params;
    const requestBody = req.body;
    try {
        const proposal = await (0, proposal_1.createOrUpdateProposal)(txHash, certIndex, requestBody);
        return res.json({
            message: "success",
            proposal,
        });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
exports.createOrUpdateProposalController = createOrUpdateProposalController;
//# sourceMappingURL=proposal.js.map