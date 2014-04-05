"use strict";

/* Controllers */

var trelloBlogControllers = angular.module( "trelloBlogControllers", [] );

trelloBlogControllers.controller( "PostListCtrl", ["$scope",
  function ( $scope ) {
    $scope.title = "test";
  }
] );

trelloBlogControllers.controller( "PostDetailCtrl", ["$scope",
  function ( $scope ) {

  }
] );
