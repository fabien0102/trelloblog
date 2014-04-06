(function ( window ) {
  "use strict";

  /* Animations */

  /* List of animations */

  var popIn = function ( element, done, TweenMax, config ) {
    var options = config.animations["pop-in"];
    TweenMax.to( element, options.duration, {scale: 1, onComplete: done} );
  };

  var slideIn = function ( element, done, TweenMax, config ) {
    var options = config.animations["slide-in"];

    var initialOptions = {opacity: 0};
    initialOptions[ options.direction ] = "100px";
    TweenMax.set( element, initialOptions );

    var finalOptions = {opacity: 1, ease: Back.easeOut, onComplete: done};
    finalOptions[ options.direction ] = 0;
    TweenMax.to( element, options.duration, finalOptions );
  };

  var slideOut = function ( element, done, TweenMax, config ) {
    var options = config.animations["slide-out"];

    // Take the element out of the flow after a few time.
    window.setTimeout( function () {
      $( element ).css( "position", "absolute" );
    }, options.duration * 1000 * 0.4 );

    var finalOptions = {opacity: 0, ease: Strong.easeOut, onComplete: done};
    finalOptions[ options.direction ] = "-100px";
    TweenMax.to( element, options.duration, finalOptions );
  };

  /* Module definition */

  angular.module( "trelloBlogAnimations", ["ngAnimate"] )
    .constant( "TweenMax", TweenMax )

    .animation( ".slide-in", ["TweenMax", "config",
      function ( TweenMax, config ) {
        return {
          enter: function ( element, done ) {
            var complete = function () {
              var $popIns = $( element ).find( ".pop-in" );
              _.forEach( $popIns, function ( $popIn ) { popIn( $popIn, done, TweenMax, config ) } );
            };

            slideIn( element, complete, TweenMax, config );
          }
        }
      }] )

    .animation( ".slide-out", ["TweenMax", "config",
      function ( TweenMax, config ) {
        return {
          leave: function ( element, done ) {
            slideOut( element, done, TweenMax, config );
          }
        }
      }] )

    .animation( ".pop-in", ["TweenMax", "config",
      function ( TweenMax, config ) {
        return {
          enter: function ( element, done ) {
            popIn( element, done, TweenMax, config );
          }
        }
      }] )
})( window );
