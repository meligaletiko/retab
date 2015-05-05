(function (app, settings) {
  var incognito = app.privateBrowsing.enabled
  var retab = (function (tabs) {
    this.open = function (visibility) {
      if (tabs.length > 0) return (function (tab, visibility) {
        this.openTab(visibility, tab.index).url = tab.url
        retab.update()
      }.call(this.window, tabs.pop(), visibility))
    }
    
    this.update = function (tab) {
      this.window.tabs.forEach(function (tab, index) {
        tab.index = index
      })
      if (tab) tabs.push({ url: tab.url, index: tab.index })
    }

    return this
  }.call({ window: app.activeBrowserWindow }, [/*^_^*/]))

  app.addEventListener("message", function (e) {
    if (!incognito && e.name === "retab")
      retab.open(settings["visibility"])
  })

  app.addEventListener("close", function(e) {
    if (!incognito && !!e.target.url) retab.update(e.target)
  }, true)
}(safari.application, safari.extension.settings))
