"use strict";

describe( "Taab services", function () {

  beforeEach( module( "trelloBlogApp" ) );

  describe( "I18n", function () {
    var $rootScope, tmhDynamicLocale, LOCALES, config, I18n;

    beforeEach( function () {
      // load our module and also provide some mock
      module( "trelloBlogApp", function ( $provide ) {

        //tmhDynamicLocale = jasmine.createSpyObj( "tmhDynamicLocale", ["set"] );
        tmhDynamicLocale = {set: sinon.spy()};

        $provide.value( "tmhDynamicLocale", tmhDynamicLocale );
        $provide.constant( "config", { language: "en", multilingual: true} );
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
      expect( $rootScope.locale ).to.equal( navigator.language.toLocaleLowerCase() );
    } );

    it( "should initialize the locale to the language default without mulilingual", function () {
      $rootScope.config = {language: "en", multilingual: false};
      expect( $rootScope.locale ).to.equal( "fr" );
    } );

    it( "should propagate change of locale", function () {
      $rootScope.locale = "en-gb";
      $rootScope.$apply(); // Apply the change

      expect( $rootScope.locale ).to.equal( "en-gb" );
      expect( $rootScope.shortLocale ).to.equal( "en" );
      expect( tmhDynamicLocale.set.calledWith( "en-gb" ) ).to.be.true;

      $rootScope.locale = "fr-fr";
      $rootScope.$apply(); // Apply the change

      expect( $rootScope.locale ).to.equal( "fr-fr" );
      expect( $rootScope.shortLocale ).to.equal( "fr" );
      expect( tmhDynamicLocale.set.calledWith( "fr-fr" ) ).to.be.true;
    } );

    it( "should store locale in lower case", function () {
      $rootScope.locale = "en-gb";
      $rootScope.$apply(); // Apply the change

      expect( $rootScope.locale ).to.equal( "en-gb" );
      expect( $rootScope.shortLocale ).to.equal( "en" );
      expect( tmhDynamicLocale.set.calledWith( "en-gb" ) ).to.be.true;
    } );

    it( "should use the lang+region translation", function () {
      $rootScope.locale = "fr-fr";
      $rootScope.$apply(); // Apply the change

      expect( I18n.translate( "foo" ) ).to.equal( "fr-fr" );
    } );

    it( "should use the lang translation if no region", function () {
      $rootScope.locale = "en-gb";
      $rootScope.$apply(); // Apply the change

      expect( I18n.translate( "foo" ) ).to.equal( "en" );
    } );

    it( "should use the default lang if no translation", function () {
      $rootScope.locale = "ru";
      $rootScope.$apply(); // Apply the change

      expect( I18n.translate( "foo" ) ).to.equal( "en" );
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
                   "&lists=open&cards=open&members=all&card_checklists=all";
    } ) );

    beforeEach( function () {
      localStorage.clear()
    } );

    it( "should defined the correct interface", function () {
      expect( service.load ).to.be.defined;
      expect( service.blog ).to.be.defined;
    } );

    it( "should correctly initialized the blog", function () {
      var blog = service.blog();

      expect( blog.error ).to.be.null;

      // It should not defined other properties
      expect( Object.keys( blog ).length ).to.equal( 1 );
    } );

    it( "should report if there is an error", function () {
      $httpBackend.expectGET( requestUrl ).respond( 404, "board not found" );

      service.load();
      $httpBackend.flush();

      var blog = service.blog();
      expect( blog.error ).to.not.be.undefined;
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
        expect( blog.name ).to.eql( response.name );
        expect( blog.desc ).to.eql( response.desc );
        expect( blog.lists ).to.eql( response.lists );
        expect( blog.members ).to.eql( response.members );
        expect( blog.labels ).to.eql( response.labelNames );
        expect( blog.cards ).to.eql( response.cards );
      } );

    } );

    describe( "while online", function () {
      it( "should give you access to the blog information", function () {
        $httpBackend.expectGET( requestUrl ).respond( response );

        service.load();
        $httpBackend.flush();

        var blog = service.blog();
        expect( blog.name ).to.eql( response.name );
        expect( blog.desc ).to.eql( response.desc );
        expect( blog.lists ).to.eql( response.lists );
        expect( blog.members ).to.eql( response.members );
        expect( blog.labels ).to.eql( response.labelNames );
        expect( blog.cards ).to.eql( response.cards );
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
        expect( blog.cards[0].due ).to.equal( "2014-04-06T15:00:00.000Z" );
        expect( blog.cards[1].due ).to.equal( "2014-04-06T12:00:00.000Z" );
        expect( blog.cards[2].due ).to.equal( "2014-03-06T12:00:00.000Z" );
      } );

      it( "should add member information in each cards", function () {
        $httpBackend.expectGET( requestUrl ).respond( {
          lists: [
            {id: "533f122757218a7e2c84c2cb", name: "Catégorie 1"}
          ],
          cards: [
            {idList: "533f122757218a7e2c84c2cb", idMembers: ["51dad2ce8cdcf73a320018c5"], due: 1},
            {idList: "533f122757218a7e2c84c2cb", idMembers: ["51843f636ef14b8a690062dc"], due: 2},
            {
              idList: "533f122757218a7e2c84c2cb",
              idMembers: ["51843f636ef14b8a690062dc", "51dad2ce8cdcf73a320018c5"],
              due: 3
            }
          ],
          members: [
            { id: "51dad2ce8cdcf73a320018c5", username: "fmonniot" },
            { id: "51843f636ef14b8a690062dc", username: "nicolascarlo" }
          ]
        } );

        service.load();
        $httpBackend.flush();

        var blog = service.blog();
        expect( blog.cards[0].members[0].username ).to.equal( "nicolascarlo" );
        expect( blog.cards[0].members[1].username ).to.equal( "fmonniot" );
        expect( blog.cards[1].members[0].username ).to.equal( "nicolascarlo" );
        expect( blog.cards[2].members[0].username ).to.equal( "fmonniot" );
      } );
    } );

  } );
} );
