// ↩ Retab 2.0 [⌘+⇧+T] for Safari
(function () {
  var closedTabs = []
  var app = safari.application
  var settings = safari.extension.settings

  app.activeBrowserWindow.updateTabs = function () {
    this.tabs.forEach(function (tab, index) { tab.index = index })
  }

  app.addEventListener("message", function (e) {
    if (closedTabs.length <= 0 || e.name !== "retab"
    || app.privateBrowsing.enabled) { return }

    if (e.message.chrome === settings.getItem("chrome")) { openTab() }
  })

  app.addEventListener("close", function(e) {
    if (!e.target.url || app.privateBrowsing.enabled) { return }

    app.activeBrowserWindow.updateTabs()

    closedTabs.push({
      url: e.target.url,
      index: e.target.index
    })
  }, true) /* useCapture */

  function openTab () {
    setTimeout(function () {
      var tab = closedTabs.pop()
      app.activeBrowserWindow.openTab(
        settings.getItem("visibility"), tab.index).url = tab.url
      app.activeBrowserWindow.updateTabs()
    }, 0)
  }
}())
