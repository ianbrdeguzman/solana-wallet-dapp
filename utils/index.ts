import {
  Cluster,
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL
} from '@solana/web3.js';
import { message } from 'antd';

const refreshBalance = async (
  network: Cluster | undefined,
  account: Keypair | null
) => {
  if (!account) return 0;

  try {
    const connection = new Connection(clusterApiUrl(network), 'confirmed');

    const publicKey = account.publicKey;

    const balance = await connection.getBalance(publicKey);

    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown Error';
    message.error(`Balance refresh failed: ${errorMessage}`);
    return 0;
  }
};

const handleAirdrop = async (
  network: Cluster = 'devnet',
  account: Keypair | null
) => {
  if (!account) return;

  try {
    const connection = new Connection(clusterApiUrl(network), 'confirmed');

    const publicKey = account.publicKey;

    const confirmation = await connection.requestAirdrop(
      publicKey,
      LAMPORTS_PER_SOL
    );

    await connection.confirmTransaction(confirmation, 'confirmed');

    return await refreshBalance(network, account);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown Error';
    message.error(`Airdrop failed: ${errorMessage}`);
  }
};

export { refreshBalance, handleAirdrop };
