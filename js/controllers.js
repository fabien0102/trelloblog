"use strict";

/* Controllers */

angular.module("trelloBlogControllers", [])
  .controller( "PostListCtrl", ["$scope", "Trello", function ( $scope, Trello ) {
    $scope.dateFormat = 'fullDate';

    Trello.load();
    $scope.trello = Trello.blog();
    }
  ])
  .controller("PostDetailCtrl", ["$scope",
    function ($scope) {

    }
  ] )
  .controller( "AsideCtrl", ["$scope", "Trello", function ( $scope, Trello ) {
    $scope.trello = Trello.blog();
  }] );
