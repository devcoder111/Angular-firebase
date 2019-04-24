# DevScript "Backup"

This script is allows to export and import backup of Firestore data.

## Instruction

1. Get service key for your Firebase Project here (replace YOUR_PROJECT_NAME with your project name):

https://console.firebase.google.com/project/YOUR_PROJECT_NAME/settings/serviceaccounts/adminsdk

Click "GENERATE NEW PRIVATE KEY" and save JSON with secret key to your computer.

2. Call script with yarn and provide path to service key and email for your user.

## Example

### If you call script from root of this project:

```
$ yarn dev-scripts:backup --secretkey ~/downloads/secret.json --export
```

Note: relative path like `../../secret.json` won't work if you call this
script from root, because yarn doesn't modify path while provide it to
the nested folder.

So use absolute path like `/users/devName/downloads/secret.json` or
`~/downloads/secret.json`.

### If you call script from this folder:

```
$ yarn start --secretkey ../../../secret.json --export
```

Here relative path will work fine as well as absolute.

## Commands

### Export

Export command can be called like this:

```
$ yarn dev-scripts:backup --secretkey ~/downloads/secret.json --export
```

### Import

Import command has param "source" and can be called like this:

```
$ yarn dev-scripts:backup --secretkey ~/downloads/secret.json --import --source /path/to/backup.json
```
