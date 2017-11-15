#!/bin/bash -e

git config credential.helper "store --file=.git/credentials"
echo "https://$RELEASE_GH_TOKEN:@github.com/$CIRCLE_PROJECT_USERNAME/$CIRCLE_PROJECT_REPONAME.git" > .git/credentials

git config --global user.email "npmjs@commercetools.com"
git config --global user.name "CT Release Bot"
git config --global push.default simple

npm config set //registry.npmjs.org/:_authToken=${NPM_TOKEN} -q

echo "Running release:semantic"
yarn release:semantic

echo "Running docs:publish"
yarn docs:publish
