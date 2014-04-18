"use strict";

/* Services */

angular.module( "trelloBlogServices", [] )
  .service( "I18n", ["$rootScope", "tmhDynamicLocale", "LOCALES", "config",
    function ( $rootScope, tmhDynamicLocale, LOCALES, config ) {
      // By default, use browser language
      $rootScope.locale = navigator.language.toLocaleLowerCase();

      // Keep a reference of the current locale
      var currentLocale = navigator.language.toLocaleLowerCase();

      // On locale change, load correct file and memorize locale
      $rootScope.$watch( "locale", function ( newLocale ) {
        tmhDynamicLocale.set( newLocale.toLocaleLowerCase() );
        currentLocale = newLocale.toLocaleLowerCase();

        $rootScope.locale = currentLocale;
        $rootScope.shortLocale = currentLocale.split( "-" )[0];
      } );

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
  .service( "Trello", ["$http", "config", "$rootScope", function ( $http, config, $rootScope ) {

    var model = {
      error: null
    };

    return {
      load: function () {
        // TODO Remove unused elements
        $http.get( "https://api.trello.com/1/boards/" + config.trello.board +
                   "/?key=" + config.trello.apiKey +
                   "&lists=open&cards=open&members=all&card_checklists=all" ).then( function ( res ) {
          model.name = res.data.name;
          model.desc = res.data.desc;
          model.lists = res.data.lists;
          model.checklists = res.data.checklists;
          model.members = res.data.members;
          model.labels = res.data.labelNames;

          model.cards = _.sortBy( res.data.cards, function ( post ) {
            return new Date( post.due ).getTime();
          } ).reverse();

          // Add members information into cards model
          _.forEach( model.cards, function ( card ) {
            card.members = [];
            _.forEach( card.idMembers, function ( member ) {
              card.members.push( _.findWhere( model.members, {id: member} ) );
            } );
          } );
          $rootScope.offline = false;

          localStorage.setItem( "model", JSON.stringify( model ) );
        }, function ( res ) {
          var local = JSON.parse( localStorage.getItem( "model" ) );

          model.error = 'Trello data access failed: ' + res.responseText;
          $rootScope.offline = true;

          if ( local !== null ) {
            model.name = local.name;
            model.desc = local.desc;
            model.lists = local.lists;
            model.checklists = local.checklists;
            model.members = local.members;
            model.labels = local.labelNames;
            model.cards = local.cards;
            model.members = local.members;
          }
        } );
      },

      blog: function () {
        return model;
      }
    };
  }] );
