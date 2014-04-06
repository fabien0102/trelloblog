"use strict";

/* Locales */

angular.module( "trelloBlogLocales", [] )
  .constant( "LOCALES", {
    "default": "en",
    "en": {
      "postedOn": "posted on"
    },
    "fr": {
      "postedOn": "posté le"
    }
  } );
