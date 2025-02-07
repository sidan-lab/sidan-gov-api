"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin_1 = require("../../middleware/admin");
const express_1 = __importDefault(require("express"));
const user_1 = require("../../controllers/user");
const auth_1 = require("../../middleware/auth");
const userRouter = express_1.default.Router();
userRouter.get("/", admin_1.verifyAdminAccess, user_1.getUsersController);
userRouter.get("/:discordId", admin_1.verifyAdminAccess, user_1.getUserByDiscordIdController);
userRouter.post("/signIn", user_1.userSignInController);
userRouter.post("/verify", auth_1.verifyUserAccess, user_1.verifyUserController);
userRouter.post("/verify-admin", admin_1.verifyAdminAccess, user_1.verifyUserController);
exports.default = userRouter;
//# sourceMappingURL=index.js.map