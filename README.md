Trello As A Blog [![GitHub version](https://badge.fury.io/gh/fabien0102%2Ftrelloblog.svg)](http://badge.fury.io/gh/fabien0102%2Ftrelloblog)
==========

## Context

**TAAB** (Trello As A Blog) is a purely front-end blog that use a Trello
public board as a back-end.

The idea was to take advantages of the incredible simplicity and flexibility
of the Trello interface for a blogging system. This is possible thanks to the
strong API that Trello provides.

Writing posts and managing the blog becomes dead-easy and insanely fast!

## Initialization

To contribute to the project, just clone it and execute `bower install` to
retrieve dependencies.

Execute `npm run config` and enter your Trello api key and your blog board id.

That's it.

## Running the test suite

You can run the unit test suite by executing `npm test` (or `npm run test-single-run`
if you want to run the test only once).

Before running the end-to-end test suite, you have to execute `npm run update-webdriver`
(only the first time).

Make sure you have a server running (`npm start` will give you one) and execute
`npm run protractor`.

## Contributors

This insane *- but genious -* idea was from [Fabien Bernard](https://twitter.com/fabien0102).

He was joined in his madness by [Nicolas Carlo](https://twitter.com/nicoespeon)
and [François Monniot](https://twitter.com/fmonniot).

