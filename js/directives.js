"use strict";

/* Directives */

angular.module( "TrelloBlogDirectives", ["ngSanitize"] )
  .directive( "markdown", ["$sanitize", function ( $sanitize ) {
    var converter = new Showdown.converter();
    return {
      restrict: "AE",
      link: function ( scope, element, attributes ) {
        if (attributes.markdown) {
          scope.$watch(attributes.markdown, function( input ) {
            input = input || "";
            var output = input.replace( /:([a-z0-1-+]+):/g, function ( match, text ) {
              return "<i class=\"emoji--" + text + "\" title=\" " + text + "\">" + text + "</i>"
            } );
            element.html( $sanitize(converter.makeHtml( output )) );
          } );
        } else {
          var input = element.html() || "";
          var output = input.replace( /:([a-z0-1-+]+):/g, function ( match, text ) {
            return "<i class=\"emoji--" + text + "\" title=\" " + text + "\">" + text + "</i>"
          } );
          element.html( $sanitize(converter.makeHtml( output )) );
        }
      }
    }
  }] );
