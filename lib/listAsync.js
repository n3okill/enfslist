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
const enFs = require("enfspatch");


function defineOptions(opts) {
    let options = opts || {};
    options.fs = options.fs || enFs;
    options.dereference = options.dereference === true;
    options.stat = options.dereference ? options.fs.stat : options.fs.lstat;
    options.back = options.back || 0;
    options.ignoreAccessError = options.hasOwnProperty("ignoreAccessError") ? options.ignoreAccessError : false;
    let stats2 = new options.fs.Stats();
    options.showStats = options.stats && options.stats.length ? options.stats : Object.getOwnPropertyNames(stats2).concat(Object.getOwnPropertyNames(Object.getPrototypeOf(stats2)));
    return options;
}




function getResult(path, stats, options) {
    let miniStats = {};
    options.showStats.forEach(k => miniStats[k] = stats[k]);
    return options.back === 2 ? miniStats : options.back ? path : {path: path, stat: miniStats};
}


function readdir(path, options, callback) {
    let result = [];
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
}


function listFiles(path, options, callback) {
    let result = [];
    options.stat(path, (err, stats) => {
        if (err) {
            if (err.code === "ENOENT" && options.ignoreAccessError) {
                return callback(null, result);
            }
            return callback(err);
        }
        result.push(getResult(path, stats, options));

        if (stats.isDirectory()) {
            readdir(path, options, (errReaddir, r)=>{
                if(errReaddir) {
                    return callback(errReaddir);
                }
                result = result.concat(r);
                return callback(null, result);
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

    listFiles(path, defineOptions(opt), callback);
}

module.exports = list;
