var BunyanPromiseLogger = require('../lib/bunyan-promise');
var q = require('q');

var resolveIn = function (defer, time, res) {
    setTimeout(function () {
        defer.resolve(res);
    }, time);
};

var rejectIn = function (defer, time, err) {
    setTimeout(function () {
        defer.reject(err);
    }, time);
};

describe('BunyanPromiseLogger test suite', function () {
    it('is an empty test', function (done) {
        this.timeout(10000);
        var logger = new BunyanPromiseLogger({
            name: 'test-logger'
        });
        var defer1 = q.defer();
        logger.trace(defer1.promise, 'arbitrary promise label 1');
        resolveIn(defer1, 1000);

        defer1.notify(100);
        defer1.notify();

        var defer2 = q.defer();
        logger.trace(defer2.promise, 'arbitrary promise label 2');
        rejectIn(defer2, 2000);

        var defer3 = q.defer();
        logger.trace(defer3.promise, 'arbitrary promise label 3');
        resolveIn(defer3, 3000);

        var defer4 = q.defer();
        logger.trace(defer4.promise, 'arbitrary promise label 4');
        rejectIn(defer4, 4000, 'asdf');

        setTimeout(function () {
            done();
        }, 5000);
    });
});
