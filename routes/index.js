const TestRouterFn = require('./test')
const RedisRouterFn = require('./redis')
const CachedRouterFn = require('./cached')

const RouterArrFns = [
    TestRouterFn,
    RedisRouterFn,
    CachedRouterFn
]

module.exports = RouterArrFns