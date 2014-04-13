"use strict";

/* App Module */

var app = angular.module( "trelloBlogApp", [
  "trelloBlogControllers",
  "trelloBlogConfig",
  "TrelloBlogDirectives",
  "trelloBlogLocales",
  "trelloBlogServices",
  "trelloBlogFilters",
  "trelloBlogAnimations",
  "ui.bootstrap",
  "tmh.dynamicLocale"
] )
  .config( ["tmhDynamicLocaleProvider", function ( tmhDynamicLocaleProvider ) {
    tmhDynamicLocaleProvider.localeLocationPattern( "bower_components/angular-i18n/angular-locale_{{locale}}.js" );
  }] );