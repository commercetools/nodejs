#!/usr/bin/env bash

set -e

echo "Preparing development setup."

pnpm husky

pnpm check-node-version --package --print
#pnpm cross-env NODE_ENV=development pnpm build
