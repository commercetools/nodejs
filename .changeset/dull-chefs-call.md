---
'@commercetools/sync-actions': patch
---

We found an issue in the way the `jsondiffpatch` was used that made this package not usable in a browser environment.

In this version we adjust the way that package is imported and we pin a transitive dependency (`chalk`) to fix the error.
