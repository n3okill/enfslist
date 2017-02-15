/**
 * @project enfslist
 * @filename listAsync.js
 * @description async methods for listing items in directories
 * @author Joao Parreira <joaofrparreira@gmail.com>
 * @copyright Copyright(c) 2016 Joao Parreira <joaofrparreira@gmail.com>
 * @licence Creative Commons Attribution 4.0 International License
 * @createdAt Created at 18-02-2016.
 * @version 0.1.0
 */

"use strict";


const nodePath = require("path");
const nodeAssert = require("assert");
const util = require("./util");




function listFiles(path, options, callback) {
    let result = [];
    options.stat(path, (err, stats) => {
        if (err) {
            if (err.code === "ENOENT" && options.ignoreAccessError) {
                return callback(null, result);
            }
            return callback(err);
        }
        result.push(util.getResult(options, path, stats));
        if (stats.isDirectory()) {
            options.fs.readdir(path, (errReadDir, files) => {
                if (errReadDir) {
                    if (!options.ignoreAccessError || (options.ignoreAccessError && !(errReadDir.code === "EACCES" || errReadDir.code === "EPERM"))) {
                        return callback(errReadDir);
                    }
                    return callback(null, result);
                }
                let filesLength = files.length;
                if (filesLength === 0) {
                    return callback(null, result);
                }
                files.forEach((file) => {
                    let filePath = nodePath.join(path, file);
                    listFiles(filePath, options, (errList, r) => {
                        if (errList) {
                            return callback(errList);
                        }
                        result = result.concat(r);
                        if (--filesLength === 0) {
                            return callback(null, result);
                        }
                    });
                });
            });
        } else {
            return callback(null, result);
        }
    });
}


/**
 * List all items inside a directory and sub-directories
 * @param {string} path - the path to the directory
 * @param {object} opt - various options for list module
 *              {bool} opt.dereference - defines the type of stat that will be used in files
 *              {object} opt.fs - the fs module to be used
 *              {number} opt.back - the elements to return (0- both[path and stats], 1 - path, 2 - stats)
 *              {array} opt.stats - return only the required stats information
 *              {bool} opt.ignoreAccessError - if true will ignore all files that can't be accessed (default false)
 * @param {function} callback - the callback function that will be called after the list is done
 * @return {Error|Array}
 */
function list(path, opt, callback) {
    if (typeof opt === "function" && !callback) {
        callback = opt;
        opt = {};
    }

    nodeAssert(path, "'path' is required");
    nodeAssert(callback, "'callback' is required");

    const options = util.getOptions(opt);
    options.stat = options.dereference ? options.fs.stat : options.fs.lstat;

    listFiles(path, options, callback);
}

module.exports = list;