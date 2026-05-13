import { input, password } from "@inquirer/prompts";
import chalk from "chalk";
import { conf } from "../lib/conf.js";
import checkPassword, { verificationString } from "../lib/checkPassword.js";
import crypto from "node:crypto";
import encrypt from "../lib/encrypt.js";
import decrypt from "../lib/decrypt.js";
import isInitialized from "../lib/isInitialized.js";

async function executeAddition() {
  const fileData = isInitialized();

  const masterPassword = await password({
    message: "Enter vault's master password:",
    mask: true,
  });

  await checkPassword(masterPassword);

  let identifier = await input({
    message: "Identifier of the new password/secret:",
  });

  const identifierArray = fileData["entries"].map((id) => id["identifier"]);

  while (identifierArray.includes(identifier)) {
    console.error(
      chalk.red(
        `The identifier is already in use. You can run ${chalk.white.bold("vault ls")} to see the list of all identifiers.`,
      ),
    );

    identifier = await input({ message: "Try another one:" });
  }

  const secret = await password({ message: "Password/Secret:", mask: true });

  const { encrypted, iv, authTag } = await encrypt(
    masterPassword,
    fileData.salt,
    secret,
  );

  const obj = {
    identifier: identifier,
    iv: iv,
    tag: authTag,
    cipherText: encrypted,
  };

  fileData["entries"].push(obj);

  conf.set("entries", fileData["entries"]);
  console.log(chalk.green("Your password has been added to the vault"));
}

export default async function add() {
  try {
    await executeAddition();
  } catch (error) {
    if (error instanceof Error && error.name === "ExitPromptError") {
      console.error("Operation aborted.");
    } else {
      throw error;
    }
  }
}
