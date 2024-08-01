import wallet from "../wba-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createMetadataAccountV3,
  CreateMetadataAccountV3InstructionAccounts,
  CreateMetadataAccountV3InstructionArgs,
  DataV2Args,
  findMetadataPda,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  createSignerFromKeypair,
  signerIdentity,
  publicKey,
} from "@metaplex-foundation/umi";
import { PublicKey } from "@solana/web3.js";
import base58 from "bs58";

// Define our Mint address
const mint = publicKey("CfmVE9LQqRAHmSGDVkUoRbtiHbPKERUDaZ7Skw8DT4zN");

// Create a UMI connection
const umi = createUmi("https://api.devnet.solana.com");
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));

(async () => {
  try {
    // Start here
    const metadataPda = findMetadataPda(umi, { mint });
    let accounts: CreateMetadataAccountV3InstructionAccounts = {
      mint,
      mintAuthority: signer,
      metadata: metadataPda,
      payer: signer,
      updateAuthority: signer.publicKey,
    };

    let data: DataV2Args = {
      name: "WBA JOEY",
      symbol: "WBA",
      uri: "https://arweave.net/1234",
      sellerFeeBasisPoints: 0,
      collection: null,
      creators: null,
      uses: null,
    };

    let args: CreateMetadataAccountV3InstructionArgs = {
      data,
      collectionDetails: null,
      isMutable: true,
    };

    let tx = createMetadataAccountV3(umi, {
      ...accounts,
      ...args,
    });

    let result = await tx.sendAndConfirm(umi);
    console.log(base58.encode(result.signature));
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
