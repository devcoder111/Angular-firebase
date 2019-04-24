#!/bin/sh

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[1;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

node dev-workflow-scripts/ci-make-prod-config.js e2e
EXIT_CODE=$?
if [[ ${EXIT_CODE} -ne 0 ]]; then
  exit 1
fi


yarn add firebase-tools
EXIT_CODE=$?
if [[ ${EXIT_CODE} -ne 0 ]]; then
  printf "${RED}Installing firebase-tools failed${NC}\n"
  exit 1
fi


printf "\n${BLUE}Start deploying to Firebase (E2E project)${NC}\n"
firebase functions:config:set \
  --token ${E2E_FIREBASE_TOKEN} \
  --project ${E2E_FIREBASE_PROJECT_NAME} \
  sendgrid.secretkey=${SENDGRID_SECRETKEY} \
  cron.key=${E2E_CRON_KEY} \
  twilio.sid=${TWILIO_SID} \
  twilio.token=${TWILIO_TOKEN} \
  twilio.from=${TWILIO_FROM}
EXIT_CODE=$?
if [[ ${EXIT_CODE} -ne 0 ]]; then
  printf "${RED}Deploying of functions config failed${NC}\n"
  exit 1
fi

firebase deploy --token ${E2E_FIREBASE_TOKEN} --project ${E2E_FIREBASE_PROJECT_NAME}
EXIT_CODE=$?
if [[ ${EXIT_CODE} -ne 0 ]]; then
  printf "${RED}Deploying to Firebase failed${NC}\n"
  exit 1
fi
printf "\n${BLUE}Deploy is finished${NC}\n"

yarn dev-scripts:fill-firebase-with-demo-data --e2e
EXIT_CODE=$?
if [[ ${EXIT_CODE} -ne 0 ]]; then
  printf "${RED}Filling Firebase with demo-data failed${NC}\n"
  exit 1
fi

printf "\n${GREEN}It seems that everything is fine. Good luck with the release! :)${NC}\n"
