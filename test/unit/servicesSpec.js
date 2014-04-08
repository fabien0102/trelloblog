"use strict";

describe( "Taab services", function () {

  beforeEach( module( "trelloBlogApp" ) );
  beforeEach( module( "trelloBlogConfig" ) );

  describe( "Trello", function () {
    var service, $httpBackend, requestUrl;
    var response = {
      name: "Taab test",
      desc: "Taab description",
      lists: [],
      members: [],
      labelNames: [],
      cards: []
    };

    beforeEach( inject( function ( _$httpBackend_, Trello, config ) {
      $httpBackend = _$httpBackend_;

      service = Trello;
      requestUrl = "https://api.trello.com/1/boards/" + config.trello.board +
                   "/?key=" + config.trello.apiKey +
                   "&lists=open&cards=open&members=all&card_checklists=all";
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

    it( "should report if there is an error", function () {
      $httpBackend.expectGET( requestUrl ).respond( 404, "board not found" );

      service.load();
      $httpBackend.flush();

      var blog = service.blog();
      expect( blog.ready ).toBeFalsy();
      expect( blog.error ).toBeDefined();
    } );

    it( "should give you access to the blog information", function () {
      $httpBackend.expectGET( requestUrl ).respond( response );

      service.load();
      $httpBackend.flush();

      var blog = service.blog();
      expect( blog.ready ).toBeTruthy();
      expect( blog.name ).toEqual( response.name );
      expect( blog.desc ).toEqual( response.desc );
      expect( blog.lists ).toEqual( response.lists );
      expect( blog.checklists ).toEqual( response.checklists );
      expect( blog.members ).toEqual( response.members );
      expect( blog.labels ).toEqual( response.labelNames );
      expect( blog.cards ).toEqual( response.cards );
    } );
  } );
} );
