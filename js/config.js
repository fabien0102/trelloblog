"use strict";

/* Config */

angular.module( "trelloBlogConfig", [] )
  .constant( "config", {
    "multilingual": true,
    "language": "fr",
    "list": "533f122757218a7e2c84c2cb",
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
