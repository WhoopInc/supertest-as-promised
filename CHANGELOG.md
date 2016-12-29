# Changelog

We follow [semver]: the major version number will be upgraded with any
breaking change. This changelog lists all meaningful changes in each
release; consult the main [README] to determine which changes are
breaking.

## --- / 2016-12-29

  * SuperTest as Promised is deprecated. Thanks, [@jasisk]!

See the README for instructions on upgrading to SuperTest 2.0.

## 4.0.2 / 2016-11-02

  * [[#39]] Bring list of breaking changes in the [README] up-to-date. Thanks, [@karlbecker]!

## 4.0.1 / 2016-10-24

  * expose additional `agent` properties through inheritance chain ([#38])

Thanks, [@jsdevwork]!

## 4.0.0 / 2016-08-11

  * mark `err.response` as non-enumerable to avoid cluttering console output ([#34])

Thanks, [@sylvaingi]!

## 3.2.0 / 2016-07-02

  * attach `response` to error object to ease debugging of failed requests ([#30])

Thanks, [@mkasberg]!

## 3.1.0 / 2016-03-30

  * add `catch()` convenience method directly to test instance ([#23])

Thanks, [@bbatha]!

## 3.0.0 / 2016-02-21

  * update Bluebird to v3.x series

## 2.0.2 / 2015-06-05

  * fix double-resolution of promise upon error ([#11])

Thanks, [@srussellextensis]!

## 2.0.1 / 2015-05-12

  * bump dev dependencies for compatibility with SuperTest's v1.0.0 test
    suite.

## 2.0.0 / 2015-04-06

  * add `toPromise()` method to explicitly convert request to promise
  * support custom promise libraries
  * update Bluebird to v2.x series

## 1.0.0 / 2014-07-01

  * release: v1.0.0
  * support `del` by passing through to upstream's alias
    Closes [#3](https://github.com/WhoopInc/supertest-as-promised/issues/3). Closes [#4](https://github.com/WhoopInc/supertest-as-promised/issues/4).
  * Alias del and delete to supertest.del
  * test: run upstream tests against our wrapped module
  * test: switch to expect interface
  * README: add build badge
  * .travis.yml: add continuous integration configuration
  * refactor `then` method
    `Promise.promisify` is awkward when invoked immediately. Save to
    temporary variable for clarity.
  * CHANGELOG: update for v0.1.1

## 0.1.1 / 2014-05-19

  * release: v0.1.1
  * refactor factory wrapping
    We don't need to inherit from the factory as long as we set
    the receiver correctly when calling its functions. D'oh!
  * CHANGELOG: update for v0.1.0
    v0.0.1 was cut from a rebased tree that was never pushed to GitHub, so
    changelog generation is a bit out-of-sync.
  * release: v0.1.0

## 0.1.0 / 2014-05-19

  * README: fix package name in code example
  * promisify and expose SuperTest agents
    Agents persist cookies across requests. Promisify and expose this
    interface at `exports.agent` to be compatible with SuperTest.
    Fixes [#1](https://github.com/WhoopInc/supertest-as-promised/issues/1).
  * add changelog
  * initial commit

[#39]: https://github.com/WhoopInc/supertest-as-promised/issues/39
[#38]: https://github.com/WhoopInc/supertest-as-promised/issues/38
[#34]: https://github.com/WhoopInc/supertest-as-promised/pull/34
[#30]: https://github.com/WhoopInc/supertest-as-promised/issues/30
[#23]: https://github.com/WhoopInc/supertest-as-promised/pull/23
[#11]: https://github.com/WhoopInc/supertest-as-promised/pull/11

[@bbatha]: https://github.com/bbatha
[@karlbecker]: https://github.com/karlbecker
[@mkasberg]: https://github.com/mkasberg
[@jasisk]: https://github.com/jasisk
[@jsdevwork]: https://github.com/jsdevwork
[@srussellextensis]: https://github.com/srussellextensis
[@sylvaingi]: https://github.com/sylvaingi

[README]: README.md
[semver]: http://semver.org
