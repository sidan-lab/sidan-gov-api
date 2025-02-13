import { Prisma, User } from "@prisma/client";
import jwt from "jsonwebtoken";
import { adminAccessList } from "../../data/admins";
import prisma from "../../database";
import { checkIfStaked } from "../../libs/cardano";
import { jwtVerify } from "../../libs/jwt";

const jwtSecret = process.env.JWT_SECRET!;

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
    throw new Error("User not exist.");
  }
};

const generateJwtToken = async (discord_id: string) => {
  const payload = {
    discord_id,
  };

  const token = jwt.sign(payload, jwtSecret, {
    expiresIn: "90d",
  });

  return token;
};

export const createUser = async (user: Prisma.UserCreateInput) => {
  let result: User | null = null;

  const data = Prisma.validator<Prisma.UserCreateInput>()(user);
  result = await prisma.user.create({
    data,
  });

  return result;
};

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
    throw new Error("Error creating user.");
  }
};

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

      const decoded = await jwtVerify(token, jwtSecret);

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
    throw new Error("Error verifying user: ", error);
  }
};

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
    throw new Error("Error verifying admin.");
  }
};

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
