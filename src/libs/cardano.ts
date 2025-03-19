import { BlockfrostProvider, serializeRewardAddress } from "@meshsdk/core";

const blockfrostApiKey = process.env.BLOCKFROST_KEY!;

const sidanPoolId = process.env.NEXT_PUBLIC_SIDAN_POOL_ID!;
const sidanDRepId = process.env.NEXT_PUBLIC_SIDAN_DREP_ID!;

const blockchainProvider = new BlockfrostProvider(blockfrostApiKey);

/**
 * Check the delegation status of the wallet address, whether it is staked to the pool and delegated to the DRep.
 *
 * @param {String} walletAddress - Wallet address
 * @return {Object} - { isRegistered: `boolean`, isStaked: `boolean`, isDRepDelegated: `boolean` }
 */
export const checkIfStaked = async (walletAddress: string) => {
  try {
    const addressInfo = await blockchainProvider.get(
      `/addresses/${walletAddress}`
    );
    const { stake_address: stakeAddress } = addressInfo;

    if (!stakeAddress) {
      return {
        isRegistered: false,
        isStaked: false,
        isDRepDelegated: false,
      };
    }

    const info = await blockchainProvider.get(`/accounts/${stakeAddress}`);

    const { active, pool_id, drep_id } = info;
    return {
      isRegistered: active,
      isStaked: pool_id === sidanPoolId,
      isDRepDelegated: drep_id === sidanDRepId,
    };
  } catch (error) {
    console.log("Error validating address stake status: ", error.message);
    throw new Error("Error validating address stake status: ", error.message);
  }
};
