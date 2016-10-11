#!/usr/bin/env bash

set -e

# Lints all files passed as arguments,
# unless they are ignored by .eslintignore

# folders/files from arguments to lint
FILES="${*:1}"

FORMATTER_PATH='node_modules/eslint-formatter-pretty'

# detect where the formatter is located
formatter_basedir='./'
if [ -d ../../${FORMATTER_PATH} ]
then
  formatter_basedir='../../'
fi

# run eslint with the located formatter
./node_modules/.bin/eslint \
  --format=${formatter_basedir}${FORMATTER_PATH} \
  $FILES
