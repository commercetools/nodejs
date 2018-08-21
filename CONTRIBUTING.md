# Contributing to commercetools nodejs

Please take a moment to review this document in order to make the contribution
process easy and effective for everyone involved.

Following these guidelines helps to communicate that you respect the time of
the developers managing and developing this open source project. In return,
they should reciprocate that respect in addressing your issue or assessing
patches and features.

## Submitting a Pull Request

Good pull requests, such as patches, improvements, and new features, are a fantastic help. They should remain focused in scope and avoid containing unrelated commits.

Please **ask first** if somebody else is already working on this or the core developers think your feature is in-scope for the related package / project. Generally always have a related issue with discussions for whatever you are including.

Please also provide a **test plan**, i.e. specify how you verified that your addition works.

Please adhere to the coding conventions used throughout a project (indentation,
accurate comments, etc.) and any other requirements (such as test coverage).

## Setting Up a Local Copy

1.  Clone the repo with `git clone git@github.com:commercetools/nodejs.git`

2.  Run `npm install` (or `yarn`) in the root `nodejs` folder. This will ensure that all package dependencies are properly installed / linked. The repository uses [lerna](https://github.com/lerna/lerna) to orchestrate the different packages.

3.  If you're writing documentation, you can start the gitbook development server with `npm run docs:watch`

4.  To run all packages tests simply do `npm test` (we use [jest](https://github.com/facebook/jest)). If you want to work on a specific package and run the tests only for that package, we recommend to use `npm run test:package`. This will prompt you to select one of the available packages. To run in _watch_ mode simply do `npm run test:package -- --watch`.

5.  Integration tests are separated out in another folder "/integration-tests". To run the integration test, you need to create an env file that have `npm_config_projectkey` (is equal to projectKey), `PROJECT_KEY`, `CLIENT_ID` and `CLIENT_SECRET` in your environment variables as specified [here](https://commercetools.github.io/nodejs/sdk/api/getCredentials.html). Then run integration test with

```
npm run test:integration
```

**Note: Due to the setup/teardown nature of the integration tests, there is the risk of potential data loss in your project**

6.  Linting and static checks are done by `npm run lint`. We the [Airbnb eslint config](https://www.npmjs.com/package/eslint-config-airbnb). Static checks are done using [Flow](https://flowtype.org/) and can be included / adopted incrementally. Committing also runs a git hook to lint the changed files.

## Formatting (Prettier)

We use [prettier](https://github.com/jlongster/prettier) to format our code, so we don't ever have to argue over code-style.

Prettier is integrated into ESLint, so all code is checked. The rules are only enabled when running `yarn run lint` from the command-line.
The rules are disabled in Atom so we don't get the annoying warnings while developing.

### Setup

Since prettier is integrated into ESLint it should run for the exact same files that are being linted.
We run prettier as part of ESLint using `eslint-plugin-prettier`. We disable all rules that `prettier` takes care of using `eslint-config-prettier`.

## Upgrading dependencies

We use [Renovate](https://renovateapp.com/) to get notified whenever there is a new version of a dependency, in form of a Pull Request. It's recommended to check the changes of the new versions before merging the PR. If necessary the PR should be updated with necessary code changes / migrations.

#### Update `yarn.lock` file

To ensure the lock file is up-to-date with the new versions, it's recommended to do checkout the branch, install the new deps with `yarn` and push the updated lock file to the PR.

## Releases

We use lerna for releasing packages. Just run `npm run release` from `master` (after pulling in the latest merges) to publish a single or a set of modules. Lerna will check changes on packages providing semver bumps according to the commit messages used for each package.

#### Commit message

Make sure your commit messages follow [Angular's commit message format](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#-git-commit-guidelines). To make this easy run `npm run commit` from the root.

```
    docs(contributing): add example of a full commit message

    The example commit message in the contributing.md document is not a concrete example. This is a problem because the
    contributor is left to imagine what the commit message should look like based on a description rather than an example. Fix the
    problem by making the example concrete and imperative.

    Closes #1
    BREAKING CHANGE: imagination no longer works
```

#### Semver version triggers

Based on the semantic release conventions, there are 3 triggers to control the semver version plus a trigger for releasing the actual packages.

* `fix` _(commit type)_: commits with this type will [bump a `patch` version](https://github.com/semantic-release/semantic-release#patch-release)
* `feat` _(commit type)_: commits with this type will [bump a `minor` version](https://github.com/semantic-release/semantic-release#minor-feature-release)
* `BREAKING CHANGE` _(commit description)_: commits with this keywords in the description will [bump a `major` version](https://github.com/semantic-release/semantic-release#major-breaking-release)

#### Merging Pull Requests

To avoid possible mistakes in the commit messages, and ensure that merging PRs will lead to releasing new versions, there is only one way to merge the PR: by `Squash and Commit`.
This is the perfect opportunity to ensure to adjust the commit message description following the semantic release conventions. This means that commits done while developing the PR don't necessary need to include the _release triggers_. You can simply do that when squashing the "final" commit.

---

_Many thanks to [h5bp](https://github.com/h5bp/html5-boilerplate/blob/master/CONTRIBUTING.md) and [create-react-app](https://github.com/facebookincubator/create-react-app/blob/master/CONTRIBUTING.md) for the inspiration with this contributing guide_
