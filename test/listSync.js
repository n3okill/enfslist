/*global describe, __dirname*/
/**
 * Created by JParreir on 28-12-2015.
 */

"use strict";

var nodePath = require("path"),
    list = require("../");

describe("enfslistSync", function() {
    var tmpPath = nodePath.join(__dirname, "..", "lib");
    it("should list files", function(done) {
        //it will return also the base path used to list files
        var files = list.listSync(tmpPath);
        files.length.should.be.equal(4);
        done();
    });
});
