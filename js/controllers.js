"use strict";

/* Controllers */

var trelloBlogControllers = angular.module( "trelloBlogControllers", [] );

trelloBlogControllers.controller( "PostListCtrl", ["$scope",
  function ( $scope ) {
    var success = function ( data ) {
      console.log( data );
      $scope.posts = data;
      $scope.$digest();
    };

    var error = function ( err ) {
      console.log( err );
    };

    Trello.lists.get( "533f122757218a7e2c84c2cb/cards", success, error );
  }
] );

trelloBlogControllers.controller( "PostDetailCtrl", ["$scope",
  function ( $scope ) {

  }
] );
