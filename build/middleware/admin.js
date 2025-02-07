"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAdminAccess = void 0;
const user_1 = require("../services/user");
const verifyAdminAccess = async (req, res, next) => {
    const discordId = req.headers["discord-id"];
    if (!discordId) {
        return res.status(401).json({
            message: "Unauthorized",
            error: "Unauthorized Access",
        });
    }
    try {
        const isAdmin = await (0, user_1.verifyAdminByDiscordId)(discordId);
        if (!isAdmin) {
            throw new Error("User not a admin");
        }
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(401).json({
            message: "Unauthorized",
            error: "Unauthorized Access",
        });
    }
};
exports.verifyAdminAccess = verifyAdminAccess;
//# sourceMappingURL=admin.js.map