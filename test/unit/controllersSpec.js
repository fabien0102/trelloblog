"use strict";

describe( "Taab controllers", function () {

  beforeEach( module( "trelloBlogApp" ) );

  var Trello = {load: function () {}, blog: function () {return model}},
    model = null;

  describe( "PostListCtrl", function () {
    var scope, ctrl;

    beforeEach( inject( function ( $rootScope, $controller ) {
      scope = $rootScope.$new();
      spyOn( Trello, "load" );

      ctrl = $controller( "PostListCtrl", {$scope: scope, Trello: Trello} );
    } ) );

    it( "should defined the date format", function () {
      expect( scope.dateFormat ).toEqual( "fullDate" );
    } );

    it( "should assign the model to the scope", function () {
      expect( scope.trello ).toEqual( model );
    } );

    it( "should load the data from the service", function () {
      expect( Trello.load ).toHaveBeenCalled()
    } );
  } );

  describe( "AsideCtrl", function () {
    var scope, ctrl;

    beforeEach( inject( function ( $rootScope, $controller ) {
      scope = $rootScope.$new();
      ctrl = $controller( "AsideCtrl", {$scope: scope, Trello: Trello} );
    } ) );

    it( "should assign the model to the scope", function () {
      expect( scope.trello ).toEqual( model );
    } );
  } );
} );
