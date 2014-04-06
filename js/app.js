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
  }] );

//app.config([]);
