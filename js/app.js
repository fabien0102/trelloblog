"use strict";

/* App Module */

var app = angular.module( "trelloBlogApp", [
  "trelloBlogControllers",
  "trelloBlogServices",
  "trelloBlogFilters",
  "btford.markdown",
  "ui.bootstrap",
  "tmh.dynamicLocale"
] )
  .config( ["tmhDynamicLocaleProvider", function ( tmhDynamicLocaleProvider ) {
    tmhDynamicLocaleProvider.localeLocationPattern( "bower_components/angular-i18n/angular-locale_{{locale}}.js" );
  }] )
  .run( ["$rootScope", "tmhDynamicLocale", function ( $rootScope, tmhDynamicLocale ) {
    $rootScope.$watch( 'locale', function ( newLocale ) {
      tmhDynamicLocale.set( newLocale );
    } );
    $rootScope.locale = navigator.language.toLowerCase();
  }] );

//app.config([]);