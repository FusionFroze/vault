import { conf } from "./conf.js";
import chalk from "chalk";

export default function isInitialized() {
  const fileData = conf.get();
  const dataKeys = Object.keys(fileData);

  if (dataKeys.length === 0) {
    console.error(
      chalk.red(
        `Vault is not initialized. Run ${chalk.white.bold("vault init")} first.`,
      ),
    );

    process.exit(1);
  } else {
    return fileData;
  }
}
