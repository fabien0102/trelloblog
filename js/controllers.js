"use strict";

/* Controllers */

angular.module("trelloBlogControllers", [])
  .controller( "PostListCtrl", ["$scope", "config",
    function ( $scope, config ) {
      $scope.dateFormat = 'dd MMM yyyy';
      var success = function (data) {
        //console.log(data);
        $scope.posts = data;
        $scope.$digest();
      };

      var error = function (err) {
        console.log(err);
      };

      config.success( function ( config ) {
        Trello.lists.get( config.list + "/cards", {filter: "open", members: true}, success, error );
      } );
      
    }
  ])
  .controller("PostDetailCtrl", ["$scope",
    function ($scope) {

    }
  ]);
