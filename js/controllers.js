"use strict";

/* Controllers */

angular.module( "trelloBlogControllers", [] )
  .controller( "PostListCtrl", ["$scope", "Trello", function ( $scope, Trello ) {
    $scope.dateFormat = 'fullDate';

    Trello.load();
    $scope.trello = Trello.blog();
  }
  ] )
  .controller( "AsideCtrl", ["$scope", "Trello", "config", function ( $scope, Trello, config ) {
    $scope.config = config;
    $scope.trello = Trello.blog();
  }] )
  .controller( "NavigationCtrl", ["$scope", "Trello", function ( $scope, Trello ) {
    $scope.trello = Trello.blog();
  }] )
  .controller( "HeadCtrl", ["$scope", "Trello", function ( $scope, Trello ) {
    $scope.trello = Trello.blog();
  }] );
