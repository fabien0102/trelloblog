"use strict";

/* Filters */

angular.module("trelloBlogFilters", [])
  .filter("notPastDue", function () {
    return function (posts) {
      if (_.isArray(posts)) {
        return _.filter(posts, function (post) {
          return new Date(post.due).getTime() < Date.now();
        });
      }
    };
  })
  .filter("published", function () {
    return function (posts) {
      return _.filter(posts, function (post) {
        var draft = false;
        _.each(post.labels, function (label) {
          if (label.name === "Draft") {
            draft = true;
          }
        });
        return !draft;
      });
    };
  });
