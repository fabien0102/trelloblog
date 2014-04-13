"use strict";

describe( "Taab services", function () {

  beforeEach( module( "trelloBlogApp" ) );

  describe( "I18n", function () {
    var $rootScope, tmhDynamicLocale, LOCALES, config, I18n;

    beforeEach( function () {
      // load our module and also provide some mock
      module( "trelloBlogApp", function ( $provide ) {

        tmhDynamicLocale = jasmine.createSpyObj( "tmhDynamicLocale", ["set"] );

        $provide.value( "tmhDynamicLocale", tmhDynamicLocale );
        $provide.constant( "config", { language: "en"} );
        $provide.constant( "LOCALES", {
          "en": { "foo": "en" },
          "fr": { "foo": "fr" },
          "fr-fr": { "foo": "fr-fr"}
        } );
      } );

      // now we inject the service we"re testing.
      inject( function ( _I18n_, _$rootScope_ ) {
        $rootScope = _$rootScope_;
        I18n = _I18n_;
      } );
    } );

    it( "should initialize the locale to the browser default", function () {
      expect( $rootScope.locale ).toEqual( navigator.language.toLocaleLowerCase() );
    } );

    it( "should propagate change of locale", function () {
      $rootScope.locale = "en-gb";
      $rootScope.$apply(); // Apply the change

      expect( $rootScope.locale ).toEqual( "en-gb" );
      expect( $rootScope.shortLocale ).toEqual( "en" );
      expect( tmhDynamicLocale.set ).toHaveBeenCalledWith( "en-gb" );

      $rootScope.locale = "fr-fr";
      $rootScope.$apply(); // Apply the change

      expect( $rootScope.locale ).toEqual( "fr-fr" );
      expect( $rootScope.shortLocale ).toEqual( "fr" );
      expect( tmhDynamicLocale.set ).toHaveBeenCalledWith( "fr-fr" );
    } );

    it( "should store locale in lower case", function () {
      $rootScope.locale = "en-gb";
      $rootScope.$apply(); // Apply the change

      expect( $rootScope.locale ).toEqual( "en-gb" );
      expect( $rootScope.shortLocale ).toEqual( "en" );
      expect( tmhDynamicLocale.set ).toHaveBeenCalledWith( "en-gb" );
    } );

    it( "should use the lang+region translation", function () {
      $rootScope.locale = "fr-fr";
      $rootScope.$apply(); // Apply the change

      expect( I18n.translate( "foo" ) ).toEqual( "fr-fr" );
    } );

    it( "should use the lang translation if no region", function () {
      $rootScope.locale = "en-gb";
      $rootScope.$apply(); // Apply the change

      expect( I18n.translate( "foo" ) ).toEqual( "en" );
    } );

    it( "should use the default lang if no translation", function () {
      $rootScope.locale = "ru";
      $rootScope.$apply(); // Apply the change

      expect( I18n.translate( "foo" ) ).toEqual( "en" );
    } );
  } );

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

    beforeEach( function () {
      localStorage.clear()
    } );

    it( "should defined the correct interface", function () {
      expect( service.load ).toBeDefined();
      expect( service.blog ).toBeDefined();
    } );

    it( "should correctly initialized the blog", function () {
      var blog = service.blog();

      expect( blog.error ).toBeNull();

      // It should not defined other properties
      expect( Object.keys( blog ).length ).toBe( 1 );
    } );

    it( "should report if there is an error", function () {
      $httpBackend.expectGET( requestUrl ).respond( 404, "board not found" );

      service.load();
      $httpBackend.flush();

      var blog = service.blog();
      expect( blog.error ).toBeDefined();
    } );

    describe( "while offline", function () {

      beforeEach( function () {
        localStorage.setItem( "model", JSON.stringify( response ) );
      } );

      it( "should give you access to the blog information", function () {
        $httpBackend.whenGET( requestUrl ).respond( 404 );

        service.load();
        $httpBackend.flush();

        var blog = service.blog();
        expect( blog.name ).toEqual( response.name );
        expect( blog.desc ).toEqual( response.desc );
        expect( blog.lists ).toEqual( response.lists );
        expect( blog.members ).toEqual( response.members );
        expect( blog.labels ).toEqual( response.labelNames );
        expect( blog.cards ).toEqual( response.cards );
      } );

    } );

    describe( "while online", function () {
      it( "should give you access to the blog information", function () {
        $httpBackend.expectGET( requestUrl ).respond( response );

        service.load();
        $httpBackend.flush();

        var blog = service.blog();
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
} );
