module.exports = {
  '*.md': ['npm run format:md', 'git add'],
  'packages/**/*.js': [
    // NOTE: apparently if you pass some argument that is not a flag AFTER the `reporters`
    // flag, jest does not seem correctly parse the arguments.
    //
    //   No tests found related to files changed since last commit.
    //   Run Jest without `-o` or with `--all` to run all tests.
    //   Error: An error occurred while adding the reporter at path "/path/to/file".Reporter is not a constructor
    //
    // For that reason, we move the `--onlyChanged` flag next to it.
    'npm run lint:js -- --reporters=jest-silent-reporter --onlyChanged',
    'flow focus-check',
    'npm run build:todos',
    'git add TODOS.md',
  ],
}
