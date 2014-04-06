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
  .filter("currentLanguage", ["config", function(config){

    var filter;

    if(config.multilingual) {
      filter = function (posts, locale){
        var currentLanguage = locale.split("-")[0].toLowerCase();

        return _.filter(posts, function (post) {
          var isCurrentLanguage = true;

          _.each(post.labels, function (label) {
            if (label.name.toLowerCase() === currentLanguage) {
              isCurrentLanguage = false;
            }
          });

          return !isCurrentLanguage;
        });
      }
    } else {
      filter = function (posts) {
        return posts; // By default we accept all posts
      };
    }

    return filter;
  }])
  .filter( "i18n", ["I18n", function ( I18n ) {
    return function ( key ) {
      return I18n.translate( key );
    };
  }] );
