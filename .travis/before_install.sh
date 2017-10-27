#!/bin/bash -e
# https://github.com/atlassian/lerna-semantic-release/blob/caribou/.travis/before_install.sh
# http://stackoverflow.com/questions/18027115/committing-via-travis-ci-failing

if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then
  echo "We are in a pull request, not setting up release"
  exit 0
fi

if [ "$TRAVIS_NODE_VERSION" != "6" ]; then
  echo "We should run the release task only once in the node 6 build, not releasing"
  exit 0
fi

if [[ "$TRAVIS_BRANCH" == "master" ]]; then
  rm -rf .git
  git init
  git clean -dfx
  git remote add origin https://github.com/${TRAVIS_REPO_SLUG}.git
  git fetch origin
  git checkout ${TRAVIS_BRANCH}

  git fetch --tags
  git branch -u origin/${TRAVIS_BRANCH}
fi

curl -o- -L https://yarnpkg.com/install.sh | bash -s
