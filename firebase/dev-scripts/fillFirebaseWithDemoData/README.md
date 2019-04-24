# DevScript "Fill Firebase with demo data"

This script will remove everything from your Firebase project.

Services affected:
- Storage
- Firestore
- Authentication
- more in future...

After purge, script will fill same services with demo data (demo users, demo files, etc).

## Instruction

1. Get service key for your Firebase Project here (replace YOUR_PROJECT_NAME with your project name):

https://console.firebase.google.com/project/YOUR_PROJECT_NAME/settings/serviceaccounts/adminsdk

Click "GENERATE NEW PRIVATE KEY" and save JSON with secret key to your computer.

2. Call script with yarn and provide path to service key and email for your user.

## Example

### If you call script from root of this project:

```
$ yarn dev-scripts:fill-firebase-with-demo-data --secretkey ~/downloads/secret.json
```

Note: relative path like `../../secret.json` won't work if you call this
script from root, because yarn doesn't modify path while provide it to
the nested folder.

So use absolute path like `/users/devName/downloads/secret.json` or
`~/downloads/secret.json`.

### If you call script from this folder:

```
$ yarn start --secretkey ../../../secret.json
```

Here relative path will work fine as well as absolute.
