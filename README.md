[![Build Status][TravisLogo]][Travis]

# get-next
> Simple http GET wrapper with chainable calls.

## Install

```sh
npm install get-next
```

## Synopsis
> See [options documentation](https://nodejs.org/api/http.html#http_http_request_options_callback).

```js

var success = function(data, response) {
// return options to trigger next handler (optional)
};
var failure = function(error) {};

get(options)
  .next(success, fail)
  .next(success, fail))
  ...
  .finally(handler);

/** USAGE **/
var get = require("get-next");
var opts = {
  // See Node documentation for details.
};

get(opts).next(function (data, response) {
  // process data / modify options for next request
  opts.path += "?query=string"
  return opts;
}).next(function (data, response) {
  //...
}).finally(function (data, response) {
  // use an optional final handler
});

```

### Example
> Print user's GitHub repositories.

```js
var get = require("get-next"),
    user = "github";

var opts = {
  host: "api.github.com",
  path: "/users/" + user + "/repos",
  headers: {
    "user-agent": "node.js",
  },
  type: "all",
  protocol: "https"
};

get(opts).next(function (data, resp) {
  JSON.parse(data).forEach(function (repo) {
    console.log(repo.name);
  });
});
```

You can use [browserify](htt) to make it work on the browser too.

```fish
browserify index.js -o index.bundle.js
```

> See [browserify-http-sample](https://github.com/bucaran/browserify-http-sample).

## License
![][MIT]

[MIT]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat-square

[TravisLogo]: https://travis-ci.org/bucaran/get-next.svg?branch=master

[Travis]: https://travis-ci.org/bucaran/get-next
