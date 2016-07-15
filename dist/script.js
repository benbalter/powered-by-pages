(function() {
  var PoweredByPages,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  PoweredByPages = (function() {
    var filter, options;

    filter = {
      urls: ["<all_urls>"]
    };

    options = ["responseHeaders"];

    function PoweredByPages() {
      this.callback = bind(this.callback, this);
      chrome.webRequest.onHeadersReceived.addListener(this.callback, filter, options);
    }

    PoweredByPages.prototype.isGitHubHeader = function(header) {
      return (header["name"] === "Server" && header["value"] === "GitHub.com") || header["name"] === "X-GitHub-Request-Id";
    };

    PoweredByPages.prototype.servedByPages = function(headers) {
      var header, id;
      for (id in headers) {
        header = headers[id];
        if (this.isGitHubHeader(header)) {
          return true;
        }
      }
      return false;
    };

    PoweredByPages.prototype.callback = function(details) {
      if (!this.servedByPages(details.responseHeaders)) {
        return;
      }
      return chrome.pageAction.show(details.tabId);
    };

    return PoweredByPages;

  })();

  new PoweredByPages;

}).call(this);

//# sourceMappingURL=script.js.map
