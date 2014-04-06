"use strict";

/* Services */

angular.module( "trelloBlogServices", [] )
  .service( 'config', ["$http", function ( $http ) {
    return $http.get( 'config.json' );
  }] );