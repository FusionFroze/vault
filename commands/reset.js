import { confirm, password } from "@inquirer/prompts";
import chalk from "chalk";
import { conf } from "../lib/conf.js";
import checkPassword from "../lib/checkPassword.js";
import isInitialized from "../lib/isInitialized.js";

export default async function reset() {
  const fileData = isInitialized();

  const masterPassword = await password({
    message: "Enter vault's master password:",
    mask: true,
  });
  await checkPassword(masterPassword);

  console.log(
    chalk.yellow.bold(
      "Important: this action is not reversible, once confirmed this command will reset the vault. You will lose all the saved passwords. Make sure you are not losing anything important.",
    ),
  );
  const answer = await confirm({ message: "Reset the vault?" });

  if (answer) {
    conf.clear();
    console.log(
      `Vault has been reset. Run ${chalk.bold.italic("vault init")} to set it up again.`,
    );
  } else {
    console.log(chalk.green("Phew!"));
  }
}
