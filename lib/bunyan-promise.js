'use strict';

require('colors');
var _ = require('lodash');
var moment = require('moment');
var bunyan = require('bunyan');

var defaults = {
    name: 'anonymous-bunyan-promise-log',
    level: 'trace'
};

var canCoerce = function (arg) {
    return _.isNumber(arg) || _.isString(arg) || _.isBoolean(arg) || _.isDate(arg) || _.isNull(arg) || _.isUndefined(arg);
};

var format = function (arg) {
    if (canCoerce(arg)) {
        return arg;
    } else if (arg instanceof Buffer) {
        var tostring = arg.toString();
        return tostring.substr(0, 100).replace(/\n/g, '\n\t') + (tostring.length > 100 ? '\n\t...\n\n' : '');
    } else {
        var stringified = JSON.stringify(arg, null, 4);
        return stringified.substr(0, 100).replace(/\n/g, '\n\t') + (stringified.length > 100 ? '\n\t...\n\n' : '');
    }
};

var BunyanPromiseLogger = function (options) {
    _.defaults(options, defaults);
    this.log = bunyan.createLogger(options);
    this.promiseTimes = {};
    this._nextKey = 0;
};

BunyanPromiseLogger.prototype._showPromises = function () {
    var log = '\n--- OUTSTANDING PROMISES ---\n'.cyan;
    _.each(this.promiseTimes, function (obj) {
        var time = obj.time;
        var msg = obj.msg;
        log += '\n\t'.cyan;
        log += msg.cyan;
        log += '\t\t'.cyan;
        log += moment(time).fromNow().toString().green;
    }, this);
    log += '\n\n------------------------------\n\n'.cyan;
    this.log.trace(log);
};
BunyanPromiseLogger.prototype.trace = function (promise, msg) {
    try {
        var key = this._nextKey++;
        this.promiseTimes[key] = {
            time: new Date(),
            msg: msg
        };
        this._showPromises();
        var progress = function (progress) {
            var start = this.promiseTimes[key].time;
            var duration = moment().from(start, true);
            this.log.trace('\n\t' + 'progress (%s): '.yellow + msg + '\t\t' + duration.toString().green + '\n', format(progress));
        }.bind(this);
        var done = function (res) {
            var start = this.promiseTimes[key].time;
            var duration = moment().from(start, true);
            this.log.trace('\n\t' + 'resolved (%s): '.green + msg + '\t\t' + duration.toString().green + '\n', format(res));
        }.bind(this);
        var fail = function (err) {
            var start = this.promiseTimes[key].time;
            var duration = moment().from(start, true);
            this.log.warn('\n\t' + 'rejected (%s): '.red + msg + '\t\t' + duration.toString().red + '\n', format(err));
        }.bind(this);
        var fin = function () {
            delete this.promiseTimes[key];
            this._showPromises();
        }.bind(this);

        promise.then(done, fail, progress);
        promise.fin(fin);
    } catch (err) {
        this.log.error('not able to trace promise ' + msg);
    }
};

module.exports = BunyanPromiseLogger;