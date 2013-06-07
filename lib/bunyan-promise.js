'use strict';

require('colors');
var _ = require('lodash');
var moment = require('moment');
var bunyan = require('bunyan');
var q = require('q');

var defaults = {
    name: 'bunyan-promise-log',
    level: 'trace'
};

var BunyanPromiseLogger = function (options) {
    _.defaults(options, defaults);
    this.log = bunyan.createLogger(options);
    this.promiseTimes = {};
};

BunyanPromiseLogger.prototype._showPromises = function () {
    var log = '---WAITING ON THE FOLLOWING---';
    _.each(this.promiseTimes, function (date, msg) {
        log += '\n\t';
        log += msg;
        log += '\t\t';
        log += moment(date).fromNow().toString().green;
    }, this);
    log += '\n------------------------------\n\n';
    this.log.trace(log);
};

BunyanPromiseLogger.prototype.trace = function (promise, msg) {
    this.promiseTimes[msg] = new Date();
    this._showPromises();
    var qPromise = q.when(promise);
    qPromise.progress(function (progress) {
        this.log.trace(msg.yellow, progress);
    }.bind(this));
    qPromise.fail(function (err) {
        this.log.warn(msg.red, err);
    }.bind(this));
    qPromise.fin(function () {
        var start = this.promiseTimes[msg];
        var duration = moment().from(start, true);
        this.log.trace(msg, duration);
        delete this.promiseTimes[msg];
        this._showPromises();
    }.bind(this));
};

module.exports = BunyanPromiseLogger;