/**
 * @project enf
 * @filename util.js
 * @author Joao Parreira <joaofrparreira@gmail.com>
 * @copyright Copyright(c) 2017 Joao Parreira <joaofrparreira@gmail.com>
 * @licence Creative Commons Attribution 4.0 International License
 * @createdAt Created at 15-02-2017
 * @version 0.1.1
 * @description utilities for enfslist
 */

"use strict";

const enFs = require("enfspatch");

function getOptions(opt) {
    let options = opt || {};
    options.fs = options.fs || enFs;
    options.dereference = options.dereference === true;
    options.back = options.back || 0;
    options.ignoreAccessError = options.hasOwnProperty("ignoreAccessError") ? options.ignoreAccessError : false;
    let stats2 = new options.fs.Stats();
    options.showStats = options.stats && options.stats.length ? options.stats : Object.getOwnPropertyNames(stats2).concat(Object.getOwnPropertyNames(Object.getPrototypeOf(stats2)));
    return options;
}

function getResult(options, path, stats) {
    let miniStats = {};
    options.showStats.forEach((k) => miniStats[k] = stats[k]);
    return options.back === 2 ? miniStats : options.back === 1 ? path : {path: path, stat: miniStats};
}

module.exports = {
    getOptions: getOptions,
    getResult: getResult
};