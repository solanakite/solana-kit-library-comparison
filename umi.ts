
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  generateSigner,
  signerIdentity,
  transactionBuilder,
  sol,
  publicKey,
} from "@metaplex-foundation/umi";

const umi = createUmi("https://api.devnet.solana.com");

const user = generateSigner(umi);

umi.use(signerIdentity(user));

const currentBalance = await umi.rpc.getBalance(user.publicKey);

const airdropAmount = sol(1);

if (currentBalance.basisPoints < airdropAmount.basisPoints) {
  await umi.rpc.airdrop(user.publicKey, airdropAmount, {
    commitment: "finalized",
  });
}

const memoProgramId = publicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");

const memoData = new Uint8Array(Buffer.from("hello world!", "utf-8"));

const memoInstruction = {
  programId: memoProgramId,
  keys: [],
  data: memoData,
};

const transaction = transactionBuilder()
  .add({
    instruction: memoInstruction,
    signers: [user],
    bytesCreatedOnChain: 0,
  });

const signature = await transaction.sendAndConfirm(umi, {
  confirm: { commitment: "confirmed" },
  send: { skipPreflight: true },
});

console.log(Buffer.from(signature.signature).toString("base58"));
