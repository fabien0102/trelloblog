"use strict";

/* Filters */

angular.module( "trelloBlogFilters", [] )

  .filter( "notPastDue", function () {
    return function ( posts ) {
      if ( _.isArray( posts ) ) {
        return _.filter( posts, function ( post ) {
          return !_.isNull( post.due ) && new Date( post.due ).getTime() < Date.now();
        } );
      }
    };
  } )

  .filter( "published", ["config", function ( config ) {
    return function ( posts ) {
      return _.filter( posts, function ( post ) {
        var draft = false;
        _.each( post.labels, function ( label ) {
          if ( label.name.toLowerCase() === config.trello.draftLabel ) {
            draft = true;
          }
        } );
        return !draft;
      } );
    };
  }] )

  .filter( "currentLanguage", ["config", function ( config ) {
    var filter;

    if ( config.multilingual ) {
      filter = function ( posts, locale ) {
        var currentLanguage = locale.split( "-" )[0].toLowerCase();

        return _.filter( posts, function ( post ) {
          var isCurrentLanguage = true;

          _.each( post.labels, function ( label ) {
            if ( label.name.toLowerCase() === currentLanguage ) {
              isCurrentLanguage = false;
            }
          } );

          return !isCurrentLanguage;
        } );
      }
    } else {
      filter = function ( posts ) {
        return posts; // By default we accept all posts
      };
    }

    return filter;
  }] )

  .filter( "category", ["$rootScope", function ( $rootScope ) {
    return function ( posts ) {
      if ( $rootScope.category ) {
        return _.filter( posts, {idList: $rootScope.category} );
      } else if ( $rootScope.subcategory ) {
        return _.filter( posts, function ( post ) {
          var inThisSubCategory = false;
          _.forEach( post.checklists, function ( checklist ) {
            if ( checklist.name.toLowerCase() === "tags" ) {
              if ( _.find( checklist.checkItems, {name: $rootScope.subcategory} ) ) inThisSubCategory = true;
            }
          } );
          return inThisSubCategory;
        } );
      } else {
        return posts;
      }
    }
  }] )

  .filter( "i18n", ["I18n", function ( I18n ) {
    return function ( key ) {
      return I18n.translate( key );
    };
  }] )

  .filter( "lang", [function () {
    return function ( code ) {
      switch ( code ) {
      case "fr":
        return "Français";
      case "en":
        return "English";
      case "es":
        return "Español";
      }
    };
  }] )

  .filter( "tags", [function () {
    return function ( checklists ) {
      var tagChecklist = _.filter( checklists, function ( checklist ) {
        return checklist.name.toLowerCase() === "tags";
      } )[0] || {checkItems: []};
      return tagChecklist.checkItems;
    };
  }] );
