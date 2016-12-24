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

1. Clone the repo with `git clone git@github.com:commercetools/nodejs.git`

2. Run `npm install` (or `yarn`) in the root `nodejs` folder. This will ensure that all package dependencies are properly installed / linked. The repository uses [lerna](https://github.com/lerna/lerna) to orchestrate the different packages.

3. If you're writing documentation, you can start the gitbook development server with `npm run docs:watch`

4. To run all packages tests simply do `npm test` (we use [jest](https://github.com/facebook/jest)). If you want to work on a specific package and run the tests only for that package, we recommend to use `npm run test:package`. This will prompt you to select one of the available packages. To run in _watch_ mode simply do `npm run test:package -- --watch`

5. Linting and static checks are done by `npm run lint`. Commiting also runs a git hook to lint the changed files.

## Releases

We use [semantic release](https://github.com/semantic-release/semantic-release) to automatically do releases based on the commit message.
Since we are using [lerna](https://github.com/lerna/lerna) we need to specify in the commit description which packages might be affected by the release (`affects: <pkg-name>, <pkg-name>, ...`)

```
<type>(<scope>): <subject>
<BLANK LINE>
affects: pkg-1, pkg-3
```

------------

*Many thanks to [h5bp](https://github.com/h5bp/html5-boilerplate/blob/master/CONTRIBUTING.md) and [create-react-app](https://github.com/facebookincubator/create-react-app/blob/master/CONTRIBUTING.md) for the inspiration with this contributing guide*
