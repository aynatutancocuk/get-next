/**
 * Simple http GET wrapper with chainable calls.
 * @param {Object} Options
 * @param {Object} protocol
 * @return {get} Instance of get object.
 */
module.exports = function(options, protocol) {
  if (options === undefined) {
    throw new Error("options argument was undefined.");
  }

  // Keep all GET handlers here and run async after first call to next.
  var list = [], index = 0, finallyHandler;

  // Use specified protocol or guess from options. Default will be http.
  var getProtocol = function(protocol) {
    // Cache http modules to support browserify static-only modules.
    var http = require("http"), https = require("https");

    if (typeof (protocol) === "function") return protocol();

    if (options.protocol === "https" ||
      options.port === 443 || options.https) {
      return https;
    } else {
      protocol = protocol || options.protocol || "http";
    }

    return protocol === "http" ? http : require(protocol);
  };

  return {
    finally : function(handler) {
      finallyHandler = handler;
    },
    next : function(success, fail) {
      // Add success / fail tuple to requests queue.
      list.push({
        success: success,
        fail: fail
      });

      if (list.length === 1) {
        (function get(success, fail) {
          getProtocol(protocol).request(options, function(response) {
            var data = "";

            response.on("data", function (chunk) {
              data += chunk.toString("utf8");
            })
            .on("end", function() {
              // Run next request in the queue after thread stack unwinds.
              setTimeout(function() {
                options = success(data, response);
                if (options) {
                  if (++index < list.length) {
                    get(list[index].success, list[index].fail);
                  }
                } else if (typeof (finallyHandler) === "function") {
                  finallyHandler(data, response);
                }
              }, 0);
            });

          }).on("error", function(err) {
            if (typeof (fail) === "function") {
              fail(err);
            } else {
              throw new Error(err);
            }
          }).end();

        }(success, fail));
      }

      return this;
    }
  };
};
