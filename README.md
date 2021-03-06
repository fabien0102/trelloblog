Trello As A Blog [![GitHub version](https://badge.fury.io/gh/fabien0102%2Ftrelloblog.svg)](http://badge.fury.io/gh/fabien0102%2Ftrelloblog) [![Build Status](https://travis-ci.org/fabien0102/trelloblog.svg?branch=master)](https://travis-ci.org/fabien0102/trelloblog)
==========

## Context

**TAAB** (Trello As A Blog) is a purely front-end blog that use a Trello
public board as a back-end.

The idea was to take advantages of the incredible simplicity and flexibility
of the Trello interface for a blogging system. This is possible thanks to the
strong API that Trello provides.

Writing posts and managing the blog becomes dead-easy and insanely fast!

## Demo and tutorials

A little demo with a pretty documentation of this project:

- [Blog](http://fabien0102.github.io/trelloblog/) (gh-pages)
- [Admin interface](https://trello.com/b/RCwudeYO/trello-as-a-blog) (trello board)

## Initialization

To contribute to the project:

- *[captain obvious]* clone the repo
- execute `npm install` to retrieve dependencies
- execute `npm run config` to set up your configuration file

That's it!

## Running the test suite

You can run the unit test suite by executing `npm test` (or `npm run test-single-run`
if you want to run the test only once).

Before running the end-to-end test suite, you have to execute `npm run update-webdriver`
(only the first time).

Make sure you have a server running (`npm start` will give you one) and execute
`npm run protractor`.

## Contributors

This insane *- but awesome -* idea was from [Fabien Bernard](https://twitter.com/fabien0102).

He was joined in his madness by [Nicolas Carlo](https://twitter.com/nicoespeon)
and [François Monniot](https://twitter.com/fmonniot).

