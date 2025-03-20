import { Prisma, User } from "@prisma/client";
import jwt from "jsonwebtoken";
import { adminAccessList } from "../../data/admins";
import prisma from "../../database";
import { checkIfStaked } from "../../libs/cardano";

const jwtSecret = process.env.JWT_SECRET!;

/**
 * Get Users
 *
 * Get all users in the database
 *
 * @return {Array} users - Array of user objects
 */
export const getUsers = async () => {
  let result: Partial<User>[] = [];

  const users = await prisma.user.findMany();

  if (users) {
    result = users.map((user) => {
      const { jwt, ...rest } = user;
      return rest;
    });
  }

  return result;
};

/**
 * Get User By Discord Id
 *
 * Get a user in the database by Discord ID
 *
 * @param {String} discordId - Discord ID of the user
 * @return {Object} user - User object
 */
export const getUserByDiscordId = async (discordId: string) => {
  let result: Partial<User> | null = null;

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
  } catch (error) {
    console.log("Error getting user: ", error.message);
    throw new Error("Error getting user");
  }
};

/**
 * Generate JWT Token
 *
 * Generates a new JWT token for the user
 *
 * @param {String} discord_id - Discord ID of the user
 * @return {String} token - JWT token
 */
const generateJwtToken = async (discord_id: string) => {
  const payload = {
    discord_id,
  };

  const token = jwt.sign(payload, jwtSecret, {
    expiresIn: "90d",
  });

  return token;
};

/**
 * Create User
 *
 * Creates a new user in the database. Used when the user signs in for the first time.
 *
 * @param {Object} user - User object
 * @return {Object} user - User object
 */
export const createUser = async (user: Prisma.UserCreateInput) => {
  let result: User | null = null;

  const data = Prisma.validator<Prisma.UserCreateInput>()(user);
  result = await prisma.user.create({
    data,
  });

  return result;
};

/**
 * Update User
 *
 * Updates the user in the database. Used when the user signs in again.
 *
 * @param {Object} user - User object
 * @return {Object} user - User object
 */
export const updateUser = async (id: string, user: Prisma.UserUpdateInput) => {
  let result: User | null = null;

  const data = Prisma.validator<Prisma.UserUpdateInput>()(user);

  result = await prisma.user.update({
    where: {
      id,
    },
    data,
  });

  return result;
};

/**
 * User Sign In
 *
 * Signs in the user by creating a new user or updating the existing user with the jwt token
 *
 * @param {Object} user - User object
 * @return {String} message - Success message
 */
export const signIn = async (user: Prisma.UserCreateInput) => {
  try {
    if (!user || Object.keys(user).length === 0) {
      throw new Error("Invalid user data.");
    }

    const data = Prisma.validator<Prisma.UserCreateInput>()(user);

    const token = await generateJwtToken(data.discord_id);

    const findUser = await prisma.user.findUnique({
      where: {
        discord_id: data.discord_id,
      },
    });

    if (findUser) {
      await updateUser(findUser.id, {
        jwt: token,
        ...data,
      });
    } else {
      await createUser({
        jwt: token,
        ...data,
      });
    }

    return "User signed in successfully.";
  } catch (error) {
    console.log("Error signing in: ", error.message);
    throw new Error("Error signing in");
  }
};

/**
 * Verify User By Discord Id
 *
 * Verifies if the user is registered, staked, and DRep delegated by checking the user's wallet address in the blockchain
 *
 * @param {String} discordId - Discord ID of the user
 * @return {Boolean} `true` if user is admin, `false` otherwise
 */
export const verifyUserByDiscordId = async (discordId: string) => {
  const isAdmin = await verifyAdminByDiscordId(discordId);

  if (isAdmin) {
    return true;
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        discord_id: discordId,
      },
    });

    if (user) {
      const token = user.jwt;

      if (!token) {
        throw new Error("User not found");
      }

      const info = await checkIfStaked(user.wallet_address as string);

      const { isRegistered, isStaked, isDRepDelegated } = info;

      if (!isRegistered || !isStaked || !isDRepDelegated) {
        throw new Error("Invalid Access");
      }

      return true;
    }
  } catch (error) {
    try {
      await resetUserAccess(discordId as string);
    } catch (error) {
      console.log("Error resetting user access: ", error);
    }
    console.log("Error verifying user: ", error.message);
    throw new Error("Error verifying user");
  }
};

/**
 * Verify Admin By Discord Id
 *
 * Verifies if the user is an admin by comparing user's wallet address with the admin access list
 *
 * @param {String} discordId - Discord ID of the user
 * @return {Boolean} isAdmin - true if user is admin, false otherwise
 */

export const verifyAdminByDiscordId = async (discordId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        discord_id: discordId,
      },
    });

    if (!user) {
      throw new Error("User not exist.");
    }

    const isAdmin = adminAccessList.some(
      (admin) => admin.wallet_address === user.wallet_address
    );

    return isAdmin;
  } catch (error) {
    console.log("Error verifying admin: ", error.message);
    throw new Error("Error verifying admin");
  }
};

/**
 * Reset User Access
 *
 * Reset user access by setting DRep delegation and staking status to false, and jwt to null. Used when authentication fails.
 *
 * @param {String} discordId  - Discord ID of the user
 * @return {Object} user - User object after reset
 */

export const resetUserAccess = async (discordId: string) => {
  const user = await prisma.user.update({
    where: {
      discord_id: discordId,
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
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  signIn,
  getUserByDiscordId,
  verifyAdminByDiscordId,
  verifyUserByDiscordId,
  resetUserAccess,
};
