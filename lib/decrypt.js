import crypto from "node:crypto";
import chalk from "chalk";

export default async function decrypt(
  masterPassword,
  salt,
  iv,
  authTag,
  cipherText,
) {
  const key = crypto.scryptSync(masterPassword, salt, 32, {
    N: 131072,
    r: 8,
    p: 1,
    maxmem: 150 * 1024 * 1024,
  });

  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);

  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(cipherText, "hex", "utf8");

  try {
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (err) {
    console.error(
      chalk.red(`Operation failed: incorrect password or corrupted data.`),
    );

    process.exit(1);
  }
}
