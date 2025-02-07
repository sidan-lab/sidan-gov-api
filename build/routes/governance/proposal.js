"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const proposal_1 = require("../../controllers/governance/proposal");
const admin_1 = require("../../middleware/admin");
const proposalRouter = express_1.default.Router();
proposalRouter.get("/:txHash/:certIndex", proposal_1.getProposalByTxHashCertIndexController);
proposalRouter.post("/:txHash/:certIndex/", admin_1.verifyAdminAccess, proposal_1.createOrUpdateProposalController);
exports.default = proposalRouter;
//# sourceMappingURL=proposal.js.map