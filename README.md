# bump-app-package-version

A GitHub action to bump your app package.json version. Supports workspaces.

## Usage

```yml
name: Bump version

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Bump version
        id: bump_version
        uses: zoontek/bump-app-package-version@v1
        with:
          type: patch # must be "patch", "minor" or "major" (required)
          prefix: v # the release name prefix (optional - default: "")

      - uses: EndBug/add-and-commit@v9
        with:
          message: ${{ steps.bump_version.outputs.new_version }}
```
