#!/bin/bash -e

rm -rf .git
git init
git clean -dfx
git remote add origin ${CIRCLE_REPOSITORY_URL}.git
git fetch origin
git checkout ${CIRCLE_BRANCH}

git fetch --tags
git branch -u origin/${CIRCLE_BRANCH}
