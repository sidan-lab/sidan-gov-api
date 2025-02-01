import { BlockfrostProvider } from "@meshsdk/core";
import { Prisma, PrismaClient, User } from "@prisma/client";
import jwt from "jsonwebtoken";
import { adminAccessList } from "../../data/admins";

const jwtSecret = process.env.JWT_SECRET!;

const blockfrostApiKey = process.env.BLOCKFROST_KEY!;

const sidanPoolId = process.env.NEXT_PUBLIC_SIDAN_POOL_ID!;
const sidanDRepId = process.env.NEXT_PUBLIC_SIDAN_DREP_ID!;

const blockchainProvider = new BlockfrostProvider(blockfrostApiKey);

const prisma = new PrismaClient();

export const getUsers = async () => {
  let result: User[] = [];

  try {
    result = await prisma.user.findMany();
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching users.");
  }

  return result;
};

export const getUserById = async (id: string) => {
  let result: User | null = null;

  try {
    result = await prisma.user.findUnique({
      where: {
        id,
      },
    });
  } catch (error) {
    console.log(error);
    throw new Error("User not exist.");
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
    console.log(error);
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

  try {
    const data = Prisma.validator<Prisma.UserCreateInput>()(user);

    if (!data) {
      throw new Error("Invalid user data.");
    }

    result = await prisma.user.create({
      data,
    });
  } catch (error) {
    console.log(error);
    throw new Error("Error creating user.");
  }

  return result;
};

export const updateUser = async (id: string, user: Prisma.UserUpdateInput) => {
  let result: User | null = null;

  try {
    const data = Prisma.validator<Prisma.UserUpdateInput>()(user);

    if (!data) {
      throw new Error("Invalid user data.");
    }

    result = await prisma.user.update({
      where: {
        id,
      },
      data,
    });
  } catch (error) {
    console.log(error);
    throw new Error("Error updating user.");
  }

  return result;
};

export const signIn = async (user: Prisma.UserCreateInput) => {
  try {
    const data = Prisma.validator<Prisma.UserCreateInput>()(user);

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

export const getTokenByDiscordId = async (discordId: string) => {
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

    jwt.verify(token, jwtSecret, async (err) => {
      if (err) {
        throw new Error("Token expired");
      }
    });

    return token;
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching token.");
  }
};

export const verifyUserByDiscordId = async (discordId: string) => {
  const checkIfStaked = async (rewardAddress: string) => {
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

    jwt.verify(token, jwtSecret, async (err, payload: jwt.JwtPayload) => {
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
  } catch (error) {
    try {
      await resetUserAccess(discordId as string);
    } catch (error) {
      console.log("Error resetting user: ", error);
    }
    console.log("Error verifying user: ", error);
    return false;
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
    console.log(error);
    throw new Error("Error verifying admin.");
  }
};

export const resetUserAccess = async (discordId: string) => {
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
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  signIn,
  getTokenByDiscordId,
  getUserByDiscordId,
  verifyAdminByDiscordId,
  verifyUserByDiscordId,
};
