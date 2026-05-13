import chalk from "chalk";
import { password } from "@inquirer/prompts";
import checkPassword from "../lib/checkPassword.js";
import isInitialized from "../lib/isInitialized.js";

async function showList() {
  const fileData = isInitialized();

  const entries = fileData["entries"];

  if (entries.length === 0) {
    console.log(
      `No entry has been made yet. Run ${chalk.bold.italic("vault add")} to make new entries.`,
    );
  } else {
    for (const entry of entries) {
      console.log(`• ${entry["identifier"]}`);
    }
  }
}

export default async function ls() {
  try {
    await showList();
  } catch (error) {
    if (error instanceof Error && error.name === "ExitPromptError") {
      console.error("Operation aborted.");
    } else {
      throw error;
    }
  }
}
