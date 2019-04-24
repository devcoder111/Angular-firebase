#!/bin/sh

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[1;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color


printf "${BLUE}Filling foodrazor-e2e project with demo data${NC}"
yarn dev-scripts:fill-firebase-with-demo-data --e2e
EXIT_CODE=$?
if [[ ${EXIT_CODE} -ne 0 ]]; then
  printf "${RED}Fill foodrazor-e2e project with demo data failed${NC}\n"
  exit 1
fi

printf "${BLUE}Deploying Firestore Security Rules${NC}"
firebase deploy --token ${E2E_FIREBASE_TOKEN} --project ${E2E_FIREBASE_PROJECT_NAME} --only firestore:rules
EXIT_CODE=$?
if [[ ${EXIT_CODE} -ne 0 ]]; then
  printf "${RED}Deploy Firestore Security Rules failed${NC}\n"
  exit 1
fi


printf "${BLUE}Running Firestore Security Rules tests${NC}"
yarn --cwd firebase/firestore/ test
EXIT_CODE=$?
if [[ ${EXIT_CODE} -ne 0 ]]; then
  printf "${RED}Firestore Security Rules tests failed${NC}\n"
  exit 1
fi


printf "${GREEN}Firestore Security Rules tests passed${NC}"
