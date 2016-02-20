/**
 * @project enfslist
 * @filename listSync.js
 * @description sync methods for listing items in directories
 * @author Joao Parreira <joaofrparreira@gmail.com>
 * @copyright Copyright(c) 2016 Joao Parreira <joaofrparreira@gmail.com>
 * @licence Creative Commons Attribution 4.0 International License
 * @createdAt Created at 18-02-2016.
 * @version 0.0.1
 */


"use strict";

var nodePath = require("path"),
    nodeAssert = require("assert"),
    enFs = require("enfspatch");

/**
 * List all items inside a directory and sub-directories
 * @param {string} path - the path to the directory
 * @param {object} options - various options for list module
 *              {bool} opt.dereference - defines the type of stat that will be used in files
 *              {object} opt.fs - the fs module to be used
 * @return {Error|Array}
 */

function list(path, options) {
    var item, items = [], result = [], stats;
    nodeAssert(path, "path must be defined");

    options = options || {};
    options.fs = options.fs || enFs;
    options.dereference = options.dereference === true;
    options.stat = options.dereference ? options.fs.statSync : options.fs.lstatSync;

    items.push(path);

    do {
        item = items.shift();
        stats = options.stat(item);
        result.push({path: item, stat: stats});
        if (stats.isDirectory()) {
            items = items.concat(options.fs.readdirSync(item).map(function(m) {
                return nodePath.join(item, m)
            }));
        }
    } while (items.length);
    return result;
}


module.exports = list;
