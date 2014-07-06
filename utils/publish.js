/* Build our website and publish it to a dedicated branch */

var fs = require("fs-extra");
var UglifyJS = require("uglify-js");
var exec = require('child_process').exec;

var config = {
  build_dir: "./dist",
  git: {
    address: "git@github.com:fmonniot/trelloblog.git",
    branch: {
      origin: "master",
      dest: "gh-pages"
    }
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
fs.removeSync(config.build_dir);
fs.mkdirpSync(config.build_dir);

// Copy assets
fs.copySync("./css", config.build_dir + "/css");
fs.copySync("./images", config.build_dir + "/images");

// Copy and rewrite index.html
var html = fs.readFileSync("./index.html" ).toString();

// Prepare js dependencies and remove links
var js_files = [];
html = html.replace(/\ *<script src=\"(.*)\"><\/script>/g, function(script, src){
  js_files.push(src);
  return "";
});

// Add app.js script tag
html = html.replace(/<\/head>/, '  <script src="./app.js"></script>\n</head>');

// Replace stylesheets tags with cdn or dist version
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
var minified = UglifyJS.minify(js_files);

// Hard copy js which are magically downloaded
fs.copySync("bower_components/angular-i18n/", config.build_dir+"/angular-i18n");
minified.code = minified.code.replace("bower_components/angular-i18n/angular-locale_{{locale}}.js",
  "angular-i18n/angular-locale_{{locale}}.js");

// Write minified script file
fs.writeFileSync(config.build_dir + "/app.js", minified.code);



// Git publication
var options = {
  cwd: config.build_dir, 
  env: {
    GIT: config.git.address, 
    BRANCH_ORIGIN: config.git.branch.origin, 
    BRANCH_DEST: config.git.branch.dest,
    USERNAME: "Robot",
    EMAIL: "robot@trelloblog.com"
  }
};

// Inception !!!
exec("pwd", options, function(error, stdout){
  console.log(stdout);
  exec("git init", options, function(error, stdout, stderr){
    console.log(stdout, stderr);
    exec("git add .", options, function(error, stdout, stderr){
      console.log(stdout, stderr);
      exec('git config user.email "${EMAIL}"', options, function(error, stdout, stderr){
        console.log(stdout, stderr);
        exec('git config user.name "${USERNAME}"', options, function(error, stdout, stderr){
          console.log(stdout, stderr);
          exec('git commit -m "Deployed to Github Pages"', options, function(error, stdout, stderr){
            console.log(stdout, stderr);
            exec("git push -f ${GIT} ${BRANCH_ORIGIN}:${BRANCH_DEST}", options, function(error, stdout, stderr){
              console.log(stdout, stderr);
              // On the seventh day he rested from all his work...
            });
          });
        });
      });
    });
  });
});
