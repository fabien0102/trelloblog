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
                   "&lists=open&cards=open&members=all";
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
      expect( blog.members ).toEqual( response.members );
      expect( blog.labels ).toEqual( response.labelNames );
      expect( blog.cards ).toEqual( response.cards );
    } );

    it( "should sort the cards by due date", function () {
      $httpBackend.expectGET( requestUrl ).respond( {
        cards: [
          {due: "2014-03-06T12:00:00.000Z"},
          {due: "2014-04-06T15:00:00.000Z"},
          {due: "2014-04-06T12:00:00.000Z"}
        ]
      } );

      service.load();
      $httpBackend.flush();

      var blog = service.blog();
      expect( blog.cards[0].due ).toEqual( "2014-04-06T15:00:00.000Z" );
      expect( blog.cards[1].due ).toEqual( "2014-04-06T12:00:00.000Z" );
      expect( blog.cards[2].due ).toEqual( "2014-03-06T12:00:00.000Z" );
    } );

    it( "should add member information in each cards", function () {
      $httpBackend.expectGET( requestUrl ).respond( {
        cards: [
          {idMembers: [ "51dad2ce8cdcf73a320018c5" ], due: 1},
          {idMembers: [ "51843f636ef14b8a690062dc" ], due: 2},
          {idMembers: [ "51843f636ef14b8a690062dc", "51dad2ce8cdcf73a320018c5" ], due: 3}
        ],
        members: [
          { id: "51dad2ce8cdcf73a320018c5", username: "fmonniot" },
          { id: "51843f636ef14b8a690062dc", username: "nicolascarlo" }
        ]
      } );

      service.load();
      $httpBackend.flush();

      var blog = service.blog();
      expect( blog.cards[0].members[0].username ).toEqual( "nicolascarlo" );
      expect( blog.cards[0].members[1].username ).toEqual( "fmonniot" );
      expect( blog.cards[1].members[0].username ).toEqual( "nicolascarlo" );
      expect( blog.cards[2].members[0].username ).toEqual( "fmonniot" );
    } );
  } );
} );
