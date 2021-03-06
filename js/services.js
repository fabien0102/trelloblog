"use strict";

/* Services */

angular.module( "trelloBlogServices", [] )
  .service( "I18n", ["$rootScope", "tmhDynamicLocale", "LOCALES", "config",
    function ( $rootScope, tmhDynamicLocale, LOCALES, config ) {
      // By default, use browser language
      $rootScope.locale = config.multilingual ? navigator.language.toLocaleLowerCase() : config.language;

      // Keep a reference of the current locale
      var currentLocale = config.multilingual ? navigator.language.toLocaleLowerCase() : config.language;

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
          model.config = {};

          // Filter `[name]` pattern
          model.lists = _.filter( res.data.lists, function ( list ) {
            return !/^\[.*\]$/.exec( list.name );
          } );
          var configList = _.findWhere( res.data.lists, { name: config.configurationList }) || {};


          // Sort by publication date
          model.cards = _.sortBy( res.data.cards, function ( post ) {
            return new Date( post.due ).getTime();
          } ).reverse();

          // Consolidate Trello data
          _.forEach( model.lists, function ( list ) {
            list.tags = [];
            list.labels = {};
            _.forEach( model.cards, function ( card ) {
              if ( card.idList === configList.id ) {
                if (!model.config[card.name]) model.config[card.name] = {};
                if (!_.isEmpty(card.labels) && config.multilingual) {
                  _.forEach( card.labels, function ( label ) {
                    model.config[card.name][label.name] = card.desc;
                  } );
                } else {
                  model.config[card.name][config.language] = card.desc;
                }
                return; // Next card
              }

              // Add members information into cards model
              card.members = [];
              _.forEach( card.idMembers, function ( member ) {
                card.members.push( _.findWhere( model.members, {id: member} ) );
              } );

              // Meld card and list information
              if ( card.idList === list.id ) {
                // Add listName into each card
                card.listName = list.name;

                // Add tags checklist information into lists model
                _.forEach( card.checklists, function ( checklist ) {
                  if ( checklist.name.toLowerCase() === "tags" ) {
                    _.forEach( checklist.checkItems, function ( tag ) {
                      var listTag = _.find( list.tags, { name: tag.name } );
                      if ( listTag ) listTag.labels = _.union( listTag.labels, card.labels );
                      else list.tags.push( _.extend( tag, { labels: card.labels } ) );
                    } );
                  }
                } );

                // Add langs available in the list
                list.labels = _.union( list.labels, card.labels );
              }
            } );
            // Delete duplicate
            list.tags = _.uniq( list.tags, "name" );

            // Sort tags by name (ascending)
            list.tags = list.tags.sort( function ( a, b ) {
              var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase();
              if (nameA < nameB) return -1; //sort string ascending
              if (nameA > nameB) return 1;
              return 0; //default return value (no sorting)
              } );
            list.labels = _.uniq( list.labels, "name" );

            // Delete duplicate list.tags.labels
            _.forEach( list.tags, function ( tag ) {
              tag.labels = _.uniq(tag.labels, "name");
            } );

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
