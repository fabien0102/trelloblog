/* CLI Interface to set config.js into a new project */

var Prompt = require( "prompt" );
var Fs = require( "fs" );

Prompt.start();
Prompt.message = "Taab";

console.log( "Trello as a blog" );
console.log( "To generate an API key : https://trello.com/1/appKey/generate" );

Prompt.get( ["trelloApiKey", "trelloBoardId"], function ( err, prompt ) {
  var file = Fs.readFileSync("js/config.js.dist" ).toString();

  file = file.replace("$BOARD$", prompt.trelloBoardId);
  file = file.replace("$APIKEY$", prompt.trelloApiKey);

  Fs.writeFileSync("js/config.js", file);
  console.log( "Congratulations! You are ready to change the world with your new blog!" );
} );
