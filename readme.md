<p align="center">
  <a href="https://commercetools.com/">
    <img alt="commercetools logo" src="https://cdn.rawgit.com/commercetools/press-kit/master/PNG/72DPI/CT%20logo%20horizontal%20RGB%2072dpi.png">
  </a>
  <b>Node.js commercetools ecosystem.</b>
</p>

<p align="center">
  <a href="https://travis-ci.org/commercetools/nodejs">
    <img alt="Travis CI Status" src="https://img.shields.io/travis/commercetools/nodejs/master.svg?style=flat-square&label=travis">
  </a>
  <a href="https://codecov.io/gh/commercetools/nodejs">
    <img src="https://img.shields.io/codecov/c/github/commercetools/nodejs.svg" alt="Codecov" />
  </a>
  <a href="https://waffle.io/commercetools/nodejs-tasks-board">
    <img alt="Waffle.io Board" src="https://img.shields.io/badge/Waffle-board-yellow.svg?style=flat-square">
  </a>
</p>

## About
This repository is managed as a monorepo; it's composed of many npm packages. To make managing this repository easy we use [Lerna](https://github.com/lerna/lerna).

## Getting started
To get everything working `npm install` will also trigger some additional commands that symlink internal packages and common development dependencies. For all common commands such as `npm test` running from root will test all packages. To test a specific package you'll have to run `npm test` from within that package directory.

## Packages
### Core Packages

| Package | Version | Dependencies |
|--------|-------|------------|
| [`placeholder`](/packages/placeholder) | [![placeholder Version][placeholder-version-icon]][placeholder-version] | [![placeholder Dependencies Status][placeholder-dependencies-icon]][placeholder-dependencies] |

[placeholder-version]: https://www.npmjs.com/package/@commercetools/placeholder
[placeholder-version-icon]: https://img.shields.io/npm/v/@commercetools/placeholder.svg?style=flat-square
[placeholder-dependencies]: https://david-dm.org/Siilwyn/lerna-labs?path=packages/placeholder
[placeholder-dependencies-icon]: https://img.shields.io/david/Siilwyn/lerna-labs.svg?path=packages/placeholder&style=flat-square
