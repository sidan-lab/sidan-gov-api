export type AdminUser = {
  wallet_address: string;
};

// Read admin wallet addresses from environment variables
export const adminAccessList: AdminUser[] = [];

// Parse the comma-separated list of wallet addresses
const adminWallets = process.env.ADMIN_WALLET_ADDRESSES;
if (adminWallets) {
  const walletAddresses = adminWallets.split(";");

  walletAddresses.forEach((address) => {
    if (address.trim()) {
      adminAccessList.push({
        wallet_address: address.trim(),
      });
    }
  });
}
