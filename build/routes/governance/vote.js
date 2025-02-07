"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const vote_1 = require("../../controllers/governance/vote");
const auth_1 = require("../../middleware/auth");
const voteRouter = express_1.default.Router();
voteRouter.post("/:postId", auth_1.verifyUserAccess, vote_1.handleVoteByPostIdController);
exports.default = voteRouter;
//# sourceMappingURL=vote.js.map