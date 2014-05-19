0.1.1 / 2014-05-19
==================

  * release: v0.1.1
  * refactor factory wrapping
    We don't need to inherit from the factory as long as we set
    the receiver correctly when calling its functions. D'oh!
  * CHANGELOG: update for v0.1.0
    v0.0.1 was cut from a rebased tree that was never pushed to GitHub, so
    changelog generation is a bit out-of-sync.
  * release: v0.1.0

0.1.0 / 2014-05-19
==================

  * README: fix package name in code example
  * promisify and expose SuperTest agents
    Agents persist cookies across requests. Promisify and expose this
    interface at `exports.agent` to be compatible with SuperTest.
    Fixes [#1](https://github.com/WhoopInc/supertest-as-promised/issues/1).
  * add changelog
  * initial commit
