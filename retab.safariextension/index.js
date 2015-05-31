(function (app, settings) {

  var incognito = app.privateBrowsing.enabled;

  var retab = (function (tabs) {

    // Callback to open a previously closed tab
    this.open = function (visibility) {

      if (tabs.length > 0) {
       return (
        function (tab, visibility) {

          var browserWindow, openTab;

          // Search for the tab browser window in the current open windows
          for (var i = 0; i < this.browserWindows.length; i++) {
            if (tab.browserWindow === this.browserWindows[i]) {
              browserWindow = tab.browserWindow;
              break;
            }
          };

          // Check if a browser window was found
          if (!!!browserWindow) {
            browserWindow = this.openBrowserWindow();

            // Update the window instances of all tabs with a window closed
            retab.updateBroserWindow(tab.browserWindow, browserWindow);

            openTab = browserWindow.activeTab;
          }
          else {
            openTab = browserWindow.openTab(visibility, tab.index);
          }

          // Update tab information
          openTab.url = tab.url;
          openTab.index = tab.index;

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

    // Callback to update tabs browser window
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
