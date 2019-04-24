#!/bin/sh

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[1;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

printf "${BLUE}Creating Angular environment.prod.ts file${NC}"
node dev-workflow-scripts/ci-make-prod-config.js prod
EXIT_CODE=$?
if [[ ${EXIT_CODE} -ne 0 ]]; then
  printf "${RED}Creation of Angular environment.prod.ts file failed${NC}\n"
  exit 1
fi

printf "${BLUE}Lint code${NC}"
yarn lint
EXIT_CODE=$?
if [[ ${EXIT_CODE} -ne 0 ]]; then
  printf "${RED}Lint failed${NC}\n"
  exit 1
fi

printf "${BLUE}Run unit-tests${NC}"
yarn test:ci
EXIT_CODE=$?
if [[ ${EXIT_CODE} -ne 0 ]]; then
  printf "${RED}Tests failed${NC}\n"
  exit 1
fi

printf "${BLUE}Run e2e-tests${NC}"
yarn e2e
EXIT_CODE=$?
if [[ ${EXIT_CODE} -ne 0 ]]; then
  printf "${RED}E2E Tests failed${NC}\n"
  exit 1
fi

printf "\n${BLUE}Test build${NC}\n"
yarn build:ci
EXIT_CODE=$?
if [[ ${EXIT_CODE} -ne 0 ]]; then
  printf "${RED}Build failed${NC}\n"
  exit 1
fi

printf "\n${GREEN}It seems that all checks are completed. Good luck with deploy!${NC}\n"
