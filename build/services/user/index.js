"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetUserAccess = exports.verifyAdminByDiscordId = exports.verifyUserByDiscordId = exports.getTokenByDiscordId = exports.signIn = exports.updateUser = exports.createUser = exports.getUserByDiscordId = exports.getUserById = exports.getUsers = void 0;
const core_1 = require("@meshsdk/core");
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const admins_1 = require("../../data/admins");
const jwtSecret = process.env.JWT_SECRET;
const blockfrostApiKey = process.env.BLOCKFROST_KEY;
const sidanPoolId = process.env.NEXT_PUBLIC_SIDAN_POOL_ID;
const sidanDRepId = process.env.NEXT_PUBLIC_SIDAN_DREP_ID;
const blockchainProvider = new core_1.BlockfrostProvider(blockfrostApiKey);
const prisma = new client_1.PrismaClient();
const getUsers = async () => {
    let result = [];
    try {
        result = await prisma.user.findMany();
    }
    catch (error) {
        console.log(error);
        throw new Error("Error fetching users.");
    }
    return result;
};
exports.getUsers = getUsers;
const getUserById = async (id) => {
    let result = null;
    try {
        result = await prisma.user.findUnique({
            where: {
                id,
            },
        });
    }
    catch (error) {
        console.log(error);
        throw new Error("User not exist.");
    }
    return result;
};
exports.getUserById = getUserById;
const getUserByDiscordId = async (discordId) => {
    let result = null;
    try {
        result = await prisma.user.findUnique({
            where: {
                discord_id: discordId,
            },
        });
        if (!result) {
            throw new Error("User not exist.");
        }
        if (result.jwt) {
            delete result.jwt;
        }
        return result;
    }
    catch (error) {
        console.log(error);
        throw new Error("User not exist.");
    }
};
exports.getUserByDiscordId = getUserByDiscordId;
const generateJwtToken = async (discord_id) => {
    const payload = {
        discord_id,
    };
    const token = jsonwebtoken_1.default.sign(payload, jwtSecret, {
        expiresIn: "90d",
    });
    return token;
};
const createUser = async (user) => {
    let result = null;
    try {
        const data = client_1.Prisma.validator()(user);
        if (!data) {
            throw new Error("Invalid user data.");
        }
        result = await prisma.user.create({
            data,
        });
    }
    catch (error) {
        console.log(error);
        throw new Error("Error creating user.");
    }
    return result;
};
exports.createUser = createUser;
const updateUser = async (id, user) => {
    let result = null;
    try {
        const data = client_1.Prisma.validator()(user);
        if (!data) {
            throw new Error("Invalid user data.");
        }
        result = await prisma.user.update({
            where: {
                id,
            },
            data,
        });
    }
    catch (error) {
        console.log(error);
        throw new Error("Error updating user.");
    }
    return result;
};
exports.updateUser = updateUser;
const signIn = async (user) => {
    try {
        const data = client_1.Prisma.validator()(user);
        if (!data) {
            throw new Error("Invalid user data.");
        }
        const token = await generateJwtToken(data.discord_id);
        const findUser = await prisma.user.findUnique({
            where: {
                discord_id: data.discord_id,
            },
        });
        if (findUser) {
            await (0, exports.updateUser)(findUser.id, {
                jwt: token,
                ...data,
            });
        }
        else {
            await (0, exports.createUser)({
                jwt: token,
                ...data,
            });
        }
        return "User signed in successfully.";
    }
    catch (error) {
        throw new Error("Error creating user.");
    }
};
exports.signIn = signIn;
const getTokenByDiscordId = async (discordId) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                discord_id: discordId,
            },
        });
        const token = user?.jwt;
        if (!token) {
            throw new Error("Token not exist.");
        }
        jsonwebtoken_1.default.verify(token, jwtSecret, async (err) => {
            if (err) {
                throw new Error("Token expired");
            }
        });
        return token;
    }
    catch (error) {
        console.log(error);
        throw new Error("Error fetching token.");
    }
};
exports.getTokenByDiscordId = getTokenByDiscordId;
const verifyUserByDiscordId = async (discordId) => {
    const isAdmin = await (0, exports.verifyAdminByDiscordId)(discordId);
    if (isAdmin) {
        return true;
    }
    const checkIfStaked = async (rewardAddress) => {
        const info = await blockchainProvider.get(`/accounts/${rewardAddress}`);
        const { active, pool_id, drep_id } = info;
        return {
            isRegistered: active,
            isStaked: pool_id === sidanPoolId,
            isDRepDelegated: drep_id === sidanDRepId,
        };
    };
    try {
        const user = await prisma.user.findUnique({
            where: {
                discord_id: discordId,
            },
        });
        if (!user) {
            throw new Error("User not exist.");
        }
        const token = user.jwt;
        if (!token) {
            throw new Error("User not found");
        }
        jsonwebtoken_1.default.verify(token, jwtSecret, async (err, payload) => {
            if (err) {
                throw new Error("Invalid Token");
            }
            const { reward_address } = payload;
            if (reward_address) {
                const info = await checkIfStaked(reward_address);
                if (!info) {
                    throw new Error("Invalid Token");
                }
                const { isRegistered, isStaked, isDRepDelegated } = info;
                if (!isRegistered || !isStaked || !isDRepDelegated) {
                    throw new Error("Invalid Access");
                }
            }
        });
        return true;
    }
    catch (error) {
        try {
            await (0, exports.resetUserAccess)(discordId);
        }
        catch (error) {
            console.log("Error resetting user: ", error);
        }
        console.log("Error verifying user: ", error);
        return false;
    }
};
exports.verifyUserByDiscordId = verifyUserByDiscordId;
const verifyAdminByDiscordId = async (discordId) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                discord_id: discordId,
            },
        });
        if (!user) {
            throw new Error("User not exist.");
        }
        const isAdmin = admins_1.adminAccessList.some((admin) => admin.wallet_address === user.wallet_address);
        return isAdmin;
    }
    catch (error) {
        console.log(error);
        throw new Error("Error verifying admin.");
    }
};
exports.verifyAdminByDiscordId = verifyAdminByDiscordId;
const resetUserAccess = async (discordId) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                discord_id: discordId,
            },
        });
        if (!user) {
            throw new Error("User not exist.");
        }
        await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                is_drep_delegated_to_sidan: false,
                is_staked_to_sidan: false,
                jwt: null,
            },
        });
        return {
            user,
            message: "User reset successfully.",
        };
    }
    catch (error) {
        console.log(error);
    }
};
exports.resetUserAccess = resetUserAccess;
module.exports = {
    getUsers: exports.getUsers,
    getUserById: exports.getUserById,
    createUser: exports.createUser,
    updateUser: exports.updateUser,
    signIn: exports.signIn,
    getTokenByDiscordId: exports.getTokenByDiscordId,
    getUserByDiscordId: exports.getUserByDiscordId,
    verifyAdminByDiscordId: exports.verifyAdminByDiscordId,
    verifyUserByDiscordId: exports.verifyUserByDiscordId,
};
//# sourceMappingURL=index.js.map