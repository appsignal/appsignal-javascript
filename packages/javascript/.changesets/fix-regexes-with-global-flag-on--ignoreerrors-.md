---
bump: patch
type: fix
---

Fix an issue when regexes with the `g` global flag are used on `ignoreErrors`. Before this change, after successfully matching on an error to ignore, if the following error would also match the same regular expression, the regular expression would then fail to match it.
