// This is a naive http module mock to test get-next.

function StupidHttp (data, timeout) {
  if (this instanceof StupidHttp) {
    this.data = data;
    this.timeout = timeout;
  } else {
    return new StupidHttp(data);
  }
}

StupidHttp.prototype.request = function (options, responseHandler) {
  function Response () {}

  var handlers = [], self = this;

  Response.prototype.on = function (event, handler) {
    handlers[event] = handler;
    return this;
  };

  setTimeout(function() {
    responseHandler(new Response());
    if (handlers.data) {
      self.data.split('').forEach(function (ch) {
        handlers.data(ch);
      });
    }
    if (handlers.end) handlers.end();
  }, this.timeout || 500);

  return this;
};

StupidHttp.prototype.on = function () {
  return this;
};

StupidHttp.prototype.end = function () {
  return this;
};

module.exports = StupidHttp;
