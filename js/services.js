"use strict";

/* Services */

angular.module( "trelloBlogServices", [] )
  .service( "I18n", ["$rootScope", "tmhDynamicLocale", "LOCALES", "config",
    function ( $rootScope, tmhDynamicLocale, LOCALES, config ) {
    // Keep a reference of the current locale
    var currentLocale;

    // On locale change, load correct file and memorize locale
    $rootScope.$watch( "locale", function ( newLocale ) {
      tmhDynamicLocale.set( newLocale.toLocaleLowerCase() );
      currentLocale = newLocale.toLocaleLowerCase();

      $rootScope.locale = currentLocale;
      $rootScope.shortLocale = currentLocale.split( "-" )[0];
    } );

    // By default, use browser language
    $rootScope.locale = navigator.language.toLocaleLowerCase();

    return {
      translate: function ( key ) {
        var lang;

        if ( _.has( LOCALES, currentLocale ) ) {
          // Language_Region exist
          lang = currentLocale;
        } else {
          if ( _.has( LOCALES, currentLocale.split( "-" )[0] ) ) {
            // Language exist
            lang = currentLocale.split( "-" )[0];
          } else {
            // Default language
            lang = config.language;
          }
        }

        return LOCALES[lang][key];
      }
    }
    }] )
  .service( "Trello", ["$http", "config", function ( $http, config ) {

    var model = {
      ready: false,
      error: null
    };

    return {
      load: function () {
        // TODO Remove unused elements
        $http.get( "https://api.trello.com/1/boards/" + config.trello.board +
                   "/?key=" + config.trello.apiKey +
                   "&lists=open&cards=open&members=all" ).then( function ( res ) {
          model.ready = true;
          model.name = res.data.name;
          model.desc = res.data.desc;
          //model.cards   = res.data.cards;
          model.lists = res.data.lists;
          model.members = res.data.members;
          model.labels = res.data.labelNames;

          model.cards = _.sortBy( res.data.cards, function ( post ) {
            return new Date( post.due ).getTime();
          } ).reverse();

        }, function ( res ) {
          model.error = 'Trello data access failed: ' + res.responseText;
        } );
      },

      blog: function () {
        return model;
      }
    };
  }] );