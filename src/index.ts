import { PUMP_FUN_PROGRAM_ID, TOKEN_MINT_ADDRESS } from './constants/constants.js';

import { config } from 'dotenv';
import { buyTransaction, sellTransaction } from './utils/swapTransactions';
config();

const main = async() => {
  await buyTransaction(process.env.PRIVATE_KEY, TOKEN_MINT_ADDRESS);
  await sellTransaction(process.env.PRIVATE_KEY, TOKEN_MINT_ADDRESS);
}

main();