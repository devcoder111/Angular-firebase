#!/bin/sh

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[1;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

RELEASE=${CI_BUILD_NUMBER}_${CI_COMMIT_ID:0:6}
echo ------ Release number is "${RELEASE}" ------

printf "\n${BLUE}Create release in Sentry${NC}\n"
curl https://sentry.io/api/0/organizations/foodrazor/releases/ \
  -X POST \
  -H 'Authorization: Bearer '${PROD_SENTRY_AUTH_TOKEN} \
  -H 'Content-Type: application/json' \
  -d '{"version": "'${RELEASE}'", "projects":["foodrazor-prod"]}' \
EXIT_CODE=$?
if [[ ${EXIT_CODE} -ne 0 ]]; then
  printf "${RED}Creation of release in Sentry failed${NC}\n"
  exit 1
fi
printf "\n${BLUE}Release created in Sentry${NC}\n"


printf "\n${BLUE}Start uploading source maps to Sentry${NC}\n"
FILES=./firebase/hosting/*.map
for f in ${FILES}
do
	printf "\n uploading ${GREEN}  $f  to Sentry release ${NC} \n"
  curl https://sentry.io/api/0/projects/foodrazor/foodrazor-prod/releases/${RELEASE}/files/ \
    -X POST \
    -H 'Authorization: Bearer '${PROD_SENTRY_AUTH_TOKEN} \
    -F file=@"$f" \
    -F name="~/${f##*/}"
done
printf "\n${BLUE}All source maps uploaded to Sentry${NC}\n"

printf "\n${BLUE}Start deploying to Firebase${NC}\n"
firebase functions:config:set \
  --token ${PROD_FIREBASE_TOKEN} \
  --project ${PROD_FIREBASE_PROJECT_NAME} \
  sendgrid.secretkey=${SENDGRID_SECRETKEY} \
  cron.key=${PROD_CRON_KEY} \
  twilio.sid=${TWILIO_SID} \
  twilio.token=${TWILIO_TOKEN} \
  twilio.from=${TWILIO_FROM} \
  hoiio.appid=${HOIIO_APPID} \
  hoiio.accesstoken=${HOIIO_ACCESSTOKEN}
EXIT_CODE=$?
if [[ ${EXIT_CODE} -ne 0 ]]; then
  printf "${RED}Deploying of functions config failed${NC}\n"
  exit 1
fi

firebase deploy --token ${PROD_FIREBASE_TOKEN} --project ${PROD_FIREBASE_PROJECT_NAME}
EXIT_CODE=$?
if [[ ${EXIT_CODE} -ne 0 ]]; then
  printf "${RED}Deploying to Firebase failed${NC}\n"
  exit 1
fi
printf "\n${BLUE}Deploy is finished${NC}\n"


printf "\n${GREEN}It seems that everything is fine. Good luck with the release! :)${NC}\n"
