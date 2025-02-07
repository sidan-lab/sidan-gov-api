"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenByDiscordIdController = exports.verifyUserController = exports.userSignInController = exports.getUserByDiscordIdController = exports.getUsersController = void 0;
const user_1 = require("../../services/user");
const getUsersController = async (_, res) => {
    try {
        const result = await (0, user_1.getUsers)();
        return res.json({
            message: "success",
            data: {
                users: result,
            },
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "error",
            error: error.message,
        });
    }
};
exports.getUsersController = getUsersController;
const getUserByDiscordIdController = async (req, res) => {
    const { discordId } = req.params;
    try {
        const result = await (0, user_1.getUserByDiscordId)(discordId);
        return res.json({
            message: "success",
            data: {
                user: result,
            },
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "error",
            error: error.message,
        });
    }
};
exports.getUserByDiscordIdController = getUserByDiscordIdController;
const userSignInController = async (req, res) => {
    const requestBody = req.body;
    try {
        const result = await (0, user_1.signIn)(requestBody);
        return res.json({
            message: "success",
            data: {
                result,
            },
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "error",
            error: error.message,
        });
    }
};
exports.userSignInController = userSignInController;
const verifyUserController = async (_, res) => {
    try {
        return res.json({
            message: "success",
            data: {
                verified: true,
            },
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "error",
            error: error.message,
        });
    }
};
exports.verifyUserController = verifyUserController;
const getTokenByDiscordIdController = async (req, res) => {
    const { discordId } = req.params;
    try {
        const result = await (0, user_1.getUserByDiscordId)(discordId);
        return res.json({
            message: "success",
            data: {
                user: result,
            },
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "error",
            error: error.message,
        });
    }
};
exports.getTokenByDiscordIdController = getTokenByDiscordIdController;
//# sourceMappingURL=index.js.map