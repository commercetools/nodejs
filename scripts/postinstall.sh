#!/usr/bin/env bash

set -e

echo "Preparing development setup."

pnpm husky

pnpm check-node-version --package --print

pnpm manypkg check

pnpm cross-env NODE_ENV=development pnpm build
