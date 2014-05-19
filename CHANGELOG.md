0.1.0 / 2014-05-19
==================

  * README: fix package name in code example
  * promisify and expose SuperTest agents
    Agents persist cookies across requests. Promisify and expose this
    interface at `exports.agent` to be compatible with SuperTest.
    Fixes [#1](https://github.com/WhoopInc/supertest-as-promised/issues/1).
  * add changelog
  * initial commit
