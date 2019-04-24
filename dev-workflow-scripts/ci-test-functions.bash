#!/bin/sh

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[1;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

printf "${BLUE}Running Firestore Functions tests${NC}"
yarn --cwd firebase/functions/ test
EXIT_CODE=$?
if [[ ${EXIT_CODE} -ne 0 ]]; then
  printf "${RED}Firestore Functions tests failed${NC}\n"
  exit 1
fi


printf "${GREEN}Firestore Functions tests passed${NC}"
