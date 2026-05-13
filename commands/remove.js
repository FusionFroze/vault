import { conf } from "../lib/conf.js";
import chalk from "chalk";
import checkPassword from "../lib/checkPassword.js";
import { confirm, password } from "@inquirer/prompts";
import isInitialized from "../lib/isInitialized.js";

async function executeRemove(identifier) {
  const fileData = isInitialized();

  const masterPassword = await password({
    message: "Enter vault's master password:",
    mask: true,
  });
  await checkPassword(masterPassword);

  const entries = fileData["entries"];
  const secretToBeRemoved = entries.find(
    (entry) => entry["identifier"] === identifier,
  );

  if (secretToBeRemoved) {
    const answer = await confirm({ message: "Are you sure?" });

    if (answer) {
      fileData["entries"] = entries.filter(
        (entry) => entry["identifier"] !== secretToBeRemoved["identifier"],
      );
      conf.set(fileData);

      console.log(
        chalk.green(`${chalk.bold(identifier)} has been removed successfully`),
      );
    } else {
      console.log("Phew!");
    }
  } else {
    console.error(
      chalk.red(
        `Identifier ${chalk.italic(identifier)} is not in the vault. Run ${chalk.white.bold("vault ls")} to see all the identifiers saved.`,
      ),
    );
  }
}

export default async function remove(identifier) {
  try {
    await executeRemove(identifier);
  } catch (error) {
    if (error instanceof Error && error.name === "ExitPromptError") {
      console.error("Operation aborted.");
    } else {
      throw error;
    }
  }
}
