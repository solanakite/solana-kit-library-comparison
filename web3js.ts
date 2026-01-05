
import {
  Connection,
  Keypair,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";

const connection = new Connection("https://api.devnet.solana.com", "confirmed");

const user = Keypair.generate();

const currentBalance = await connection.getBalance(user.publicKey, "finalized");

const airdropAmount = 1 * LAMPORTS_PER_SOL;

if (currentBalance < airdropAmount) {
  const airdropSignature = await connection.requestAirdrop(
    user.publicKey,
    airdropAmount
  );
  await connection.confirmTransaction(airdropSignature, "finalized");
}

const memoProgramId = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");

const memoInstruction = new TransactionInstruction({
  keys: [],
  programId: memoProgramId,
  data: Buffer.from("hello world!", "utf-8"),
});

const transaction = new Transaction().add(memoInstruction);

const signature = await sendAndConfirmTransaction(
  connection,
  transaction,
  [user],
  {
    commitment: "confirmed",
    skipPreflight: true,
  }
);

console.log(signature);
