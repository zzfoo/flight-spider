"use strict";

var utils = {};

utils.timeToDayString = function(time) {
    var y,
        m,
        d,
        date,
        string;
    string = "";
    date = new Date(time);
    y = date.getFullYear();
    string += y;

    string += "-";
    m = date.getMonth() + 1;
    if (m < 10) {
        string += "0" + m;
    } else {
        string += m;
    }

    string += "-";
    d = date.getDate();
    if (d < 10) {
        string += "0" + d;
    } else {
        string += d;
    }
    return string;
}

utils.getNMonthsLaterTime = function(time, n) {
    var m,
        date = new Date(time);
    m = date.getMonth() + n;
    date.setMonth(m);
    return date.getTime();
}

utils.getTimeByDate = function(date, divider) {
    var y, m, d;
    var arr = date.split(divider);
    y = Number(arr[0]);
    m = arr[1];
    m = m[0] === "0" ? Number(m[1]) : Number(m);
    m -= 1;
    d = arr[2];
    d = d[0] === "0" ? Number(d[1]) : Number(d);
    console.log(y, m, d);
    return new Date(y, m, d).getTime();
}

module.exports = utils;













