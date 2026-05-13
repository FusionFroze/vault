import { conf } from "./conf.js";
import decrypt from "./decrypt.js";

export const verificationString =
  "NXeLwbx5fUo/oeLQqqSUCjYn4uKPo4Y8yXwIE0NUZqo=";

export default async function checkPassword(masterPassword) {
  const fileData = conf.get();

  const salt = fileData.salt;
  const iv = fileData.verifier["iv"];
  const authTag = Buffer.from(fileData.verifier["tag"], "hex");
  const cipherText = fileData.verifier["cipherText"];

  await decrypt(masterPassword, salt, iv, authTag, cipherText);
}
