/* CLI Interface to set config.js into a new project */

var Prompt = require( "prompt" );
var Fs = require( "fs" );

// Test hack (should use minimist)
if ( process.env.ENVIRONMENT === "test" ) {
  var file = Fs.readFileSync( "js/config.js.dist" ).toString();
  file = file.replace( "$BOARD$", "c94SaRKm" );
  file = file.replace( "$API_KEY$", "5af287a3734f0af280d09c2d3d0e3914" );
  file = file.replace( "$UNPUBLISHED_LABEL$", "unpublished" );
  file = file.replace( "$CONFIGURATION_LIST$", "[Configuration]" );
  Fs.writeFileSync( "js/config.js", file );
  process.exit( 0 );
}

Prompt.start();
Prompt.message = "Taab";

console.log( "Trello as a blog" );

Prompt.get( [
  {
    name: "trelloApiKey",
    description: "Trello api key (https://trello.com/1/appKey/generate)",
    default: "5af287a3734f0af280d09c2d3d0e3914"
  },
  {
    name: "trelloBoardId",
    description: "Trello board id",
    default: "RCwudeYO"
  },
  {
    name: "unpublishedLabel",
    description: "Name of unpublished label",
    default: "unpublished"
  },
  {
    name: "configurationList",
    description: "Name of configuration list",
    default: "[Configuration]"
  }
], function ( err, prompt ) {
  var file = Fs.readFileSync( "js/config.js.dist" ).toString();

  file = file.replace( "$BOARD$", prompt.trelloBoardId );
  file = file.replace( "$API_KEY$", prompt.trelloApiKey );
  file = file.replace( "$UNPUBLISHED_LABEL$", prompt.unpublishedLabeêl );
  file = file.replace( "$CONFIGURATION_LIST$", prompt.configurationList );

  Fs.writeFileSync( "js/config.js", file );
  console.log( "Congratulations! You are ready to change the world with your new blog!" );
  console.log( "Just run `npm run publish` to publish your blog on a gh-pages ;)");
} );
