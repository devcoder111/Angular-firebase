# FoodRazor v2.0
 
[ ![Codeship Status for foodrazor_offical/mono-repo](https://app.codeship.com/projects/862d5a10-4088-0136-e9eb-02089476edf0/status?branch=master)](https://app.codeship.com/projects/291082)

## If you are new to the project

You have to create your own Firebase project (for your local development) and configure it property.

Follow these steps:

1. [Firebase Console - Create project](https://console.firebase.google.com/). Give it name "foodrazor-yourname"
1. Upgrade it to "Blaze" plan (button is in left bottom corner).
1. [Activate Auth method "Email"](https://console.firebase.google.com/project/_/authentication/providers)
1. [Activate Firestore](https://console.firebase.google.com/project/_/database)
1. [Activate Cloud Storage (click “Get Started”)](https://console.firebase.google.com/project/_/storage)
1. [Create account service key and download it's json file.](https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk)
1. On [Overview page](https://console.firebase.google.com/project/foodrazor-anton/overview) - Click “+ Add app”, select "web app" and copy “config” object
1. Angular - Copy “environment.sample.ts” and save copy with name “environment.ts”. Change type to “dev” and fill firebase config with value from step #4. Use "http://localhost:4200/" as baseUrl
1. Angular - Do the same for "environment.prod.ts", but use type "prod". Use "https://foodrazor-yourname.firebaseapp.com/" as baseUrl.
1. Set firebase CLI current project:
```
$ npm i -g yarn
$ yarn install-all
$ yarn global add firebase-tools
$ firebase login
$ firebase use <YourFirebaseProjectIdHere>
```
8. Create Firebase Functions Environment Variables Config:
```
$ firebase functions:config:set cron.key=1230694dcd0c70395bcf7303a800c397be2344d4834
$ firebase functions:config:set sendgrid.secretkey=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
```
9. Deploy your app to Firebase
```
$ yarn deploy
```
10. Fill your Firebase with demo data:
```
$ yarn dev-scripts:fill-firebase-with-demo-data --secretkey /path/to/your/foodrazor-account-key.json
```
11. Run your frontend locally:
```
$ yarn start
```

## Known issues

If you see "ERROR in Cannot read property 'length' of undefined" - that means Angular CLI 
didn't find environment.ts or environment.prod.ts file. Make sure you generated it.

## Deploy app (it has pre-deploy hook, that builds app)

```
$ yarn deploy
```


## Run Functions locally

```
$ yarn start:server
```

For functions, which operates images and PDFs - install these deps:

#### Ubuntu
```
$ sudo apt-get install imagemagick
```

#### OSX
```
$ brew install imagemagick
```


## Developers scripts

Scripts in folder `firebase/dev-scripts` will help you with development.

If you are new to the project - make sure you read README.md in that folder.

Scripts there can for example fill your Firebase Project with demo data, 
so you can develop app on standalone instance of Firebase Project.
