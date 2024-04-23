---
bump: "patch"
type: "remove"
---

Remove dependency on `isomorphic-unfetch`. This fixes an issue where
`isomorphic-unfetch` fails to bundle properly with `esbuild` or `webpack`.
