"use strict";

describe( 'Trello Blog App', function () {

  describe( 'Post list view', function () {

    beforeEach( function () {
      browser.get( 'index.html' );
    } );

    it( 'should filter the post list as user types into the search box', function () {

      var phoneList = element.all( by.repeater( 'post in trello.cards' ) );
      var query = element( by.model( 'search' ) );

      expect( phoneList.count() ).toBe( 7 );

      query.sendKeys( 'titre' );
      expect( phoneList.count() ).toBe( 1 );

      query.clear();
      query.sendKeys( 'un' );
      expect( phoneList.count() ).toBe( 3 );
    } );

    it( 'should filter the post list as user choose a language', function () {

      var phoneList = element.all( by.repeater( 'post in trello.cards' ) );

      expect( phoneList.count() ).toBe( 7 );

      element( by.css( ".fr" ) ).click();
      expect( phoneList.count() ).toBe( 5 );

      element( by.css( ".es" ) ).click();
      expect( phoneList.count() ).toBe( 2 );
    } );
  } );
} );