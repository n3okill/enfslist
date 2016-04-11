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

const nodePath = require("path");
const list = require("../");

describe("enfslist", function() {
    var tmpPath = nodePath.join(__dirname, "..", "lib");
    it("should list files", function(done) {
        //it will return also the base path used to list files
        list.list(tmpPath, function(err, list) {
            (err === null).should.be.equal(true);
            list.length.should.be.equal(4);
            done();
        });
    });
});
