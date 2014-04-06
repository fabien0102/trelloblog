"use strict";

/* Controllers */

angular.module("trelloBlogControllers", [])
  .controller( "PostListCtrl", ["$scope", "config",
    function ( $scope, config ) {
      $scope.dateFormat = 'fullDate';

      var success = function (data) {
        $scope.posts = _.sortBy( data, function ( post ) {
          return new Date( post.due ).getTime();
        } ).reverse();
        $scope.$digest();
      };

      var error = function (err) {
        console.log(err);
      };

      Trello.lists.get( config.list + "/cards", {filter: "open", members: true}, success, error );
    }
  ])
  .controller("PostDetailCtrl", ["$scope",
    function ($scope) {

    }
  ]);
