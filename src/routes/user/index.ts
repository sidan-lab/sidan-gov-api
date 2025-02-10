import express from "express";
import {
  getUserByDiscordIdController,
  getUsersController,
  userSignInController,
  verifyUserController,
} from "../../controllers/user";
import verifyAdminAccess from "../../middleware/admin";
import verifyUserAccess from "../../middleware/auth";

const userRouter = express.Router();

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get all users
 *     description: Get all users from the database
 *     parameters:
 *        - name: discord-id
 *          in: header
 *          required: true
 *          description: discord id of the admin
 *          type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved a list of users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ArrayOfUsers'
 *       400:
 *         description: Bad request
 */
userRouter.use(verifyAdminAccess).get("/", getUsersController);

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get user by id
 *     description: Get user by id from the database
 *     parameters:
 *        - name: discord-id
 *          in: header
 *          required: true
 *          description: discord id of the admin
 *          type: string
 *        - in: path
 *          name: userId
 *          schema:
 *              type: string
 *          required: true
 *          description: The id of the user to get
 *     responses:
 *       200:
 *         description: Successfully retrieved user by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SingleUser'
 *       400:
 *         description: Bad request
 */
userRouter
  .use(verifyAdminAccess)
  .get("/:discordId", getUserByDiscordIdController);

/**
 * @swagger
 * /user/signIn:
 *   get:
 *     summary: sign in user
 *     description: Create a new jwt token for user. Update user if exist or create a new user if not exist
 *     requestBody:
 *        descriptions: User Create Object
 *        required: true
 *        content:
 *          application/json:
 *           schema:
 *            $ref: '#/components/schemas/UserCreateDto'
 *     responses:
 *       200:
 *         description: Successfully retrieved user by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SingleUser'
 *       400:
 *         description: Bad request
 */
userRouter.post("/signIn", userSignInController);

/**
 * @swagger
 * /user/verify:
 *   get:
 *     summary: Verify user by discord id
 *     description: Create a new jwt token for user. Update user if exist or create a new user if not exist
 *     parameters:
 *        - name: discord-id
 *          in: header
 *          required: true
 *          description: discord id of the user
 *          type: string
 *     responses:
 *       200:
 *         description: Successfully verified user by discord id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VerifyUserResponse'
 *       400:
 *         description: Bad request
 */
userRouter.use(verifyUserAccess).post("/verify", verifyUserController);

/**
 * @swagger
 * /user/verify:
 *   get:
 *     summary: Verify admin by discord id
 *     description: Verify whether the user is an admin or not
 *     parameters:
 *        - name: discord-id
 *          in: header
 *          required: true
 *          description: discord id of the admin
 *          type: string
 *     responses:
 *       200:
 *         description: Successfully verified user by discord id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VerifyUserResponse'
 *       400:
 *         description: Bad request
 */
userRouter.use(verifyAdminAccess).post("/verify-admin", verifyUserController);

export default userRouter;
