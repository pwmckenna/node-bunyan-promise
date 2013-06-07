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

## Example output

This is pretty printed by piping the output through the [bunyan cli](https://github.com/trentm/node-bunyan#cli-usage).
```bs
node app.js | bunyan -o short
```
Alternatively you can use the [bunyan grunt task](https://npmjs.org/package/grunt-bunyan) if you're using grunt
```bs
npm install --save-dev grunt-bunyan
grunt bunyan test
```

![](http://s11.postimg.org/n9mk3vofn/bunyan.png)
