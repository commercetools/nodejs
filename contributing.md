# Contributing
First of all, thank you for contributing. It’s appreciated. This guide details how to use issues and pull requests to improve this project.

## Running
**From within a package directory:**
- `npm start` - Watch for file changes then test.

- `npm test` - Run the tests and report the results.

- `npm run build` - Babelify everything in `src` output to `lib`.

- `npm run lint` - Check if the code follows the [ESLint](https://github.com/commercetools/eslint-config) rules.

**From the repository root:**
- `npm run clean` - Remove the `node_modules` directory and `lib` content from all packages.

- `npm run check-updates` - Checks for outdated dependencies in all packages and the root.

- `npm run upgrade` - Upgrades all outdated dependencies by changing their semver range.

- `npm run release` - Fires up [`lerna-semantic-release`](https://github.com/atlassian/lerna-semantic-release/) to tag a new release, push to git and publish a new version to npm.

## Making changes
* Create a topic branch from where you want to base your work.
* Make commits of logical units.
* Make sure you have added the necessary tests for your changes.

### Branching
When creating a branch. Use the issue number(without the '#') as the prefix and add a short title, like: `1-commit-message-example`

### Commit message
Make sure your commit messages follow the [Angular's format](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#-git-commit-guidelines) and includes the affected package if there is any. To make this easy run `npm run commit` or `git cz` from the root.
````
    docs(contributing): make the example in contributing guidelines concrete

    affects: @commercetools/docs-parser

    The example commit message in the contributing.md document is not a concrete example. This is a problem because the
    contributor is left to imagine what the commit message should look like
    based on a description rather than an example. Fix the
    problem by making the example concrete and imperative.

    Closes #1
    Breaks having an open issue
````

## Creating an Issue
Before you create a new issue:
  * Check the issues on Github to ensure that one doesn't already exist.
  * Clearly describe the issue, there is an [ISSUE_TEMPLATE](.github/ISSUE_TEMPLATE.md) to guide you.

## Tests
We use [tape](https://github.com/substack/tape) for unit and integration test.

We try to maintain a code coverage of 100%. Please ensure you do so too 😉
