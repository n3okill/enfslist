/**
 * @project enfslist
 * @filename listSync.js
 * @description sync methods for listing items in directories
 * @author Joao Parreira <joaofrparreira@gmail.com>
 * @copyright Copyright(c) 2016 Joao Parreira <joaofrparreira@gmail.com>
 * @licence Creative Commons Attribution 4.0 International License
 * @createdAt Created at 18-02-2016.
 * @version 0.1.1
 */


"use strict";

const nodePath = require("path");
const nodeAssert = require("assert");
const util = require("./util");

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
    let items = [], result = [];
    nodeAssert(path, "path must be defined");

    const options = util.getOptions(opt);
    options.stat = options.dereference ? options.fs.statSync : options.fs.lstatSync;

    items.push(path);
    do {
        const item = items.shift();
        let stats;
        try {
            stats = options.stat(item);
        } catch (err) {
            if (!(err.code === "ENOENT" && options.ignoreAccessError)) {
                throw err;
            }
        }
        result.push(util.getResult(options,item,stats));
        if (stats.isDirectory()) {
            try {
                items = items.concat(options.fs.readdirSync(item).map((m) => {
                    return nodePath.join(item, m);
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
