"use strict";

/* Config */

angular.module( "trelloBlogConfig", [] )
  .constant( "config", {
    "multilingual": true,
    "language": "fr",
    "trello": {
      "board": "c94SaRKm",
      "apiKey": "5af287a3734f0af280d09c2d3d0e3914" // Generated at https://trello.com/1/appKey/generate
    },
    "animations": {
      "slide-in": {
        "duration": 1,
        "direction": "right"
      },
      "slide-out": {
        "duration": 0.5,
        "direction": "left"
      },
      "pop-in": {
        "duration": 0.3
      }
    }
  } );
