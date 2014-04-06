"use strict";

/* Filters */

angular.module("trelloBlogFilters", [])
  .filter("notPastDue", function () {
    return function (posts) {
      if (_.isArray(posts)) {
        return _.filter(posts, function (post) {
          return !_.isNull( post.due ) && new Date( post.due ).getTime() < Date.now();
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
  } )
  .filter( "i18n", ["I18n", function ( I18n ) {
    return function ( key ) {
      return I18n.translate( key );
    };
  }] );
