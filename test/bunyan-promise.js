var BunyanPromiseLogger = require('../lib/bunyan-promise');
var q = require('q');

describe('BunyanPromiseLogger test suite', function () {
    it('is an empty test', function (done) {
        var logger = new BunyanPromiseLogger({
            name: 'test-logger'
        });
        var defer = q.defer();
        logger.trace(defer.promise);
        setTimeout(function () {
            defer.resolve();
            done();
        }, 100);
    });
});
