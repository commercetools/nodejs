#!/usr/bin/env bash

set -e

if [ -n "$SKIP_POSTINSTALL" ]; then
  echo "Skipping postinstall steps."

else
  if [ -n "$SKIP_POSTINSTALL_DEV_SETUP" ]; then
    echo "Skipping development setup."

  else
    echo "Preparing development setup."

    pnpm husky install
    pnpm preconstruct dev
    pnpm check-node-version --package --print
    pnpm manypkg check
  fi
fi
