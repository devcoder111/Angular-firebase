# Developer scripts

Hello developer! Scripts in this folder will help you with development (what a surprise, right?).
Just run them with `$ yarn scriptName` and provide some parameters with ` --paramName paramValue`.

## List of scripts

1. "Fill Firebase with demo data"

This one will remove everything from your Firebase project.

Services affected:
- Storage
- Firestore
- Authentication
- more in future...

After purge, script will fill same services with demo data (demo users, demo files, etc).

Check folder "fillFirebaseWithDemoData" for detailed README.md file with instruction of how to use it.
