"use strict";

describe( "Taab filters", function () {

  beforeEach( module( "trelloBlogApp" ) );

  var I18n, config = {trello: {unpublishedLabel: "unpublished"}};

  beforeEach( module( "trelloBlogApp", function ( $provide ) {
    I18n = {translate: function () { return "foo"; }};
    $provide.value( "I18n", I18n );
    $provide.constant( "config", config );
  } ) );

  describe( "notPastDue", function () {
    var notPastDueFilter;

    var now = new Date().getTime();
    var yesterday = new Date( now - 24 * 60 * 60 * 1000 );
    var today = new Date( now + 1 );
    var tomorrow = new Date( now + 24 * 60 * 60 * 1000 );

    // slice an extra double quotes
    var posts = [
      {due: null},
      {due: JSON.stringify( yesterday ).slice( 1, 25 )},
      {due: JSON.stringify( today ).slice( 1, 25 )},
      {due: JSON.stringify( tomorrow ).slice( 1, 25 )}
    ];

    beforeEach( function () {
      inject( function ( _notPastDueFilter_ ) {
        notPastDueFilter = _notPastDueFilter_;
      } );
    } );

    it( "should exclude all date in the future or null", function () {
      expect( notPastDueFilter( posts ).length ).toEqual( 2 );
      expect( notPastDueFilter( posts ) ).toEqual( [
        {due: JSON.stringify( yesterday ).slice( 1, 25 )},
        {due: JSON.stringify( today ).slice( 1, 25 )}
      ] );
    } );

    it( "should return undefined if no array is passed", function () {
      expect( notPastDueFilter( {} ) ).toBeUndefined();
    } );
  } );

  describe( "published", function () {
    var publishedFilter;
    var posts = [
      {labels: [
        {name: "unpublished"}
      ]},
      {labels: [
        {name: "es"}
      ]},
      {labels: [
        {name: "en"}
      ]},
      {labels: [
        {name: "unpublished"}
      ]}
    ];

    beforeEach( function () {
      inject( function ( _publishedFilter_ ) {
        publishedFilter = _publishedFilter_;
      } );
    } );

    it( "should filter out any post with the `unpublished` label", function () {
      expect( publishedFilter( posts ).length ).toEqual( 2 );
      expect( publishedFilter( posts ) ).toEqual( [
        {labels: [
          {name: "es"}
        ]},
        {labels: [
          {name: "en"}
        ]}
      ] );
    } );
  } );

  describe( "currentLanguage", function () {
    var currentLanguageFilter;
    var posts = [
      {labels: [
        {name: "fr"}
      ]},
      {labels: [
        {name: "es"}
      ]},
      {labels: [
        {name: "en"}
      ]},
      {labels: [
        {name: "fr"}
      ]},
      {labels: [
        {name: "es"}
      ]},
      {labels: [
        {name: "en"}
      ]},
      {labels: [
        {name: "fr"}
      ]}
    ];

    describe( "multilingual is false", function () {

      beforeEach( function () {
        inject( function ( _currentLanguageFilter_ ) {
          currentLanguageFilter = _currentLanguageFilter_;
        } );
      } );

      it( "should do nothing", function () {
        expect( currentLanguageFilter( posts, "en-gb" ) ).toEqual( posts );
      } );

      it( "should do nothing", function () {
        expect( currentLanguageFilter( posts, "fr-fr" ) ).toEqual( posts );
      } );

      it( "should do nothing", function () {
        expect( currentLanguageFilter( posts, "es" ) ).toEqual( posts );
      } );

      it( "should do nothing", function () {
        expect( currentLanguageFilter( posts, "ru" ) ).toEqual( posts );
      } );

    } );

    describe( "multilingual is true", function () {

      beforeEach( module( "trelloBlogApp", function ( $provide ) {
        $provide.constant( "config", {multilingual: true} );
      } ) );

      beforeEach( function () {
        inject( function ( _currentLanguageFilter_ ) {
          currentLanguageFilter = _currentLanguageFilter_;
        } );
      } );

      it( "should filter the en lang", function () {
        expect( currentLanguageFilter( posts, "en-gb" ).length ).toEqual( 2 );
        expect( currentLanguageFilter( posts, "en-gb" ) ).toEqual( [
          {labels: [
            {name: "en"}
          ]},
          {labels: [
            {name: "en"}
          ]}
        ] );
      } );

      it( "should filter the fr lang", function () {
        expect( currentLanguageFilter( posts, "fr-fr" ).length ).toEqual( 3 );
        expect( currentLanguageFilter( posts, "fr-fr" ) ).toEqual( [
          {labels: [
            {name: "fr"}
          ]},
          {labels: [
            {name: "fr"}
          ]},
          {labels: [
            {name: "fr"}
          ]}
        ] );
      } );

      it( "should filter the es lang", function () {
        expect( currentLanguageFilter( posts, "es" ).length ).toEqual( 2 );
        expect( currentLanguageFilter( posts, "es" ) ).toEqual( [
          {labels: [
            {name: "es"}
          ]},
          {labels: [
            {name: "es"}
          ]}
        ] );
      } );

      it( "should filter the ru lang", function () {
        expect( currentLanguageFilter( posts, "ru" ).length ).toEqual( 0 );
        expect( currentLanguageFilter( posts, "ru" ) ).toEqual( [] );
      } );

    } );

  } );

  describe( "i18n", function () {
    var i18nFilter;
    beforeEach( function () {
      inject( function ( _i18nFilter_ ) {
        i18nFilter = _i18nFilter_;
      } );
    } );

    it( "should use the I18n service", function () {
      spyOn( I18n, "translate" );
      var result = i18nFilter( "key" );

      expect( I18n.translate ).toHaveBeenCalledWith( "key" );
      expect( result ).toEqual( I18n.translate( "key" ) );
    } );

  } );

  describe( "lang", function () {
    var langFilter;
    beforeEach( function () {
      inject( function ( _langFilter_ ) {
        langFilter = _langFilter_;
      } );
    } );

    it( "should return the language name of the code `fr`", function () {
      expect( langFilter( "fr" ) ).toEqual( "Français" );
    } );

    it( "should return the language name of the code `en`", function () {
      expect( langFilter( "en" ) ).toEqual( "English" );
    } );

    it( "should return the language name of the code `es`", function () {
      expect( langFilter( "es" ) ).toEqual( "Español" );
    } );

    it( "should return undefined if name of the code is not defined", function () {
      expect( langFilter( "ru" ) ).toBeUndefined();
    } );

  } );

  describe( "tags", function () {
    var tagsFilter;
    var checklists = [
      {name: "banana"},
      {name: "Tags", checkItems: ["css", "lorem ipsum"]},
      {name: "tags", checkItems: ["plop"]}
    ];

    beforeEach( function () {
      inject( function ( _tagsFilter_ ) {
        tagsFilter = _tagsFilter_;
      } );
    } );

    it( "should return the array of tags from the first `tags` checklists", function () {
      expect( tagsFilter( checklists ) ).toEqual( ["css", "lorem ipsum"] );
    } );

  } );
} );
