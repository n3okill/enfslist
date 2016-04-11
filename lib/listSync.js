/**
 * @project enfslist
 * @filename listSync.js
 * @description sync methods for listing items in directories
 * @author Joao Parreira <joaofrparreira@gmail.com>
 * @copyright Copyright(c) 2016 Joao Parreira <joaofrparreira@gmail.com>
 * @licence Creative Commons Attribution 4.0 International License
 * @createdAt Created at 18-02-2016.
 * @version 0.1.0
 */


"use strict";

const nodePath = require("path");
const nodeAssert = require("assert");
const enFs = require("enfspatch");


/**
 * List all items inside a directory and sub-directories
 * @param {string} path - the path to the directory
 * @param {object} opt - various options for list module
 *              {bool} opt.dereference - defines the type of stat that will be used in files
 *              {object} opt.fs - the fs module to be used
 *              {number} opt.back - the elements to return (0- both[path and stats], 1 - path, 2 - stats)
 *              {array} opt.stats - return only the required stats information
 *              {bool} opt.ignoreAccessError - if true will ignore all directories without reading access (default false)
 * @return {Error|Array}
 */

function list(path, opt) {
    let items = [], result = [], options;
    nodeAssert(path, "path must be defined");

    options = opt || {};
    options.fs = options.fs || enFs;
    options.dereference = options.dereference === true;
    options.stat = options.dereference ? options.fs.statSync : options.fs.lstatSync;
    options.ignoreAccessError = options.hasOwnProperty("ignoreAccessError") ? options.ignoreAccessError : false;
    const back = options.back || 0;
    const stats2 = new options.fs.Stats();
    const showStats = options.stats && options.stats.length ? options.stats : Object.getOwnPropertyNames(stats2).concat(Object.getOwnPropertyNames(Object.getPrototypeOf(stats2)));

    items.push(path);
    do {
        const item = items.shift();
        let stats;
        try {
            stats = options.stat(item);
        } catch (err) {
            if (err.code === "ENOENT" && options.ignoreAccessError) {
                continue;
            } else {
                throw err;
            }
        }
        let miniStats = {};
        showStats.forEach(k=>miniStats[k] = stats[k]);
        result.push(back === 2 ? miniStats : back === 1 ? item : {path: item, stat: miniStats});
        if (stats.isDirectory()) {
            try {
                items = items.concat(options.fs.readdirSync(item).map(m => {
                    return nodePath.join(item, m)
                }));
            } catch (err) {
                if (!options.ignoreAccessError || (options.ignoreAccessError && !(err.code === "EACCES" || err.code === "EPERM"))) {
                    throw err;
                }
            }
        }
    } while (items.length);

    return result;
}


module.exports = list;
