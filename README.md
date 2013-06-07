# Bunyan-Promise

Bunyan-Promise consumes promises and outputs [bunyan](https://npmjs.org/package/bunyan) logs showing their progress, their resolution or rejection, and makes state dumps showing all promises that have not settled.


## How?
Bunyan-Promise can consume any type of promises, but for the sake of this example we'll use one from [Kriskowal's Q Library](https://github.com/kriskowal/q).

```js
var q = require('q');
var BunyanPromiseLogger = require('bunyan-promise');
var logger = new BunyanPromiseLogger({
  name: 'test-logger'
});
var defer = q.defer();
logger.trace(defer.promise, 'arbitrary promise name for logging');

// sometime in the future resolve that promise
setTimeout(function () {
  defer.resolve();
}, 10000);
```

## Example output

This is pretty printed by piping the output through the [bunyan cli](https://github.com/trentm/node-bunyan#cli-usage).
```bs
node app.js | bunyan -o short
```
Alternatively you can use the [bunyan grunt task](https://npmjs.org/package/grunt-bunyan) if you're using grunt
```bs
npm install --save-dev grunt-bunyan
grunt bunyan task1 task2 ...
```

![](http://s7.postimg.org/rp2qjzjmz/Screen_Shot_2013_06_07_at_1_39_38_PM.png)
