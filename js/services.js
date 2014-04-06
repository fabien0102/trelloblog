"use strict";

/* Services */

angular.module( "trelloBlogServices", [] )
  .service( "config", ["$http", function ( $http ) {
    return $http.get( "config.json" );
  }] )
  .service( "I18n", ["$rootScope", "tmhDynamicLocale", "Locales", function ( $rootScope, tmhDynamicLocale, Locales ) {
    // Keep a reference of the current locale
    var currentLocale;

    // On locale change, load correct file and memorize locale
    $rootScope.$watch( "locale", function ( newLocale ) {
      tmhDynamicLocale.set( newLocale.toLocaleLowerCase() );
      currentLocale = newLocale.toLocaleLowerCase();
    } );

    // By default, use browser language
    $rootScope.locale = navigator.language.toLocaleLowerCase();

    return {
      translate: function ( key ) {
        var lang;

        if ( _.has( Locales, currentLocale ) ) {
          // Language_Region exist
          lang = currentLocale;
        } else {
          if ( _.has( Locales, currentLocale.split( "-" )[0] ) ) {
            // Language exist
            lang = currentLocale.split( "-" )[0];
          } else {
            // Default language
            lang = Locales.default;
          }
        }

        return Locales[lang][key];
      }
    }
  }] );