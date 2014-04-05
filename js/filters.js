"use strict";

/* Filters */

angular.module("trelloBlogFilters", [])
  .filter("notPastDue", function () {
    return function (input) {
      if (_.isArray(input)) {
        return _.filter(input, function (item) {
          return new Date(item.due).getTime() < Date.now();
        });
      }
    };
  });
