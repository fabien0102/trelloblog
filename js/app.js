"use strict";

/* App Module */

var app = angular.module( "trelloBlogApp", [
  "trelloBlogControllers",
  "trelloBlogLocales",
  "trelloBlogServices",
  "trelloBlogFilters",
  "trelloBlogAnimations",
  "btford.markdown",
  "ui.bootstrap",
  "tmh.dynamicLocale"
] )
  .config( ["tmhDynamicLocaleProvider", function ( tmhDynamicLocaleProvider ) {
    tmhDynamicLocaleProvider.localeLocationPattern( "bower_components/angular-i18n/angular-locale_{{locale}}.js" );
  }] )
  .run( ["$rootScope", "I18n", function ( $rootScope, I18n ) {

    $rootScope.i18n = function ( key ) {
      return I18n.translate( key );
    };

  }] );

//app.config([]);
