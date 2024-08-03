import wallet from "../wba-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createGenericFile,
  createSignerFromKeypair,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";

// Create a devnet connection
const umi = createUmi("https://api.devnet.solana.com");

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
  try {
    // Follow this JSON structure
    // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure

    const image =
      " https://arweave.net/NyvwrRokagkqOd6sDwHhsrAjx9sJiNR8NJ5x8F0rrsg";
    const metadata = {
      name: "Joey RUG",
      symbol: "RUG",
      description: "This is a rug beware of it",
      image,
      attributes: [{ trait_type: "Rugness", value: "High" }],
      properties: {
        files: [
          {
            type: "image/png",
            uri: image,
          },
        ],
      },
      creators: [],
    };
    const metadataBuffer = Buffer.from(JSON.stringify(metadata));
    const file = createGenericFile(metadataBuffer, "metadata.json", {
      contentType: "application/json",
    });
    const [myUri] = await umi.uploader.upload([file]);
    console.log("Your URI: ", myUri);
  } catch (error) {
    console.log("Oops.. Something went wrong", error);
  }
})();
