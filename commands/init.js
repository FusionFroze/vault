import chalk from "chalk";
import { conf } from "../lib/conf.js";
import { password } from "@inquirer/prompts";
import crypto from "node:crypto";

import { verificationString } from "../lib/checkPassword.js";
import encrypt from "../lib/encrypt.js";

async function initialize() {
  const fileData = conf.get();

  const dataKeys = Object.keys(fileData);

  if (dataKeys.includes("salt")) {
    console.error(
      chalk.red(
        `Vault has already been initialized. Run ${chalk.white.bold("vault --help")} for usage information.`,
      ),
    );
    process.exit(1);
  }

  const masterPassword = await password({
    message: "Enter vault's master password:",
    mask: true,
  });

  if (masterPassword.length < 6) {
    console.log(
      chalk.red("Vault's master password must be at least 6 characters long."),
    );
    process.exit(1);
  }

  let masterPasswordConfirmation = await password({
    message: "Confirm the password:",
    mask: true,
  });

  while (masterPassword !== masterPasswordConfirmation) {
    console.log(chalk.red("Passwords do not match. Try again..."));

    masterPasswordConfirmation = await password({
      message: "Confirm the password:",
      mask: true,
    });
  }

  const salt = crypto.randomBytes(16).toString("hex");

  const { encrypted, iv, authTag } = await encrypt(
    masterPassword,
    salt,
    verificationString,
  );

  const obj = {
    salt: salt,
    verifier: {
      iv: iv,
      tag: authTag,
      cipherText: encrypted,
    },
    entries: [],
  };

  conf.set(obj);

  console.log(
    chalk.green(
      `Vault is ready.\n${chalk.italic("(Note: Do not forget this password. You will need this for every other operation.)")}`,
    ),
  );
}

export default async function init() {
  try {
    await initialize();
  } catch (error) {
    if (error instanceof Error && error.name === "ExitPromptError") {
      console.log(chalk.cyan("See you 🫡"));
    } else {
      throw error;
    }
  }
}
