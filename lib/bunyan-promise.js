'use strict';

require('colors');
var _ = require('lodash');
var moment = require('moment');
var bunyan = require('bunyan');
var q = require('q');

var defaults = {
    name: 'anonymous-bunyan-promise-log',
    level: 'trace'
};

var isFormattable = function (arg) {
    return _.isNumber(arg) || _.isString(arg) || _.isBoolean(arg) || _.isDate(arg) || _.isNull(arg) || _.isUndefined(arg);
};

var format = function (arg) {
    if (isFormattable(arg)) {
        return arg;
    } else {
        return typeof arg;
    }
};

var BunyanPromiseLogger = function (options) {
    _.defaults(options, defaults);
    this.log = bunyan.createLogger(options);
    this.promiseTimes = {};
};

BunyanPromiseLogger.prototype._showPromises = function () {
    var log = '\n--- OUTSTANDING PROMISES ---\n'.cyan;
    _.each(this.promiseTimes, function (date, msg) {
        log += '\n\t'.cyan;
        log += msg.cyan;
        log += '\t\t'.cyan;
        log += moment(date).fromNow().toString().green;
    }, this);
    log += '\n\n------------------------------\n\n'.cyan;
    this.log.trace(log);
};

BunyanPromiseLogger.prototype.trace = function (p, msg) {
    var promise = q.when(p);
    this.promiseTimes[msg] = new Date();
    this._showPromises();
    var progress = function (progress) {
        var start = this.promiseTimes[msg];
        var duration = moment().from(start, true);
        this.log.trace('\n\t' + 'progress (%s): '.yellow + msg + '\t\t' + duration.toString().green + '\n', format(progress));
    }.bind(this);
    var done = function (res) {
        var start = this.promiseTimes[msg];
        var duration = moment().from(start, true);
        this.log.trace('\n\t' + 'resolved (%s): '.green + msg + '\t\t' + duration.toString().green + '\n', format(res));
    }.bind(this);
    var fail = function (err) {
        var start = this.promiseTimes[msg];
        var duration = moment().from(start, true);
        this.log.warn('\n\t' + 'rejected (%s): '.red + msg + '\t\t' + duration.toString().red + '\n', format(err));
    }.bind(this);
    var fin = function () {
        delete this.promiseTimes[msg];
        this._showPromises();
    }.bind(this);

    promise.then(done, fail, progress);
    promise.fin(fin);
};

module.exports = BunyanPromiseLogger;