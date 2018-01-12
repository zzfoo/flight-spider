"use strict";

var https = require("https");
var querystring = require("querystring");

function crawl(postData, callback) {
    post(postData, callback);
}

function post(options, callback) {
    var options,
        req,
        reqOptions,
        postData;
    // var postData = JSON.stringify(data);
    // console.log("postData: ", postData);
    // var options = {
    //     host: host,
    //     port: port,
    //     method: "POST",
    //     path: path,
    //     headers: {
    //         "Content-Type": "application/json",
    //         "Content-Length": postData.length
    //     }
    // };
    postData = options.postData;
    postData = querystring.stringify(postData);
    // console.log("postData: ", postData);
    reqOptions = {
        host: options.host,
        path: options.path,
        method: options.method,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': postData.length,
        }
    };
    var data = "";
    req = https.request(reqOptions, function(res) {
        res.setEncoding("utf8");
        res.on("data", function(chunk) {
            data += chunk;
            // callback(null, chunk);
        });
        res.on("end", function() {
            callback(null, data);
        })
    })

    req.on("error", function(err) {
        console.log("err: ", err);
        callback(err);
    })

    req.write(postData);
    req.end();
}

module.exports = crawl;