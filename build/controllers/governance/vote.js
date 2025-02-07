"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleVoteByPostIdController = void 0;
const vote_1 = require("../../services/governance/vote");
const handleVoteByPostIdController = async (req, res) => {
    const { postId } = req.params;
    const requestBody = req.body;
    let discordId = req.headers["discord-id"];
    if (!discordId) {
        return res.status(401).json({
            message: "Unauthorized",
            error: "Unauthorized Access",
        });
    }
    if (discordId instanceof Array) {
        discordId = discordId[0];
    }
    try {
        await (0, vote_1.handleVoteByPostId)(requestBody, postId, discordId);
        const vote = await (0, vote_1.getVotesByPostId)(postId);
        return res.json({
            message: "Success",
            vote,
        });
    }
    catch (error) {
        return res.status(500).json({ error: "Error handling votes" });
    }
};
exports.handleVoteByPostIdController = handleVoteByPostIdController;
//# sourceMappingURL=vote.js.map