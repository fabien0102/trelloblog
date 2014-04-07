"use strict";

describe( "Taab services", function () {

  beforeEach( module( "trelloBlogApp" ) );

  describe( "Trello", function () {
    var service, $httpBackend;

    beforeEach( inject( function ( _$httpBackend_, Trello ) {
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET( "https://api.trello.com" )
        .respond( {name: "Taab test"} );

      service = Trello;
    } ) );

    it( "should defined the correct interface", function () {
      expect( service.load ).toBeDefined();
      expect( service.blog ).toBeDefined();
    } );

    it( "should correctly initialized the blog", function () {
      var blog = service.blog();

      expect( blog.ready ).toBe( false );
      expect( blog.error ).toBeNull();

      // It should not defined other properties
      expect( Object.keys( blog ).length ).toBe( 2 );
    } );
  } );
} );
