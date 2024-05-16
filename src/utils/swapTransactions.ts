import { Program, AnchorProvider, setProvider, Wallet } from '@coral-xyz/anchor';
import { Connection, Keypair, PublicKey, VersionedTransaction, TransactionMessage } from '@solana/web3.js';
import base58 from "bs58";
import { createAssociatedTokenAccount, findAssociatedTokenAddress, getDetailsFromTokenMint } from './utils';
import { BN } from 'bn.js';
import idl from '../constants/idl';
import { PUMP_FUN_PROGRAM_ID, TOKEN_MINT_ADDRESS } from '../constants/constants';

const buyTransaction = async (walletSecretKey: string, mintAddress: string) => {
  const programId = new PublicKey(PUMP_FUN_PROGRAM_ID);
  const secretKey = base58.decode(walletSecretKey);
  const owner = Keypair.fromSecretKey(secretKey);
  const wallet = new Wallet(Keypair.fromSecretKey(secretKey));
  const mint = new PublicKey(mintAddress);

  const {bondingCurve, associatedBondingCurve} = await getDetailsFromTokenMint(mintAddress);

  const r = findAssociatedTokenAddress(wallet.publicKey, mint);

  const connection = new Connection('https://api.mainnet-beta.solana.com');
  const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions());
  setProvider(provider);

  const program = new Program(idl, programId, provider);
  const associatedAddress = await createAssociatedTokenAccount(connection, owner, mint);
  console.log(`Associated Address: ${associatedAddress}`);

  const instruction = await program.methods.buy(new BN(1500000), new BN(0)).accounts({
    global: new PublicKey("4wTV1YmiEkRvAtNtsSGPtUrqRYQMe5SKy2uB4Jjaxnjf"),
    feeRecipient: new PublicKey("CebN5WGQ4jvEPvsVU4EoHEpgzq1VV7AbicfhtW4xC9iM"),
    mint: mint,
    bondingCurve: new PublicKey(bondingCurve),
    associatedBondingCurve: new PublicKey(associatedBondingCurve),
    associatedUser: r,
    user: owner.publicKey,
    systemProgram: new PublicKey("11111111111111111111111111111111"),
    tokenProgram: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    rent: new PublicKey("SysvarRent111111111111111111111111111111111"),
    eventAuthority: PublicKey.findProgramAddressSync([Buffer.from("__event_authority")], programId)[0],
    program: programId
  }).instruction();

  const instructions = [];
  instructions.push(instruction);
  const blockhash = await connection.getLatestBlockhash("finalized");
  const final_tx = new VersionedTransaction(new TransactionMessage({
    payerKey: owner.publicKey,
    recentBlockhash: blockhash.blockhash,
    instructions: instructions
  }).compileToV0Message());

  final_tx.sign([wallet.payer]);

  const txid = await connection.sendTransaction(final_tx, {
    skipPreflight: true,
  });

  await connection.confirmTransaction(txid);

  console.log(txid);
};

const sellTransaction = async (walletSecretKey: string, mintAddress: string) => {
  const programId = new PublicKey(PUMP_FUN_PROGRAM_ID);
  const secretKey = base58.decode(walletSecretKey);
  const owner = Keypair.fromSecretKey(secretKey);
  const wallet = new Wallet(Keypair.fromSecretKey(secretKey));
  const mint = new PublicKey(mintAddress);

  const {bondingCurve, associatedBondingCurve} = await getDetailsFromTokenMint(mintAddress);

  const r = findAssociatedTokenAddress(wallet.publicKey, mint);

  const connection = new Connection('https://api.mainnet-beta.solana.com');
  const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions());
  setProvider(provider);

  const program = new Program(idl, programId, provider);
  const associatedAddress = await createAssociatedTokenAccount(connection, owner, mint);
  console.log(`Associated Address: ${associatedAddress}`);

  const instruction = await program.methods.sell(new BN(1500000), new BN(0)).accounts({
    global: new PublicKey("4wTV1YmiEkRvAtNtsSGPtUrqRYQMe5SKy2uB4Jjaxnjf"),
    feeRecipient: new PublicKey("CebN5WGQ4jvEPvsVU4EoHEpgzq1VV7AbicfhtW4xC9iM"),
    mint: mint,
    bondingCurve: new PublicKey(bondingCurve),
    associatedBondingCurve: new PublicKey(associatedBondingCurve),
    associatedUser: r,
    user: owner.publicKey,
    systemProgram: new PublicKey("11111111111111111111111111111111"),
    tokenProgram: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    rent: new PublicKey("SysvarRent111111111111111111111111111111111"),
    eventAuthority: PublicKey.findProgramAddressSync([Buffer.from("__event_authority")], programId)[0],
    program: programId
  }).instruction();

  const instructions = [];
  instructions.push(instruction);
  const blockhash = await connection.getLatestBlockhash("finalized");
  const final_tx = new VersionedTransaction(new TransactionMessage({
    payerKey: owner.publicKey,
    recentBlockhash: blockhash.blockhash,
    instructions: instructions
  }).compileToV0Message());

  final_tx.sign([wallet.payer]);

  const txid = await connection.sendTransaction(final_tx, {
    skipPreflight: true,
  });

  await connection.confirmTransaction(txid);

  console.log(txid);
};

export {
  buyTransaction,
  sellTransaction
}