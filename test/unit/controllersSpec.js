"use strict";

describe( "Taab controllers", function () {

  beforeEach( module( "trelloBlogApp" ) );

  describe( "PostListCtrl", function () {
    var scope, ctrl,
      Trello = {load: function () {}, blog: function () {return model}},
      model;

    beforeEach( inject( function ( $rootScope, $controller ) {
      scope = $rootScope.$new();
      ctrl = $controller( "PostListCtrl", {$scope: scope, Trello: Trello} );
    } ) );

    it( "should defined the date format", function () {
      expect( scope.dateFormat ).toEqual( "fullDate" );
    } );
  } );
} );
