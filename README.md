# Bunyan-Promise

Bunyan can consume any type of promises, but for the sake of example we'll use one from [Kriskowal's Q Library](https://github.com/kriskowal/q).

```js
var q = require('q');
var BunyanPromiseLogger = require('bunyan-promise');
var logger = new BunyanPromiseLogger({
  name: 'test-logger'
});
var defer = q.defer();
defer.resolve();
logger.trace(defer.promise, 'arbitrary promise name for logging');
```
