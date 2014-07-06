/* Build our website and publish it to a dedicated branch */

var fs = require("fs-extra");
var UglifyJS = require("uglify-js");
var safeps = require("safeps");
var async = require("async");
var winston = require('winston');

var config = {
  build_dir: "./dist",
  git: {
    remote: "origin"
  },
  prefix: {
    src: "js/",
    vendors: "bower_components/"
  }
};
var cdn = {
  "bower_components/bootstrap/dist/css/bootstrap.min.css":
    "//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.1.1/css/bootstrap.min.css",
  "css/app.css": "css/app.css"
};

// Init the folder
winston.info("Clean build directory");
fs.removeSync(config.build_dir);
fs.mkdirpSync(config.build_dir);

// Copy assets
winston.info("Copy assets");
fs.copySync("./css", config.build_dir + "/css");
fs.copySync("./images", config.build_dir + "/images");

// Copy and rewrite index.html
winston.info("Copy index.html");
var html = fs.readFileSync("./index.html" ).toString();

// Prepare js dependencies and remove links
winston.info("Prepare js dependencies and remove links");
var js_files = [];
html = html.replace(/\ *<script src=\"(.*)\"><\/script>/g, function(script, src){
  js_files.push(src);
  return "";
});

// Add app.js script tag
html = html.replace(/<\/head>/, '  <script src="./app.js"></script>\n</head>');

// Replace stylesheets tags with cdn or dist version
winston.info("Replace stylesheets tags with cdn or dist version");
html = html.replace(/<link rel="stylesheet" href="(.*)"\/>/g, function(target, href){
  if(href === "bower_components/angular-emoji/angular-emoji.css") {
    var name = href.split("/");
    var new_href = "css/" + name[name.length - 1];
    // Copy image (to comment)
    fs.copySync(href.substr(0,href.length - name[name.length - 1].length) + "/images",
        config.build_dir +"/css/images");
    fs.copySync(href, config.build_dir +"/"+ new_href);

    return '<link rel="stylesheet" href="'+new_href+'">';
  }
  return '<link rel="stylesheet" href="'+cdn[href]+'">';
});

// Write new index.html
fs.writeFileSync(config.build_dir + "/index.html", html);

// Magnify javascript
winston.info("Magnify javascript");
var minified = UglifyJS.minify(js_files);

// Hard copy js which are magically downloaded
winston.info("Hard copy js which are magically downloaded");
fs.copySync("bower_components/angular-i18n/", config.build_dir+"/angular-i18n");
minified.code = minified.code.replace("bower_components/angular-i18n/angular-locale_{{locale}}.js",
  "angular-i18n/angular-locale_{{locale}}.js");

// Write minified script file
winston.info("Write minified script file");
fs.writeFileSync(config.build_dir + "/app.js", minified.code);



// Git publication
winston.info("Begin gh-pages publication");
var options = {
  outPath: config.build_dir
};


async.series([
  function getRemoteRepoUrl (done) {
    safeps.spawnCommand("git", ["config", "remote." + config.git.remote + ".url"], function (err, stdout, stderr) {
      options.remoteRepoUrl = stdout.replace(/\n/,"");
      winston.info("Repository: " + options.remoteRepoUrl);
      done(err);
    });
  },
  function getLastCommitMessage (done) {
    safeps.spawnCommand("git", ["log", "--oneline"], function (err, stdout, stderr) {
      options.lastCommit = stdout.split('\n')[0];
      winston.info("Commit message: " + options.lastCommit);
      done(err);
    });
  },
  function changeDir (done) {
    process.chdir("dist");
    done();
  },
  function deployGhPages (done) {
    var gitCommands = [
      ["init"],
      ["add", "--all"],
      ["commit", "-m", options.lastCommit],
      ["push", "--quiet", "--force", options.remoteRepoUrl, "master:gh-pages"],
    ];
    safeps.spawnCommands("git", gitCommands, {stdio:"inherit"}, function( err ){
      done(err);
    });
  }
  ],
  function finish (err) {
    if (err) winston.error(err);
    winston.info("Deployment to GitHub Pages completed successfully")
  }
);
