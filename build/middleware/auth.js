"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUserAccess = void 0;
const user_1 = require("../services/user");
const verifyUserAccess = async (req, res, next) => {
    const discordId = req.headers["discord-id"];
    if (!discordId) {
        return res.status(401).json({
            message: "Unauthorized",
            error: "Unauthorized Access",
        });
    }
    try {
        const verifyUser = await (0, user_1.verifyUserByDiscordId)(discordId);
        if (!verifyUser) {
            throw new Error("User not verified");
        }
        next();
    }
    catch (error) {
        console.log(error);
        try {
            await (0, user_1.resetUserAccess)(discordId);
        }
        catch (error) {
            console.log("Error resetting user: ", error);
        }
        return res.status(401).json({
            message: "Unauthorized",
            error: "Unauthorized Access",
        });
    }
};
exports.verifyUserAccess = verifyUserAccess;
//# sourceMappingURL=auth.js.map