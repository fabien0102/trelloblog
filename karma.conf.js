// Karma configuration
// Generated on Sun Apr 06 2014 19:51:46 GMT+0200 (CEST)

module.exports = function ( config ) {
  config.set( {

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      "bower_components/lodash/dist/lodash.min.js",
      "bower_components/jquery/jquery.min.js",
      "bower_components/gsap/src/minified/TweenMax.min.js",
      "bower_components/bootstrap/dist/js/bootstrap.min.js",
      "bower_components/angular/angular.min.js",
      "bower_components/angular-dynamic-locale/src/tmhDynamicLocale.js",
      "bower_components/angular-sanitize/angular-sanitize.min.js",
      "bower_components/showdown/compressed/showdown.js",
      "bower_components/angular-markdown-directive/markdown.js",
      "bower_components/angular-bootstrap/ui-bootstrap.min.js",
      "bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js",
      "bower_components/angular-animate/angular-animate.min.js",
      "https://api.trello.com/1/client.js?key=5af287a3734f0af280d09c2d3d0e3914",
      'js/*.js',
      'test/**/*.js',
      'test/**/*.js'
    ],

    // list of files to exclude
    exclude: [

    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {

    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  } );
};
