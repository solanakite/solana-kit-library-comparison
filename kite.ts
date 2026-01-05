
import { lamports } from "@solana/kit";
import { connect, SOL } from "solana-kite";
import { getAddMemoInstruction } from "@solana-program/memo";

const connection = connect("devnet")

const user = await connection.createWallet({
  airdropAmount: lamports(1n * SOL),
})

const memoInstruction = getAddMemoInstruction({
  memo: "hello world!",
})

const signature = await connection.sendTransactionFromInstructions({
  feePayer: user,
  instructions: [memoInstruction]
});

console.log(signature)

