import { conf } from "../lib/conf.js";
import chalk from "chalk";
import { password } from "@inquirer/prompts";
import checkPassword from "../lib/checkPassword.js";
import crypto from "node:crypto";
import { verificationString } from "../lib/checkPassword.js";
import encrypt from "../lib/encrypt.js";
import isInitialized from "../lib/isInitialized.js";
import yoctoSpinner from "yocto-spinner";
import decrypt from "../lib/decrypt.js";

async function changePassword() {
  const fileData = isInitialized();

  const masterPassword = await password({
    message: "Enter vault's current password:",
    mask: true,
  });
  await checkPassword(masterPassword);

  const newPassword = await password({
    message: "Enter new password:",
    mask: true,
  });
  let newPasswordConfirmation = await password({
    message: "Confirm new password:",
    mask: true,
  });
  while (newPassword !== newPasswordConfirmation) {
    newPasswordConfirmation = await password({
      message: "Passwords do not match. Try again:",
      mask: true,
    });
  }

  if (newPassword === masterPassword) {
    console.log(
      chalk.green(
        "New password is the same as the current password. Nothing changed!",
      ),
    );
    process.exit(0);
  }

  const spinner = yoctoSpinner();
  spinner.start("Changing vault's password...");

  const oldSalt = fileData["salt"];
  const newSalt = crypto.randomBytes(16).toString("hex");

  // 'v' for 'verifier'
  const {
    encrypted: vEncrypted,
    iv: vIv,
    authTag: vAuthTag,
  } = await encrypt(newPassword, newSalt, verificationString);

  spinner.stop();
  spinner.start(chalk.green("Re-encrypting all entries..."));

  const reencryptedEntries = await Promise.all(
    fileData["entries"].map(async (entry) => {
      const oldAuthTag = Buffer.from(entry["tag"], "hex");
      const plainText = await decrypt(
        masterPassword,
        oldSalt,
        entry["iv"],
        oldAuthTag,
        entry["cipherText"],
      );

      const { encrypted, iv, authTag } = await encrypt(
        newPassword,
        newSalt,
        plainText,
      );

      return {
        identifier: entry["identifier"],
        iv: iv,
        tag: authTag,
        cipherText: encrypted,
      };
    }),
  );

  conf.set({
    salt: newSalt,
    verifier: {
      iv: vIv,
      tag: vAuthTag,
      cipherText: vEncrypted,
    },
    entries: reencryptedEntries,
  });

  spinner.stop();

  console.log(
    chalk.green("Vault's master password has been changed successfully!"),
  );
}

export default async function passwd() {
  try {
    await changePassword();
  } catch (error) {
    if (error instanceof Error && error.name === "ExitPromptError") {
      console.error("Operation aborted.");
    } else {
      throw error;
    }
  }
}
