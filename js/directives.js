"use strict";

/* Directives */

angular.module( "TrelloBlogDirectives", ["ngSanitize"] )
  .directive( "markdown", ["$sanitize", function ( $sanitize ) {
    var converter = new Showdown.converter();
    return {
      restrict: "AE",
      scope: {
        source: "=markdown"
      },
      link: function ( scope, element, attributes ) {
        var input = scope.source || element.html();
        var output = input.replace( /:([a-z0-1-+]+):/g, function ( match, text ) {
          return "<i class=\"emoji--" + text + "\" title=\" " + text + "\">" + text + "</i>"
        } );
        element.html( $sanitize(converter.makeHtml( output )) );
      }
    }
  }] );
