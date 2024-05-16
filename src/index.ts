// import { Program, AnchorProvider, setProvider, Wallet } from '@coral-xyz/anchor';
// import { Connection, Keypair, PublicKey } from '@solana/web3.js';
// import base58 from "bs58";
// import { createAssociatedTokenAccount, findAssociatedTokenAddress, checkAssociatedTokenAcount } from './utils/utils.js';
// import { BN } from 'bn.js';
// import idl from './constants/idl.js';
import { PUMP_FUN_PROGRAM_ID, TOKEN_MINT_ADDRESS } from './constants/constants.js';

import { config } from 'dotenv';
import { buyTransaction } from './utils/swapTransactions';
config();

const main = async() => {
  await buyTransaction(process.env.PRIVATE_KEY, TOKEN_MINT_ADDRESS);
}

main();

// const programId = new PublicKey(PUMP_FUN_PROGRAM_ID);
// const secretKey = base58.decode(process.env.PRIVATE_KEY);
// const owner = Keypair.fromSecretKey(secretKey);
// const wallet = new Wallet(Keypair.fromSecretKey(secretKey));
// const mint = new PublicKey(TOKEN_MINT_ADDRESS);

// const r = findAssociatedTokenAddress(wallet.publicKey, mint);

// const connection = new Connection('https://api.mainnet-beta.solana.com');
// const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions());
// setProvider(provider);

// const program = new Program(idl, programId, provider);
// const associatedAddress = await createAssociatedTokenAccount(connection, owner, mint);
// console.log(associatedAddress);

// const instruction = await program.methods.sell(new BN(1050000), new BN(1050000)).accounts({
//   global: new PublicKey("4wTV1YmiEkRvAtNtsSGPtUrqRYQMe5SKy2uB4Jjaxnjf"),
//   feeRecipient: new PublicKey("CebN5WGQ4jvEPvsVU4EoHEpgzq1VV7AbicfhtW4xC9iM"),
//   mint: mint,
//   bondingCurve: new PublicKey('r3ygrmCSSeJJ1aG4fSSkP32Gs6DaoaFxhm6gTLsqZkT'),
//   associatedBondingCurve: new PublicKey('qspKpm7V55oXE8G6vWzrJeuhvJnJX4w1BMVt3cuLjsT'),
//   associatedUser: r,
//   user: owner.publicKey,
//   systemProgram: new PublicKey("11111111111111111111111111111111"),
//   tokenProgram: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
//   rent: new PublicKey("SysvarRent111111111111111111111111111111111"),
//   eventAuthority: PublicKey.findProgramAddressSync([Buffer.from("__event_authority")], programId)[0],
//   program: programId
// }).rpc();

// console.log(instruction);

// function Buy_createTransactionInstruction(signerPublicKey, // Public key of the signer account
// programPublicKey, // Public key of the program to interact with
// associatedTokenPublicKey, // Public key of the associated token account
// mintPublicKey) {
//     const accounts = [
//         {
//             pubkey: signerPublicKey,
//             isSigner: true,
//             isWritable: true,
//         },
//         {
//             pubkey: programPublicKey,
//             isSigner: false,
//             isWritable: false,
//         },
//         {
//             pubkey: associatedTokenPublicKey,
//             isSigner: false,
//             isWritable: true,
//         },
//         {
//             pubkey: mintPublicKey,
//             isSigner: false,
//             isWritable: false,
//         },
//         {
//             pubkey: SystemProgram.programId,
//             isSigner: false,
//             isWritable: false,
//         },
//         {
//             pubkey: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"), // Assuming this is assigned elsewhere
//             isSigner: false,
//             isWritable: false,
//         },
//     ];
//     const data = Buffer.alloc(0);
//     return new TransactionInstruction({
//         keys: accounts,
//         programId: new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"),
//         data,
//     });
// }
// const instructions = [];
// instructions.push(Buy_createTransactionInstruction(owner.publicKey, r, owner.publicKey, new PublicKey('9LFUtDdTqtnT1cp4FAkeNeGMrkmfrCvWiqpJHUtkHPrG')));
// instructions.push(instruction);
// console.log(instructions);
// const blockhash = await connection.getLatestBlockhash("finalized");
// console.log(blockhash);

// const final_tx = new VersionedTransaction(new TransactionMessage({
//   payerKey: owner.publicKey,
//   recentBlockhash: blockhash.blockhash,
//   instructions: instructions
// }).compileToV0Message());

// final_tx.sign([wallet.payer]);

// console.log(final_tx);

// const txid = await connection.sendTransaction(final_tx, {
//   skipPreflight: true,
// });

// await connection.confirmTransaction(txid);

// console.log(txid);