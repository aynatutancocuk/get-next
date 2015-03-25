var test = require("tap").test,
    get = require("../index"),
    StupidHttp = require("../lib/StupidHttp");

test("test", function (t) {
  var http = function() {
    return StupidHttp("foobar");
  };

  var opts = {
    sweet: "cake"
  };

  get(opts, http).next(function (data, resp) {
    //=== 1st test ===
    t.equal(data, "foobar", "retrieves raw data");
    opts.sweet = "butterfinger";
    return opts;
  })
  .next(function(data, resp) {
    //=== 2nd test ===
    t.equal(opts.sweet, "butterfinger", "channels modified options");
  })
  .next(function(data, resp) {
    t.ok(false, "This test never happens.");
  })
  .finally(function(data, resp) {
    //=== 3rd test ===
    t.end();
  });
});
