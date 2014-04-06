"use strict";

/* Animations */

angular.module( "trelloBlogAnimations", ["ngAnimate"] )
  .constant( "TweenMax", TweenMax )

  .animation( ".list-in", ["$window", "$rootScope", "TweenMax", "config",
    function ( $window, $rootScope, TweenMax, config ) {
      return {
        enter: function ( element, done ) {

          var listInOptions = config.animations["list-in"];

          // Set initial position for element animation.
          var initialOptions = {opacity: 0};
          initialOptions[ listInOptions.direction ] = "100px";
          TweenMax.set( element, initialOptions );

          // Move the element to its final position.
          var finalOptions = {opacity: 1, ease: Back.easeOut, onComplete: done};
          finalOptions[ listInOptions.direction ] = 0;
          TweenMax.to( element, listInOptions.duration, finalOptions );
        }
      }
    }] );
