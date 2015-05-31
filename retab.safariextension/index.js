(function (app, settings) {

  var incognito = app.privateBrowsing.enabled;

  var retab = (function (tabs) {

    // Callback to open a previously closed tab
    this.open = function (visibility) {

      if (tabs.length > 0) {
       return (
        function (tab, visibility) {

          var browserWindow, openTab;

          for (var i = 0; i < this.browserWindows.length; i++) {
            if (tab.browserWindow === this.browserWindows[i]) {
              browserWindow = tab.browserWindow;
              break;
            }
          };

          if (!!!browserWindow) {
            browserWindow = this.openBrowserWindow();

            retab.updateBroserWindow(tab.browserWindow, browserWindow);

            openTab = browserWindow.activeTab;
          }
          else {
            openTab = browserWindow.openTab(visibility, tab.index);
          }

          openTab.url = tab.url;

        }.call(this.app, tabs.pop(), visibility))
      }
    }
    
    // Callback to update the closed tabs information
    this.update = function (tab) {

      this.app.activeBrowserWindow.tabs.forEach(function (tab, index) {
        tab.index = index
      })
      
      if (tab) {
        tabs.push({ url: tab.url, index: tab.index, browserWindow: tab.browserWindow })
      }
    }

    this.updateBroserWindow = function (oldBrowserWindow, newBrowserWindow) {

      tabs.forEach(function (tab, index) {
        if (tab.browserWindow === oldBrowserWindow) {
          tab.browserWindow = newBrowserWindow;
        }
      })
    }

    return this

  }.call({ app: app }, [/*^_^*/]))

  app.addEventListener("message", function (e) {
    if (!incognito && e.name === "retab")
      retab.open(settings["visibility"])
  })

  // Set this callback to the tab close event
  app.addEventListener("close", function (e) {
    if (!incognito && !!e.target.url) {
      retab.update(e.target);
    }
  }, true)

}(safari.application, safari.extension.settings))
