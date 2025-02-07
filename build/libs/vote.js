"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.voteToEnum = void 0;
const client_1 = require("@prisma/client");
const voteToEnum = (vote) => {
    vote = vote.toUpperCase();
    switch (vote) {
        case "YES":
            return client_1.VoteType.YES;
        case "NO":
            return client_1.VoteType.NO;
        case "ABSTAIN":
            return client_1.VoteType.ABSTAIN;
        default:
            throw new Error("Invalid vote type.");
    }
};
exports.voteToEnum = voteToEnum;
//# sourceMappingURL=vote.js.map