"use strict";

/* Controllers */

var trelloBlogControllers = angular.module( "trelloBlogControllers", [] );

trelloBlogControllers.controller( "PostListCtrl", ["$scope",
  function ( $scope ) {
    var success = function ( data ) {
      console.log( data );
      $scope.title = data.name;
      $scope.$digest();
    };

    var error = function ( err ) {
      console.log( err );
    };

    Trello.boards.get( "c94SaRKm", success, error );
  }
] );

trelloBlogControllers.controller( "PostDetailCtrl", ["$scope",
  function ( $scope ) {

  }
] );
