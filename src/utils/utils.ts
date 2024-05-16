import { Keypair, PublicKey, Connection } from '@solana/web3.js';
import { Token, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';

/**
 * 
 * @param {*} connection : Connection
 * @param {*} walletPublicKey : PublicKey
 * @param {*} tokenMintAddress : PublicKey
 * @returns Boolean
 */
const checkAssociatedTokenAcount = async (connection: Connection, walletPublicKey: PublicKey, tokenMintAddress: PublicKey) => {
  try {
    // Get the associated token address for your wallet and token mint
    const associatedTokenAddress = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      tokenMintAddress,
      walletPublicKey
    );

    // Get account info
    const accountInfo = await connection.getAccountInfo(associatedTokenAddress);

    if (accountInfo) {
      return associatedTokenAddress.toBase58();
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error checking associated token account:', error);
  }
};

/**
 * Create Associated Token Account
 * @param {*} connection : Connection
 * @param {*} owner : Keypair
 * @returns {*} address : String
 */
const createAssociatedTokenAccount = async (connection: Connection, owner: Keypair, mintPublicKey: PublicKey) => {
  // Get the associated token account address for the wallet
  const associatedTokenAddress = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    mintPublicKey,
    owner.publicKey
  );
  
  // Check if the associated token account already exists
  const associatedTokenAccountInfo = await connection.getAccountInfo(associatedTokenAddress);
  const mint = new Token(connection, mintPublicKey, TOKEN_PROGRAM_ID, owner );
  
  if (!associatedTokenAccountInfo) {
    // Create the associated token account if it doesn't exist
    await mint.createAssociatedTokenAccount(owner.publicKey);
  } 
  return associatedTokenAddress.toBase58();
};

/**
 * 
 * @param {*} walletAddress : PublicKey
 * @param {*} tokenMintAddress : PublicKey
 * @returns 
 */
const findAssociatedTokenAddress = (walletAddress: PublicKey, tokenMintAddress: PublicKey) => {
  const [result] = PublicKey.findProgramAddressSync([
    walletAddress.toBuffer(),
    TOKEN_PROGRAM_ID.toBuffer(),
    tokenMintAddress.toBuffer()
  ], ASSOCIATED_TOKEN_PROGRAM_ID);
  return result;
};

const getDetailsFromTokenMint = async (tokenMintAddress: string) => {
  const response = await fetch(`https://client-api-2-74b1891ee9f9.herokuapp.com/coins/${tokenMintAddress}`);
  const details = await response.json();

  return {
    bondingCurve: details.bonding_curve,
    associatedBondingCurve: details.associated_bonding_curve
  };
}

export {
  createAssociatedTokenAccount,
  findAssociatedTokenAddress,
  checkAssociatedTokenAcount,
  getDetailsFromTokenMint
};
