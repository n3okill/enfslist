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

/* global describe, it, before, after*/
"use strict";

const nodePath = require("path");
const nodeOs = require("os");
const rimraf = require("rimraf");
const cwd = process.cwd();
const fs = require("fs");
const enfsList = require("../");

describe("enfslist async", function () {
    const tmpPath = nodePath.join(nodeOs.tmpdir(), "enfslist");
    const files = ["file1", "file2", "file3", "file4"];
    before(function (done) {
        fs.mkdir(tmpPath, (err) => {
            (err === null).should.be.equal(true);
            process.chdir(tmpPath);
            let filesLength = files.length;
            files.forEach((path) => {
                fs.writeFile(path, "data", "utf8", (errWrite) => {
                    (errWrite === null).should.be.equal(true);
                    if (--filesLength === 0) {
                        done();
                    }
                });
            });
        });
    });
    after(function (done) {
        process.chdir(cwd);
        rimraf(tmpPath, done);
    });
    it("should list files", function (done) {
        //it will return also the base path used to list files
        enfsList.list(tmpPath, function (err, list) {
            (err === null).should.be.equal(true);
            list.length.should.be.equal(files.length + 1); //the +1 is the directory that also appears in the list
            done();
        });
    });
});
