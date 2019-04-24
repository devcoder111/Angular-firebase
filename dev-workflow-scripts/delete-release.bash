#!/bin/sh

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[1;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Example of usage - Delete one release:
# RELEASE=RELEASE_NUMBER PROD_SENTRY_AUTH_TOKEN=YOUR_TOKEN bash dev-workflow-scripts/delete-release.bash

# Example of usage - Delete multiple releases with bash script:
: '
// start of multiline comment
declare -a arr=(
"release1"
"release2"
"release3"
)

for item in "${arr[@]}"
do
   RELEASE=$item PROD_SENTRY_AUTH_TOKEN=YOUR_TOKEN bash dev-workflow-scripts/delete-release.bash
done
// end of multiline comment
'

printf "\n${BLUE}Deleting release \"${RELEASE}\"${NC}\n"
curl https://sentry.io/api/0/organizations/foodrazor/releases/${RELEASE}/ \
  -X "DELETE" \
  -H 'Authorization: Bearer '${PROD_SENTRY_AUTH_TOKEN}
printf "\n${BLUE}Release deleted${NC}\n"
