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

var BunyanPromiseLogger = function (options) {
    _.defaults(options, defaults);
    this.log = bunyan.createLogger(options);
    this.promiseTimes = {};
};

BunyanPromiseLogger.prototype._showPromises = function () {
    var log = '\n---WAITING ON THE FOLLOWING---\n';
    _.each(this.promiseTimes, function (date, msg) {
        log += '\n\t';
        log += msg;
        log += '\t\t';
        log += moment(date).fromNow().toString().green;
    }, this);
    log += '\n\n------------------------------\n\n';
    this.log.trace(log);
};

BunyanPromiseLogger.prototype.trace = function (p, msg) {
    var promise = q.when(p);
    this.promiseTimes[msg] = new Date();
    this._showPromises();
    var progress = function (progress) {
        var start = this.promiseTimes[msg];
        var duration = moment().from(start, true);
        this.log.trace('\n\t' + 'progress%s: '.yellow + msg + '\t\t' + duration.toString().green + '\n', progress ? ' (' + progress + ')' : '');
    }.bind(this);
    var done = function () {
        console.log('done');
        var start = this.promiseTimes[msg];
        var duration = moment().from(start, true);
        this.log.trace('\n\t' + 'resolved: '.green + msg + '\t\t' + duration.toString().green + '\n');
    }.bind(this);
    var fail = function (err) {
        var start = this.promiseTimes[msg];
        var duration = moment().from(start, true);
        this.log.warn('\n\t' + 'rejected%s: '.red + msg + '\t\t' + duration.toString().red + '\n', err ? ' (' + err + ')' : '');
    }.bind(this);
    var fin = function () {
        delete this.promiseTimes[msg];
        this._showPromises();
    }.bind(this);

    promise.then(done, fail, progress);
    promise.fin(fin);
};

module.exports = BunyanPromiseLogger;