/**
 * @project enfslist
 * @filename listAsync.js
 * @description async methods for listing items in directories
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
 * @param {object} opt - various options for list module
 *              {bool} opt.dereference - defines the type of stat that will be used in files
 *              {object} opt.fs - the fs module to be used
 * @param {function} callback - the callback function that will be called after the list is done
 * @return {Error|Array}
 */
function list(path, opt, callback) {
    var options;

    if (typeof opt === "function" && !callback) {
        callback = opt;
        opt = {};
    }

    nodeAssert(path, "'path' is required");
    nodeAssert(callback, "'callback' is required");


    options = opt || {};
    options.fs = options.fs || enFs;
    options.dereference = options.dereference === true;
    options.stat = options.dereference ? options.fs.stat : options.fs.lstat;
    listFiles(path, options, callback);
}

function listFiles(path, options, callback) {
    var result = [];
    options.stat(path, function(err, stats) {
        if (err) {
            return callback(err);
        }
        result.push({path: path, stat: stats});
        if (stats.isDirectory()) {
            options.fs.readdir(path, function(errReadDir, files) {
                var filesLength;
                if (errReadDir) {
                    return callback(errReadDir);
                }
                filesLength = files.length;
                if (filesLength === 0) {
                    return callback(null, result);
                }
                files.forEach(function(file) {
                    var filePath;
                    filePath = nodePath.join(path, file);
                    listFiles(filePath, options, function(errList, r) {
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

module.exports = list;
