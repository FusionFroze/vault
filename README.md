# Vault

Encrypt and manage your secrets from the terminal.

## Installation

**Prerequisite:** Node.js v18+

```shell
$ npm i -g @fusionfroze/vault
```

## How to use it

### Initialization

To initialize the vault, run -

```shell
$ vault init
```

You will set a master password here for the vault.

_(**Important**: Do not forget this password. You will need this password to make new entries, retrieve them, remove them, change the password itself or reset the entire vault.)_

### Making a new entry

To add a new entry, run -

```shell
$ vault add
```

You will need to enter the vault's master password to proceed. After that the following input interface will open -

```shell
$ vault add
✔ Enter vault\'s master password: ******
✔ Identifier of the new password/secret: new_password
✔ Password/Secret: ************
Your password has been added to the vault
```

Each entry has an **Identifier** that uniquely identifies it. Here, provide a unique identifier and the password/secret to be saved to add it to the vault.

### Retrieving a password/secret

To retrieve a password/secret, run -

```shell
$ vault copy <identifier>
```

The stored password/secret will be **copied** directly to your **clipboard**.
**_Example usage:_**

```shell
$ vault copy new_password
```

### Listing all the identifiers

To list all the identifiers of respective entries stored in the vault, run -

```shell
$ vault ls
```

This command will not need the master password.

### Removing an entry

To remove a specific entry from the vault, run -

```shell
$ vault remove <identifier>
```

You will be asked for confirmation once. Once executed, this action cannot be undone.

**_Example usage:_**

```shell
$ vault remove new_password
```

### Changing the master password

To change the master password of the vault, run -

```shell
$ vault passwd
```

### Resetting the vault

To reset the vault, run -

```shell
$ vault reset
```

You will be asked for confirmation before the vault is reset.

**_(Important: This will delete everything in the vault. Make sure you are not deleting anything important before running this command.)_**

After resetting the vault, run **vault init** to set it up again.
