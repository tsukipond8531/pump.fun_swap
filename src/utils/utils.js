import { Keypair, PublicKey } from '@solana/web3.js';
import { Token, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import dotenv from "dotenv";

dotenv.config();

/**
 * 
 * @param {*} connection : Connection
 * @param {*} walletPublicKey : PublicKey
 * @param {*} tokenMintAddress : PublicKey
 * @returns Boolean
 */
const checkAssociatedTokenAcount = async (connection, walletPublicKey, tokenMintAddress) => {
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
const createAssociatedTokenAccount = async (connection, owner, mintPublicKey) => {
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
const findAssociatedTokenAddress = (walletAddress, tokenMintAddress) => {
  const [result] = PublicKey.findProgramAddressSync([
    walletAddress.toBuffer(),
    TOKEN_PROGRAM_ID.toBuffer(),
    tokenMintAddress.toBuffer()
  ], ASSOCIATED_TOKEN_PROGRAM_ID);
  return result;
};

export {
  createAssociatedTokenAccount,
  findAssociatedTokenAddress,
  checkAssociatedTokenAcount
};
