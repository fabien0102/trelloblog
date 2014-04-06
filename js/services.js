"use strict";

/* Services */

angular.module( "trelloBlogServices", [] )
  .service( "I18n", ["$rootScope", "tmhDynamicLocale", "LOCALES", function ( $rootScope, tmhDynamicLocale, LOCALES ) {
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

        if ( _.has( LOCALES, currentLocale ) ) {
          // Language_Region exist
          lang = currentLocale;
        } else {
          if ( _.has( LOCALES, currentLocale.split( "-" )[0] ) ) {
            // Language exist
            lang = currentLocale.split( "-" )[0];
          } else {
            // Default language
            lang = LOCALES.default;
          }
        }

        return LOCALES[lang][key];
      }
    }
  }] );