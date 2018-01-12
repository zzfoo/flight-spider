"use strict";

var querystring = require("querystring");

var async = require("async");

var data = require("./testData.js");
var configure = require("./configure.js");
var utils = require("./utils.js");
var crawl = require("./spider.js");
var convert = require("./converter");

var datas = {};
var dataArray = [];
function start() {
    crawlOneFlightTrips(configure.oneFlightTrips, function(err) {
        if (err) {
            console.log("err: ", err);
            return;
        }
        crawlNFlightTrips(configure.nFlightTrips, function(err) {
            if (err) {
                console.log("err: ", err);
                return;
            }

            var tripCount = configure.tripCount;
            for (var i = 1; i <= tripCount; i++) {
                dataArray = dataArray.concat(datas[i]);
            }
            // console.log("dataArray: ", dataArray);
            convert(dataArray);
        })
    });
    // searchByTime({
    //     from: "普吉",
    //     to: "上海",
    //     order: 4,
    //   }, "2017-06-02", function(err, data) {

    //   });
}

function crawlNFlightTrips(trips, callback) {
    var tasks = [];
    trips.forEach(function(trip) {
        tasks.push(function(callback) {
            crawlNFlightTrip(trip, function(err, data) {
                if (err) {
                    callback(err);
                    return;
                }
                console.log("callback: ", callback);
                datas[trip.order] = data;
                callback(null);
            });
        });
    })
    async.waterfall(tasks, callback);
}

function crawlNFlightTrip(trip, callback) {
    var now = Date.now(),
        endTime = utils.getNMonthsLaterTime(now, configure.monthCount),
        dates = [];
    while (now <= endTime) {
        dates.push(utils.timeToDayString(now));
        now += 24 * 3600 * 1000;
    }
    console.log("===============================");
    console.log("============" + trip.from + "==============")
    console.log("===============================");
    console.log("============" + trip.to + "==============")
    console.log("===============================");
    console.log("");
    console.log("");
    console.log("");
    // console.log("dates: ", dates);

    var tripDatas = {};
    var tripArray = [];
    async.eachLimit(dates, 1, function(date, callback) {
        searchByTime(trip, date, function(err, data) {
            if (err) {
                callback(err);
                return;
            }
            data.forEach(function(item) {
                if (!tripDatas[item.flight]) {
                    tripDatas[item.flight] = [];
                }
                tripDatas[item.flight].push(item);
            });
            callback(null, data);
        })
    }, function(err, data) {
        if (err) {
            callback(err);
            return;
        }
        console.log(tripDatas);
        for (var p in tripDatas) {
            tripArray = tripArray.concat(tripDatas[p]);
        }
        // tripArray.sort(function(a, b) {
        //     var flightA = Number(a.flight.slice(2));
        //     var flightB = Number(b.flight.slice(2));
        //     console.log(flightA, flightB);
        //     if (flightA !== flightB) {
        //         return flightA > flightB;
        //     }
        //     return getTimeByDate(a.date, "/") > getTimeByDate(b.date, "/");
        // });

        callback(null, tripArray);
    })
}

function searchByTime(trip, date, callback) {
    var postData,
        from = trip.from,
        to = trip.to,
        dateTransformed = date.replace(/-/gi, "/");

    postData = {
        Currency: 0,
        SType: 0,
        Departure: from,
        Arrival: to,
        DepartureDate: date,
        ReturnDate: null,
        IsIJFlight: false,
        IsBg: false,
        IsEmployee: false,
        IsLittleGroupFlight: false,
        SeatsNum: 1,
        ActId: 0,
        IfRet: false,
    };

    crawl({
        postData: postData,
        host: configure.host,
        path: configure.searchPath,
        method: "POST",
    }, function(err, data) {
        var info,
            infos = [];
        data = JSON.parse(data);
        if (!data.Route) {
            console.log("data!!!!!!!!!!1", data);
        }
        data = data.Route;
        data.forEach(function(route) {
            route = route[0];
            infos.push({
                date: dateTransformed,
                from: from,
                to: to,
                flight: route.No,
                price: route.MinCabinPrice,
            });
        });

        console.log("data: ", infos);
        callback(err, infos);
    })
}

function crawlOneFlightTrips(trips, callback) {
    async.each(trips, function(trip, callback) {
        crawlOneFlightTrip(trip, function(err, data) {
            if (err) {
                callback(err);
                return;
            }
            datas[trip.order] = data;
            callback(null, data);
        });
    }, function(err, data) {
        if (err) {
            callback(err);
            return;
        }
        callback(null, data);
    })
}

function crawlOneFlightTrip(trip, callback) {
    var postData,
        from = trip.from,
        to = trip.to,
        // flight = trip.flight,
        order = trip.order;
    var now = Date.now(),
        beginDate = utils.timeToDayString(now),
        endDate = utils.timeToDayString(utils.getNMonthsLaterTime(now, configure.monthCount));
    postData = {
        Departure: from,
        Arrival: to,
        Currency: 0,
        SType: 0,
        IsIJFlight: false,
        Days: -1,
        IfRet: false,
        ActId: 0,
        IsReturn: false,
        BeginDate: beginDate,
        EndDate: endDate,
    };

    console.log("===============================");
    console.log("============" + trip.from + "==============")
    console.log("===============================");
    console.log("============" + trip.to + "==============")
    console.log("===============================");
    console.log("");
    console.log("");
    console.log("");

    crawl({
        postData: postData,
        host: configure.host,
        path: configure.minPricePath,
        method: "POST",
    }, function(err, data) {
        data = JSON.parse(data);
        data = data.PriceTrends;
        data = data.map(function(item) {
            return {
                date: item.Date.replace(/-/gi, "/"),
                from: from,
                to: to,
                flight: "",
                price: item.Price || 0,
            };
        });
        callback(err, data);
    })
}

start();
