import * as functions from 'firebase-functions';
import { createUserStructureInDB } from './onCreate/createUserStructureInDB';

exports = module.exports = functions.auth.user().onCreate(async (userRecord: functions.auth.UserRecord) => {
  try {
    await createUserStructureInDB(userRecord);
    // More functions can be called here if needed (example: Notifications, User counter, etc)
  } catch (error) {
    console.error('authOnCreate', error);
  }
});
