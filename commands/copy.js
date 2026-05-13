import { conf } from "../lib/conf.js";
import chalk from "chalk";
import { password } from "@inquirer/prompts";
import checkPassword from "../lib/checkPassword.js";
import clipboard from "clipboardy";
import decrypt from "../lib/decrypt.js";
import isInitialized from "../lib/isInitialized.js";

async function executeCopy(identifier) {
  const fileData = isInitialized();

  const masterPassword = await password({
    message: "Enter vault's master password:",
    mask: true,
  });
  await checkPassword(masterPassword);

  const entries = fileData["entries"];
  const requestedSecretObj = entries.find(
    (entry) => entry["identifier"] === identifier,
  );

  if (requestedSecretObj) {
    const authTag = Buffer.from(requestedSecretObj["tag"], "hex");

    const decrypted = await decrypt(
      masterPassword,
      fileData["salt"],
      requestedSecretObj["iv"],
      authTag,
      requestedSecretObj["cipherText"],
    );

    await clipboard.write(decrypted);
    console.log(
      chalk.green(
        "Your password/secret has been copied to clipboard successfully!",
      ),
    );
  } else {
    console.log(
      chalk.red(
        `Identifier ${chalk.italic(identifier)} not found! Run ${chalk.white.bold("vault ls")} to see all the identifiers.`,
      ),
    );
  }
}

export default async function copy(identifier) {
  try {
    await executeCopy(identifier);
  } catch (error) {
    if (error instanceof Error && error.name === "ExitPromptError") {
      console.error("Operation aborted.");
    } else {
      throw error;
    }
  }
}
