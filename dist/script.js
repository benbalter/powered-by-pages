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
      this.onClick = bind(this.onClick, this);
      this.redirect = bind(this.redirect, this);
      this.callback = bind(this.callback, this);
      chrome.webRequest.onHeadersReceived.addListener(this.callback, filter, options);
      chrome.pageAction.onClicked.addListener(this.onClick);
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

    PoweredByPages.prototype.redirect = function(tabId, newUrl) {
      return chrome.tabs.update(tabId, {
        url: newUrl
      });
    };

    PoweredByPages.prototype.onClick = function(tab) {
      var host, owner, parts, path, repo, url;
      url = new URL(tab.url);
      host = url.hostname;
      path = url.pathname;
      if (host === "github.com") {
        parts = path.split("/");
        owner = parts[1];
        repo = parts[2];
        url = "http://" + owner + ".github.io";
        if (repo.match(/^#{owner}\.github\.(io|com)$/i)) {
          return this.redirect(tab.id, url);
        } else {
          return this.redirect(tab.id, url + "/" + repo);
        }
      } else if (host.match(/[a-z0-9-]+\.github\.(io|com)$/i)) {
        parts = host.split(".");
        owner = parts[0];
        if (parts[2] === "com") {
          owner = "github";
          repo = parts[0] + ".github.com";
        } else if (path === "/") {
          repo = owner + ".github.io";
        } else {
          repo = path.split("/")[1];
        }
        return this.redirect(tab.id, "https://github.com/" + owner + "/" + repo);
      }
    };

    return PoweredByPages;

  })();

  new PoweredByPages;

}).call(this);

//# sourceMappingURL=script.js.map
