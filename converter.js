"use strict";

var fs = require("fs");
var json2xls = require("json2xls");

var convert = function(data) {
    var xls = json2xls(data);

    fs.writeFileSync('data.xlsx', xls, 'binary');
}

module.exports = convert;