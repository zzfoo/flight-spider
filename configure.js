"use strict";

var configure = {
    host: "flights.ch.com",
    minPricePath: "/Flights/MinPriceTrends",
    searchPath: "/Flights/SearchByTime",
    depaturePlace: "上海",
    monthCount: 5,
    oneFlightTrips: [
    {
      from: "上海",
      to: "清迈", // 清迈
      // flight: "9C8979",
      order: 1,
    },
    {
      from: "清迈", // 清迈
      to: "上海",
      // flight: "9C8980",
      order: 2,
    },
    {
      from: "上海",
      to: "普吉",
      // flight: "9C8971",
      order: 3,
    },{
      from: "普吉",
      to: "上海",
      // flight: "9C8972",
      order: 4,
    },{
      from: "上海",
      to: "素叻他尼(近苏梅岛)",
      // flight: "9C8771",
      order: 5,
    },
    {
      from: "素叻他尼(近苏梅岛)",
      to: "上海",
      // flight: "9C8772",
      order: 6,
    },
    {
      from: "上海",
      to: "甲米",
      // flight: "9C8519",
      order: 7,
    },
    {
      from: "甲米",
      to: "上海",
      // flight: "9C8520",
      order: 8,
    },
    ],
    nFlightTrips:
    [
      {
        from: "上海",
        to: "曼谷",
        order: 9,
      },
      {
        from: "曼谷",
        to: "上海",
        order: 10,
      },
    ],
    tripCount: 10,
};

module.exports = configure;