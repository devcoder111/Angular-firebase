export enum AuthState {
  notAuthenticated = 'notAuthenticated', // No user at all
  waitingForEmailVerification = 'waitingForEmailVerification', // User has registered, verification email has sent, waiting for email verification
  authenticationInProgress = 'authenticationInProgress', // Firebase authentication is in progress
  authenticationError = 'authenticationError', // Auth failed due to authentication error in Firebase
  authenticationInfo = 'authenticationInfo', // We need to show info message
  userProfileLoading = 'userProfileLoading', // User authenticated, but we are loading organizations
  organizationLoaded = 'organizationLoaded', // User authenticated, has at least one organization, but haven't any locations yet
  authorized = 'authorized', // User is checked, has at least one organization and location and has access to app data
  emailSent = 'emailSent', // User request to reset password and now wait message
  passwordChangingInProgress = 'passwordChangingInProgress', // Firebase authentication is in progress
  passwordChanged = 'passwordChanged', // User change his password and ready to sing in
}
