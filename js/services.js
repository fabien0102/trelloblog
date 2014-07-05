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
          model.members = res.data.members;
          model.labels = res.data.labelNames;

          // Filter `[name]` pattern
          model.lists = _.filter( res.data.lists, function ( list ) {
            return !/^\[.*\]$/.exec( list.name );
          } );

          // Sort by publication date
          model.cards = _.sortBy( res.data.cards, function ( post ) {
            return new Date( post.due ).getTime();
          } ).reverse();

          // Consolidate Trello data
          _.forEach( model.lists, function ( list ) {
            list.tags = [];
            _.forEach( model.cards, function ( card ) {

              // Add members information into cards model
              card.members = [];
              _.forEach( card.idMembers, function ( member ) {
                card.members.push( _.findWhere( model.members, {id: member} ) );
              } );

              // Add tags checklist information into lists model
              if ( card.idList === list.id ) {
                _.forEach( card.checklists, function ( checklist ) {
                  if ( checklist.name.toLowerCase() === "tags" ) {
                    list.tags = _.union( _.flatten( checklist.checkItems, "name" ), list.tags )
                  }
                } );
              }
            } );
            list.tags = _.sortBy(list.tags);
          } );

          $rootScope.offline = false;

          localStorage.setItem( "model", JSON.stringify( model ) );
        }, function ( res ) {
          model = _.extend( model, JSON.parse( localStorage.getItem( "model" ) ) );

          // Use a predictable name for labels.
          model.labels = model.labelNames;

          model.error = 'Trello data access failed: ' + res.responseText;
          $rootScope.offline = true;
        } );
      },

      blog: function () {
        return model;
      }
    };
  }] );
