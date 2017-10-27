#!/usr/bin/env bash
# This file runs all the main scripts to be run in the build.
# Exit if one of the build steps errors
set -e

# 1. lint code
npm run lint

# 2. run tests + coverage
npm run coverage:ci

# 3. run integration tests
# Note: PRs coming from forks do not have access to encrypted variables,
# thus tasks that rely on that should not run.
if [ "$TRAVIS_SECURE_ENV_VARS" == "true" ]; then
  npm run it
else
  echo "Build does not have secure env variables, skipping integration tests!"
fi
