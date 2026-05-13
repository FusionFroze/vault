#! /usr/bin/env node

import { program } from "commander";
import init from "./commands/init.js";
import reset from "./commands/reset.js";
import add from "./commands/add.js";
import copy from "./commands/copy.js";
import ls from "./commands/ls.js";
import remove from "./commands/remove.js";
import passwd from "./commands/passwd.js";

program
  .command("init")
  .description("initialize the vault with a master password")
  .action(init);

program.command("add").description("add new password/secret").action(add);

program
  .command("copy")
  .description("copy a password/secret")
  .argument("<identifier>", "identifier of the password/secret to be copied")
  .action((identifier) => copy(identifier));

program
  .command("ls")
  .description(
    "print the list of all the identifers of saved passwords/secrets.",
  )
  .action(ls);

program
  .command("remove")
  .description("remove a specific entry from the vault")
  .argument("<identifier>", "identifier of the password/secret to be removed")
  .action((identifier) => remove(identifier));

program
  .command("passwd")
  .description("change the master password")
  .action(passwd);

program.command("reset").description("reset the vault").action(reset);

program.parse();
