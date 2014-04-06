"use strict";

/* Config */

angular.module( "trelloBlogConfig", [] )
  .constant( "config", {
    "multilingual": true,
    "language": "fr",
    "trello": {
      "list": "533f122757218a7e2c84c2cb",
      "apiKey": "5af287a3734f0af280d09c2d3d0e3914" // Generated at https://trello.com/1/appKey/generate
    },
    "animations": {
      "slide-in": {
        "duration": 1,
        "direction": "right"
      },
      "pop-in": {
        "duration": 0.3
      }
    }
  } );
