import { BlockfrostProvider, serializeRewardAddress } from "@meshsdk/core";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

const blockfrostKeyResourceName =
  process.env.BLOCKFROST_KEY_SECRET_RESOURCE_NAME!;
const sidanPoolId = process.env.NEXT_PUBLIC_SIDAN_POOL_ID!;
const sidanDRepId = process.env.NEXT_PUBLIC_SIDAN_DREP_ID!;

if (!blockfrostKeyResourceName) {
  throw new Error(
    "Environment variable BLOCKFROST_KEY_SECRET_RESOURCE_NAME is not set"
  );
}

/**
 * Fetch the secret value from GCP Secret Manager.
 *
 * @return {Promise<string>} The secret value.
 */

// Instantiates a client
const secretmanagerClient = new SecretManagerServiceClient();

async function callAccessSecretVersion() {
  try {
    // Access the secret
    const [accessResponse] = await secretmanagerClient.accessSecretVersion({
      name: blockfrostKeyResourceName,
    });

    // Extract the secret payload
    const payload = accessResponse.payload?.data?.toString();
    if (!payload) {
      throw new Error("Secret payload is empty");
    }
    console.log("BLOCKFROST_KEY:", payload);
    return payload;
  } catch (error) {
    console.error("Error accessing secret:", error.message);
    throw new Error(
      `Failed to fetch secret (${blockfrostKeyResourceName}) from GCP Secret Manager: ${error.message}`
    );
  }
}

// Fetch the Blockfrost API key and initialize the blockchain provider
let blockchainProvider: BlockfrostProvider | null = null;

async function getBlockchainProvider(): Promise<BlockfrostProvider> {
  if (!blockchainProvider) {
    const blockfrostApiKey = await callAccessSecretVersion();
    blockchainProvider = new BlockfrostProvider(blockfrostApiKey);
  }
  return blockchainProvider;
}

/**
 * Check the delegation status of the wallet address, whether it is staked to the pool and delegated to the DRep.
 *
 * @param {String} walletAddress - Wallet address
 * @return {Object} - { isRegistered: `boolean`, isStaked: `boolean`, isDRepDelegated: `boolean` }
 */
export const checkIfStaked = async (walletAddress: string) => {
  try {
    const blockchainProvider = await getBlockchainProvider();
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
