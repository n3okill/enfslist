/**
 * @project enfslist
 * @filename list.js
 * @description entry point for enfslist module
 * @author Joao Parreira <joaofrparreira@gmail.com>
 * @copyright Copyright(c) 2016 Joao Parreira <joaofrparreira@gmail.com>
 * @licence Creative Commons Attribution 4.0 International License
 * @createdAt Created at 18-02-2016.
 * @version 0.0.1
 */

"use strict";

module.exports = {
    list: require("./listAsync"),
    listSync: require("./listSync")
};
