class PoweredByPages

  filter  = { urls: ["<all_urls>"] }
  options = ["responseHeaders"]

  constructor: ->
    chrome.webRequest.onHeadersReceived.addListener @callback, filter, options

  isGitHubHeader: (header) ->
    (header["name"] == "Server" and header["value"] == "GitHub.com") or
      header["name"] == "X-GitHub-Request-Id"

  servedByPages: (headers) ->
    for id, header of headers
      return true if @isGitHubHeader(header)

    false

  callback: (details) =>
    return unless @servedByPages(details.responseHeaders)
    chrome.pageAction.show(details.tabId)

new PoweredByPages
