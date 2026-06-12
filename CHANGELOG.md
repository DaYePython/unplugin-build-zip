# @daye-cli/unplugin-build-zip

## [0.1.15](https://github.com/DaYePython/unplugin-build-zip/compare/v0.1.14...v0.1.15) (2026-06-12)

### Chores

* Fix GitHub Release creation in the Changesets release workflow.

## [0.1.14](https://github.com/DaYePython/unplugin-build-zip/compare/v0.1.13...v0.1.14) (2026-06-12)

### Chores

* release v0.1.14 with tag workflow changelog ([c7d2efa](https://github.com/DaYePython/unplugin-build-zip/commit/c7d2efa88ec3a1d7511e497ed56c3556618876c5))

## [0.1.13](https://github.com/DaYePython/unplugin-build-zip/compare/v0.1.12...v0.1.13) (2026-06-12)

### Chores

* add tag publish workflow and release v0.1.13 ([e7e29cf](https://github.com/DaYePython/unplugin-build-zip/commit/e7e29cfc0d1a5037228ec30142c35b1fe229b47b))

## [0.1.12](https://github.com/DaYePython/unplugin-build-zip/compare/v0.1.11...v0.1.12) (2026-06-12)

### Reverts

* Revert "chore: add CHANGELOG.md and update release scripts" ([da942cd](https://github.com/DaYePython/unplugin-build-zip/commit/da942cdb62ee067a25d13375ee5fc8bbf035057b))

### Chores

* update .gitignore to exclude macOS .DS_Store files ([71ead8c](https://github.com/DaYePython/unplugin-build-zip/commit/71ead8ca826a530d4ce47dce9059e9248ba1f938))
* add CHANGELOG.md and update release scripts ([8143d51](https://github.com/DaYePython/unplugin-build-zip/commit/8143d51f17f2029b5c668ff8809095c6d05ff00a))
* adapt release flow to changesets ([cf4dd74](https://github.com/DaYePython/unplugin-build-zip/commit/cf4dd7454a05b2707cbf5cfc443dc383c2a6658d))
* enhance release workflow with GitHub release creation ([792a45d](https://github.com/DaYePython/unplugin-build-zip/commit/792a45d75ba8b26b9cc7dcd4b5d4c9e209d1ffcd))

## [0.1.11](https://github.com/DaYePython/unplugin-build-zip/compare/v0.1.10...v0.1.11) (2026-06-11)

### Chores

* rename package scope ([edcde95](https://github.com/DaYePython/unplugin-build-zip/commit/edcde95c7110a32dbb865b489c884bcbf74af4ea))

## [0.1.10](https://github.com/DaYePython/unplugin-build-zip/compare/v0.1.9...v0.1.10) (2026-06-11)

### Bug Fixes

* remove duplicate import of execSync in test file ([39c9125](https://github.com/DaYePython/unplugin-build-zip/commit/39c9125c14a0742dafb39f948294b8cc1779ebd1))

### Features

* add zip folder option ([500f470](https://github.com/DaYePython/unplugin-build-zip/commit/500f47053e909e0d7ea1bb3c55dff4fb33d6dd1c))

## [0.1.9](https://github.com/DaYePython/unplugin-build-zip/compare/v0.1.8...v0.1.9) (2026-03-17)

### Features

* add Webpack build detection to improve compatibility ([015832e](https://github.com/DaYePython/unplugin-build-zip/commit/015832ee9c60f501055e5e0f9b35c63a0feadb56))

## [0.1.8](https://github.com/DaYePython/unplugin-build-zip/compare/v0.1.7...v0.1.8) (2026-03-16)

### Features

* add Vite build support and improve bundle closure logic ([eed41a4](https://github.com/DaYePython/unplugin-build-zip/commit/eed41a4d82119a633fc544235c71cea96ad56877))

## [0.1.7](https://github.com/DaYePython/unplugin-build-zip/compare/v0.1.6...v0.1.7) (2026-03-16)

### Bug Fixes

* handle undefined options in rollup writeBundle method ([1def51b](https://github.com/DaYePython/unplugin-build-zip/commit/1def51bcbbd3a88e26ed700205ebd7a900f66e93))

### Features

* restructure core module and add utility functions for zipping directories ([0e7e5f3](https://github.com/DaYePython/unplugin-build-zip/commit/0e7e5f38edeae70ede86051529d28be031fdf186))

## [0.1.6](https://github.com/DaYePython/unplugin-build-zip/compare/v0.1.5...v0.1.6) (2026-03-13)

### Bug Fixes

* update publish step to include package filter for npm publish ([92ab7d4](https://github.com/DaYePython/unplugin-build-zip/commit/92ab7d4cfaa22747a30f15c47d3e26ba641469a4))

## [0.1.5](https://github.com/DaYePython/unplugin-build-zip/compare/v0.1.4...v0.1.5) (2026-03-13)

### Bug Fixes

* update .gitignore to exclude zip files in dist directory ([afd074e](https://github.com/DaYePython/unplugin-build-zip/commit/afd074efa7047c3f98c58e779b56a6d101578816))

### Features

* add test demo(vue-cli-vue2 and vite-vue3) ([445d382](https://github.com/DaYePython/unplugin-build-zip/commit/445d382e18344951d3ebb40ccc95283b2314133e))

## [0.1.4](https://github.com/DaYePython/unplugin-build-zip/compare/v0.1.3...v0.1.4) (2026-03-13)

### Features

* hook webpack and rollup to support building zip correctly ([c5f85ca](https://github.com/DaYePython/unplugin-build-zip/commit/c5f85ca1ee28d6be6100a2016449ae3252926cfc))

## [0.1.3](https://github.com/DaYePython/unplugin-build-zip/compare/v0.1.2...v0.1.3) (2026-03-13)

### Bug Fixes

* update exports format in package.json and add format options in tsdown.config.ts ([cb674a8](https://github.com/DaYePython/unplugin-build-zip/commit/cb674a80856b2e7bd2c59e41ea50ab82491852f4))

### Reverts

* Revert "fix: revert package name to unplugin-build-zip and version to 0.1.0; update exports format in package.json" ([cae1e6a](https://github.com/DaYePython/unplugin-build-zip/commit/cae1e6ac9374dc32dac152af12ea782fba1cecc7))
* Revert "fix: revert package name to unplugin-build-zip and version to 0.1.0; update exports format in package.json" ([669d815](https://github.com/DaYePython/unplugin-build-zip/commit/669d815b253b1ff7dbbb6dbd144a3c12930a0991))

## [0.1.2](https://github.com/DaYePython/unplugin-build-zip/compare/v0.1.1...v0.1.2) (2026-03-13)

### Bug Fixes

* revert package name to unplugin-build-zip and version to 0.1.0; update exports format in package.json ([916760b](https://github.com/DaYePython/unplugin-build-zip/commit/916760b51e914aa33a1364364ea2053fde22206a))
* update version to 0.1.1 in package.json ([9c6db42](https://github.com/DaYePython/unplugin-build-zip/commit/9c6db42f515e22e8e5571b4dc7b93ed11822754e))

## [0.1.1](https://github.com/DaYePython/unplugin-build-zip/releases/tag/v0.1.1) (2026-03-13)

### Features

* implement unplugin-build-zip plugin ([637cd22](https://github.com/DaYePython/unplugin-build-zip/commit/637cd22f00185deac661809be201f96f4ea90433))
* add GitHub Actions workflow for NPM publishing ([1b6432c](https://github.com/DaYePython/unplugin-build-zip/commit/1b6432c0ae9526b11ad520ee85e50f864219cecb))

### Documentation

* rewrite README.md ([7c045ef](https://github.com/DaYePython/unplugin-build-zip/commit/7c045efddc6e881c044d517dc3efa960da098f44))

### Chores

* init from unplugin-starter ([4c3855c](https://github.com/DaYePython/unplugin-build-zip/commit/4c3855caaee82eff4fa3e73cbfd946f14665c5c3))
* update repository url to DaYePython/unplugin-build-zip ([391b2de](https://github.com/DaYePython/unplugin-build-zip/commit/391b2de78a4faa532a16367971957ff5e541372e))
* update package name to @tonywater/unplugin-build-zip in README.md and package.json ([ff71365](https://github.com/DaYePython/unplugin-build-zip/commit/ff71365f6cf98a9de9e3ecdf3728b8e0e9ad6854))
