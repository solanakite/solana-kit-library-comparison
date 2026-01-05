
import { createClient, requestAirdrop, lamports } from "@solana/client";
import { generateKeyPairSigner } from "@solana/kit";
import { getAddMemoInstruction } from "@solana-program/memo";

const SOL = 1_000_000_000n;

const client = createClient({
  endpoint: "https://api.devnet.solana.com",
});

const user = await generateKeyPairSigner();

await requestAirdrop(client, {
  address: user.address,
  lamports: lamports(1n * SOL),
});

const memoInstruction = getAddMemoInstruction({
  memo: "hello world!",
});

const signature = await client.transaction.prepareAndSend({
  instructions: [memoInstruction],
  authority: user,
});

console.log(signature);
