"use strict";

/* Controllers */

angular.module("trelloBlogControllers", [])
  .controller( "PostListCtrl", ["$scope", "$http", "config",
    function ( $scope, $http, config ) {
      $scope.dateFormat = 'fullDate';

      var success = function ( response ) {
        $scope.posts = _.sortBy( response.data, function ( post ) {
          return new Date( post.due ).getTime();
        } ).reverse();
        $scope.$digest();
      };

      var error = function (err) {
        console.log(err);
      };

      $http.get( "https://api.trello.com/1/lists/" + config.trello.list +
                 "/cards?key=" + config.trello.apiKey +
                 "&filter=open&members=true" ).then( success, error );
    }
  ])
  .controller("PostDetailCtrl", ["$scope",
    function ($scope) {

    }
  ]);
