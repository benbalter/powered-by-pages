class PoweredByPages

  filter  = { urls: ["<all_urls>"] }
  options = ["responseHeaders"]

  constructor: ->
    chrome.webRequest.onHeadersReceived.addListener @callback, filter, options
    chrome.pageAction.onClicked.addListener @onClick

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

  redirect: (tabId, newUrl) =>
    chrome.tabs.update tabId, url: newUrl

  onClick: (tab) =>
    url = new URL tab.url
    host = url.hostname
    path = url.pathname

    # Source -> Site
    if host == "github.com"
      parts = path.split("/")
      owner = parts[1]
      repo  = parts[2]
      url   = "http://#{owner}.github.io"

      # User page
      if repo.match /^#{owner}\.github\.(io|com)$/i
        @redirect tab.id, url

      # Project page
      else
        @redirect tab.id, "#{url}/#{repo}"

    # Site -> Source
    else if host.match(/[a-z0-9-]+\.github\.(io|com)$/i)
      parts = host.split(".")
      owner = parts[0]

      # GitHub-owned page
      if parts[2] == "com"
        owner = "github"
        repo  = "#{parts[0]}.github.com"

      # User page
      else if path == "/"
        repo = "#{owner}.github.io"

      # Project page
      else
        repo = path.split("/")[1]

      @redirect tab.id, "https://github.com/#{owner}/#{repo}"

new PoweredByPages
