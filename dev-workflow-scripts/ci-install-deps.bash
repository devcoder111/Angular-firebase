#!/bin/sh

yarn run install-all
EXIT_CODE=$?
if [[ ${EXIT_CODE} -ne 0 ]]; then
  printf "${RED}Installing deps failed${NC}\n"
  exit 1
fi

yarn run install-additional-functions-deps
EXIT_CODE=$?
if [[ ${EXIT_CODE} -ne 0 ]]; then
  printf "${RED}Installing additional deps failed${NC}\n"
  exit 1
fi

yarn add firebase-tools
EXIT_CODE=$?
if [[ ${EXIT_CODE} -ne 0 ]]; then
  printf "${RED}Installing firebase-tools failed${NC}\n"
  exit 1
fi


printf "${GREED}All dependencies successfully installed${NC}\n"
