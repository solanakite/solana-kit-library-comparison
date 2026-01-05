import {
  airdropFactory,
  createSolanaClient,
  createTransaction,
  generateKeyPairSigner,
  lamports,
} from "gill";
import { getAddMemoInstruction } from "gill/programs";

const user = await generateKeyPairSigner();

const SOL = 1_000_000_000n;

const memoInstruction = getAddMemoInstruction({
  memo: "hello world!",
});

const { rpc, rpcSubscriptions, sendAndConfirmTransaction } = createSolanaClient(
  {
    urlOrMoniker: "devnet",
  }
);

const slot = await rpc.getSlot().send();

const airdrop = airdropFactory({ rpc, rpcSubscriptions });

await airdrop({
  commitment: "confirmed",
  lamports: lamports(1n * SOL),
  recipientAddress: user.address,
});

const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

const transaction = createTransaction({
  version: "legacy",
  feePayer: user,
  instructions: [memoInstruction],
  latestBlockhash,
  computeUnitLimit: 5000,
  computeUnitPrice: 1000,
});

const signature = await sendAndConfirmTransaction(transaction);

console.log(signature);
