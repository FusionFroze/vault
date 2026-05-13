import crypto from "node:crypto";

export default async function encrypt(masterPassword, salt, plainString) {
  const key = crypto.scryptSync(masterPassword, salt, 32, {
    N: 131072,
    r: 8,
    p: 1,
    maxmem: 150 * 1024 * 1024, // Memory limit of 128MB is getting exceeded
  });

  const iv = crypto.randomBytes(12).toString("hex");
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

  let encrypted = cipher.update(plainString, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag().toString("hex");

  return { encrypted, iv, authTag };
}
