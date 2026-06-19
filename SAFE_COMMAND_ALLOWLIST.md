# Safe Command Allowlist

Allowed for this local defensive review:

- git status --short --branch
- git remote -v
- git diff --check
- rg --files
- rg -n <defensive-patterns> <scoped-files>
- node --check app.js
- Get-Content -Raw <scoped-file>
- Copy-Item from source checkout to C:\tmp mirror

Not automatically allowed:

- network calls
- package install
- deploy
- commit/push
- permission/ACL changes
- deletion or recursive move

