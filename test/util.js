/**
 * @project enf
 * @filename util.js
 * @author Joao Parreira <joaofrparreira@gmail.com>
 * @copyright Copyright(c) 2017 Joao Parreira <joaofrparreira@gmail.com>
 * @licence Creative Commons Attribution 4.0 International License
 * @createdAt Created at 15-02-2017
 * @version 0.0.1
 * @description
 */

"use strict";

const fs = require("fs");
const rimraf = require("rimraf");
const cwd = process.cwd();

module.exports = {
    before: (path, files, done) => {
        fs.mkdir(path, (err) => {
            (err === null).should.be.equal(true);
            process.chdir(path);
            let filesLength = files.length;
            files.forEach((p) => {
                fs.writeFile(p, "data", "utf8", (errWrite) => {
                    (errWrite === null).should.be.equal(true);
                    if (--filesLength === 0) {
                        done();
                    }
                });
            });
        });
    },
    after: (path, done) => {
        process.chdir(cwd);
        rimraf(path, done);
    }
};